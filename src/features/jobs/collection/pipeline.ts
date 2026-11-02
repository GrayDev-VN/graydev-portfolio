import { randomUUID } from "node:crypto";
import { acquireCollectionLease, finishCollectionRun, releaseCollectionLease, saveCollectedJobs, startCollectionRun } from "../database.ts";
import type { SqlClient } from "../database.ts";
import type { Job, JobSourceName } from "../types.ts";
import type { SourceConfig } from "./config.ts";
import { collectSource } from "./collector.ts";

export interface CollectionResult {
  source: JobSourceName;
  status: "succeeded" | "failed" | "skipped" | "disabled";
  count: number;
  runId?: string;
  errorCode?: string;
}
export interface PipelineOptions {
  collect?: (config: SourceConfig) => Promise<Job[]>;
  clock?: () => Date;
  runId?: () => string;
}

/** Sources fail independently; a failed fetch never deletes or closes old data. */
export async function runJobCollection(db: SqlClient, configs: SourceConfig[], options: PipelineOptions = {}): Promise<CollectionResult[]> {
  const collect = options.collect ?? collectSource;
  const clock = options.clock ?? (() => new Date());
  const createRunId = options.runId ?? randomUUID;
  const results: CollectionResult[] = [];
  for (const config of configs) {
    if (!config.enabled) {
      results.push({ source: config.name, status: "disabled", count: 0 });
      continue;
    }
    const runId = createRunId();
    const acquired = await acquireCollectionLease(db, config.name, runId, 600, clock());
    if (!acquired) {
      results.push({ source: config.name, status: "skipped", count: 0 });
      continue;
    }
    try {
      await startCollectionRun(db, { id: runId, source: config.name, now: clock() });
      try {
        const jobs = await collect(config);
        const count = await saveCollectedJobs(db, config.name, jobs, clock(), runId);
        await finishCollectionRun(db, { id: runId, status: "succeeded", count, now: clock() });
        results.push({ source: config.name, status: "succeeded", count, runId });
      } catch {
        // Never persist arbitrary provider/DB errors, endpoint tokens or response bodies.
        await finishCollectionRun(db, { id: runId, status: "failed", errorCode: "COLLECTION_FAILED", now: clock() });
        results.push({ source: config.name, status: "failed", count: 0, runId, errorCode: "COLLECTION_FAILED" });
      }
    } finally {
      await releaseCollectionLease(db, config.name, runId);
    }
  }
  return results;
}
