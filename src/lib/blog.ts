import matter from "gray-matter";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface BlogPost {
  slug: string;
  title: string;
  titleVi: string;
  excerpt: string;
  excerptVi: string;
  category: string;
  categoryVi: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  content: string;
  contentVi: string;
  folder?: string;
}

const blogDirectory = path.join(process.cwd(), "content", "blog");

function requiredString(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing or invalid "${key}" in blog post front matter.`);
  }
  return value.trim();
}

function optionalString(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md") && !entry.name.startsWith("_")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function readPostFromFile(filePath: string): Promise<BlogPost> {
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  const data = parsed.data as Record<string, unknown>;
  const publishedAt = requiredString(data, "publishedAt");
  if (Number.isNaN(Date.parse(publishedAt))) {
    throw new Error(`Invalid publishedAt date in blog post "${filePath}".`);
  }

  // Slug defaults to filename without extension, or frontmatter slug
  const fileSlug = path.basename(filePath, ".md");
  const slug = (typeof data.slug === "string" && data.slug.trim()) || fileSlug;

  // Relative folder (e.g., "backend", "data-engineering")
  const relativeDir = path.relative(blogDirectory, path.dirname(filePath));
  const folder = relativeDir && relativeDir !== "." ? relativeDir.replace(/\\/g, "/") : undefined;

  return {
    slug,
    title: requiredString(data, "title"),
    titleVi: optionalString(data, "titleVi"),
    excerpt: requiredString(data, "excerpt"),
    excerptVi: optionalString(data, "excerptVi"),
    category: requiredString(data, "category"),
    categoryVi: optionalString(data, "categoryVi"),
    publishedAt,
    readingTime: requiredString(data, "readingTime"),
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    content: parsed.content.trim(),
    contentVi: optionalString(data, "contentVi"),
    folder,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = await getMarkdownFiles(blogDirectory);
    const posts = await Promise.all(files.map(readPostFromFile));
    return posts.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
