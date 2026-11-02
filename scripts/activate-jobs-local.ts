import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";

async function main() {
  const source = parseEnv(await readFile(fileURLToPath(new URL("../.env.jobs.local", import.meta.url)), "utf8"));
  if (!source.JOBS_DATABASE_URL || source.JOBS_STORAGE !== "postgres") throw new Error("Local jobs database configuration is missing.");
  const target = fileURLToPath(new URL("../.env.local", import.meta.url));
  let content = "";
  try { content = await readFile(target, "utf8"); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  const existing = parseEnv(content);
  if ((existing.JOBS_DATABASE_URL && existing.JOBS_DATABASE_URL !== source.JOBS_DATABASE_URL)
    || (existing.JOBS_READ_DATABASE_URL && existing.JOBS_READ_DATABASE_URL !== source.JOBS_DATABASE_URL)) {
    throw new Error("Existing jobs database settings differ; kept unchanged. Use jobs:dev on another port.");
  }
  const preserved = content.split(/\r?\n/).filter(line => !/^\s*(?:export\s+)?JOBS_(?:STORAGE|DATABASE_URL|READ_DATABASE_URL)\s*=/.test(line)).join("\n").trimEnd();
  await writeFile(target, `${preserved}\n\n# Local PostgreSQL jobs; credentials stay private.\nJOBS_STORAGE=postgres\nJOBS_DATABASE_URL=${source.JOBS_DATABASE_URL}\n`, { mode: 0o600 });
  console.log("Enabled the local jobs database for the existing portfolio dev server. Other settings were preserved.");
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Could not activate local jobs storage."); process.exitCode = 1; });
