import { foldText, isHoChiMinh, normalizeJob, normalizeJobs } from "../normalize.ts";
import type { Job, JobSourceName, JobWorkMode } from "../types.ts";
import type { SourceConfig } from "./config.ts";
import { FeedFetchError, MAX_FEED_BYTES } from "./fetch.ts";
import { parseJobPostingHtml } from "./jsonld.ts";

type Data = Record<string, unknown>;
type FetchResource = (url: string, accept: "application/json") => Promise<string>;
const MAX_PAGES = 3;
const PAGE_SIZE = 100;
const MAX_DETAILS = 20;

function object(input: unknown): Data {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new FeedFetchError("Employer API returned invalid data");
  return input as Data;
}
function optionalObject(input: unknown): Data { return input && typeof input === "object" && !Array.isArray(input) ? input as Data : {}; }
function text(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function requiredText(value: unknown, max = 100000): string {
  const result = text(value);
  if (!result || result.length > max) throw new FeedFetchError("Employer API is missing required data");
  return result;
}
function id(value: unknown): string {
  const result = typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? String(value) : text(value);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,199}$/.test(result)) throw new FeedFetchError("Employer API returned an invalid posting ID");
  return result;
}
async function readJson(fetchResource: FetchResource, url: string): Promise<unknown> {
  const body = await fetchResource(url, "application/json");
  if (Buffer.byteLength(body) > MAX_FEED_BYTES) throw new FeedFetchError("Employer API response exceeds the size limit");
  try { return JSON.parse(body); } catch { throw new FeedFetchError("Employer API returned invalid JSON"); }
}
function location(input: unknown): string {
  const value = optionalObject(input);
  return [...new Set([text(value.city), text(value.region), text(value.country)].filter(Boolean))].join(", ");
}
function candidate(title: string, city: string, level = ""): boolean {
  const role = foldText(title);
  return isHoChiMinh(city)
    && !/\b(?:senior|sr|lead|principal|staff|manager|director|head)\b/.test(role)
    && !/\b(?:senior|director|executive)\b/.test(foldText(level).replace(/_/g, " "))
    && /\bjava\b|\bback[- ]?end\b|\b(?:ai|ml|llm|machine learning|artificial intelligence)\b|\bsoftware\s+(?:engineer|developer)\b|\blap trinh\b/.test(role);
}
function earlyCareerPriority(title: string, level = ""): number {
  const career = /\b(?:intern|internship|fresher|junior|graduate|entry level)\b/.test(foldText(`${title} ${level}`).replace(/_/g, " ")) ? 0 : 10;
  const target = /\bjava\b|\bback[- ]?end\b|\b(?:ai|ml|llm|machine learning|artificial intelligence)\b/.test(foldText(title)) ? 0 : 1;
  return career + target;
}
function postingUrl(input: unknown, provider: "SmartRecruiters" | "Lever", company: string, postingId: string): string {
  let url: URL;
  try { url = new URL(requiredText(input, 2048)); } catch { throw new FeedFetchError("Employer API returned an invalid posting URL"); }
  const expectedHost = provider === "SmartRecruiters" ? "jobs.smartrecruiters.com" : "jobs.lever.co";
  const parts = url.pathname.split("/").filter(Boolean);
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.hostname !== expectedHost
    || parts.length !== 2 || parts[0].toLowerCase() !== company.toLowerCase()
    || (provider === "Lever" ? parts[1] !== postingId : parts[1] !== postingId && !parts[1].startsWith(`${postingId}-`))) throw new FeedFetchError("Employer API returned an unexpected posting URL");
  url.hash = "";
  return url.href;
}
function parseSchema(schema: Data, source: JobSourceName, url: string, now: Date): Job {
  // Escape markup before embedding JSON: a provider's literal </script> must never
  // terminate this inert synthetic script or change which schema is parsed.
  const encoded = JSON.stringify({ "@context": "https://schema.org", "@type": "JobPosting", ...schema }).replace(/</g, "\\u003c");
  try {
    const jobs = parseJobPostingHtml(`<script type="application/ld+json">${encoded}</script>`, source, url, now);
    if (jobs.length !== 1) throw new Error("Missing posting");
    return jobs[0];
  } catch { throw new FeedFetchError("Employer API posting could not be normalized"); }
}

