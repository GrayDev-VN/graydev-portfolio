import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

async function main() {
  const password = randomBytes(24).toString("hex");
  const url = `postgresql://graydev:${password}@127.0.0.1:55432/graydev_jobs`;
  const filename = fileURLToPath(new URL("../.env.jobs.local", import.meta.url));
  try {
    await writeFile(filename, `# Local jobs development only. Never commit this file.\nJOBS_STORAGE=postgres\nJOBS_POSTGRES_PASSWORD=${password}\nJOBS_DATABASE_URL=${url}\n`, { flag: "wx", mode: 0o600 });
    console.log("Created private .env.jobs.local with generated local database credentials.");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      console.log("Kept existing .env.jobs.local unchanged.");
      return;
    }
    throw new Error("Could not create local jobs configuration.");
  }
}
main().catch(() => { console.error("Local jobs setup failed; credentials are omitted."); process.exitCode = 1; });
