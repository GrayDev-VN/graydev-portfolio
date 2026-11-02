import { createHash } from "node:crypto";
import { load } from "cheerio";
import { foldText, normalizeJob } from "../normalize.ts";
import type { Job, JobCategory, JobLevel, JobSourceName, JobWorkMode } from "../types.ts";
import { JOB_SOURCE_HOSTS } from "../types.ts";

type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as ObjectValue : undefined;
}

/** Parse inert markup only: Cheerio does not execute scripts or load resources. */
function plain(value: unknown): string {
  if (typeof value !== "string") return "";
  const $ = load(value, undefined, false);
  $("script,style,noscript,iframe,object,template").remove();
  $("br").replaceWith("\n");
  $("p,div,li,h1,h2,h3,h4,tr").append("\n");
  return $.root().text().replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function required(value: unknown): string {
  const result = plain(value);
  if (!result) throw new Error("JobPosting is missing required text.");
  return result;
}
function strings(value: unknown): string {
  return Array.isArray(value) ? value.map(plain).filter(Boolean).join("; ") : plain(value);
}
function schemaDate(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new Error("JobPosting has an invalid date.");
  const date = value.trim();
  const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2}))?$/.exec(date);
  const calendar = match?.[1];
  if (!calendar || new Date(`${calendar}T00:00:00Z`).toISOString().slice(0, 10) !== calendar
    || (match[2] && (Number(match[2]) > 23 || Number(match[3]) > 59 || Number(match[4]) > 59)) || !Number.isFinite(Date.parse(date))) {
    throw new Error("JobPosting has an invalid date.");
  }
  return date.length === 10 ? date : new Date(date).toISOString();
}
function locations(value: unknown): string {
  const entries = Array.isArray(value) ? value : [value];
  return [...new Set(entries.map(entry => {
    const place = object(entry);
    if (!place) return plain(entry);
    const address = object(place.address);
    if (!address) return plain(place.address) || plain(place.name);
    const country = object(address.addressCountry);
    return [plain(address.addressLocality), plain(address.addressRegion), country ? plain(country.name) : plain(address.addressCountry)]
      .filter(Boolean).filter((part, index, all) => all.indexOf(part) === index).join(", ");
  }).filter(Boolean))].join("; ");
}

