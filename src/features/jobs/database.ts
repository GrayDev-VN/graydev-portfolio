import { createHash } from "node:crypto";
import { filterJobs, normalizeJob, normalizeJobs } from "./normalize.ts";
import { JOB_SOURCE_NAMES } from "./types.ts";
import type { Job, JobSourceName } from "./types.ts";

export interface SqlConnection {
  query(text: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[]; rowCount?: number | null }>;
  release(): void;
}
export interface SqlClient {
  query(text: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[]; rowCount?: number | null }>;
  /** Pools must supply connect so transactions stay on one checked-out connection. */
  connect?(): Promise<SqlConnection>;
}

export const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS job_source_records (
  source_name TEXT NOT NULL CHECK (source_name IN ('ITviec','TopDev','VietnamWorks','TopCV','LinkedIn','SmartRecruiters','Lever')),
  source_key TEXT NOT NULL,
  job JSONB NOT NULL CHECK (jsonb_typeof(job) = 'object'),
  checked_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (source_name, source_key)
);
CREATE TABLE IF NOT EXISTS job_collection_runs (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL CHECK (source_name IN ('ITviec','TopDev','VietnamWorks','TopCV','LinkedIn','SmartRecruiters','Lever')),
  status TEXT NOT NULL CHECK (status IN ('running','succeeded','failed','skipped')),
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  record_count INTEGER NOT NULL DEFAULT 0 CHECK (record_count >= 0),
  error_code TEXT
);
CREATE TABLE IF NOT EXISTS job_collection_leases (
  source_name TEXT PRIMARY KEY CHECK (source_name IN ('ITviec','TopDev','VietnamWorks','TopCV','LinkedIn','SmartRecruiters','Lever')),
  owner TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS job_collection_runs_started_idx ON job_collection_runs (started_at DESC);
`;

/** Bound request memory; newest active in-scope records have priority over history. */
export const PUBLIC_JOB_RECORD_LIMIT = 10000;

function sourceName(source: JobSourceName): JobSourceName {
  if (!JOB_SOURCE_NAMES.includes(source)) throw new Error("Unsupported job source.");
  return source;
}
function identifier(value: string): string {
  if (typeof value !== "string" || !value.trim() || value.length > 200) throw new Error("Invalid collection identifier.");
  return value;
}
function timestamp(now: Date): string {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid collection time.");
  return now.toISOString();
}

export async function migrateJobsDatabase(db: SqlClient): Promise<void> {
  const connection = db.connect ? await db.connect() : db;
  let began = false;
  try {
    await connection.query("BEGIN");
    began = true;
    // Serialize schema upgrades even when scheduled workers start together.
    await connection.query("SELECT pg_advisory_xact_lock(1886351978)");
    for (const statement of MIGRATION_SQL.split(";").map(value => value.trim()).filter(Boolean)) await connection.query(statement);
    const tables = ["job_source_records", "job_collection_runs", "job_collection_leases"] as const;
    for (const table of tables) {
      const constraint = `${table}_source_name_check`;
      const existing = await connection.query("SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid = $1::regclass AND conname = $2", [table, constraint]);
      const definition = String(existing.rows[0]?.definition ?? "");
      if (!definition.includes("'SmartRecruiters'") || !definition.includes("'Lever'")) {
        // Names are fixed repository constants, never provider/user-controlled SQL.
        await connection.query(`ALTER TABLE ${table} DROP CONSTRAINT IF EXISTS ${constraint},
          ADD CONSTRAINT ${constraint} CHECK (source_name IN ('ITviec','TopDev','VietnamWorks','TopCV','LinkedIn','SmartRecruiters','Lever'))`);
      }
    }
    await connection.query("COMMIT");
  } catch (error) {
    if (began) await connection.query("ROLLBACK");
    throw error;
  } finally {
    if (db.connect && "release" in connection && typeof connection.release === "function") connection.release();
  }
}

export async function readDatabaseJobs(db: SqlClient, now = new Date()): Promise<Job[]> {
  // Preserve closed cross-post links while capacity permits. History cannot crowd
  // eligible active jobs out, and the validator's 10000-record limit is never exceeded.
  const result = await db.query(`SELECT job FROM job_source_records
    ORDER BY CASE WHEN job->>'status' = 'active'
      AND job->'categories' ?| ARRAY['java-backend','ai-engineer','backend-ai']
      AND job->'levels' ?| ARRAY['intern','fresher','junior']
      AND translate(regexp_replace(normalize(lower(job->>'location'), NFD), '[̀-ͯ]', '', 'g'), '.,', '  ') ~ $3
      AND (
      job->>'expiresAt' IS NULL OR CASE WHEN length(job->>'expiresAt') = 10
        THEN (((job->>'expiresAt')::date + 1)::timestamp AT TIME ZONE 'Asia/Ho_Chi_Minh')
        ELSE (job->>'expiresAt')::timestamptz END > $1::timestamptz)
      THEN 0 ELSE 1 END,
      checked_at DESC, source_name, source_key LIMIT $2`, [timestamp(now), PUBLIC_JOB_RECORD_LIMIT, "\\m(ho\\s*chi\\s*minh|hcmc?|sai\\s*gon)\\M"]);
  return filterJobs(normalizeJobs(result.rows.map(row => row.job), now), {}, now);
}

export async function acquireCollectionLease(db: SqlClient, source: JobSourceName, owner: string, ttlSeconds = 300, now = new Date()): Promise<boolean> {
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 3600) throw new Error("Lease duration must be 1-3600 seconds.");
  const started = timestamp(now);
  const expires = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  const result = await db.query(`INSERT INTO job_collection_leases (source_name, owner, expires_at)
    VALUES ($1, $2, $3) ON CONFLICT (source_name) DO UPDATE SET owner = EXCLUDED.owner, expires_at = EXCLUDED.expires_at
    WHERE job_collection_leases.expires_at <= $4::timestamptz RETURNING source_name`, [sourceName(source), identifier(owner), expires, started]);
  return result.rows.length === 1;
}

export async function releaseCollectionLease(db: SqlClient, source: JobSourceName, owner: string): Promise<void> {
  await db.query("DELETE FROM job_collection_leases WHERE source_name = $1 AND owner = $2", [sourceName(source), identifier(owner)]);
}

export async function startCollectionRun(db: SqlClient, options: { id: string; source: JobSourceName; now?: Date }): Promise<void> {
  await db.query("INSERT INTO job_collection_runs (id, source_name, status, started_at) VALUES ($1, $2, 'running', $3)", [identifier(options.id), sourceName(options.source), timestamp(options.now ?? new Date())]);
}

export async function finishCollectionRun(db: SqlClient, options: { id: string; status: "succeeded" | "failed" | "skipped"; count?: number; errorCode?: string; now?: Date }): Promise<void> {
  if (!["succeeded", "failed", "skipped"].includes(options.status)) throw new Error("Invalid collection outcome.");
  const count = options.count ?? 0;
  if (!Number.isInteger(count) || count < 0) throw new Error("Invalid collection count.");
  // Store a bounded category only, never a provider error message that could contain secrets.
  if (options.errorCode !== undefined && !/^[A-Z][A-Z0-9_]{0,63}$/.test(options.errorCode)) throw new Error("Invalid collection error code.");
  const result = await db.query(`UPDATE job_collection_runs SET status = $2, finished_at = $3, record_count = $4, error_code = $5
    WHERE id = $1 AND status = 'running' AND started_at <= $3::timestamptz RETURNING id`, [identifier(options.id), options.status, timestamp(options.now ?? new Date()), count, options.errorCode ?? null]);
  if (!result.rows.length) throw new Error("Collection run is missing or already finished.");
}

/**
 * Upsert only observed records; missing records never imply closure or deletion.
 * Scheduled collectors must pass their leaseOwner and a fresh save-time `now`.
 * The lease row stays locked until commit so another collector cannot take over
 * halfway through this batch. Omit leaseOwner only for an explicitly managed import.
 */
export async function saveCollectedJobs(db: SqlClient, source: JobSourceName, jobs: Job[], now = new Date(), leaseOwner?: string): Promise<number> {
  sourceName(source);
  if (!Array.isArray(jobs) || jobs.length > 10000) throw new Error("Collection batch exceeds 10000 records.");
  const records = jobs.map(input => {
    const job = normalizeJob(input, now);
    if (job.sources.length !== 1 || job.sources[0].name !== source) throw new Error("Collection payload must belong to exactly one matching source.");
    const origin = job.sources[0];
    const key = origin.sourceId ? `id:${origin.sourceId}` : `url:${origin.url}`;
    const id = `${source}:${createHash("sha256").update(key).digest("hex")}`;
    return { key, job: { ...job, id }, checkedAt: origin.checkedAt ?? job.checkedAt };
  });
  // A Pool must hand us a dedicated session; BEGIN on Pool.query is unsafe.
  const connection = db.connect ? await db.connect() : db;
  let began = false;
  try {
    await connection.query("BEGIN");
    began = true;
    if (leaseOwner !== undefined) {
      const lease = await connection.query(`SELECT source_name FROM job_collection_leases
        WHERE source_name = $1 AND owner = $2 AND expires_at > $3::timestamptz FOR UPDATE`, [source, identifier(leaseOwner), timestamp(now)]);
      if (!lease.rows.length) throw new Error("Collection lease lost before save.");
    }
    let changed = 0;
    for (const record of records) {
      const result = await connection.query(`INSERT INTO job_source_records (source_name, source_key, job, checked_at)
        VALUES ($1, $2, $3::jsonb, $4) ON CONFLICT (source_name, source_key)
        DO UPDATE SET job = EXCLUDED.job, checked_at = EXCLUDED.checked_at
        WHERE job_source_records.checked_at < EXCLUDED.checked_at RETURNING source_key`, [source, record.key, JSON.stringify(record.job), record.checkedAt]);
      changed += result.rows.length;
    }
    await connection.query("COMMIT");
    return changed;
  } catch (error) {
    if (began) await connection.query("ROLLBACK");
    throw error;
  } finally {
    if (db.connect && "release" in connection && typeof connection.release === "function") connection.release();
  }
}
