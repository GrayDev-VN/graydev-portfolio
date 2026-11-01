import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { getBlogPost as readPost, getBlogPosts as readSummaries } from "@/features/blog/repository";
import { categoryForPost, type BlogPost, type BlogPostSummary } from "./blog-presentation";

// Enrich the validated content repository at the application's server boundary.
const datesFor = cache(async (slug: string, locales: readonly string[]) => {
  const dates = await Promise.all(locales.map(async locale => {
    const { data } = matter(await readFile(path.join(process.cwd(), "content/blog", slug, `${locale}.md`), "utf8"));
    return [locale, data.updatedAt as string | undefined] as const;
  }));
  const byLocale = Object.fromEntries(dates);
  return { updatedAt: byLocale.en ?? (!locales.includes("en") ? byLocale.vi : undefined), updatedAtVi: byLocale.vi ?? (!locales.includes("vi") ? byLocale.en : undefined) };
});

export const getBlogPosts = cache(async (): Promise<BlogPostSummary[]> => Promise.all(
  (await readSummaries()).map(async post => ({ ...categoryForPost(post), ...await datesFor(post.slug, post.availableLocales) })),
));
export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const post = await readPost(slug);
  return post ? { ...categoryForPost(post), ...await datesFor(post.slug, post.availableLocales) } : null;
});
