"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Share2, Check, ArrowUp, BookOpen } from "lucide-react";
import TableOfContents from "@/features/blog/components/TableOfContents";
import type { TocItem } from "@/features/blog/types";
import { BLOG_SERIES, type BlogPostSummary } from "@/lib/blog-presentation";
import { useLocale } from "@/components/LocaleProvider";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { formatWithAmpersand } from "@/components/CleanAmpersand";

interface BlogArticleProps {
  post: BlogPostSummary;
  bodies: { en: React.ReactNode; vi: React.ReactNode };
  tableOfContents: { en: TocItem[]; vi: TocItem[] };
  related?: BlogPostSummary[];
}

export default function BlogArticle({ post, bodies, tableOfContents, related = [] }: BlogArticleProps) {
  const { locale, t } = useLocale();
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  const title = locale === "vi" ? post.titleVi || post.title : post.title;
  const excerpt = locale === "vi" ? post.excerptVi || post.excerpt : post.excerpt;
  const headings = tableOfContents[locale];
  const updatedAt = locale === "vi" ? post.updatedAtVi : post.updatedAt;
  const series = BLOG_SERIES.find(item => (item.slugs as readonly string[]).includes(post.slug));
  const seriesPosts = series ? series.slugs.map(slug => slug === post.slug ? post : related.find(item => item.slug === slug)).filter((item): item is BlogPostSummary => Boolean(item)) : [];

  // Smooth jump to section
  const handleJumpTo = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 96; // 6rem offset for top navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });

      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  }, []);

  // Coalesce scroll events and resolve headings once per article/language.
  useEffect(() => {
    const headingElements = headings
      .map((heading) => ({ id: heading.id, element: document.getElementById(heading.id) }))
      .filter((heading) => heading.element !== null);
    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      const article = articleRef.current;
      if (article) {
        const bounds = article.getBoundingClientRect();
        const readableHeight = Math.max(1, bounds.height - window.innerHeight + 96);
        setScrollProgress(Math.round(Math.min(100, Math.max(0, ((96 - bounds.top) / readableHeight) * 100))));
      }

      if (headings.length === 0) return;
      const scrollPosition = window.scrollY + 140;
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const item = headingElements[i];
        if (item.element && item.element.getBoundingClientRect().top + window.scrollY <= scrollPosition) {
          setActiveId(item.id);
          return;
        }
      }
      if (headingElements.length > 0 && window.scrollY < 200) {
        setActiveId(headingElements[0].id);
      }
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { setCopied(false); }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 left-10 w-80 h-80 bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full pb-24 pt-4">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 font-[JetBrains_Mono] text-xs font-semibold text-indigo-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>{t("Back to all articles", "Quay lại danh sách bài viết")}</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0f1d] hover:bg-[#152038] border border-[#1e293b] text-xs font-[JetBrains_Mono] text-[#94a3b8] hover:text-white transition-all cursor-pointer"
            title={t("Copy link to share", "Sao chép liên kết bài viết")}
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">{t("Copied!", "Đã chép link!")}</span>
              </>
            ) : (
              <>
                <Share2 size={13} />
                <span>{t("Share", "Chia sẻ")}</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header Banner */}
        <header className="mb-10 rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-md bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 font-[JetBrains_Mono] text-xs font-bold text-indigo-300 uppercase tracking-wider">
              {locale === "vi" ? post.categoryVi || post.category : post.category}
            </span>
            {post.tags &&
              post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#101827] border border-[#1e293b] px-2.5 py-1 font-[JetBrains_Mono] text-[11px] text-[#94a3b8]"
                >
                  #{tag}
                </span>
              ))}
          </div>

          <h1 className="font-[Space_Grotesk] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.18]">
            {formatWithAmpersand(title)}
          </h1>

          <p className="mt-5 text-base sm:text-xl leading-relaxed text-[#94a3b8] max-w-5xl font-[Plus_Jakarta_Sans]">
            {excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[#1e293b]/80 pt-6 font-[JetBrains_Mono] text-xs text-[#94a3b8]">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-600/30 border border-indigo-400/50">
                <img src="/avatar-96.webp" alt="Gray Nguyen" width={96} height={96} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-sm">Gray Nguyen</span>
            </div>
            <span>•</span>
            <time dateTime={post.publishedAt} className="text-[#64748b]">
              {new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(post.publishedAt))}
            </time>
            <span>•</span>
            {updatedAt && updatedAt !== post.publishedAt && <span className="text-slate-400">{t("Updated", "Cập nhật")}: <time dateTime={updatedAt}>{new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(updatedAt))}</time></span>}
            <span className="inline-flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Clock3 size={14} aria-hidden="true" />
              {locale === "vi" ? post.readingTimeVi : post.readingTime}
            </span>
            {headings.length > 0 && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[#94a3b8]">
                  <BookOpen size={14} />
                  {headings.length} {t("sections", "mục chính")}
                </span>
              </>
            )}
          </div>
        </header>

        {!post.availableLocales.includes(locale) && (
          <p role="status" className="mb-6 text-sm text-slate-400">
            {t("This article is currently available in Vietnamese only.", "Bài viết này hiện chỉ có bản tiếng Anh.")}
          </p>
        )}

        <TableOfContents
          mobile
          headings={headings}
          activeId={activeId}
          progress={scrollProgress}
          onJump={handleJumpTo}
          onBackToTop={scrollToTop}
        />

        {/* 2-Column Responsive Layout: Content (Wider/Bigger) + Sticky Sidebar */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] xl:gap-10">
          {/* Main Article Content Column - Generous Width & Comfort */}
          <article ref={articleRef} lang={post.availableLocales.includes(locale) ? locale : post.availableLocales[0]} className="min-w-0">
            <div className="rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-6 sm:p-10 lg:p-12 xl:p-14 shadow-2xl">
              <div className="blog-prose space-y-6 text-[17px] sm:text-[18px] lg:text-[19px] leading-[32px] sm:leading-[36px] text-[#e2e8f0] font-[Plus_Jakarta_Sans] [&_a]:text-indigo-400 [&_a]:underline [&_a:hover]:text-white [&_p]:mb-6 [&_li]:ml-6 [&_li]:list-disc [&_ol>li]:list-decimal [&_ul]:space-y-3 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:bg-[#101827] [&_blockquote]:p-6 [&_blockquote]:my-8 [&_blockquote]:rounded-r-2xl [&_blockquote]:text-[18px] sm:[&_blockquote]:text-[19px] [&_blockquote]:leading-[32px] [&_blockquote]:italic [&_strong]:text-white [&_strong]:font-bold">
                {bodies[locale]}
              </div>

              {/* End of article footer */}
              <div className="mt-14 border-t border-[#1e293b] pt-8 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href={`/${locale}/blog`}
                  className="inline-flex items-center gap-2 font-[JetBrains_Mono] text-xs font-semibold text-indigo-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  <span>{t("Back to all articles", "Quay lại danh sách bài viết")}</span>
                </Link>

                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101827] hover:bg-[#141d30] border border-[#1e293b] font-[JetBrains_Mono] text-xs text-[#cbd5e1] hover:text-white transition-all shadow-sm"
                >
                  <ArrowUp size={14} />
                  <span>{t("Back to top", "Lên đầu trang")}</span>
                </button>
              </div>
            </div>
          </article>

          {/* Sticky Table of Contents Sidebar (Desktop >= lg) */}
          <aside className="sticky top-24 hidden min-w-0 self-start space-y-5 lg:block">
            <TableOfContents
              headings={headings}
              activeId={activeId}
              progress={scrollProgress}
              onJump={handleJumpTo}
              onBackToTop={scrollToTop}
            />

            {/* Author Profile Card */}
            <div className="rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-5 shadow-xl">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-13 h-13 rounded-full overflow-hidden bg-[#101827] border-2 border-indigo-500/40 shrink-0 shadow-sm">
                  <img
                    src="/avatar-96.webp"
                    alt={PORTFOLIO_DATA.profile.name}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="font-[Space_Grotesk] text-sm font-bold text-white">
                    {PORTFOLIO_DATA.profile.name}
                  </h4>
                  <p className="text-[11px] font-[JetBrains_Mono] text-indigo-400">
                    {t("AI & Backend Engineer", "Kỹ sư AI & Backend")}
                  </p>
                  <p className="text-[11px] font-[JetBrains_Mono] text-[#64748b]">
                    SOFTWORLD • AWS Intern
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">
                {t(
                  "Writing on Java Core, Distributed Systems, Banking Architecture, and AI engineering.",
                  "Chia sẻ về Java Core, hệ thống phân tán, kiến trúc ngân hàng và ứng dụng AI.",
                )}
              </p>
              <Link
                href="/career"
                className="inline-flex items-center gap-1 text-xs font-[JetBrains_Mono] font-semibold text-indigo-400 hover:text-white transition-colors"
              >
                <span>{t("View career journey →", "Xem hành trình →")}</span>
              </Link>
            </div>
          </aside>
        </div>
        {series && <section className="mt-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6" aria-label={t("Article series", "Chuỗi bài viết")}>
          <p className="text-indigo-400 text-xs font-mono mb-2">SERIES</p><h2 className="text-xl font-bold mb-4">{locale === "vi" ? series.titleVi : series.title}</h2>
          <ol className="space-y-3">{seriesPosts.map((item, i) => <li key={item.slug}><Link href={`/${locale}/blog/${item.slug}`} aria-current={item.slug === post.slug ? "page" : undefined} className={item.slug === post.slug ? "text-indigo-300 font-semibold" : "text-slate-400 hover:text-white"}>{i + 1}. {locale === "vi" ? item.titleVi : item.title}{item.slug === post.slug ? t(" · Reading", " · Đang đọc") : " →"}</Link></li>)}</ol>
        </section>}
        {related.filter(item => item.slug !== post.slug).length > 0 && <section className="mt-8"><h2 className="text-xl font-bold mb-4">{t("Read next", "Đọc tiếp")}</h2><div className="grid sm:grid-cols-2 gap-4">{related.filter(item => item.slug !== post.slug).slice(0, 2).map(item => <Link key={item.slug} href={`/${locale}/blog/${item.slug}`} className="rounded-xl border border-slate-800 bg-[#0a0f1d] p-5 text-indigo-200 hover:border-indigo-500">{locale === "vi" ? item.titleVi : item.title} →</Link>)}</div></section>}
      </div>
    </div>
  );
}
