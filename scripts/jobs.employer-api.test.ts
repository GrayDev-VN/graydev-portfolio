import assert from "node:assert/strict";
import test from "node:test";
import { collectEmployerApi } from "../src/features/jobs/collection/employer-api.ts";
import type { SourceConfig } from "../src/features/jobs/collection/config.ts";
import { filterJobs } from "../src/features/jobs/normalize.ts";

const now = new Date("2026-11-03T08:00:00.000Z");
const srConfig: SourceConfig = { name: "SmartRecruiters", enabled: true, mode: "smartrecruiters", companySlugs: ["fixture-company"], allowedHosts: ["api.smartrecruiters.com"], permissionReference: "https://developers.smartrecruiters.com/docs/posting-api" };
const leverConfig: SourceConfig = { name: "Lever", enabled: true, mode: "lever", companySlugs: ["fixture-company"], allowedHosts: ["api.lever.co"], permissionReference: "https://github.com/lever/postings-api" };
const summary = { id: "123", name: "Junior Java Backend Developer", company: { name: "Fixture Company", identifier: "fixture-company" }, releasedDate: "2026-11-01T10:00:00.000Z", location: { city: "Ho Chi Minh City", country: "vn" }, experienceLevel: { label: "Associate" }, ref: "http://localhost/private" };
const detail = { ...summary, active: true, postingUrl: "https://jobs.smartrecruiters.com/fixture-company/123-junior-java-backend", jobAd: { sections: { jobDescription: { text: "<p>Build backend APIs with Java and Spring Boot.</p>" }, qualifications: { text: "<p>1-3 years of experience.</p>" }, additionalInformation: { text: "Test fixture only." } } } };
const leverJob = { id: "fixture-uuid", text: "AI Engineer Intern", categories: { location: "Ho Chi Minh City", commitment: "Internship" }, country: "VN", description: "<p>Build RAG pipelines with Python and LLMs.</p>", lists: [{ text: "Requirements", content: "<li>No experience required.</li>" }], hostedUrl: "https://jobs.lever.co/fixture-company/fixture-uuid", workplaceType: "hybrid", createdAt: Date.parse("2026-11-01T10:00:00Z") };

test("SmartRecruiters uses public Vietnam listing and fixed detail endpoint, preserves provenance", async () => {
  const calls: string[] = [];
  const jobs = await collectEmployerApi(srConfig, async (url, accept) => {
    calls.push(url); assert.equal(accept, "application/json");
    if (new URL(url).pathname.endsWith("/postings")) {
      assert.equal(new URL(url).searchParams.get("country"), "vn");
      assert.equal(new URL(url).searchParams.get("destination"), "PUBLIC");
      assert.equal(new URL(url).searchParams.get("limit"), "100");
      return JSON.stringify({ totalFound: 1, content: [summary] });
    }
    return JSON.stringify(detail);
  }, now);
  assert.equal(calls.length, 2);
  assert.equal(calls[1], "https://api.smartrecruiters.com/v1/companies/fixture-company/postings/123");
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].company, "Fixture Company");
  assert.equal(jobs[0].sources[0].url, detail.postingUrl);
  assert.equal(jobs[0].sources[0].name, "SmartRecruiters");
  assert.equal(jobs[0].sources[0].sourceId, "fixture-company:123");
  assert.equal(jobs[0].checkedAt, now.toISOString());
  assert.equal(jobs[0].postedAt, summary.releasedDate);
  assert.deepEqual(jobs[0].levels, ["junior"]);
  assert.ok(jobs[0].skills.includes("Java"));
});

test("list candidates exclude senior, nontechnical and other-city jobs before detail calls", async () => {
  let details = 0;
  const candidates = [summary, { ...summary, id: "2", name: "Senior Java Backend Developer" }, { ...summary, id: "3", location: { city: "Ha Noi", country: "vn" } }, { ...summary, id: "4", name: "Marketing Intern" }, { ...summary, id: "5", experienceLevel: { label: "Mid-Senior Level" } }];
  const jobs = await collectEmployerApi(srConfig, async url => {
    if (new URL(url).pathname.endsWith("/postings")) return JSON.stringify({ totalFound: candidates.length, content: candidates });
    details++; return JSON.stringify(detail);
  }, now);
  assert.equal(details, 1);
  assert.equal(jobs.length, 1);
});

test("SmartRecruiters pagination is bounded to3 pages and details20 with target priority", async () => {
  const offsets: string[] = [];
  const details: string[] = [];
  const jobs = await collectEmployerApi(srConfig, async url => {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith("/postings")) {
      const offset = Number(parsed.searchParams.get("offset")); offsets.push(String(offset));
      return JSON.stringify({ totalFound: 999, content: Array.from({ length: 100 }, (_, index) => ({ ...summary, id: String(offset + index + 1), name: index === 99 ? "AI Engineer Intern" : "Software Engineer Intern" })) });
    }
    const postingId = parsed.pathname.split("/").pop()!; details.push(postingId);
    return JSON.stringify({ ...detail, id: postingId, postingUrl: `https://jobs.smartrecruiters.com/fixture-company/${postingId}-job` });
  }, now);
  assert.deepEqual(offsets, ["0", "100", "200"]);
  assert.equal(details.length, 20);
  assert.deepEqual(details.slice(0, 3), ["100", "200", "300"]);
  assert.equal(jobs.length, 20);
});

