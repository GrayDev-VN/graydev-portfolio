import assert from "node:assert/strict";
import test from "node:test";
import { parseSourceConfigs } from "../src/features/jobs/collection/config.ts";
import { collectSource } from "../src/features/jobs/collection/collector.ts";
import { createPublicLookup, isPublicAddress, MAX_FEED_BYTES } from "../src/features/jobs/collection/fetch.ts";

const now = new Date("2026-11-03T08:00:00.000Z");
const config = { name: "ITviec" as const, enabled: true, feedUrl: "https://feeds.provider.com/jobs", allowedHosts: ["feeds.provider.com"], permissionReference: "Written provider agreement #123" };
const job = { id: "collection-test-only", title: "Java Backend Intern", company: "Test fixture company", location: "Ho Chi Minh City", workMode: "onsite", categories: ["java-backend"], levels: ["intern"], skills: ["Java"], description: "Test fixture only", postedAt: "2026-11-01", checkedAt: "2026-11-02", status: "active", sources: [{ name: "ITviec", url: "https://itviec.com/it-jobs/test-fixture-only" }] };
const json = (body: unknown) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json; charset=utf-8" } });
const noSleep = async () => {};

test("collection config requires explicit permission and exact public host allowlist", () => {
  assert.equal(parseSourceConfigs([config])[0].feedUrl, config.feedUrl);
  assert.deepEqual(parseSourceConfigs([{ name: "TopCV", enabled: false }]), [{ name: "TopCV", enabled: false }]);
  for (const patch of [
    { permissionReference: "" }, { allowedHosts: undefined }, { feedUrl: "http://feeds.provider.com/jobs" },
    { feedUrl: "https://user:password@feeds.provider.com/jobs" }, { feedUrl: "https://feeds.provider.com:8443/jobs" },
    { feedUrl: "https://feeds.provider.com.evil.com/jobs" }, { feedUrl: "https://127.0.0.1/jobs", allowedHosts: ["127.0.0.1"] },
    { feedUrl: "https://metadata.internal/jobs", allowedHosts: ["metadata.internal"] },
    { feedUrl: "https://feeds.provider.com/jobs#fragment" }, { allowedHosts: ["*.provider.com"] },
  ]) assert.throws(() => parseSourceConfigs([{ ...config, ...patch }]));
  assert.throws(() => parseSourceConfigs([config, config]));
});

test("DNS policy blocks private and special addresses including IPv6 routes", () => {
  for (const address of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "198.18.0.1", "192.0.2.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "0.0.0.0", "::1", "::ffff:127.0.0.1", "fc00::1", "fe80::1", "ff02::1", "2001:db8::1", "2002:7f00:1::", "2001::1"]) assert.equal(isPublicAddress(address), false, address);
  for (const address of ["1.1.1.1", "8.8.8.8", "2606:4700:4700::1111", "2001:4860:4860::8888"]) assert.equal(isPublicAddress(address), true, address);
});

test("disabled sources make no requests", async () => {
  let calls = 0;
  assert.deepEqual(await collectSource({ name: "ITviec", enabled: false }, { fetchImpl: async () => { calls++; return json([]); }, sleep: noSleep }), []);
  assert.equal(calls, 0);
});

test("connection lookup pins validated DNS answers and rejects mixed public/private DNS", async () => {
  let resolutions = 0;
  const safeLookup = createPublicLookup((_hostname, callback) => { resolutions++; callback(null, [{ address: "1.1.1.1", family: 4 }]); });
  await new Promise<void>((resolve, reject) => safeLookup("feeds.provider.com", {}, (error, address, family) => {
    if (error) { reject(error); return; }
    assert.equal(address, "1.1.1.1"); assert.equal(family, 4); resolve();
  }));
  assert.equal(resolutions, 1);
  const unsafeLookup = createPublicLookup((_hostname, callback) => callback(null, [{ address: "1.1.1.1", family: 4 }, { address: "127.0.0.1", family: 4 }]));
  await assert.rejects(new Promise<void>((resolve, reject) => unsafeLookup("feeds.provider.com", {}, error => error ? reject(error) : resolve())), /blocked address/);
});

test("authorized feed is normalized and stamped with fresh per-source observation", async () => {
  const pauses: number[] = [];
  const jobs = await collectSource(config, { now, sleep: async ms => { pauses.push(ms); }, fetchImpl: async (url, init) => {
    assert.equal(String(url), config.feedUrl);
    assert.equal(init?.redirect, "error");
    assert.equal(init?.method, "GET");
    return json([job]);
  } });
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].checkedAt, now.toISOString());
  assert.equal(jobs[0].sources[0].checkedAt, now.toISOString());
  assert.equal(jobs[0].sources[0].status, "active");
  assert.equal(job.checkedAt, "2026-11-02");
  assert.deepEqual(pauses, [1000]);
});

