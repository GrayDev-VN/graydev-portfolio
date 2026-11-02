import assert from "node:assert/strict";
import { after, test } from "node:test";
import { load } from "cheerio";
import { jobsStorage, closeJobsDatabases } from "../src/features/jobs/connection.ts";
import { getJobs } from "../src/features/jobs/repository.ts";

after(closeJobsDatabases);

test("real collected jobs in PostgreSQL appear as rendered cards on the user's running UI", async () => {
  assert.equal(jobsStorage(), "postgres", "This test must use the real jobs database.");
  const jobs = await getJobs();
  assert.ok(jobs.length > 0, "No real eligible jobs have been collected.");
  const origin = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000");
  assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname));
  const response = await fetch(new URL("/jobs/", origin), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200);
  const $ = load(await response.text());
  const titles = $("main article h3").map((_, node) => $(node).text()).get();
  assert.equal(titles.length, jobs.length, "UI is reading a different snapshot/database or not rendering the jobs.");
  for (const job of jobs) {
    assert.ok(titles.includes(job.title), `Missing rendered job: ${job.title}`);
    assert.ok(!/fixture|test.only|example company/i.test(`${job.title} ${job.company}`));
    for (const source of job.sources) assert.ok($(`main article a[href="${source.url}"]`).length > 0);
  }
  assert.ok($("main").text().includes("Last successful update:"));
  console.log(`Verified ${jobs.length} real jobs in PostgreSQL and rendered UI cards.`);
  for (const job of jobs) console.log(`${job.title} | ${job.company} | ${job.sources[0].url}`);
});