test("malformed list/detail or inconsistent posting company fail without arbitrary URL fetch", async () => {
  for (const payload of ["{", JSON.stringify({ content: [], totalFound: "1" }), JSON.stringify({ content: null, totalFound: 1 })]) {
    await assert.rejects(collectEmployerApi(srConfig, async () => payload, now));
  }
  for (const value of [
    { ...detail, id: "999" }, { ...detail, company: { name: "Other", identifier: "other" } },
    { ...detail, postingUrl: "http://localhost/123" }, { ...detail, postingUrl: "https://jobs.smartrecruiters.com/other/123-job" },
    { ...detail, postingUrl: "https://jobs.smartrecruiters.com/fixture-company/999-other" },
    { ...detail, jobAd: {} }, { ...detail, releasedDate: "2099-01-01" },
  ]) await assert.rejects(collectEmployerApi(srConfig, async url => JSON.stringify(new URL(url).pathname.endsWith("/postings") ? { totalFound: 1, content: [summary] } : value), now));
});

test("unpublished SmartRecruiters posting becomes expired rather than revived", async () => {
  const jobs = await collectEmployerApi(srConfig, async url => JSON.stringify(new URL(url).pathname.endsWith("/postings") ? { totalFound: 1, content: [summary] } : { ...detail, active: false }), now);
  assert.equal(jobs[0].status, "expired");
  assert.equal(jobs[0].sources[0].status, "expired");
});

test("unknown career level and unrelated stack are not silently called junior Java jobs", async () => {
  const unknown = { ...detail, name: "Software Engineer", jobAd: { sections: { jobDescription: { text: "Work on C++ embedded devices." } } } };
  const jobs = await collectEmployerApi(srConfig, async url => JSON.stringify(new URL(url).pathname.endsWith("/postings") ? { totalFound: 1, content: [{ ...summary, name: "Software Engineer" }] } : unknown), now);
  assert.equal(jobs.length, 1);
  assert.deepEqual(jobs[0].categories, []);
  assert.deepEqual(jobs[0].levels, []);
  assert.deepEqual(filterJobs(jobs, {}, now), []);
});

test("literal closing script in API HTML stays inert and content is normalized", async () => {
  const injected = { ...detail, jobAd: { sections: { jobDescription: { text: '<p>Java Spring Boot.</p></script><script>alert("no execution")</script><p>Backend.</p>' } } } };
  const jobs = await collectEmployerApi(srConfig, async url => JSON.stringify(new URL(url).pathname.endsWith("/postings") ? { totalFound: 1, content: [summary] } : injected), now);
  assert.equal(jobs.length, 1);
  assert.ok(!jobs[0].description.includes("alert"));
});

test("Lever public list preserves hosted URL, company namespace, actual work mode and date", async () => {
  let calls = 0;
  const jobs = await collectEmployerApi(leverConfig, async url => {
    calls++;
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://api.lever.co");
    assert.equal(parsed.searchParams.get("mode"), "json");
    return JSON.stringify([leverJob]);
  }, now);
  assert.equal(calls, 1);
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].company, "fixture-company");
  assert.equal(jobs[0].sources[0].url, leverJob.hostedUrl);
  assert.equal(jobs[0].workMode, "hybrid");
  assert.equal(jobs[0].postedAt, "2026-11-01T10:00:00.000Z");
  assert.ok(jobs[0].categories.includes("ai-engineer"));
});

test("Lever filters irrelevant jobs and deduplicates list IDs", async () => {
  const jobs = await collectEmployerApi(leverConfig, async () => JSON.stringify([leverJob, leverJob, { ...leverJob, id: "other", text: "Senior AI Engineer", hostedUrl: "https://jobs.lever.co/fixture-company/other" }, { ...leverJob, id: "elsewhere", categories: { location: "Ha Noi" } }]), now);
  assert.equal(jobs.length, 1);
});

test("Lever validates date and public hosted URL without following arbitrary links", async () => {
  for (const value of [
    { ...leverJob, hostedUrl: "https://evil.com/posting" }, { ...leverJob, hostedUrl: "https://jobs.lever.co/other/fixture-uuid" },
    { ...leverJob, createdAt: "2026" }, { ...leverJob, createdAt: Date.parse("2099-01-01") },
    { ...leverJob, description: "", descriptionPlain: "" },
  ]) await assert.rejects(collectEmployerApi(leverConfig, async () => JSON.stringify([value]), now));
});

test("configuration prevents source/mode/slug injection and disabled sources do no work", async () => {
  let calls = 0;
  const fetchResource = async () => { calls++; return "[]"; };
  assert.deepEqual(await collectEmployerApi({ ...srConfig, enabled: false }, fetchResource, now), []);
  assert.equal(calls, 0);
  for (const patch of [
    { companySlugs: ["../private"] }, { companySlugs: ["company?token=x"] }, { companySlugs: [] },
    { companySlugs: Array.from({ length: 6 }, (_, i) => `company-${i}`) }, { permissionReference: "" },
    { allowedHosts: ["evil.com"] }, { name: "Lever" as const },
  ]) await assert.rejects(collectEmployerApi({ ...srConfig, ...patch }, fetchResource, now));
  assert.equal(calls, 0);
});
