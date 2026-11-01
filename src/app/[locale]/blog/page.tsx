import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioShell from "@/components/PortfolioShell";
import BlogIndex from "@/components/BlogIndex";
import { getBlogPosts } from "@/lib/blog";
import { canonical } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return [{ locale: "en" }, { locale: "vi" }]; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "vi") notFound();
  return {
    title: locale === "vi" ? "Blog kỹ thuật | Gray Nguyen" : "Engineering Blog | Gray Nguyen",
    description: locale === "vi" ? "Ghi chép về Java, AI, dữ liệu và thuật toán." : "Learning notes on Java, AI, data engineering and algorithms.",
    alternates: { canonical: canonical(`/${locale}/blog/`), languages: { en: canonical("/en/blog/"), vi: canonical("/vi/blog/") } },
  };
}
export default async function LocalizedBlog({ params }: Props) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "vi") notFound();
  return <div lang={locale}><PortfolioShell><BlogIndex posts={await getBlogPosts()} /></PortfolioShell></div>;
}
