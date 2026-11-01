import { BLOG_CATEGORIES, type PostMetadata } from "./types.ts";

export function parsePostMetadata(data: Record<string, unknown>, file: string): PostMetadata {
  function fail(message: string): never {
    throw new Error(`[blog] ${file}: ${message}`);
  }
  function text(key: string): string {
    const value = data[key];
    return typeof value === "string" && value.trim() ? value.trim() : fail(`"${key}" must be a non-empty string.`);
  }
  function date(key: string): string {
    const value = text(key);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) {
      fail(`"${key}" must be a valid YYYY-MM-DD date (quoted in YAML).`);
    }
    return value;
  }
  const category = text("category");
  if (!Object.hasOwn(BLOG_CATEGORIES, category)) fail(`Unknown category "${category}".`);
  const status = text("status");
  if (status !== "draft" && status !== "published") fail('"status" must be "draft" or "published".');
  if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
    fail('"tags" must be an array of non-empty strings.');
  }
  const publishedAt = date("publishedAt");
  const updatedAt = data.updatedAt === undefined ? undefined : date("updatedAt");
  if (updatedAt && updatedAt < publishedAt) fail('"updatedAt" cannot precede "publishedAt".');
  const cover = data.cover === undefined ? undefined : text("cover");
  if (cover && !cover.startsWith("/blog/")) fail('"cover" must start with "/blog/".');

  return {
    title: text("title"), description: text("description"),
    category: category as PostMetadata["category"], status: status as PostMetadata["status"],
    tags: [...new Set((data.tags as string[]).map((tag) => tag.trim()))],
    publishedAt, updatedAt, cover,
  };
}
