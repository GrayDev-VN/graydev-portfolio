export const JOB_CATEGORIES = ["java-backend", "ai-engineer", "backend-ai"] as const;
export const JOB_LEVELS = ["intern", "fresher", "junior"] as const;
export const JOB_SOURCE_NAMES = ["ITviec", "TopDev", "VietnamWorks", "TopCV", "LinkedIn", "SmartRecruiters", "Lever"] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];
export type JobLevel = typeof JOB_LEVELS[number];
export type JobSourceName = typeof JOB_SOURCE_NAMES[number];
/** Exact public posting hosts; API transport hosts belong to connector configuration. */
export const JOB_SOURCE_HOSTS: Record<JobSourceName, string[]> = {
  ITviec: ["itviec.com", "www.itviec.com"],
  TopDev: ["topdev.vn", "www.topdev.vn"],
  VietnamWorks: ["vietnamworks.com", "www.vietnamworks.com"],
  TopCV: ["topcv.vn", "www.topcv.vn"],
  LinkedIn: ["linkedin.com", "www.linkedin.com"],
  SmartRecruiters: ["jobs.smartrecruiters.com"],
  Lever: ["jobs.lever.co"],
};
export type JobWorkMode = "onsite" | "hybrid" | "remote" | "unknown";
export interface JobSource {
  name: JobSourceName;
  url: string;
  sourceId?: string;
  /** Persisted per-source lifecycle; legacy imports inherit the job-level fields. */
  status?: "active" | "expired";
  checkedAt?: string;
  expiresAt?: string;
}
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: JobWorkMode;
  categories: JobCategory[];
  levels: JobLevel[];
  skills: string[];
  description: string;
  salary?: string;
  postedAt?: string;
  expiresAt?: string;
  checkedAt: string;
  status: "active" | "expired";
  sources: JobSource[];
}
export interface JobFilters {
  query?: string;
  category?: JobCategory;
  level?: JobLevel;
  source?: JobSourceName;
  workMode?: JobWorkMode;
  includeExpired?: boolean;
}
