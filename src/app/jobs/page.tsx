import type { Metadata } from "next";
import PortfolioShell from "@/components/PortfolioShell";
import JobsBoard from "@/features/jobs/components/JobsBoard";
import { getJobs, getJobCollectionInfo } from "@/features/jobs/repository";

export const metadata: Metadata = {
  title: "Backend & AI Jobs | GrayDev",
  description: "Cơ hội Java Backend và AI Engineer cho Intern, Fresher, Junior tại TP.HCM. Xem yêu cầu và ứng tuyển qua nguồn tin gốc.",
  alternates: { canonical: "/jobs/" },
};

// Read the latest imported snapshot and re-evaluate expiration on each request.
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const [jobs, collection] = await Promise.all([getJobs(), getJobCollectionInfo()]);
  return <PortfolioShell><JobsBoard jobs={jobs} collection={collection} /></PortfolioShell>;
}
