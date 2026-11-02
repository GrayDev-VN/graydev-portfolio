import robotsParser from "robots-parser";
import { setTimeout as delay } from "node:timers/promises";
import { normalizeJobs } from "../normalize.ts";
import type { Job } from "../types.ts";
import { parseSourceConfigs } from "./config.ts";
import type { SourceConfig } from "./config.ts";
import { FeedFetchError, JOBS_CRAWLER_AGENT, readBoundedText, secureFeedFetch } from "./fetch.ts";
import { discoverJobPageUrls, parseJobPostingHtml } from "./jsonld.ts";
import { collectEmployerApi } from "./employer-api.ts";

export interface CollectionOptions {
  now?: Date;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  /** Tests may shorten these production upper bounds. */
  timeoutMs?: number;
  budgetMs?: number;
}
interface CollectionContext {
  signal: AbortSignal;
  remaining: () => number;
  pause: (ms: number) => Promise<void>;
}

async function fetchResource(url: string, accept: "application/json" | "text/html" | "text/plain", options: CollectionOptions, context: CollectionContext, minimumDelay = 1000): Promise<string> {
  const fetchImpl = options.fetchImpl ?? secureFeedFetch;
  const now = options.now ?? new Date();
  for (let attempt = 0; attempt < 3; attempt++) {
    await context.pause(minimumDelay);
    if (context.signal.aborted || context.remaining() <= 0) throw new FeedFetchError("Source collection budget exceeded");
    const timeoutMs = Math.max(1, Math.min(10000, options.timeoutMs ?? 10000, context.remaining()));
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let onBudgetAbort: (() => void) | undefined;
    let retryDelay = 1000 * 2 ** attempt;
    try {
      return await Promise.race([
        (async () => {
          const response = await fetchImpl(url, { method: "GET", redirect: "error", signal: controller.signal, headers: { accept } });
          if (!response.ok) {
            await response.body?.cancel();
            const transient = response.status === 429 || response.status >= 500;
            const retryAfter = response.headers.get("retry-after");
            if (transient && retryAfter) {
              const parsed = /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - now.getTime();
              if (Number.isFinite(parsed)) {
                if (parsed > 60000) throw new FeedFetchError("Provider requested collection be deferred");
                retryDelay = Math.max(retryDelay, parsed);
              }
            }
            throw new FeedFetchError(`Feed returned HTTP ${response.status}`, transient);
          }
          return readBoundedText(response, accept);
        })(),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => { controller.abort(); reject(new FeedFetchError("Feed request timed out", true)); }, timeoutMs);
          onBudgetAbort = () => { controller.abort(); reject(new FeedFetchError("Source collection budget exceeded")); };
          context.signal.addEventListener("abort", onBudgetAbort, { once: true });
        }),
      ]);
    } catch (error) {
      const failure = error instanceof FeedFetchError ? error : new FeedFetchError("Feed connection failed", true);
      if (attempt === 2 || !failure.retryable || context.signal.aborted) throw new FeedFetchError(failure.message);
    } finally {
      if (timeout) clearTimeout(timeout);
      if (onBudgetAbort) context.signal.removeEventListener("abort", onBudgetAbort);
      controller.abort();
    }
    await context.pause(retryDelay);
  }
  throw new FeedFetchError("Feed collection failed");
}

