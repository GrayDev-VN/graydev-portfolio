import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import PortfolioShell from "@/components/PortfolioShell";
import BlogArticle from "@/components/BlogArticle";
import PostBody from "@/features/blog/components/PostBody";
import { analyzeMarkdown } from "@/features/blog/markdown";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { BLOG_SERIES } from "@/lib/blog-presentation";
import { canonical } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateStaticParams() {
  return (await getBlogPosts()).flatMap(post => post.availableLocales.map(locale => ({ locale, slug: post.slug })));
}
async function resolvePost(params: Props["params"]) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "vi") notFound();
  const post = await getBlogPost(slug);
  if (!post) notFound();
  if (!post.availableLocales.includes(locale)) permanentRedirect(`/${post.availableLocales[0]}/blog/${post.slug}/`);
  return { locale, post };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, post } = await resolvePost(params);
  const title = locale === "vi" ? post.titleVi : post.title;
  const description = locale === "vi" ? post.excerptVi : post.excerpt;
  const url = canonical(`/${locale}/blog/${post.slug}/`);
  const image = `/api/og?slug=${encodeURIComponent(post.slug)}&locale=${locale}`;
  return {
    title: `${title} | Gray Nguyen`, description,
    alternates: { canonical: url, languages: Object.fromEntries(post.availableLocales.map(language => [language, canonical(`/${language}/blog/${post.slug}/`)])) },
    openGraph: { type: "article", title, description, url, locale: locale === "vi" ? "vi_VN" : "en_US", publishedTime: post.publishedAt, modifiedTime: (locale === "vi" ? post.updatedAtVi : post.updatedAt) ?? post.publishedAt, authors: ["Gray Nguyen"], images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
export default async function LocalizedArticle({ params }: Props) {
  const { locale, post } = await resolvePost(params);
  const { content, contentVi, ...summary } = post;
  const series = BLOG_SERIES.find(item => (item.slugs as readonly string[]).includes(post.slug));
  const posts = await getBlogPosts();
  const related = posts.filter(item => item.slug !== post.slug && ((series?.slugs as readonly string[] | undefined)?.includes(item.slug) || item.tags.some(tag => post.tags.includes(tag))));
  related.sort((a, b) => Number((series?.slugs as readonly string[] | undefined)?.includes(b.slug)) - Number((series?.slugs as readonly string[] | undefined)?.includes(a.slug)));
  const body = <PostBody content={locale === "vi" ? contentVi : content} />;
  const headings = analyzeMarkdown(locale === "vi" ? contentVi : content).headings;
  return <div lang={locale}><PortfolioShell><BlogArticle post={summary} bodies={{ en: body, vi: body }} tableOfContents={{ en: headings, vi: headings }} related={related} /></PortfolioShell></div>;
}
