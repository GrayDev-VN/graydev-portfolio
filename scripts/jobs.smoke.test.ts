import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100";
const origin = new URL(base);
if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)) {
  throw new Error("Smoke tests must target a local test server.");
}

test("jobs page serves accessible filters, truthful source status and planned CV notice", async () => {
  const response = await fetch(new URL("/jobs/", origin), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const id of ["job-search", "job-category", "job-level", "job-work-mode", "job-source"]) {
    assert.ok(html.includes(`id="${id}"`), `Missing filter ${id}`);
    assert.ok(html.includes(`for="${id}"`), `Missing label ${id}`);
  }
  if (process.env.TEST_JOBS_STORAGE === "postgres") {
    assert.ok(html.includes("No job collection has completed yet") || html.includes("Last successful update:"));
    assert.ok(!html.includes("Automated collection from the planned sources is not active"));
  } else {
    assert.ok(html.includes("Automated collection from the planned sources is not active"));
  }
  assert.ok(html.includes("CV upload and analysis are not available yet"));
  assert.ok(!html.includes('type="file"'));
  assert.ok(html.includes('href="/jobs"') || html.includes('href="/jobs/"'));
  assert.ok(html.includes('id="main-content"'));
});

for (const route of ["/", "/en/blog/", "/vi/blog/", "/projects/", "/career/", "/credentials/"]) {
  test(`existing route ${route} remains available`, async () => {
    const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes('id="main-content"'));
  });
}