test("expiry is preserved instead of reviving expired postings", async () => {
  const jobs = await collectSource(config, { now, sleep: noSleep, fetchImpl: async () => json([{ ...job, expiresAt: "2026-11-02" }]) });
  assert.equal(jobs[0].status, "expired");
  assert.equal(jobs[0].sources[0].expiresAt, "2026-11-02");
});

test("429 retries honor bounded Retry-After", async () => {
  let calls = 0;
  const pauses: number[] = [];
  const jobs = await collectSource(config, { now, sleep: async ms => { pauses.push(ms); }, fetchImpl: async () => {
    calls++;
    return calls < 3 ? new Response(null, { status: 429, headers: { "retry-after": "60" } }) : json([]);
  } });
  assert.deepEqual(jobs, []);
  assert.equal(calls, 3);
  assert.deepEqual(pauses, [1000, 60000, 1000, 60000, 1000]);
});

test("Retry-After beyond the process backoff budget defers collection without early retry", async () => {
  let calls = 0;
  const pauses: number[] = [];
  await assert.rejects(collectSource(config, { now, sleep: async ms => { pauses.push(ms); }, fetchImpl: async () => { calls++; return new Response(null, { status: 429, headers: { "retry-after": "9999" } }); } }), /deferred/);
  assert.equal(calls, 1);
  assert.deepEqual(pauses, [1000]);
});

test("network failures retry at most three times without exposing errors or URL secrets", async () => {
  let calls = 0;
  await assert.rejects(collectSource({ ...config, feedUrl: `${config.feedUrl}?token=secret` }, { now, sleep: noSleep, fetchImpl: async () => { calls++; throw new Error("token=secret credentials"); } }), error => error instanceof Error && error.message === "Feed connection failed");
  assert.equal(calls, 3);
});

test("5xx retries stop after three attempts with exponential backoff", async () => {
  let calls = 0;
  const pauses: number[] = [];
  await assert.rejects(collectSource(config, { now, sleep: async ms => { pauses.push(ms); }, fetchImpl: async () => { calls++; return new Response(null, { status: 503 }); } }), /HTTP 503/);
  assert.equal(calls, 3);
  assert.deepEqual(pauses, [1000, 1000, 1000, 2000, 1000]);
});

test("Retry-After HTTP dates are respected", async () => {
  let calls = 0;
  const pauses: number[] = [];
  await collectSource(config, { now, sleep: async ms => { pauses.push(ms); }, fetchImpl: async () => ++calls === 1 ? new Response(null, { status: 429, headers: { "retry-after": new Date(now.getTime() + 10000).toUTCString() } }) : json([]) });
  assert.deepEqual(pauses, [1000, 10000, 1000]);
});

test("HTTP auth failures and redirects never retry", async () => {
  for (const status of [301, 302, 401, 403, 404]) {
    let calls = 0;
    await assert.rejects(collectSource(config, { now, sleep: noSleep, fetchImpl: async () => { calls++; return new Response(null, { status }); } }), new RegExp(`HTTP ${status}`));
    assert.equal(calls, 1);
  }
});

