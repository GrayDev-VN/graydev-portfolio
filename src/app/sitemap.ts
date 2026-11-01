import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { canonical, siteOrigin } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteOrigin()) return [];
  const staticPages = ["/", "/career/", "/projects/", "/projects/flowassist-chatbot/", "/credentials/", "/en/blog/", "/vi/blog/"];
  return [
    ...staticPages.map(path => ({ url: canonical(path)! })),
    ...(await getBlogPosts()).flatMap(post => post.availableLocales.map(locale => ({
      url: canonical(`/${locale}/blog/${post.slug}/`)!,
      lastModified: (locale === "vi" ? post.updatedAtVi : post.updatedAt) ?? post.publishedAt,
      alternates: { languages: Object.fromEntries(post.availableLocales.map(language => [language, canonical(`/${language}/blog/${post.slug}/`)!])) },
    }))),
  ];
}
