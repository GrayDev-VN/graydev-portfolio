import { jobsDatabase, closeJobsDatabases } from "../src/features/jobs/connection.ts";
import { migrateJobsDatabase } from "../src/features/jobs/database.ts";

async function main() {
  await migrateJobsDatabase(jobsDatabase("write"));
}

main()
  .then(() => console.log("Jobs database schema is ready."))
  .catch(() => {
    console.error("Jobs database migration failed. Check JOBS_DATABASE_URL and database privileges; secrets are omitted.");
    process.exitCode = 1;
  }).finally(closeJobsDatabases);
