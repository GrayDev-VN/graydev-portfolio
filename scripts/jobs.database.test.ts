import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { acquireCollectionLease, finishCollectionRun, migrateJobsDatabase, PUBLIC_JOB_RECORD_LIMIT, readDatabaseJobs, releaseCollectionLease, saveCollectedJobs, startCollectionRun } from "../src/features/jobs/database.ts";
import type { SqlClient } from "../src/features/jobs/database.ts";
import type { Job, JobSourceName } from "../src/features/jobs/types.ts";
import { JOB_SOURCE_HOSTS } from "../src/features/jobs/types.ts";
import { normalizeJob } from "../src/features/jobs/normalize.ts";

const now = new Date("2026-11-03T10:00:00Z");
const postgres = new PGlite();
const db: SqlClient = { async query(text, values) {
  const result = await postgres.query<Record<string, unknown>>(text, values);
  return { rows: result.rows, rowCount: result.affectedRows };
} };
before(async () => { await migrateJobsDatabase(db); });
beforeEach(async () => { await db.query("TRUNCATE job_source_records, job_collection_runs, job_collection_leases"); });
after(async () => { await postgres.close(); });

function fixture(source: JobSourceName = "ITviec", changes: Partial<Job> = {}): Job {
  return { id: `fixture-${source}`, title: "Junior Java Backend", company: "Fixture company", location: "TP. Hồ Chí Minh",
    description: "Java Spring Boot SQL", workMode: "hybrid", categories: ["java-backend"], levels: ["junior"], skills: ["Java"],
    checkedAt: "2026-11-03T09:00:00Z", postedAt: "2026-11-01", status: "active",
    sources: [{ name: source, url: `https://${JOB_SOURCE_HOSTS[source][0]}/jobs/fixture`, sourceId: "posting-1" }], ...changes };
}

