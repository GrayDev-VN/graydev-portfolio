import type { Metadata } from "next";
import PortfolioShell from "@/components/PortfolioShell";
import FlowAssistCaseStudy from "@/components/FlowAssistCaseStudy";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: canonical("/projects/flowassist-chatbot/") },
  title: "FlowAssist Chatbot — RAG Case Study | Gray Nguyen",
  description: "Document ingestion, vector retrieval, FastAPI services and deployment: an engineering case study of FlowAssist.",
};
export default function FlowAssistPage() {
  return <PortfolioShell><FlowAssistCaseStudy /></PortfolioShell>;
}