async function collect(config: SourceConfig, options: CollectionOptions, context: CollectionContext): Promise<Job[]> {
  const now = options.now ?? new Date();
  if (config.mode === "smartrecruiters" || config.mode === "lever") {
    return collectEmployerApi(config, (url, accept) => {
      if (!config.allowedHosts?.includes(new URL(url).hostname)) throw new FeedFetchError("Employer API host is not allowed");
      return fetchResource(url, accept, options, context);
    }, now);
  }
  if (config.mode === "jsonld") {
    const robotsByOrigin = new Map<string, ReturnType<typeof robotsParser>>();
    async function fetchAllowedPage(pageUrl: string): Promise<string> {
      const origin = new URL(pageUrl).origin;
      let rules = robotsByOrigin.get(origin);
      if (!rules) {
        const robotsUrl = `${origin}/robots.txt`;
        const body = await fetchResource(robotsUrl, "text/plain", options, context);
        const lines = body.split(/\r?\n/).map(line => line.replace(/#.*/, "").trim()).filter(Boolean);
        if (!lines.some(line => /^user-agent\s*:/i.test(line)) || lines.some(line => !/^[a-z][a-z-]*\s*:/i.test(line))) throw new FeedFetchError("Source robots policy is unavailable or malformed");
        rules = robotsParser(robotsUrl, body);
        robotsByOrigin.set(origin, rules);
      }
      if (rules.isAllowed(pageUrl, JOBS_CRAWLER_AGENT) !== true) throw new FeedFetchError("Source robots policy disallows this page");
      const crawlDelay = rules.getCrawlDelay(JOBS_CRAWLER_AGENT);
      if (crawlDelay !== undefined && (!Number.isFinite(crawlDelay) || crawlDelay < 0)) throw new FeedFetchError("Source robots crawl delay is invalid");
      if (crawlDelay !== undefined && crawlDelay > 60) throw new FeedFetchError("Source robots policy requires collection be deferred");
      return fetchResource(pageUrl, "text/html", options, context, Math.max(1000, Math.ceil((crawlDelay ?? 0) * 1000)));
    }
    const detailUrls = new Set(config.pageUrls ?? []);
    for (const listingUrl of config.listingUrls ?? []) {
      const html = await fetchAllowedPage(listingUrl);
      let discovered: string[];
      try { discovered = discoverJobPageUrls(html, listingUrl, config.name, config.allowedHosts!, config.detailPathPrefixes!); } catch { throw new FeedFetchError("Unable to discover posting URLs"); }
      for (const pageUrl of discovered) if (detailUrls.size < 20) detailUrls.add(pageUrl);
    }
    const jobs: Job[] = [];
    for (const pageUrl of detailUrls) {
      const html = await fetchAllowedPage(pageUrl);
      try {
        const parsed = parseJobPostingHtml(html, config.name, pageUrl, now);
        if (parsed.length !== 1) throw new Error("Expected one JobPosting per detail page");
        jobs.push(...parsed);
      } catch { throw new FeedFetchError("Page contains invalid job posting data"); }
    }
    try { return normalizeJobs(jobs, now); } catch { throw new FeedFetchError("Collected pages contain invalid job data"); }
  }
  const body = await fetchResource(config.feedUrl!, "application/json", options, context);
  let payload: unknown;
  try { payload = JSON.parse(body); } catch { throw new FeedFetchError("Feed contains invalid JSON"); }
  if (!Array.isArray(payload) || payload.some(item => !item || !Array.isArray(item.sources) || item.sources.length !== 1 || item.sources[0]?.name !== config.name)) throw new FeedFetchError("Feed entries must each contain one matching source");
  let jobs: Job[];
  try { jobs = normalizeJobs(payload, now); } catch { throw new FeedFetchError("Feed contains invalid job data"); }
  const checkedAt = now.toISOString();
  return jobs.map(job => ({ ...job, checkedAt, sources: job.sources.map(source => ({ ...source, checkedAt, status: job.status, ...(job.expiresAt ? { expiresAt: job.expiresAt } : {}) })) }));
}

export async function collectSource(input: SourceConfig, options: CollectionOptions = {}): Promise<Job[]> {
  const [config] = parseSourceConfigs([input]);
  if (!config.enabled) return [];
  const budget = Math.max(1, Math.min(120000, options.budgetMs ?? 120000));
  const started = performance.now();
  const sourceController = new AbortController();
  const timer = setTimeout(() => sourceController.abort(), budget);
  const remaining = () => budget - (performance.now() - started);
  const context: CollectionContext = {
    signal: sourceController.signal,
    remaining,
    pause: async ms => {
      if (sourceController.signal.aborted || ms >= remaining()) throw new FeedFetchError("Source collection budget exceeded");
      if (options.sleep) {
        let onAbort: (() => void) | undefined;
        try {
          await Promise.race([options.sleep(ms), new Promise<never>((_, reject) => {
            onAbort = () => reject(new FeedFetchError("Source collection budget exceeded"));
            sourceController.signal.addEventListener("abort", onAbort, { once: true });
          })]);
        } finally { if (onAbort) sourceController.signal.removeEventListener("abort", onAbort); }
      } else await delay(ms, undefined, { signal: sourceController.signal });
      if (sourceController.signal.aborted || remaining() <= 0) throw new FeedFetchError("Source collection budget exceeded");
    },
  };
  try { return await collect(config, options, context); }
  catch (error) { throw error instanceof FeedFetchError ? error : new FeedFetchError("Source collection failed"); }
  finally { clearTimeout(timer); sourceController.abort(); }
}
