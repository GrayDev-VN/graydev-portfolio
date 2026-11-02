import { JOB_CATEGORIES, JOB_LEVELS, JOB_SOURCE_NAMES, JOB_SOURCE_HOSTS } from "./types.ts";
import type { Job, JobFilters, JobSource, JobSourceName, JobWorkMode } from "./types.ts";

function record(input: unknown, field: string): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error(`${field}: expected object`);
  return input as Record<string, unknown>;
}
function text(input: unknown, field: string, max = 20000): string {
  if (typeof input !== "string" || !input.trim() || input.length > max) throw new Error(`${field}: expected nonempty string (max ${max})`);
  return input.trim();
}
function values<T extends string>(input: unknown, allowed: readonly T[], field: string): T[] {
  if (!Array.isArray(input) || input.some(value => !allowed.includes(value))) throw new Error(`${field}: invalid values`);
  return [...new Set(input)] as T[];
}
function date(input: unknown, field: string): string {
  const value = text(input, field, 40);
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(value)) throw new Error(`${field}: use ISO UTC date`);
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value.slice(0, 10)) throw new Error(`${field}: invalid date`);
  return value;
}
export function foldText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}
export function isHoChiMinh(location: string): boolean {
  return /\b(?:ho\s*chi\s*minh|hcmc?|sai\s*gon)\b/.test(foldText(location).replace(/[.,]/g, " "));
}
function normalizeSource(input: unknown, fallback: { checkedAt: string; expiresAt?: string; status: "active" | "expired" }, now: Date): JobSource {
  const raw = record(input, "source");
  if (!JOB_SOURCE_NAMES.includes(raw.name as JobSourceName)) throw new Error("source.name: unsupported source");
  const name = raw.name as JobSourceName;
  const url = new URL(text(raw.url, "source.url", 2048));
  if (url.protocol !== "https:" || url.username || url.password || url.port || !JOB_SOURCE_HOSTS[name].includes(url.hostname)) throw new Error("source.url: expected HTTPS URL on the source's official host");
  if (url.pathname === "/") throw new Error("source.url: expected a posting URL, not the source homepage");
  url.hash = "";
  // Remove tracking only; preserve query parameters that may identify a posting.
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|trk$|trackingId$|refId$)/i.test(key)) url.searchParams.delete(key);
  const hasLifecycle = raw.status !== undefined || raw.checkedAt !== undefined;
  const checkedAt = raw.checkedAt === undefined ? fallback.checkedAt : date(raw.checkedAt, "source.checkedAt");
  const expiresAt = raw.expiresAt === undefined ? (hasLifecycle ? undefined : fallback.expiresAt) : date(raw.expiresAt, "source.expiresAt");
  const status = raw.status === undefined ? fallback.status : raw.status;
  if (status !== "active" && status !== "expired") throw new Error("source.status: invalid value");
  if (Date.parse(checkedAt) > now.getTime()) throw new Error("source.checkedAt: cannot be in the future");
  return { name, url: url.toString(), ...(raw.sourceId === undefined ? {} : { sourceId: text(raw.sourceId, "source.sourceId", 200) }), checkedAt,
    ...(expiresAt ? { expiresAt } : {}), status: status === "expired" || (expiresAt && expiryTime(expiresAt) < now.getTime()) ? "expired" : "active" };
}

function lifecycle(sources: JobSource[], fallback: Job): Pick<Job, "checkedAt" | "expiresAt" | "status"> {
  const active = sources.filter(source => (source.status ?? fallback.status) === "active");
  const checkedAt = sources.map(source => source.checkedAt ?? fallback.checkedAt).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  const dated = active.length ? active : sources;
  const expiresAt = dated.every(source => source.expiresAt) ? dated.map(source => source.expiresAt!).sort((a, b) => expiryTime(b) - expiryTime(a))[0] : undefined;
  return { checkedAt, expiresAt, status: active.length ? "active" : "expired" };
}

export function normalizeJob(input: unknown, now = new Date()): Job {
  const raw = record(input, "job");
  const checkedAt = date(raw.checkedAt, "checkedAt");
  const postedAt = raw.postedAt === undefined ? undefined : date(raw.postedAt, "postedAt");
  const expiresAt = raw.expiresAt === undefined ? undefined : date(raw.expiresAt, "expiresAt");
  if (Date.parse(checkedAt) > now.getTime()) throw new Error("checkedAt: cannot be in the future");
  if (postedAt && Date.parse(postedAt) > Date.parse(checkedAt)) throw new Error("postedAt: cannot follow checkedAt");
  if (expiresAt && postedAt && Date.parse(expiresAt) < Date.parse(postedAt)) throw new Error("expiresAt: cannot precede postedAt");
  if (raw.status !== "active" && raw.status !== "expired") throw new Error("status: invalid value");
  const workModes: JobWorkMode[] = ["onsite", "hybrid", "remote", "unknown"];
  if (!workModes.includes(raw.workMode as JobWorkMode)) throw new Error("workMode: invalid value");
  if (!Array.isArray(raw.sources) || !raw.sources.length || raw.sources.length > 20) throw new Error("sources: expected 1-20 sources");
  if (!Array.isArray(raw.skills) || raw.skills.length > 100) throw new Error("skills: expected at most 100 strings");
  const job: Job = {
    id: text(raw.id, "id", 200), title: text(raw.title, "title", 300), company: text(raw.company, "company", 300),
    location: text(raw.location, "location", 500), description: text(raw.description, "description", 100000),
    workMode: raw.workMode as JobWorkMode,
    categories: values(raw.categories, JOB_CATEGORIES, "categories"), levels: values(raw.levels, JOB_LEVELS, "levels"),
    skills: [...new Set(raw.skills.map(skill => text(skill, "skill", 100)))],
    checkedAt, ...(postedAt ? { postedAt } : {}), ...(expiresAt ? { expiresAt } : {}),
    ...(raw.salary === undefined ? {} : { salary: text(raw.salary, "salary", 300) }),
    status: raw.status === "expired" || (expiresAt && expiryTime(expiresAt) < now.getTime()) ? "expired" : "active",
    sources: raw.sources.map(source => normalizeSource(source, { checkedAt, expiresAt, status: raw.status as "active" | "expired" }, now)),
  };
  return { ...job, ...lifecycle(job.sources, job) };
}

