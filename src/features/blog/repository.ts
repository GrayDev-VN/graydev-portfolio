import matter from "gray-matter";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parsePostMetadata } from "./schema.ts";
import { analyzeMarkdown } from "./markdown.ts";
import { BLOG_CATEGORIES, type BlogLocale, type BlogPost, type BlogPostSummary, type PostTranslation } from "./types.ts";

export async function readBlogDirectory(directory: string): Promise<BlogPost[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const posts: BlogPost[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith("_")) continue;
    if (!entry.isDirectory() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
      throw new Error(`[blog] ${entry.name}: expected a slug directory containing en.md and/or vi.md.`);
    }
    const folder = path.join(directory, entry.name);
    const files = await readdir(folder);
    const translations: Partial<Record<BlogLocale, PostTranslation>> = {};
    for (const file of files) {
      if (file !== "en.md" && file !== "vi.md") throw new Error(`[blog] ${folder}/${file}: expected en.md or vi.md. Store images in public/blog/.`);
      const locale = file.slice(0, 2) as BlogLocale;
      const filePath = path.join(folder, file);
      try {
        const parsed = matter(await readFile(filePath, "utf8"));
        const metadata = parsePostMetadata(parsed.data, filePath);
        const content = parsed.content.trim();
        if (!content) throw new Error("Markdown body must not be empty.");
        const { readingMinutes } = analyzeMarkdown(content);
        if (metadata.status === "published") translations[locale] = { ...metadata, content, locale, readingMinutes };
      } catch (error) {
        throw new Error(`[blog] Cannot read ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    if (!files.length) throw new Error(`[blog] ${folder}: no translations found.`);
    const en = translations.en ?? translations.vi;
    const vi = translations.vi ?? translations.en;
    if (!en || !vi) continue; // All translations are drafts.
    if (en.category !== vi.category || en.publishedAt !== vi.publishedAt) {
      throw new Error(`[blog] ${entry.name}: translations must share category and publishedAt.`);
    }
    posts.push({
      slug: entry.name, title: en.title, titleVi: vi.title,
      excerpt: en.description, excerptVi: vi.description,
      category: BLOG_CATEGORIES[en.category].en, categoryVi: BLOG_CATEGORIES[en.category].vi,
      publishedAt: en.publishedAt, tags: [...new Set([...en.tags, ...vi.tags])],
      readingTime: `${en.readingMinutes} min read`, readingTimeVi: `${vi.readingMinutes} phút đọc`,
      content: en.content, contentVi: vi.content,
      availableLocales: (["en", "vi"] as const).filter((locale) => translations[locale]),
    });
  }
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
}

const readPosts = cache(() => readBlogDirectory(path.join(process.cwd(), "content", "blog")));

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return (await readPosts()).map((post) => ({
    slug: post.slug, title: post.title, titleVi: post.titleVi,
    excerpt: post.excerpt, excerptVi: post.excerptVi,
    category: post.category, categoryVi: post.categoryVi,
    publishedAt: post.publishedAt, tags: post.tags,
    readingTime: post.readingTime, readingTimeVi: post.readingTimeVi,
    availableLocales: post.availableLocales,
  }));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return (await readPosts()).find((post) => post.slug === slug) ?? null;
}
