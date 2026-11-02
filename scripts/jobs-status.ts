import { jobsDatabase, closeJobsDatabases } from "../src/features/jobs/connection.ts";

async function main() {
  const db = jobsDatabase("read");
  const records = await db.query("SELECT count(*)::int AS count FROM job_source_records");
  const runs = await db.query("SELECT source_name, status, started_at, finished_at, record_count, error_code FROM job_collection_runs ORDER BY started_at DESC LIMIT 10");
  console.log(`Stored source records: ${records.rows[0].count}`);
  if (!runs.rows.length) console.log("No collection runs recorded.");
  else console.log(JSON.stringify(runs.rows, null, 2));
}
main().catch(() => {
  console.error("Could not read jobs database status. Check connection and migration; credentials are omitted.");
  process.exitCode = 1;
}).finally(closeJobsDatabases);
