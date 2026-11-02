import path from "node:path";
import { fileURLToPath } from "node:url";
import { importJobsSnapshot } from "../src/features/jobs/repository.ts";

/** Offline operator tool: import only data you are authorized to republish. */
async function main() {
  const [input, ...extra] = process.argv.slice(2);
  if (!input || extra.length) throw new Error("Usage: npm run jobs:import -- <authorized-local-file.json>");
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const destination = path.join(root, "data", "jobs.json");
  const source = path.resolve(input);
  const count = await importJobsSnapshot(source, destination);
  console.log(`Imported ${count} validated, deduplicated jobs (whole snapshot replaced). Source authorization remains the operator's responsibility.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : "Import failed");
  process.exitCode = 1;
});
