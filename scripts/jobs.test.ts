import assert from "node:assert/strict";
import test from "node:test";
import { filterJobs, isHoChiMinh, normalizeJob, normalizeJobs } from "../src/features/jobs/normalize.ts";
import { getJobs, importJobsSnapshot, readJobsSnapshot } from "../src/features/jobs/repository.ts";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const now = new Date("2026-11-03T10:00:00Z");
const fixture = {
  id: "test-java-1", title: "Junior Java Backend", company: "Fixture company",
  location: "TP. Hồ Chí Minh", description: "Java, Spring Boot and SQL.", workMode: "hybrid",
  categories: ["java-backend"], levels: ["junior"], skills: ["Java", "Spring Boot"],
  checkedAt: "2026-11-03T09:00:00Z", postedAt: "2026-11-01", status: "active",
  sources: [{ name: "ITviec", url: "https://itviec.com/it-jobs/fixture-job?utm_source=test#apply" }],
};

test("validates snapshot and strips tracking while preserving original job identity", () => {
  const job = normalizeJob(fixture, now);
  assert.equal(job.sources[0].url, "https://itviec.com/it-jobs/fixture-job");
  const withQuery = normalizeJob({ ...fixture, sources: [{ name: "LinkedIn", url: "https://www.linkedin.com/jobs/view/123?currentJobId=123&trk=test" }] }, now);
  assert.equal(withQuery.sources[0].url, "https://www.linkedin.com/jobs/view/123?currentJobId=123");
});
test("rejects unsafe URLs, deceptive hosts and mismatched source labels", () => {
  for (const url of ["javascript:alert(1)", "http://itviec.com/jobs/123", "https://itviec.com.attacker.test/job", "https://attacker.test/itviec.com", "https://user:pass@itviec.com/jobs/123", "https://itviec.com:8080/jobs/123", "https://linkedin.com/jobs/view/123", "https://itviec.com/"]) {
    assert.throws(() => normalizeJob({ ...fixture, sources: [{ name: "ITviec", url }] }, now));
  }
});
test("rejects malformed fields and the entire malformed batch", () => {
  for (const changes of [{ title: " " }, { skills: [1] }, { levels: ["senior"] }, { workMode: "maybe" }, { status: "unknown" }, { sources: [] }, { description: null }, { checkedAt: undefined }]) {
    assert.throws(() => normalizeJobs([fixture, { ...fixture, id: "other", ...changes }], now), /jobs\[1\]/);
  }
  assert.throws(() => normalizeJobs({ jobs: [fixture] }, now));
  assert.throws(() => normalizeJobs([fixture, fixture], now), /duplicate id/);
});
test("rejects invalid and inconsistent dates without silently rolling calendar days", () => {
  for (const changes of [{ checkedAt: "2026-02-30" }, { checkedAt: "2026-13-01" }, { checkedAt: "tomorrow" }, { checkedAt: "2026-11-04" }, { postedAt: "2026-11-04" }, { expiresAt: "2026-10-01" }]) {
    assert.throws(() => normalizeJob({ ...fixture, ...changes }, now));
  }
});
test("recognizes HCM spellings without including unrelated cities", () => {
  for (const location of ["TP. Hồ Chí Minh", "Ho Chi Minh City", "HCMC", "HCM", "Sài Gòn", "Quận 1, Hồ Chí Minh"]) assert.equal(isHoChiMinh(location), true, location);
  for (const location of ["Hà Nội", "Đà Nẵng", "Remote", "Bình Dương", "Birmingham"]) assert.equal(isHoChiMinh(location), false, location);
});
test("scoped filters require HCM, supported career group and stated early-career level", () => {
  const jobs = [
    normalizeJob(fixture, now),
    normalizeJob({ ...fixture, id: "hanoi", location: "Hà Nội" }, now),
    normalizeJob({ ...fixture, id: "unknown-level", levels: [] }, now),
    normalizeJob({ ...fixture, id: "unknown-category", categories: [] }, now),
  ];
  assert.deepEqual(filterJobs(jobs, {}, now).map(job => job.id), [fixture.id]);
  assert.equal(filterJobs(jobs, { query: "spring", category: "java-backend", level: "junior", source: "ITviec", workMode: "hybrid" }, now).length, 1);
  assert.equal(filterJobs(jobs, { level: "intern" }, now).length, 0);
  assert.equal(filterJobs(jobs, { source: "TopCV" }, now).length, 0);
  assert.equal(filterJobs(jobs, { query: "python" }, now).length, 0);
  assert.equal(filterJobs(jobs, { query: "SQL java ho chi minh" }, now).length, 1);
});
test("deduplicates cross-posts, preserving all source links and newest verified content", () => {
  const result = normalizeJobs([fixture, { ...fixture, id: "topdev-java", salary: "Negotiable", checkedAt: "2026-11-03T09:30:00Z", sources: [{ name: "TopDev", url: "https://topdev.vn/detail-jobs/fixture-java" }] }], now);
  assert.equal(result.length, 1);
  assert.equal(result[0].salary, "Negotiable");
  assert.deepEqual(result[0].sources.map(source => source.name).sort(), ["ITviec", "TopDev"]);
});
test("same-source job identity deduplicates title edits and tracking links", () => {
  const result = normalizeJobs([fixture, { ...fixture, id: "updated", title: "Java Backend Developer", sources: [{ name: "ITviec", url: "https://itviec.com/it-jobs/fixture-job?utm_medium=email" }] }], now);
  assert.equal(result.length, 1);
  assert.equal(result[0].sources.length, 1);
});
test("does not merge same title at different companies or different locations", () => {
  const result = normalizeJobs([fixture, { ...fixture, id: "different-company", company: "Another fixture", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/fixture-2" }] }, { ...fixture, id: "different-location", location: "Hà Nội", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/fixture-3" }] }], now);
  assert.equal(result.length, 3);
});
test("keeps separate same-board openings and old cross-source reposts", () => {
  assert.equal(normalizeJobs([fixture, { ...fixture, id: "different-posting", sources: [{ name: "ITviec", url: "https://itviec.com/it-jobs/other-opening" }] }], now).length, 2);
  assert.equal(normalizeJobs([fixture, { ...fixture, id: "old", postedAt: "2026-08-01", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/old" }] }], now).length, 2);
});
test("an expired cross-post does not hide a currently active source", () => {
  const jobs = normalizeJobs([fixture, { ...fixture, id: "expired", status: "expired", checkedAt: "2026-11-03T09:30:00Z", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/expired" }] }], now);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].status, "active");
  assert.equal(jobs[0].sources.length, 2);
});
test("newly closed posting wins over its own older active record", () => {
  const jobs = normalizeJobs([fixture, { ...fixture, id: "closed", status: "expired", checkedAt: "2026-11-03T09:30:00Z" }], now);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].status, "expired");
  assert.equal(filterJobs(jobs, {}, now).length, 0);
});
test("cross-source heuristic cannot bridge two distinct openings on the same board", () => {
  const second = { ...fixture, id: "second", sources: [{ name: "ITviec", url: "https://itviec.com/it-jobs/second" }] };
  const crossPost = { ...fixture, id: "cross", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/cross" }] };
  assert.equal(normalizeJobs([fixture, crossPost, second], now).length, 2);
  assert.equal(normalizeJobs([fixture, second, crossPost], now).length, 2);
});
test("snapshot roundtrip preserves independent source expiry and closed state", () => {
  const input = [
    { ...fixture, expiresAt: "2026-11-04" },
    { ...fixture, id: "longer", checkedAt: "2026-11-03T08:00:00Z", expiresAt: "2026-11-10", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/longer" }] },
    { ...fixture, id: "closed", status: "expired", checkedAt: "2026-11-03T09:30:00Z", sources: [{ name: "TopDev", url: "https://topdev.vn/detail-jobs/closed" }] },
  ];
  const first = normalizeJobs(input, now);
  assert.equal(first.length, 1);
  const persisted = JSON.parse(JSON.stringify(first));
  const later = new Date("2026-11-06T10:00:00Z");
  const second = normalizeJobs(persisted, later);
  assert.equal(filterJobs(second, {}, later).length, 1);
  assert.equal(second[0].expiresAt, "2026-11-10");
  assert.equal(second[0].sources.find(source => source.name === "ITviec")?.status, "expired");
  assert.equal(second[0].sources.find(source => source.name === "TopDev")?.status, "expired");
  assert.equal(second[0].sources.find(source => source.name === "TopCV")?.status, "active");
  const finalTime = new Date("2026-11-11T10:00:00Z");
  assert.equal(filterJobs(normalizeJobs(JSON.parse(JSON.stringify(second)), finalTime), {}, finalTime).length, 0);
});
test("an active source with unknown deadline is not assigned another source's deadline", () => {
  const first = normalizeJobs([{ ...fixture, expiresAt: "2026-11-04" }, { ...fixture, id: "unknown-deadline", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/no-deadline" }] }], now);
  assert.equal(first[0].expiresAt, undefined);
  const later = new Date("2026-11-06T10:00:00Z");
  const second = normalizeJobs(JSON.parse(JSON.stringify(first)), later);
  assert.equal(second[0].sources.find(source => source.name === "TopCV")?.expiresAt, undefined);
  assert.equal(filterJobs(second, {}, later).length, 1);
});
test("expiration includes the whole Vietnam date and is rechecked at read/filter time", () => {
  const deadline = normalizeJob({ ...fixture, expiresAt: "2026-11-03" }, now);
  assert.equal(deadline.status, "active");
  assert.equal(filterJobs([deadline], {}, new Date("2026-11-03T17:00:00Z")).length, 0);
  assert.equal(filterJobs([deadline], { includeExpired: true }, new Date("2026-11-03T17:00:00Z")).length, 1);
  assert.equal(normalizeJob({ ...fixture, expiresAt: "2026-11-02" }, now).status, "expired");
  assert.equal(filterJobs([normalizeJob({ ...fixture, status: "expired" }, now)], {}, now).length, 0);
});
test("repository reads committed snapshot without requiring a network or external secret", async () => {
  const jobs = await getJobs();
  assert.ok(Array.isArray(jobs));
  for (const job of jobs) assert.ok(isHoChiMinh(job.location));
});

async function withSnapshot(run: (directory: string) => Promise<void>) {
  const root = path.resolve(tmpdir());
  const directory = await mkdtemp(path.join(root, "gray-jobs-test-"));
  try { await run(directory); } finally {
    assert.equal(path.dirname(path.resolve(directory)), root);
    assert.ok(path.basename(directory).startsWith("gray-jobs-test-"));
    await rm(directory, { recursive: true, force: true });
  }
}
test("file repository validates before displaying and filters expired/out-of-scope data", async () => {
  await withSnapshot(async directory => {
    const filename = path.join(directory, "jobs.json");
    await writeFile(filename, JSON.stringify([fixture, { ...fixture, id: "outside", location: "Hà Nội", sources: [{ name: "TopCV", url: "https://topcv.vn/viec-lam/outside" }] }]));
    assert.equal((await readJobsSnapshot(filename, now)).length, 1);
    await writeFile(filename, "{}");
    await assert.rejects(readJobsSnapshot(filename, now), /expected array/);
    await writeFile(filename, "invalid json");
    await assert.rejects(readJobsSnapshot(filename, now), SyntaxError);
  });
});
test("atomic import validates entire batch before replacing the snapshot", async () => {
  await withSnapshot(async directory => {
    const input = path.join(directory, "input.json");
    const output = path.join(directory, "jobs.json");
    await writeFile(output, "[]\n");
    await writeFile(input, JSON.stringify([fixture, { ...fixture, id: "bad", sources: [] }]));
    await assert.rejects(importJobsSnapshot(input, output, now), /sources/);
    assert.equal(await readFile(output, "utf8"), "[]\n");
    await writeFile(input, JSON.stringify([fixture]));
    assert.equal(await importJobsSnapshot(input, output, now), 1);
    assert.equal((await readJobsSnapshot(output, now)).length, 1);
    assert.deepEqual((await readdir(directory)).sort(), ["input.json", "jobs.json"]);
    await assert.rejects(importJobsSnapshot(output, output, now), /separate input/);
  });
});
