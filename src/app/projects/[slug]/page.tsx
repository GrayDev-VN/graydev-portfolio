import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import PortfolioShell from "@/components/PortfolioShell";
import ProjectOverview from "@/components/ProjectOverview";
import { canonical } from "@/lib/site";

export function generateStaticParams() {
  return PORTFOLIO_DATA.projects.filter(project => project.id !== "flowassist-chatbot").map(project => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PORTFOLIO_DATA.projects.find(project => project.id === slug);
  if (!project) return {};
  return { title: `${project.title} | Gray Nguyen`, description: project.summary, alternates: { canonical: canonical(`/projects/${slug}/`) } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PORTFOLIO_DATA.projects.find(project => project.id === slug);
  if (!project) notFound();
  return <PortfolioShell><ProjectOverview project={project} /></PortfolioShell>;
}
