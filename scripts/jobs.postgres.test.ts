import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { jobsDatabase, closeJobsDatabases } from "../src/features/jobs/connection.ts";
import { acquireCollectionLease, migrateJobsDatabase, readDatabaseJobs, saveCollectedJobs } from "../src/features/jobs/database.ts";
import type { SqlClient } from "../src/features/jobs/database.ts";
import { parseSourceConfigs } from "../src/features/jobs/collection/config.ts";
import { collectSource } from "../src/features/jobs/collection/collector.ts";
import { runJobCollection } from "../src/features/jobs/collection/pipeline.ts";

test("real PostgreSQL: isolated migration, collector persistence, upserts and racing leases", async t => {
  const schema = `jobs_test_${randomUUID().replace(/-/g, "")}`;
  assert.match(schema, /^jobs_test_[a-f0-9]{32}$/);
  const pool = jobsDatabase("write");
  const connection = await pool.connect();
  const db: SqlClient = { query: (sql, values) => connection.query(sql, values) };
  let created = false;
  try {
    await connection.query(`CREATE SCHEMA "${schema}"`);
    created = true;
    await connection.query(`SET search_path TO "${schema}", public`);
    await t.test("migration is repeatable on PostgreSQL server", async () => {
      await migrateJobsDatabase(db);
      await migrateJobsDatabase(db);
    });
    const now = new Date();
    const config = parseSourceConfigs([{ name: "ITviec", enabled: true, mode: "jsonld", pageUrls: ["https://itviec.com/it-jobs/fixture-only"], allowedHosts: ["itviec.com"], permissionReference: "isolated-test-fixture" }])[0];
    const html = `<script type="application/ld+json">${JSON.stringify({ "@type": "JobPosting", title: "Java Backend Intern", hiringOrganization: { name: "Fixture only" }, jobLocation: { address: { addressLocality: "Ho Chi Minh City" } }, description: "Java Spring Boot REST APIs", employmentType: "INTERNSHIP" })}</script>`;
    await t.test("HTML crawler to SQL to public repository without publishing fixtures", async () => {
      const result = await runJobCollection(db, [config], { collect: source => collectSource(source, {
        now, sleep: async () => {}, fetchImpl: async input => String(input).endsWith("robots.txt")
          ? new Response("User-agent: *\nAllow: /", { headers: { "content-type": "text/plain" } })
          : new Response(html, { headers: { "content-type": "text/html" } }),
      }) });
      assert.equal(result[0].status, "succeeded");
      assert.equal(result[0].count, 1);
      const jobs = await readDatabaseJobs(db);
      assert.equal(jobs.length, 1);
      assert.equal(jobs[0].title, "Java Backend Intern");
      assert.equal((await db.query("SELECT status FROM job_collection_runs")).rows[0].status, "succeeded");
    });
    await t.test("rerunning the same observation is idempotent", async () => {
      const jobs = await readDatabaseJobs(db);
      assert.equal(await saveCollectedJobs(db, "ITviec", jobs), 0);
      assert.equal((await db.query("SELECT * FROM job_source_records")).rows.length, 1);
    });
    await t.test("only one of two real database sessions acquires a source lease", async () => {
      const second = await pool.connect();
      try {
        await second.query(`SET search_path TO "${schema}", public`);
        const other: SqlClient = { query: (sql, values) => second.query(sql, values) };
        const results = await Promise.all([
          acquireCollectionLease(db, "TopCV", "worker-a", 60),
          acquireCollectionLease(other, "TopCV", "worker-b", 60),
        ]);
        assert.equal(results.filter(Boolean).length, 1);
      } finally { await second.query("RESET search_path"); second.release(); }
    });
  } finally {
    try {
      await connection.query("RESET search_path");
      if (created) {
        assert.match(schema, /^jobs_test_[a-f0-9]{32}$/);
        await connection.query(`DROP SCHEMA "${schema}" CASCADE`);
      }
    } finally { connection.release(); await closeJobsDatabases(); }
  }
});
