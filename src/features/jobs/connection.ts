import pg from "pg";

export type JobsStorage = "snapshot" | "postgres";
type JobsEnvironment = Record<string, string | undefined>;

export function jobsStorage(env: JobsEnvironment = process.env): JobsStorage {
  const mode = env.JOBS_STORAGE;
  if (mode === "snapshot" || mode === "postgres") return mode;
  if (mode) {
    throw new Error("JOBS_STORAGE must be snapshot or postgres.");
  }
  return env.JOBS_READ_DATABASE_URL || env.JOBS_DATABASE_URL ? "postgres" : "snapshot";
}

/** Keep credentials server-side and verify certificates on remote connections. */
export function jobsPoolConfig(connectionString: string): pg.PoolConfig {
  let url: URL;
  try { url = new URL(connectionString); } catch { throw new Error("Invalid jobs database configuration."); }
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname || url.pathname.length < 2 || url.hash) {
    throw new Error("Invalid jobs database configuration.");
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const sslmode = url.searchParams.get("sslmode");
  if (!local && sslmode && !["require", "verify-ca", "verify-full"].includes(sslmode)) {
    throw new Error("Remote jobs databases require verified TLS.");
  }
  // Avoid connection-string SSL options overriding certificate verification.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert", "ssl", "uselibpqcompat"]) url.searchParams.delete(key);
  return {
    connectionString: url.toString(), ssl: local ? false : { rejectUnauthorized: true },
    max: 4, connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000,
    statement_timeout: 30000, query_timeout: 35000, allowExitOnIdle: true,
    application_name: "graydev-jobs",
  };
}

const jobsGlobal = globalThis as typeof globalThis & { graydevJobsPools?: Map<string, pg.Pool> };

export function jobsDatabase(role: "read" | "write" = "read"): pg.Pool {
  const raw = role === "read" ? process.env.JOBS_READ_DATABASE_URL || process.env.JOBS_DATABASE_URL : process.env.JOBS_DATABASE_URL;
  if (!raw) throw new Error("Jobs database is not configured.");
  const config = jobsPoolConfig(raw);
  const pools = jobsGlobal.graydevJobsPools ??= new Map();
  let pool = pools.get(raw);
  if (!pool) {
    pool = new pg.Pool(config);
    pool.on("error", () => { console.error("Jobs database connection interrupted."); });
    pools.set(raw, pool);
  }
  return pool;
}

export async function closeJobsDatabases(): Promise<void> {
  const pools = jobsGlobal.graydevJobsPools;
  if (!pools) return;
  jobsGlobal.graydevJobsPools = new Map();
  await Promise.all([...pools.values()].map(pool => pool.end()));
}
