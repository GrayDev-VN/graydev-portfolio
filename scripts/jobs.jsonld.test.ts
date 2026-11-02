import assert from "node:assert/strict";
import test from "node:test";
import { discoverJobPageUrls, parseJobPostingHtml } from "../src/features/jobs/collection/jsonld.ts";
import { filterJobs } from "../src/features/jobs/normalize.ts";

const now = new Date("2026-11-03T12:00:00Z");
const page = "https://itviec.com/it-jobs/fixture-123";
const fixture = {
  "@context": "https://schema.org", "@type": "JobPosting", title: "Junior Java Backend Developer",
  hiringOrganization: { "@type": "Organization", name: "Fixture &amp; Company" },
  jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Hồ Chí Minh", addressCountry: "VN" } },
  description: "<p>Build Java and Spring Boot APIs.</p><p>SQL &amp; Docker.</p>",
  identifier: { "@type": "PropertyValue", value: "123" }, datePosted: "2026-11-01", validThrough: "2026-12-01",
};
function html(value: unknown): string {
  return `<html><head><script type="application/ld+json">${JSON.stringify(value).replace(/</g, "\\u003c")}</script></head></html>`;
}
function parse(value: unknown) { return parseJobPostingHtml(html(value), "ITviec", page, now); }

test("Java mobile and frontend roles are not mislabeled as Java Backend", () => {
  for (const title of ["Junior Java Android Developer", "Java Mobile Developer", "Java Frontend Developer", "Internship - SAP Developer (JS, Java, ABAP, Fiori, BTP)"]) {
    assert.deepEqual(parse({ ...fixture, title })[0].categories, []);
  }
});

test("extracts inert JSON-LD, text entities, source identity and explicit skills", () => {
  const [job] = parse(fixture);
  assert.equal(job.company, "Fixture & Company");
  assert.match(job.description, /SQL & Docker/);
  assert.ok(!job.description.includes("<p>"));
  assert.deepEqual(job.categories, ["java-backend"]);
  assert.deepEqual(job.levels, ["junior"]);
  assert.ok(job.skills.includes("Java"));
  assert.ok(job.skills.includes("Spring Boot"));
  assert.equal(job.workMode, "unknown");
  assert.equal(job.sources[0].url, page);
  assert.equal(job.sources[0].sourceId, "123");
  assert.equal(job.postedAt, "2026-11-01");
  assert.equal(filterJobs([job], {}, now).length, 1);
});

test("does not execute scripts, leak embedded HTML or trust structured-data URL", () => {
  const [job] = parse({ ...fixture, url: "https://attacker.test/steal", description: '<p>Java API</p><script>globalThis.jsonLdExecuted = true</script><style>secret-style</style><iframe src="https://attacker.test"></iframe>' });
  assert.equal((globalThis as typeof globalThis & { jsonLdExecuted?: boolean }).jsonLdExecuted, undefined);
  assert.equal(job.description, "Java API");
  assert.equal(job.sources[0].url, page);
  assert.throws(() => parseJobPostingHtml(html(fixture), "ITviec", "https://attacker.test/jobs/1", now));
});

test("supports graph, arrays, schema-qualified types and offset dates", () => {
  const [job] = parse([{ "@graph": [{ "@type": "Organization", name: "Ignore" }, { ...fixture, "@type": ["Thing", "https://schema.org/JobPosting"], datePosted: "2026-11-02T08:30:00+07:00", validThrough: "2026-11-04T12:00:00-05:00" }] }]);
  assert.equal(job.postedAt, "2026-11-02T01:30:00.000Z");
  assert.equal(job.expiresAt, "2026-11-04T17:00:00.000Z");
  assert.equal(parse({ "@type": "WebPage", mainEntity: fixture }).length, 1);
});

test("deduplicates identical schema blocks but rejects ambiguous multi-job detail pages", () => {
  assert.equal(parse([fixture, fixture]).length, 1);
  assert.throws(() => parse([fixture, { ...fixture, title: "Another Java Developer", identifier: "124" }]), /one distinct/);
  assert.deepEqual(parse({ "@type": "Organization", name: "Not a posting" }), []);
});

test("fails the page on malformed JSON-LD or missing required JobPosting fields", () => {
  assert.throws(() => parseJobPostingHtml('<script type="application/ld+json">{bad json}</script>', "ITviec", page, now), /invalid JSON-LD/);
  for (const field of ["title", "hiringOrganization", "jobLocation", "description"] as const) {
    assert.throws(() => parse({ ...fixture, [field]: undefined }), /missing/);
  }
  for (const datePosted of ["2026-02-30", "2026-11-02T08:00:00", "2026-11-02T24:00:00Z", "not-a-date", "2027-01-01"]) assert.throws(() => parse({ ...fixture, datePosted }));
});

test("does not turn JavaScript or company AI mentions into Java/AI engineer roles", () => {
  const [javascript] = parse({ ...fixture, title: "Junior JavaScript Developer", description: "JavaScript and TypeScript frontend interfaces for AI Company." });
  assert.deepEqual(javascript.categories, []);
  assert.ok(!javascript.skills.includes("Java"));
  const [backgroundAi] = parse({ ...fixture, title: "Junior Backend Developer", description: "Build REST APIs. Our company uses AI to screen applications." });
  assert.deepEqual(backgroundAi.categories, []);
});

