import type { BlogPostSummary as BaseSummary, BlogPost as BasePost } from "@/features/blog/types";

export type BlogPostSummary = BaseSummary & { updatedAt?: string; updatedAtVi?: string };
export type BlogPost = BasePost & { updatedAt?: string; updatedAtVi?: string };

export const BLOG_SERIES = [
  { id: "java-foundations", title: "Java foundations", titleVi: "Nền tảng Java", slugs: ["java-core", "backend-engineering-roadmap"] },
  { id: "algorithm-foundations", title: "Algorithm foundations", titleVi: "Nền tảng thuật toán", slugs: ["two-pointers-two-sum-ii"] },
] as const;

export function categoryForPost<T extends BaseSummary>(post: T): T {
  // Algorithm notes live alongside existing blog content and can be grouped by tag.
  return post.tags.some(tag => ["leetcode", "algorithms"].includes(tag.toLowerCase()))
    ? { ...post, category: "Algorithms / LeetCode", categoryVi: "Thuật toán / LeetCode" }
    : post;
}
