import type { Metadata } from "next";
import PortfolioShell from "@/components/PortfolioShell";
import BlogIndex from "@/components/BlogIndex";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Gray Nguyen",
  description: "Learning notes about data engineering, AI, and backend development.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <PortfolioShell>
      <BlogIndex posts={posts} />
    </PortfolioShell>
  );
}