test("classifies backend AI requirements and explicit AI Engineer roles", () => {
  const [backend] = parse({ ...fixture, title: "Junior Backend Engineer", description: "Build LLM APIs and a RAG service in Python." });
  assert.deepEqual(backend.categories, ["backend-ai"]);
  assert.ok(backend.skills.includes("LLM"));
  assert.ok(backend.skills.includes("RAG"));
  const [ai] = parse({ ...fixture, title: "Fresher AI Engineer", description: "Python and PyTorch for machine learning.", jobLocationType: "TELECOMMUTE" });
  assert.deepEqual(ai.categories, ["ai-engineer"]);
  assert.deepEqual(ai.levels, ["fresher"]);
  assert.equal(ai.workMode, "remote");
});

test("conservative levels reject senior/lead titles and minimum three years despite junior mentions", () => {
  for (const title of ["Senior Java Backend Developer", "Tech Lead Java", "Staff Backend Engineer"]) {
    assert.deepEqual(parse({ ...fixture, title, description: "Mentor junior and new graduates." })[0].levels, []);
  }
  for (const description of ["At least 3 years of experience. Mentor junior developers.", "Minimum 5+ years experience; no prior experience required with Redis.", "3+ years of Java development experience.", "Kinh nghiệm từ 3 năm. Hướng dẫn junior.", "Tối thiểu 3 năm kinh nghiệm."]) {
    assert.deepEqual(parse({ ...fixture, description })[0].levels, [], description);
  }
  assert.deepEqual(parse({ ...fixture, experienceRequirements: { "@type": "OccupationalExperienceRequirements", monthsOfExperience: 36 } })[0].levels, []);
});

test("recognizes explicit graduate/intern/zero-to-two requirements without guessing unknowns", () => {
  assert.deepEqual(parse({ ...fixture, title: "Java Backend Engineer", description: "No experience required. New graduates welcome." })[0].levels, ["fresher"]);
  assert.deepEqual(parse({ ...fixture, title: "Java Backend Engineer", description: "0-2 years of experience in Java." })[0].levels, ["junior"]);
  assert.deepEqual(parse({ ...fixture, title: "Java Backend Engineer", employmentType: "INTERNSHIP", description: "Java and SQL." })[0].levels, ["intern"]);
  assert.deepEqual(parse({ ...fixture, title: "Java Backend Engineer", description: "Experience in Java and SQL." })[0].levels, []);
  const [hanoi] = parse({ ...fixture, jobLocation: { address: { addressLocality: "Hà Nội", addressCountry: "VN" } } });
  assert.equal(filterJobs([hanoi], {}, now).length, 0);
  assert.throws(() => parse({ ...fixture, jobLocation: {} }), /missing its location/);
});

test("retains explicit hybrid and expiration without inventing salary or onsite", () => {
  const [job] = parse({ ...fixture, description: "Hybrid Java role.", validThrough: "2026-11-02", baseSalary: { value: 1000 } });
  assert.equal(job.workMode, "hybrid");
  assert.equal(job.status, "expired");
  assert.equal(job.salary, undefined);
});

test("bounds markup size, structured-data nesting and posting count", () => {
  assert.throws(() => parseJobPostingHtml("x".repeat(10 * 1024 * 1024 + 1), "ITviec", page, now), /size limit/);
  let nested: unknown = fixture;
  for (let i = 0; i < 34; i++) nested = { "@graph": nested };
  assert.throws(() => parse(nested), /too complex/);
  assert.throws(() => parse(Array.from({ length: 101 }, () => fixture)), /too many postings/);
});

test("discovers bounded same-origin official detail links and ignores untrusted links", () => {
  const listing = "https://itviec.com/it-jobs/java/ho-chi-minh-hcm";
  const markup = '<a href="/it-jobs/valid?utm_source=test#apply">valid</a><a href="/it-jobs/valid">duplicate</a><a href="https://itviec.com.attacker.test/it-jobs/123">evil</a><a href="https://topcv.vn/it-jobs/123">other source</a><a href="javascript:alert(1)">script</a><a href="https://user:pass@itviec.com/it-jobs/123">credentials</a><a href="/blog/article">blog</a>';
  assert.deepEqual(discoverJobPageUrls(markup, listing, "ITviec", ["itviec.com"], ["/it-jobs/"]), ["https://itviec.com/it-jobs/valid"]);
  const many = Array.from({ length: 30 }, (_, id) => `<a href="/it-jobs/job-${id}">job</a>`).join("");
  assert.equal(discoverJobPageUrls(many, listing, "ITviec", ["itviec.com"], ["/it-jobs/"]).length, 20);
  assert.throws(() => discoverJobPageUrls(markup, "https://attacker.test/jobs", "ITviec", ["attacker.test"], ["/jobs/"]), /official/);
  assert.throws(() => discoverJobPageUrls(markup, listing, "ITviec", ["itviec.com"], ["//"]), /prefix/);
});