const technologies: [string, RegExp][] = [
  ["Java", /\bjava\b/i], ["Spring Boot", /\bspring\s*boot\b/i], ["Spring", /\bspring\b/i],
  ["Python", /\bpython\b/i], ["SQL", /\bsql\b/i], ["PostgreSQL", /\bpostgres(?:ql)?\b/i],
  ["MySQL", /\bmysql\b/i], ["Docker", /\bdocker\b/i], ["Kubernetes", /\b(?:kubernetes|k8s)\b/i],
  ["Redis", /\bredis\b/i], ["Kafka", /\bkafka\b/i], ["AWS", /\baws\b/i],
  ["LLM", /\bllms?\b|\blarge language models?\b/i], ["RAG", /\brag\b|\bretrieval[- ]augmented generation\b/i],
  ["LangChain", /\blangchain\b/i], ["FastAPI", /\bfastapi\b/i], ["PyTorch", /\bpytorch\b/i],
  ["TensorFlow", /\btensorflow\b/i],
];
function categories(title: string, description: string, skills: string): JobCategory[] {
  const result: JobCategory[] = [];
  const role = foldText(title);
  const requirements = foldText(`${description} ${skills}`);
  const backend = /\bback[- ]?end\b|\bserver[- ]side\b/.test(role);
  const nonBackend = /\b(?:android|mobile|ios|front[- ]?end|sap|abap|fiori)\b/.test(role);
  const java = !nonBackend && (/\bjava\b/.test(role) && (backend || /\bdeveloper\b|\blap trinh\b/.test(role))
    || backend && /\bjava\b/.test(requirements) && /\bspring(?:\s+boot)?\b/.test(requirements));
  if (java) result.push("java-backend");
  if (/\b(?:ai|ml|llm|machine learning|artificial intelligence)\s+(?:engineer|developer)\b|\b(?:engineer|developer)\s*[-–:]\s*(?:ai|ml|llm)\b|\bky su\s+(?:ai|tri tue nhan tao)\b/.test(role)) result.push("ai-engineer");
  const aiRequirement = /\bllms?\b|\brag\b|\blarge language models?\b|\bretrieval[- ]augmented generation\b/.test(requirements)
    || /\b(?:build|develop|integrat\w*|experience (?:in|with)|skills? (?:in|with))\b[^.\n]{0,60}\b(?:ai|machine learning)\b/.test(requirements);
  if (backend && aiRequirement) result.push("backend-ai");
  return result;
}
function levels(title: string, description: string, employmentType: unknown, experience: unknown): JobLevel[] {
  const role = foldText(title);
  const experienceObject = object(experience);
  const text = foldText(`${description} ${strings(experience)}`);
  if (/\b(?:senior|sr|lead|principal|staff|manager|head|truong nhom)\b/.test(role)) return [];
  if (typeof experienceObject?.monthsOfExperience === "number" && experienceObject.monthsOfExperience >= 36) return [];
  const experienceRanges = [...text.matchAll(/(?:\b(?:at least|minimum|min|from|over|tu|toi thieu|tren)\s*)?(\d+)\s*(?:[-–]\s*(\d+)\s*)?\+?\s*(?:years?|nam)\s*(?:of\s+)?(?:experience|kinh nghiem)\b/g)];
  const beforeYears = [...text.matchAll(/\b(?:experience|kinh nghiem)\s*(?:(?:of|from|tu|toi thieu|at least|minimum)\s*)?(\d+)\s*(?:[-–]\s*(\d+)\s*)?\+?\s*(?:years?|nam)\b/g)];
  const explicitMinimum = [...text.matchAll(/\b(?:at least|minimum|min|from|tu|toi thieu|tren)\s*(\d+)\s*\+?\s*(?:years?|nam)\b/g), ...text.matchAll(/\b(\d+)\s*\+\s*(?:years?|nam)\b/g)];
  if ([...experienceRanges, ...beforeYears, ...explicitMinimum].some(match => Number(match[1]) >= 3)) return [];
  const result: JobLevel[] = [];
  if (/\b(?:intern|internship|thuc tap)\b/.test(role) || /\binternship\b/.test(foldText(strings(employmentType)))) result.push("intern");
  if (/\b(?:fresher|graduate|new grad)\b/.test(role) || /\b(?:no (?:prior )?experience (?:is )?(?:required|necessary)|new graduates?|fresh graduates?|khong (?:yeu cau|can) kinh nghiem|sinh vien moi tot nghiep)\b/.test(text)) result.push("fresher");
  if (/\bjunior\b/.test(role) || [...experienceRanges, ...beforeYears].some(match => Number(match[1]) <= 2 && (match[2] ? Number(match[2]) <= 2 : !match[0].includes("+")))) result.push("junior");
  return result;
}
function workMode(posting: ObjectValue, title: string, description: string): JobWorkMode {
  if (/\btelecommute\b/i.test(strings(posting.jobLocationType))) return "remote";
  if (/\bhybrid\b/i.test(`${title} ${description}`)) return "hybrid";
  return "unknown";
}