// Date-only deadlines include the whole posting day in Vietnam (UTC+7).
function expiryTime(value: string): number {
  return value.length === 10 ? Date.parse(`${value}T23:59:59.999+07:00`) : Date.parse(value);
}
function normalizedKey(value: string): string { return foldText(value).replace(/[^a-z0-9]+/g, " ").trim(); }

export function deduplicateJobs(jobs: Job[]): Job[] {
  const groups: Job[][] = [];
  for (const job of jobs) {
    const key = `${normalizedKey(job.company)}|${normalizedKey(job.title)}|${normalizedKey(job.location)}`;
    const matching: number[] = [];
    groups.forEach((group, index) => {
      const hasSourceConflict = group.some(existing => existing.sources.some(source => job.sources.some(other => source.name === other.name)));
      if (group.some(existing => {
        const sameSourceIdentity = existing.sources.some(source => job.sources.some(other => source.name === other.name && (source.url === other.url || (!!source.sourceId && source.sourceId === other.sourceId))));
        // Cross-source similarity is only a conservative heuristic; distinct postings
        // on the same board and reposts months apart must remain separate.
        const crossPost = matching.length === 0 && !hasSourceConflict
          && !!existing.postedAt && !!job.postedAt
          && Math.abs(Date.parse(existing.postedAt) - Date.parse(job.postedAt)) <= 7 * 86400000
          && `${normalizedKey(existing.company)}|${normalizedKey(existing.title)}|${normalizedKey(existing.location)}` === key;
        return sameSourceIdentity || crossPost;
      })) matching.push(index);
    });
    if (!matching.length) groups.push([job]);
    else {
      const merged = [job, ...matching.flatMap(index => groups[index])];
      for (const index of matching.reverse()) groups.splice(index, 1);
      groups.push(merged);
    }
  }
  return groups.map(group => {
    const ordered = [...group].sort((a, b) => Date.parse(b.checkedAt) - Date.parse(a.checkedAt) || a.id.localeCompare(b.id));
    // Resolve each source's latest state before deciding whether any source is open.
    // An old active record must not revive a newer closed record from that source.
    const latestBySource: { source: JobSource; job: Job }[] = [];
    const sourceEntries = ordered.flatMap(job => job.sources.map(source => ({ source, job }))).sort((a, b) => Date.parse(b.source.checkedAt ?? b.job.checkedAt) - Date.parse(a.source.checkedAt ?? a.job.checkedAt));
    for (const { job: item, source } of sourceEntries) {
      if (!latestBySource.some(latest => latest.source.name === source.name && (latest.source.url === source.url || (!!source.sourceId && latest.source.sourceId === source.sourceId)))) latestBySource.push({ source, job: item });
    }
    const newest = latestBySource.find(entry => (entry.source.status ?? entry.job.status) === "active")?.job ?? ordered[0];
    const sources = latestBySource.map(entry => entry.source);
    return { ...newest, sources, ...lifecycle(sources, newest) };
  }).sort((a, b) => Date.parse(b.postedAt ?? b.checkedAt) - Date.parse(a.postedAt ?? a.checkedAt) || a.id.localeCompare(b.id));
}
export function normalizeJobs(input: unknown, now = new Date()): Job[] {
  if (!Array.isArray(input) || input.length > 10000) throw new Error("jobs: expected array with at most 10000 entries");
  const jobs = input.map((value, index) => {
    try { return normalizeJob(value, now); } catch (error) { throw new Error(`jobs[${index}]: ${error instanceof Error ? error.message : "invalid job"}`); }
  });
  const ids = new Set<string>();
  for (const job of jobs) {
    if (ids.has(job.id)) throw new Error(`jobs: duplicate id ${job.id}`);
    ids.add(job.id);
  }
  return deduplicateJobs(jobs);
}
export function filterJobs(jobs: Job[], filters: JobFilters = {}, now = new Date()): Job[] {
  const query = foldText(filters.query?.trim() ?? "").split(/\s+/).filter(Boolean);
  return jobs.filter(job => isHoChiMinh(job.location) && job.categories.length > 0 && job.levels.length > 0
    && (filters.includeExpired || (job.status === "active" && (!job.expiresAt || expiryTime(job.expiresAt) >= now.getTime())))
    && (!filters.category || job.categories.includes(filters.category))
    && (!filters.level || job.levels.includes(filters.level))
    && (!filters.source || job.sources.some(source => source.name === filters.source))
    && (!filters.workMode || job.workMode === filters.workMode)
    && query.every(token => foldText([job.title, job.company, job.location, job.description, ...job.skills].join(" ")).includes(token)));
}
