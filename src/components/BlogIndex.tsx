"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, PenLine, Search, X } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import { useLocale } from "@/components/LocaleProvider";

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const { locale, t } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories with bilingual labels
  const categories = useMemo(() => {
    const map = new Map<string, { en: string; vi: string; count: number }>();
    posts.forEach((p) => {
      const existing = map.get(p.category);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.category, {
          en: p.category,
          vi: p.categoryVi || p.category,
          count: 1,
        });
      }
    });
    return Array.from(map.entries()).map(([key, data]) => ({
      key,
      label: locale === "vi" ? data.vi : data.en,
      count: data.count,
    }));
  }, [posts, locale]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const title = (locale === "vi" ? post.titleVi || post.title : post.title).toLowerCase();
      const excerpt = (locale === "vi" ? post.excerptVi || post.excerpt : post.excerpt).toLowerCase();
      const tags = post.tags.map((t) => t.toLowerCase()).join(" ");
      const category = (locale === "vi" ? post.categoryVi || post.category : post.category).toLowerCase();

      const matchesSearch =
        title.includes(q) || excerpt.includes(q) || tags.includes(q) || category.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery, locale]);

  return (
    <section className="relative z-10 w-full pb-20 pt-8">
      {/* Header */}
      <div className="mb-10 max-w-4xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 font-[JetBrains_Mono] text-xs uppercase tracking-widest text-indigo-300">
          <PenLine size={14} aria-hidden="true" />
          {t("ENGINEERING LOG & ROADMAPS", "GÓC GHI CHÉP & LỘ TRÌNH KỸ THUẬT")}
        </span>
        <h1 className="font-[Space_Grotesk] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          {t("Notes, Roadmaps & System Thinking", "Bài học, Lộ trình & Tư duy Hệ thống")}
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#94a3b8]">
          {t(
            "Hands-on lessons, architectural decisions, and step-by-step engineering roadmaps across Backend, Data, and AI.",
            "Ghi chép thực chiến, phân tích kiến trúc và các lộ trình học tập từng bước về Backend, Dữ liệu và Trí tuệ nhân tạo.",
          )}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-[JetBrains_Mono] font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                : "bg-[#0a0f1d] text-[#94a3b8] hover:text-white border border-[#1e293b] hover:border-slate-600"
            }`}
          >
            <span>{t("All Categories", "Tất cả")}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedCategory === "all" ? "bg-white/20 text-white" : "bg-[#152038] text-[#94a3b8]"
              }`}
            >
              {posts.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-[JetBrains_Mono] font-semibold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                    : "bg-[#0a0f1d] text-[#94a3b8] hover:text-white border border-[#1e293b] hover:border-slate-600"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#152038] text-[#94a3b8]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-lg">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Filter by keyword, topic, or tag...", "Tìm kiếm theo từ khóa, thẻ hoặc chủ đề...")}
            className="w-full rounded-xl bg-[#0a0f1d] border border-[#1e293b] pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-[#64748b] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-[Plus_Jakarta_Sans]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-6 sm:p-7 transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0e1629] flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                {/* Meta Header */}
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-[JetBrains_Mono] text-xs text-[#94a3b8]">
                  <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
                    {locale === "vi" ? post.categoryVi || post.category : post.category}
                  </span>
                  <span>•</span>
                  <time dateTime={post.publishedAt} className="text-[#64748b]">
                    {new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
                      dateStyle: "medium",
                      timeZone: "UTC",
                    }).format(new Date(post.publishedAt))}
                  </time>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[#64748b]">
                    <Clock3 size={13} aria-hidden="true" />
                    {post.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-[Space_Grotesk] text-2xl font-bold text-white transition-colors group-hover:text-indigo-300">
                  <Link href={`/blog/${post.slug}`}>
                    {locale === "vi" ? post.titleVi || post.title : post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="mt-3 text-[14px] leading-relaxed text-[#94a3b8] line-clamp-3">
                  {locale === "vi" ? post.excerptVi || post.excerpt : post.excerpt}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-[#1e293b]">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="rounded-md bg-[#141d30] border border-[#1e293b] px-2 py-0.5 font-[JetBrains_Mono] text-[10px] text-[#94a3b8] hover:text-white hover:border-slate-500 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Read Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-2 font-[JetBrains_Mono] text-xs font-bold text-indigo-400 transition-colors hover:text-white"
                >
                  {t("Read full article", "Đọc toàn bộ bài viết")}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1e293b] bg-[#0c121f] p-10 text-center text-[#94a3b8]">
          <p className="font-[Space_Grotesk] text-lg text-white font-semibold">
            {t("No articles found", "Không tìm thấy bài viết nào")}
          </p>
          <p className="mt-2 text-sm text-[#64748b]">
            {t(
              "Try selecting a different category or clearing the search query.",
              "Thử chọn một danh mục khác hoặc xóa từ khóa tìm kiếm.",
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#182338] px-4 py-2 text-xs font-[JetBrains_Mono] text-white hover:bg-[#22304b] transition-colors"
          >
            {t("Reset filters", "Đặt lại bộ lọc")}
          </button>
        </div>
      )}
    </section>
  );
}
