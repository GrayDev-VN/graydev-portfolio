export type BlogLocale = "en" | "vi";

export const BLOG_CATEGORIES = {
  backend: { en: "Backend", vi: "Backend" },
  "data-engineering": { en: "Data Engineering", vi: "Kỹ thuật dữ liệu" },
  ai: { en: "AI Engineering", vi: "Kỹ thuật AI" },
} as const;

export interface PostMetadata {
  title: string;
  description: string;
  category: keyof typeof BLOG_CATEGORIES;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string;
  updatedAt?: string;
  cover?: string;
}

export interface PostTranslation extends PostMetadata {
  locale: BlogLocale;
  content: string;
  readingMinutes: number;
}

// Only metadata crosses the client boundary on the blog index.
export interface BlogPostSummary {
  slug: string;
  title: string;
  titleVi: string;
  excerpt: string;
  excerptVi: string;
  category: string;
  categoryVi: string;
  publishedAt: string;
  readingTime: string;
  readingTimeVi: string;
  tags: string[];
  availableLocales: BlogLocale[];
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  contentVi: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
