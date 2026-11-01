import { notFound, permanentRedirect } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog";

export async function generateStaticParams() {
  return (await getBlogPosts()).map(({ slug }) => ({ slug }));
}
export default async function ArticleRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  permanentRedirect(`/${post.availableLocales.includes("en") ? "en" : "vi"}/blog/${post.slug}/`);
}