test("invalid data and mixed-source provenance fail without retry", async () => {
  const wrongSource = { name: "TopCV", url: "https://topcv.vn/viec-lam/test-fixture-only" };
  for (const payload of [
    {}, [{ ...job, sources: [wrongSource] }], [{ ...job, sources: [job.sources[0], wrongSource] }],
    [{ ...job, checkedAt: "2099-01-01" }], [{ ...job, sources: [{ ...job.sources[0], url: "javascript:alert(1)" }] }],
  ]) {
    let calls = 0;
    await assert.rejects(collectSource(config, { now, sleep: noSleep, fetchImpl: async () => { calls++; return json(payload); } }));
    assert.equal(calls, 1);
  }
});

test("JSON-only and body size limits reject declared and streamed oversized feeds", async () => {
  for (const response of [
    new Response(null, { status: 204, headers: { "content-type": "application/json" } }),
    new Response("[]", { headers: { "content-type": "text/html" } }),
    new Response("{", { headers: { "content-type": "application/json" } }),
    new Response("[]", { headers: { "content-type": "application/json", "content-length": String(MAX_FEED_BYTES + 1) } }),
    new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_FEED_BYTES)); controller.enqueue(new Uint8Array(1)); controller.close(); } }), { headers: { "content-type": "application/json" } }),
  ]) await assert.rejects(collectSource(config, { now, sleep: noSleep, fetchImpl: async () => response }));
});

test("entire request has a bounded timeout and abort signal", async () => {
  let calls = 0;
  const signals: AbortSignal[] = [];
  await assert.rejects(collectSource(config, { now, sleep: noSleep, timeoutMs: 5, fetchImpl: async (_url, init) => { calls++; signals.push(init!.signal!); return new Promise<Response>(() => {}); } }), /timed out/);
  assert.equal(calls, 3);
  assert.ok(signals.every(signal => signal.aborted));
});

const pageUrl = "https://itviec.com/it-jobs/test-fixture-only";
const htmlConfig = { ...config, mode: "jsonld" as const, feedUrl: undefined, allowedHosts: ["itviec.com"], pageUrls: [pageUrl] };
const robotsText = "User-agent: *\nDisallow:\n";
const htmlBody = `<html><script type="application/ld+json">${JSON.stringify({ "@type": "JobPosting", title: job.title, hiringOrganization: { name: job.company }, description: "Java Spring Boot internship test fixture", jobLocation: { address: { addressLocality: "Ho Chi Minh City" } }, datePosted: "2026-11-01" })}</script></html>`;
const textResponse = (body: string, type: string) => new Response(body, { headers: { "content-type": type } });

test("HTML config bounds pages and discovery on official allowed hosts", () => {
  assert.equal(parseSourceConfigs([htmlConfig])[0].mode, "jsonld");
  for (const patch of [
    { pageUrls: [] }, { pageUrls: Array.from({ length: 21 }, (_, i) => `${pageUrl}-${i}`) },
    { pageUrls: ["https://evil.com/job"], allowedHosts: ["evil.com"] }, { pageUrls: ["https://itviec.com/"] },
    { pageUrls: undefined, listingUrls: ["https://itviec.com/jobs"] },
    { pageUrls: undefined, listingUrls: ["https://itviec.com/jobs"], detailPathPrefixes: ["/"] },
    { listingUrls: ["https://itviec.com/jobs"], detailPathPrefixes: ["/it-jobs/../"] },
  ]) assert.throws(() => parseSourceConfigs([{ ...htmlConfig, ...patch }]));
});

test("HTML collection obeys robots once per origin and parses inert JSON-LD", async () => {
  const calls: string[] = [];
  const result = await collectSource({ ...htmlConfig, pageUrls: [pageUrl, `${pageUrl}-2`] }, { now, sleep: noSleep, fetchImpl: async url => {
    calls.push(String(url));
    return String(url).endsWith("/robots.txt") ? textResponse(robotsText, "text/plain") : textResponse(htmlBody, "text/html");
  } });
  assert.equal(result.length, 2);
  assert.deepEqual(calls, ["https://itviec.com/robots.txt", pageUrl, `${pageUrl}-2`]);
  assert.equal(result[0].checkedAt, now.toISOString());
});