/** Extract JobPosting JSON-LD from authorized detail pages; never fetch or execute it. */
export function parseJobPostingHtml(html: string, source: JobSourceName, pageUrl: string, now = new Date()): Job[] {
  if (typeof html !== "string" || Buffer.byteLength(html) > 10 * 1024 * 1024) throw new Error("Job page exceeds the size limit.");
  const $ = load(html);
  const postings: ObjectValue[] = [];
  let visited = 0;
  function visit(value: unknown, depth = 0): void {
    if (++visited > 10000 || depth > 32) throw new Error("Job page structured data is too complex.");
    if (Array.isArray(value)) { value.forEach(item => visit(item, depth + 1)); return; }
    const item = object(value);
    if (!item) return;
    const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
    if (types.some(type => typeof type === "string" && /^(?:https?:\/\/schema\.org\/)?JobPosting$/.test(type))) postings.push(item);
    if (postings.length > 100) throw new Error("Job page contains too many postings.");
    if (item["@graph"]) visit(item["@graph"], depth + 1);
    if (item.mainEntity) visit(item.mainEntity, depth + 1);
  }
  $("script").each((_, element) => {
    if (($(element).attr("type") ?? "").split(";")[0].trim().toLowerCase() !== "application/ld+json") return;
    let data: unknown;
    try { data = JSON.parse($(element).text()); } catch { throw new Error("Job page contains invalid JSON-LD."); }
    visit(data);
  });
  const jobs = postings.map(posting => {
    const title = required(posting.title);
    const company = required(object(posting.hiringOrganization)?.name);
    const description = required(posting.description);
    const location = locations(posting.jobLocation);
    if (!location) throw new Error("JobPosting is missing its location.");
    const explicitSkills = strings(posting.skills);
    const skillText = `${title} ${description} ${explicitSkills}`;
    const identifier = object(posting.identifier);
    const sourceId = typeof posting.identifier === "string" ? posting.identifier.trim()
      : typeof identifier?.value === "string" || typeof identifier?.value === "number" ? String(identifier.value).trim() : undefined;
    const postedAt = schemaDate(posting.datePosted);
    const expiresAt = schemaDate(posting.validThrough);
    return normalizeJob({
      id: `${source}:html:${createHash("sha256").update(`${pageUrl}|${sourceId ?? `${title}|${company}`}`).digest("hex")}`,
      title, company, description, location, workMode: workMode(posting, title, description),
      categories: categories(title, description, explicitSkills), levels: levels(title, description, posting.employmentType, posting.experienceRequirements),
      skills: technologies.filter(([, pattern]) => pattern.test(skillText)).map(([name]) => name),
      checkedAt: now.toISOString(), status: "active", ...(postedAt ? { postedAt } : {}), ...(expiresAt ? { expiresAt } : {}),
      sources: [{ name: source, url: pageUrl, ...(sourceId ? { sourceId } : {}) }],
    }, now);
  });
  const distinct = [...new Map(jobs.map(job => [JSON.stringify(job), job])).values()];
  if (distinct.length > 1) throw new Error("Expected one distinct JobPosting per detail page.");
  return distinct;
}

/** One discovery level only; no network, no JavaScript, no links off the source origin. */
export function discoverJobPageUrls(html: string, listingUrl: string, source: JobSourceName, allowedHosts: string[], detailPathPrefixes: string[]): string[] {
  if (typeof html !== "string" || Buffer.byteLength(html) > 10 * 1024 * 1024) throw new Error("Job listing page exceeds the size limit.");
  const listing = new URL(listingUrl);
  const hosts = JOB_SOURCE_HOSTS[source];
  if (!hosts || listing.protocol !== "https:" || listing.username || listing.password || listing.port
    || !hosts.includes(listing.hostname) || !allowedHosts.includes(listing.hostname)) throw new Error("Listing URL must use an allowed official source origin.");
  if (!Array.isArray(detailPathPrefixes) || !detailPathPrefixes.length || detailPathPrefixes.some(prefix => typeof prefix !== "string" || !prefix.startsWith("/") || prefix.startsWith("//") || /[?#\\]/.test(prefix))) throw new Error("Invalid job detail path prefixes.");
  const $ = load(html);
  const urls = new Set<string>();
  $("a[href]").each((_, element) => {
    if (urls.size >= 20) return false;
    let url: URL;
    try { url = new URL($(element).attr("href")!, listing); } catch { return; }
    if (url.origin !== listing.origin || url.username || url.password || url.port || !allowedHosts.includes(url.hostname)
      || !detailPathPrefixes.some(prefix => url.pathname.startsWith(prefix))) return;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) if (/^(utm_|trk$|trackingId$|refId$)/i.test(key)) url.searchParams.delete(key);
    const seed = new URL(listing); seed.hash = "";
    if (url.href !== seed.href && url.pathname !== "/") urls.add(url.href);
  });
  return [...urls];
}