async function smartRecruiters(companies: string[], fetchResource: FetchResource, now: Date): Promise<Job[]> {
  const candidates: { company: string; summary: Data; priority: number }[] = [];
  const seen = new Set<string>();
  for (const company of companies) {
    let offset = 0;
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(`https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(company)}/postings`);
      url.search = new URLSearchParams({ country: "vn", destination: "PUBLIC", limit: String(PAGE_SIZE), offset: String(offset) }).toString();
      const result = object(await readJson(fetchResource, url.href));
      if (!Array.isArray(result.content) || result.content.length > PAGE_SIZE || !Number.isSafeInteger(result.totalFound) || Number(result.totalFound) < 0) throw new FeedFetchError("Employer API returned an invalid posting list");
      for (const entry of result.content) {
        const summary = object(entry);
        const title = text(summary.name);
        const level = optionalObject(summary.experienceLevel);
        if (!candidate(title, location(summary.location), `${text(level.id)} ${text(level.label)}`)) continue;
        const postingId = id(summary.id);
        const key = `${company.toLowerCase()}:${postingId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        candidates.push({ company, summary, priority: earlyCareerPriority(title, text(level.label)) });
      }
      offset += result.content.length;
      if (!result.content.length || offset >= Number(result.totalFound)) break;
    }
  }
  candidates.sort((a, b) => a.priority - b.priority);
  const jobs: Job[] = [];
  for (const { company, summary } of candidates.slice(0, MAX_DETAILS)) {
    const postingId = id(summary.id);
    // Never follow a provider-supplied `ref`: construct the fixed official endpoint.
    const detail = object(await readJson(fetchResource, `https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(company)}/postings/${encodeURIComponent(postingId)}`));
    if (id(detail.id) !== postingId || typeof detail.active !== "boolean") throw new FeedFetchError("Employer API returned inconsistent posting data");
    const employer = optionalObject(detail.company);
    if (text(employer.identifier) && text(employer.identifier).toLowerCase() !== company.toLowerCase()) throw new FeedFetchError("Employer API returned an inconsistent company");
    const title = requiredText(detail.name, 300);
    const employerName = requiredText(employer.name, 300);
    const sections = optionalObject(optionalObject(detail.jobAd).sections);
    const description = requiredText(optionalObject(sections.jobDescription).text);
    const qualifications = text(optionalObject(sections.qualifications).text);
    const additional = text(optionalObject(sections.additionalInformation).text);
    const sourceUrl = postingUrl(detail.postingUrl, "SmartRecruiters", company, postingId);
    const detailLocation = optionalObject(detail.location);
    const schema: Data = {
      title, hiringOrganization: { name: employerName },
      description: [description, qualifications, additional].filter(Boolean).join("\n\n"),
      jobLocation: { address: { addressLocality: text(detailLocation.city), addressRegion: text(detailLocation.region), addressCountry: text(detailLocation.country) } },
      identifier: `${company}:${postingId}`,
      employmentType: text(optionalObject(detail.typeOfEmployment).label),
      ...(detailLocation.remote === true ? { jobLocationType: "TELECOMMUTE" } : {}),
      ...(detail.releasedDate ?? summary.releasedDate ? { datePosted: detail.releasedDate ?? summary.releasedDate } : {}),
    };
    const parsed = parseSchema(schema, "SmartRecruiters", sourceUrl, now);
    const status = detail.active ? parsed.status : "expired";
    jobs.push(normalizeJob({ ...parsed, id: `SmartRecruiters:${company}:${postingId}`, status, sources: parsed.sources.map(source => ({ ...source, status })) }, now));
  }
  return jobs;
}

async function lever(companies: string[], fetchResource: FetchResource, now: Date): Promise<Job[]> {
  const jobs: Job[] = [];
  const seen = new Set<string>();
  for (const company of companies) {
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(`https://api.lever.co/v0/postings/${encodeURIComponent(company)}`);
      url.search = new URLSearchParams({ mode: "json", limit: String(PAGE_SIZE), skip: String(page * PAGE_SIZE) }).toString();
      const result = await readJson(fetchResource, url.href);
      if (!Array.isArray(result) || result.length > PAGE_SIZE) throw new FeedFetchError("Employer API returned an invalid posting list");
      for (const entry of result) {
        const value = object(entry);
        const categories = optionalObject(value.categories);
        const title = text(value.text);
        const city = [text(categories.location), ...(Array.isArray(categories.allLocations) ? categories.allLocations.map(text) : [])].filter(Boolean).join("; ");
        if (!candidate(title, city)) continue;
        const postingId = id(value.id);
        const key = `${company.toLowerCase()}:${postingId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const sourceUrl = postingUrl(value.hostedUrl, "Lever", company, postingId);
        const description = requiredText(value.description || value.descriptionPlain);
        if (value.lists !== undefined && (!Array.isArray(value.lists) || value.lists.length > 50)) throw new FeedFetchError("Employer API returned invalid description sections");
        const lists = (value.lists as unknown[] | undefined)?.map(entry => { const list = object(entry); return `${text(list.text)}\n${text(list.content)}`; }).join("\n\n");
        let postedAt: string | undefined;
        if (value.createdAt !== undefined) {
          if (typeof value.createdAt !== "number" || !Number.isSafeInteger(value.createdAt) || !Number.isFinite(new Date(value.createdAt).getTime())) throw new FeedFetchError("Employer API returned an invalid posting date");
          postedAt = new Date(value.createdAt).toISOString();
        }
        const parsed = parseSchema({
          title,
          // Lever's public API does not expose an employer display name. Preserve
          // its exact published company namespace instead of guessing a brand.
          hiringOrganization: { name: company },
          description: [description, lists, text(value.additional) || text(value.additionalPlain)].filter(Boolean).join("\n\n"),
          jobLocation: { address: { addressLocality: city, addressCountry: text(value.country) } },
          identifier: `${company}:${postingId}`, employmentType: text(categories.commitment),
          ...(value.workplaceType === "remote" ? { jobLocationType: "TELECOMMUTE" } : {}),
          ...(postedAt ? { datePosted: postedAt } : {}),
        }, "Lever", sourceUrl, now);
        const workMode: JobWorkMode = value.workplaceType === "on-site" ? "onsite" : value.workplaceType === "hybrid" ? "hybrid" : parsed.workMode;
        jobs.push(normalizeJob({ ...parsed, id: `Lever:${company}:${postingId}`, workMode }, now));
        if (jobs.length >= MAX_DETAILS) return jobs;
      }
      if (result.length < PAGE_SIZE) break;
    }
  }
  return jobs;
}

/** Read-only adapters for documented public employer posting APIs; no applications. */
export async function collectEmployerApi(config: SourceConfig, fetchResource: FetchResource, now: Date): Promise<Job[]> {
  if (!config.enabled) return [];
  const smart = config.mode === "smartrecruiters" && config.name === "SmartRecruiters";
  const isLever = config.mode === "lever" && config.name === "Lever";
  const host = smart ? "api.smartrecruiters.com" : "api.lever.co";
  if ((!smart && !isLever) || !config.permissionReference?.trim() || !config.allowedHosts?.includes(host)
    || !Array.isArray(config.companySlugs) || !config.companySlugs.length || config.companySlugs.length > 5
    || config.companySlugs.some(slug => typeof slug !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(slug))) throw new FeedFetchError("Invalid public employer API configuration");
  const companies = [...new Set(config.companySlugs)];
  const jobs = smart ? await smartRecruiters(companies, fetchResource, now) : await lever(companies, fetchResource, now);
  // Persist every observed candidate, including unknown/out-of-scope classifications.
  // Otherwise a corrected classification cannot replace an older matching DB row.
  // The public repository applies the strict career/location/level filters on read.
  return normalizeJobs(jobs, now);
}
