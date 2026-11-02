import { randomUUID } from "node:crypto";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { filterJobs, normalizeJobs } from "./normalize.ts";
import type { Job } from "./types.ts";
import { jobsDatabase, jobsStorage } from "./connection.ts";
import { readDatabaseJobs } from "./database.ts";

/** Read the approved snapshot only. Never fetch job boards during a page request. */
export async function readJobsSnapshot(filename: string, now = new Date()): Promise<Job[]> {
  const content = await readFile(filename, "utf8");
  if (Buffer.byteLength(content) > 10 * 1024 * 1024) throw new Error("Snapshot exceeds 10 MB.");
  return filterJobs(normalizeJobs(JSON.parse(content), now), {}, now);
}
export async function getJobs(): Promise<Job[]> {
  if (jobsStorage() === "postgres") return readDatabaseJobs(jobsDatabase("read"));
  return readJobsSnapshot(path.join(process.cwd(), "data", "jobs.json"));
}

export async function getJobCollectionInfo(): Promise<{ storage: "postgres" | "snapshot"; lastCollectedAt?: string }> {
  const storage = jobsStorage();
  if (storage === "snapshot") return { storage };
  const result = await jobsDatabase("read").query("SELECT MAX(finished_at) AS latest FROM job_collection_runs WHERE status = 'succeeded'");
  const latest = result.rows[0]?.latest;
  return { storage, ...(latest ? { lastCollectedAt: new Date(latest).toISOString() } : {}) };
}

/** Whole-snapshot replacement. The CLI fixes destination; injection supports isolated tests. */
export async function importJobsSnapshot(input: string, destination: string, now = new Date()): Promise<number> {
  if (path.resolve(input).toLowerCase() === path.resolve(destination).toLowerCase()) throw new Error("Use a separate input file.");
  const content = await readFile(input, "utf8");
  if (Buffer.byteLength(content) > 10 * 1024 * 1024) throw new Error("Import file exceeds 10 MB.");
  const jobs = normalizeJobs(JSON.parse(content), now);
  const temporary = path.join(path.dirname(destination), `.jobs-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, `${JSON.stringify(jobs, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    await rename(temporary, destination);
  } finally {
    await unlink(temporary).catch((error: NodeJS.ErrnoException) => { if (error.code !== "ENOENT") throw error; });
  }
  return jobs.length;
}
