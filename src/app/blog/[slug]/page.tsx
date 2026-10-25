import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioShell from "@/components/PortfolioShell";
import BlogArticle from "@/components/BlogArticle";
import { getBlogPost } from "@/lib/blog";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found | Gray Nguyen" };
  return {
    title: `${post.title} | Gray Nguyen`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <PortfolioShell>
      <BlogArticle post={post} />
    </PortfolioShell>
  );
}