test("disallowed, malformed and unavailable robots abort before fetching a page", async () => {
  for (const policy of ["User-agent: *\nDisallow: /it-jobs/", "User-agent: *\nAllow: /\nUser-agent: GrayDevJobsBot\nDisallow: /", "not robots", "User-agent: *\nmalformed rule"]) {
    const calls: string[] = [];
    await assert.rejects(collectSource(htmlConfig, { now, sleep: noSleep, fetchImpl: async url => { calls.push(String(url)); return textResponse(policy, "text/plain"); } }), /robots/);
    assert.deepEqual(calls, ["https://itviec.com/robots.txt"]);
  }
  let calls = 0;
  await assert.rejects(collectSource(htmlConfig, { now, sleep: noSleep, fetchImpl: async () => { calls++; return new Response(null, { status: 403 }); } }), /HTTP 403/);
  assert.equal(calls, 1);
});

test("HTML collector respects robots crawl delay without real sleeps", async () => {
  const pauses: number[] = [];
  await collectSource(htmlConfig, { now, sleep: async ms => { pauses.push(ms); }, fetchImpl: async url => String(url).endsWith("/robots.txt") ? textResponse("User-agent: *\nDisallow:\nCrawl-delay: 5", "text/plain") : textResponse(htmlBody, "text/html") });
  assert.deepEqual(pauses, [1000, 5000]);
});

test("detail pages without JobPosting or malformed structured data fail source", async () => {
  for (const html of ["<html>No posting</html>", '<script type="application/ld+json">{</script>']) {
    await assert.rejects(collectSource(htmlConfig, { now, sleep: noSleep, fetchImpl: async url => String(url).endsWith("/robots.txt") ? textResponse(robotsText, "text/plain") : textResponse(html, "text/html") }), /invalid job posting/);
  }
});

test("approved listing discovery stays one level deep and bounded to20 detail pages", async () => {
  const calls: string[] = [];
  const listingUrl = "https://itviec.com/jobs-search";
  const listing = Array.from({ length: 25 }, (_, i) => `<a href="/it-jobs/fixture-${i}">Job</a>`).join("") + '<a href="https://evil.com/it-jobs/a">Evil</a><a href="/other">Other</a>';
  const result = await collectSource({ ...htmlConfig, pageUrls: undefined, listingUrls: [listingUrl], detailPathPrefixes: ["/it-jobs/"] }, { now, sleep: noSleep, fetchImpl: async url => {
    const value = String(url); calls.push(value);
    return value.endsWith("/robots.txt") ? textResponse(robotsText, "text/plain") : textResponse(value === listingUrl ? listing : htmlBody, "text/html");
  } });
  assert.equal(result.length, 20);
  assert.equal(calls.length, 22);
  assert.ok(calls.every(url => new URL(url).origin === "https://itviec.com"));
});

test("source budget prevents sleep or fetch past the total deadline", async () => {
  let calls = 0;
  let pauses = 0;
  await assert.rejects(collectSource(config, { budgetMs: 500, sleep: async () => { pauses++; }, fetchImpl: async () => { calls++; return json([]); } }), /budget exceeded/);
  assert.equal(calls, 0);
  assert.equal(pauses, 0);
});

test("absolute source deadline aborts an in-flight request", async () => {
  let calls = 0;
  let signal: AbortSignal | null | undefined;
  await assert.rejects(collectSource(config, { budgetMs: 1100, sleep: noSleep, fetchImpl: async (_url, init) => { calls++; signal = init?.signal; return new Promise<Response>(() => {}); } }), /budget exceeded/);
  assert.equal(calls, 1);
  assert.ok(signal?.aborted);
});
