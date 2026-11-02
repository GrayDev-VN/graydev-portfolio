import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { after, before, beforeEach, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { acquireCollectionLease, migrateJobsDatabase, readDatabaseJobs, saveCollectedJobs } from "../src/features/jobs/database.ts";
import type { SqlClient } from "../src/features/jobs/database.ts";
import { jobsPoolConfig, jobsStorage } from "../src/features/jobs/connection.ts";
import { parseSourceConfigs } from "../src/features/jobs/collection/config.ts";
import { collectSource } from "../src/features/jobs/collection/collector.ts";
import { runJobCollection } from "../src/features/jobs/collection/pipeline.ts";
import type { Job, JobSourceName } from "../src/features/jobs/types.ts";

const now = new Date("2026-11-03T10:00:00Z");
const engine = new PGlite();
const db: SqlClient = { async query(sql, params) { const result = await engine.query<Record<string, unknown>>(sql, params); return { rows: result.rows, rowCount: result.affectedRows }; } };
before(async () => { await migrateJobsDatabase(db); });
beforeEach(async () => { await db.query("TRUNCATE job_source_records, job_collection_runs, job_collection_leases"); });
after(async () => { await engine.close(); });

function config(name: JobSourceName = "ITviec") {
  return parseSourceConfigs([{ name, enabled: true, allowedHosts: ["authorized.example.com"], feedUrl: "https://authorized.example.com/jobs.json", permissionReference: "test-fixture-permission" }])[0];
}
function fixture(name: JobSourceName = "ITviec"): Job {
  const host = name === "TopCV" ? "topcv.vn" : "itviec.com";
  return { id: "fixture-1", title: "Java Backend Intern", company: "Fixture only", location: "TP. Hồ Chí Minh",
    description: "Java Spring Boot REST API", categories: ["java-backend"], levels: ["intern"], skills: ["Java"],
    workMode: "unknown", status: "active", checkedAt: "2026-11-03T09:00:00Z", sources: [{ name, url: `https://${host}/jobs/fixture` }] };
}

test("web storage auto-selects configured PostgreSQL and rejects invalid modes", () => {
  assert.equal(jobsStorage({}), "snapshot");
  assert.equal(jobsStorage({ JOBS_DATABASE_URL: "configured" }), "postgres");
  assert.equal(jobsStorage({ JOBS_READ_DATABASE_URL: "configured" }), "postgres");
  assert.equal(jobsStorage({ JOBS_STORAGE: "snapshot", JOBS_DATABASE_URL: "configured" }), "snapshot");
  assert.throws(() => jobsStorage({ JOBS_STORAGE: "oops" }));
});

test("database connections verify remote TLS without exposing credentials in errors", () => {
  const config = jobsPoolConfig("postgresql://test:fixture-only@db.example.com/jobs?sslmode=require");
  assert.deepEqual(config.ssl, { rejectUnauthorized: true });
  assert.ok(!config.connectionString?.includes("sslmode="));
  assert.equal(jobsPoolConfig("postgresql://test:fixture-only@localhost:55432/jobs").ssl, false);
  for (const value of ["secret-invalid-url", "https://user:private@db.example.com/jobs", "postgresql://user:private@db.example.com/jobs?sslmode=disable"]) {
    assert.throws(() => jobsPoolConfig(value), error => error instanceof Error && !error.message.includes("private") && !error.message.includes(value));
  }
});

test("disabled sources never fetch and never create a misleading successful run", async () => {
  const result = await runJobCollection(db, parseSourceConfigs([{ name: "ITviec", enabled: false }]), { collect: async () => { throw new Error("Must not fetch"); } });
  assert.equal(result[0].status, "disabled");
  assert.equal((await db.query("SELECT * FROM job_collection_runs")).rows.length, 0);
});

test("operator CLI refuses an unconfigured run without claiming collection success", () => {
  const script = fileURLToPath(new URL("./collect-jobs.ts", import.meta.url));
  const disabledConfig = fileURLToPath(new URL("./fixtures/jobs-disabled.json", import.meta.url));
  const result = spawnSync(process.execPath, ["--experimental-strip-types", script, "--config", disabledConfig], {
    encoding: "utf8", timeout: 15000,
    env: { ...process.env, JOBS_DATABASE_URL: "must-not-connect-or-print-this" },
  });
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("No authorized sources enabled"));
  assert.ok(!`${result.stdout}${result.stderr}`.includes("must-not-connect-or-print-this"));
});

test("authorized feed travels through fetch, validation, SQL persistence and public read", async () => {
  const result = await runJobCollection(db, [config()], { clock: () => now, collect: source => collectSource(source, {
    now, sleep: async () => {}, fetchImpl: async () => new Response(JSON.stringify([fixture()]), { headers: { "content-type": "application/json" } }),
  }) });
  assert.equal(result[0].status, "succeeded");
  assert.equal(result[0].count, 1);
  const jobs = await readDatabaseJobs(db, now);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].title, "Java Backend Intern");
  const runs = (await db.query("SELECT status, record_count FROM job_collection_runs")).rows;
  assert.deepEqual(runs, [{ status: "succeeded", record_count: 1 }]);
  assert.equal((await db.query("SELECT * FROM job_collection_leases")).rows.length, 0);
});

test("source failures preserve old rows, sanitize errors and allow another source to finish", async () => {
  await saveCollectedJobs(db, "ITviec", [fixture()], now);
  const result = await runJobCollection(db, [config(), config("TopCV")], { clock: () => now, collect: async source => {
    if (source.name === "ITviec") throw new Error("https://secret.example/?token=DO_NOT_STORE");
    return [fixture("TopCV")];
  } });
  assert.deepEqual(result.map(value => value.status), ["failed", "succeeded"]);
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 2);
  const runs = (await db.query("SELECT * FROM job_collection_runs")).rows;
  assert.ok(!JSON.stringify(runs).includes("DO_NOT_STORE"));
  assert.ok(runs.some(run => run.error_code === "COLLECTION_FAILED"));
  assert.equal((await db.query("SELECT * FROM job_collection_leases")).rows.length, 0);
});

test("concurrent source lease skips fetch without claiming success", async () => {
  await acquireCollectionLease(db, "ITviec", "other-worker", 600, now);
  let fetched = false;
  const result = await runJobCollection(db, [config()], { clock: () => now, collect: async () => { fetched = true; return []; } });
  assert.equal(fetched, false);
  assert.equal(result[0].status, "skipped");
  assert.equal((await db.query("SELECT owner FROM job_collection_leases")).rows[0].owner, "other-worker");
});

test("lease expiry during fetch fences the stale worker and records failure", async () => {
  let time = now;
  const result = await runJobCollection(db, [config()], { clock: () => time, collect: async () => {
    time = new Date(now.getTime() + 601000);
    return [fixture()];
  } });
  assert.equal(result[0].status, "failed");
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 0);
});