test("PostgreSQL migrations are repeatable without deleting records", async () => {
  await saveCollectedJobs(db, "ITviec", [fixture()], now);
  await migrateJobsDatabase(db);
  await migrateJobsDatabase(db);
  assert.equal((await readDatabaseJobs(db, now)).length, 1);
});
test("upgrades legacy five-source constraints without losing jobs, runs or leases", async () => {
  await saveCollectedJobs(db, "ITviec", [fixture()], now);
  await startCollectionRun(db, { id: "legacy-run", source: "ITviec", now });
  await acquireCollectionLease(db, "ITviec", "legacy-owner", 60, now);
  for (const table of ["job_source_records", "job_collection_runs", "job_collection_leases"]) {
    await db.query(`ALTER TABLE ${table} DROP CONSTRAINT ${table}_source_name_check,
      ADD CONSTRAINT ${table}_source_name_check CHECK (source_name IN ('ITviec','TopDev','VietnamWorks','TopCV','LinkedIn'))`);
  }
  await migrateJobsDatabase(db);
  const upgraded = await db.query("SELECT oid FROM pg_constraint WHERE conname = 'job_source_records_source_name_check'");
  await migrateJobsDatabase(db);
  const repeated = await db.query("SELECT oid FROM pg_constraint WHERE conname = 'job_source_records_source_name_check'");
  assert.deepEqual(repeated.rows, upgraded.rows, "repeat migration must not drop/recreate current constraints");
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 1);
  assert.equal((await db.query("SELECT * FROM job_collection_runs")).rows.length, 1);
  assert.equal((await db.query("SELECT * FROM job_collection_leases")).rows.length, 1);
  for (const source of ["SmartRecruiters", "Lever"] as const) {
    assert.equal(await saveCollectedJobs(db, source, [fixture(source)], now), 1);
    await startCollectionRun(db, { id: `${source}-run`, source, now });
    assert.equal(await acquireCollectionLease(db, source, `${source}-owner`, 60, now), true);
  }
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 3);
  await assert.rejects(db.query("INSERT INTO job_collection_leases (source_name, owner, expires_at) VALUES ($1, $2, $3)", ["UnknownProvider", "owner", now.toISOString()]), /check constraint/);
});
test("employer API source URLs only accept exact public posting hosts", () => {
  assert.equal(normalizeJob(fixture("SmartRecruiters"), now).sources[0].name, "SmartRecruiters");
  assert.equal(normalizeJob(fixture("Lever"), now).sources[0].name, "Lever");
  for (const [source, host] of [["SmartRecruiters", "api.smartrecruiters.com"], ["SmartRecruiters", "www.jobs.smartrecruiters.com"], ["SmartRecruiters", "jobs.smartrecruiters.com.attacker.test"], ["Lever", "api.lever.co"], ["Lever", "www.jobs.lever.co"]] as const) {
    assert.throws(() => normalizeJob(fixture(source, { sources: [{ name: source, url: `https://${host}/jobs/fixture` }] }), now), /official host/);
  }
});
test("upserts are idempotent and ignore stale or equal checkedAt", async () => {
  assert.equal(await saveCollectedJobs(db, "ITviec", [fixture()], now), 1);
  assert.equal(await saveCollectedJobs(db, "ITviec", [fixture()], now), 0);
  const older = fixture("ITviec", { status: "expired", checkedAt: "2026-11-03T08:00:00Z" });
  assert.equal(await saveCollectedJobs(db, "ITviec", [older], now), 0);
  assert.equal((await readDatabaseJobs(db, now))[0].status, "active");
  const newer = fixture("ITviec", { status: "expired", checkedAt: "2026-11-03T09:30:00Z" });
  assert.equal(await saveCollectedJobs(db, "ITviec", [newer], now), 1);
  assert.equal((await readDatabaseJobs(db, now)).length, 0);
});
test("empty successful batches and failed collections do not expire unseen jobs", async () => {
  await saveCollectedJobs(db, "ITviec", [fixture()], now);
  assert.equal(await saveCollectedJobs(db, "ITviec", [], now), 0);
  await startCollectionRun(db, { id: "failed-run", source: "ITviec", now });
  await finishCollectionRun(db, { id: "failed-run", status: "failed", errorCode: "UPSTREAM_UNAVAILABLE", now });
  assert.equal((await readDatabaseJobs(db, now)).length, 1);
});
test("database read merges source records and respects each source's later deadline", async () => {
  await saveCollectedJobs(db, "ITviec", [fixture("ITviec", { expiresAt: "2026-11-04" })], now);
  await saveCollectedJobs(db, "TopCV", [fixture("TopCV", { expiresAt: "2026-11-10" })], now);
  const jobs = await readDatabaseJobs(db, new Date("2026-11-06T10:00:00Z"));
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].sources.length, 2);
  assert.equal(jobs[0].sources.find(source => source.name === "ITviec")?.status, "expired");
  assert.equal(jobs[0].sources.find(source => source.name === "TopCV")?.status, "active");
});
test("source ID keeps a stable database record across changed URL and title", async () => {
  await saveCollectedJobs(db, "ITviec", [fixture()], now);
  await saveCollectedJobs(db, "ITviec", [fixture("ITviec", { title: "Updated Java title", checkedAt: "2026-11-03T09:30:00Z", sources: [{ name: "ITviec", sourceId: "posting-1", url: "https://itviec.com/jobs/new-slug" }] })], now);
  const result = await db.query("SELECT source_key FROM job_source_records");
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].source_key, "id:posting-1");
  assert.equal((await readDatabaseJobs(db, now))[0].title, "Updated Java title");
});
test("SQL parameters safely store hostile text and source identities", async () => {
  const attack = "'; DROP TABLE job_source_records; --";
  await saveCollectedJobs(db, "ITviec", [fixture("ITviec", { company: attack, sources: [{ name: "ITviec", sourceId: attack, url: "https://itviec.com/jobs/safe" }] })], now);
  assert.equal((await readDatabaseJobs(db, now))[0].company, attack);
  await migrateJobsDatabase(db);
  assert.equal(Number((await db.query("SELECT COUNT(*) AS count FROM job_source_records")).rows[0].count), 1);
});
test("rejects mixed-source injection before beginning a transaction", async () => {
  await assert.rejects(saveCollectedJobs(db, "ITviec", [fixture("TopCV")], now), /matching source/);
  await assert.rejects(saveCollectedJobs(db, "ITviec", [fixture("ITviec", { sources: [...fixture().sources, ...fixture("TopCV").sources] })], now), /exactly one/);
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 0);
});
test("entire batch rolls back if a database write fails", async () => {
  let inserts = 0;
  let released = false;
  const connection: SqlClient & { release(): void } = { async query(text, values) {
    if (text.startsWith("INSERT INTO job_source_records") && ++inserts === 2) throw new Error("Injected write failure");
    return db.query(text, values);
  }, release() { released = true; } };
  const pool: SqlClient = { query() { throw new Error("Pool query must not be used during transaction"); }, async connect() { return connection; } };
  const second = fixture("ITviec", { id: "second", sources: [{ name: "ITviec", sourceId: "posting-2", url: "https://itviec.com/jobs/second" }] });
  await assert.rejects(saveCollectedJobs(pool, "ITviec", [fixture(), second], now), /Injected write failure/);
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 0);
  assert.equal(released, true);
});
test("lease acquisition is atomic, source-scoped and owner checked on release", async () => {
  assert.equal(await acquireCollectionLease(db, "ITviec", "owner-a", 60, now), true);
  assert.equal(await acquireCollectionLease(db, "ITviec", "owner-b", 60, now), false);
  assert.equal(await acquireCollectionLease(db, "TopCV", "owner-b", 60, now), true);
  await releaseCollectionLease(db, "ITviec", "owner-b");
  assert.equal(await acquireCollectionLease(db, "ITviec", "owner-b", 60, now), false);
  const expired = new Date(now.getTime() + 60000);
  assert.equal(await acquireCollectionLease(db, "ITviec", "owner-b", 60, expired), true);
  await releaseCollectionLease(db, "ITviec", "owner-a");
  assert.equal(await acquireCollectionLease(db, "ITviec", "owner-c", 60, expired), false);
  await releaseCollectionLease(db, "ITviec", "owner-b");
  assert.equal(await acquireCollectionLease(db, "ITviec", "owner-c", 60, expired), true);
  await assert.rejects(acquireCollectionLease(db, "ITviec", "owner-c", 0, now), /duration/);
});
test("lease fence rejects expired or replaced workers without modifying records", async () => {
  await acquireCollectionLease(db, "ITviec", "worker-a", 60, now);
  await assert.rejects(saveCollectedJobs(db, "ITviec", [fixture()], now, "worker-b"), /lease lost/);
  assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 0);
  assert.equal(await saveCollectedJobs(db, "ITviec", [fixture()], now, "worker-a"), 1);
  const later = new Date(now.getTime() + 60000);
  await assert.rejects(saveCollectedJobs(db, "ITviec", [fixture()], later, "worker-a"), /lease lost/);
  assert.equal(await acquireCollectionLease(db, "ITviec", "worker-b", 60, later), true);
  await assert.rejects(saveCollectedJobs(db, "ITviec", [fixture()], later, "worker-a"), /lease lost/);
});
test("public database read stays within validator cap even when history grows beyond it", async () => {
  await db.query(`INSERT INTO job_source_records (source_name, source_key, job, checked_at)
    SELECT 'ITviec', 'history-' || item, $1::jsonb || jsonb_build_object('id', 'history-' || item), $2
    FROM generate_series(1, $3::integer) AS item`, [JSON.stringify(fixture("ITviec", { status: "expired" })), now.toISOString(), PUBLIC_JOB_RECORD_LIMIT + 1]);
  await saveCollectedJobs(db, "TopCV", [fixture("TopCV")], now);
  let rowCount = 0;
  const bounded: SqlClient = { async query(text, values) { const result = await db.query(text, values); rowCount = result.rows.length; return result; } };
  const jobs = await readDatabaseJobs(bounded, now);
  assert.equal(rowCount, PUBLIC_JOB_RECORD_LIMIT);
  assert.equal(jobs.length, 1);
  assert.ok(jobs[0].sources.some(source => source.name === "TopCV"));
});
test("more than 10000 active out-of-scope jobs cannot crowd out eligible HCM jobs", async () => {
  await db.query(`INSERT INTO job_source_records (source_name, source_key, job, checked_at)
    SELECT 'ITviec', 'hanoi-' || item, $1::jsonb || jsonb_build_object('id', 'hanoi-' || item), $2
    FROM generate_series(1, $3::integer) AS item`, [JSON.stringify(fixture("ITviec", { location: "Hà Nội" })), now.toISOString(), PUBLIC_JOB_RECORD_LIMIT + 1]);
  await saveCollectedJobs(db, "TopCV", [fixture("TopCV", { location: "TP. Hồ Chí Minh" })], now);
  const jobs = await readDatabaseJobs(db, now);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].location, "TP. Hồ Chí Minh");
});
test("collection outcomes have terminal states and only bounded error categories", async () => {
  await startCollectionRun(db, { id: "run-1", source: "TopCV", now });
  await finishCollectionRun(db, { id: "run-1", status: "succeeded", count: 3, now });
  const result = await db.query("SELECT status, record_count, error_code FROM job_collection_runs WHERE id = $1", ["run-1"]);
  assert.deepEqual(result.rows[0], { status: "succeeded", record_count: 3, error_code: null });
  await assert.rejects(finishCollectionRun(db, { id: "run-1", status: "failed", now }), /already finished/);
  await assert.rejects(finishCollectionRun(db, { id: "missing", status: "failed", errorCode: "secret url https://example.test" }), /error code/);
  await assert.rejects(finishCollectionRun(db, { id: "missing", status: "skipped", count: -1 }), /count/);
});
