import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { jobsDatabase, closeJobsDatabases } from "../src/features/jobs/connection.ts";
import { parseSourceConfigs } from "../src/features/jobs/collection/config.ts";
import { runJobCollection } from "../src/features/jobs/collection/pipeline.ts";

async function main() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== "--config")) throw new Error("Usage: jobs:collect [--config local-file.json]");
  const configFile = args.length ? path.resolve(args[1]) : fileURLToPath(new URL("../config/jobs-sources.json", import.meta.url));
  const configs = parseSourceConfigs(JSON.parse(await readFile(configFile, "utf8")));
  if (!configs.some(config => config.enabled)) {
    console.error("No authorized sources enabled. Configure config/jobs-sources.json before collecting.");
    process.exitCode = 1;
    return;
  }
  const results = await runJobCollection(jobsDatabase("write"), configs);
  for (const result of results) console.log(`${result.source}: ${result.status}; changed=${result.count}${result.runId ? `; run=${result.runId}` : ""}`);
  if (results.some(result => result.status === "failed") || !results.some(result => result.status === "succeeded")) process.exitCode = 1;
}

main().catch(() => {
  console.error("Job collection failed. Check database access, migrations and source configuration; secrets are omitted.");
  process.exitCode = 1;
}).finally(closeJobsDatabases);
