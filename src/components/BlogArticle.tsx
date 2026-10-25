"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock3, Share2, Check, ArrowUp, ChevronDown, List, BookOpen } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import { useLocale } from "@/components/LocaleProvider";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toString()
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/[*_`#]/g, "")
      .trim();

    const id = slugify(cleanText) || `heading-${headings.length + 1}`;
    headings.push({ id, text: cleanText, level });
  }

  return headings;
}

function getChildrenText(children: React.ReactNode): string {
  if (!children) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getChildrenText).join("");
  if (React.isValidElement(children) && children.props) {
    return getChildrenText((children.props as any).children);
  }
  return "";
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  const { locale, t } = useLocale();
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const title = locale === "vi" ? post.titleVi || post.title : post.title;
  const excerpt = locale === "vi" ? post.excerptVi || post.excerpt : post.excerpt;
  const content = locale === "vi" ? post.contentVi || post.content : post.content;

  // Extract table of contents headings
  const headings = useMemo(() => extractHeadings(content), [content]);

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
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
      setMobileTocOpen(false);
    }
  }, []);

  // Track reading scroll progress & active heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      if (headings.length === 0) return;
      const headingElements = headings
        .map((h) => ({ id: h.id, element: document.getElementById(h.id) }))
        .filter((h) => h.element !== null);

      const scrollPosition = window.scrollY + 140;
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const item = headingElements[i];
        if (item.element && item.element.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          return;
        }
      }
      if (headingElements.length > 0 && window.scrollY < 200) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            href="/blog"
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
            {title}
          </h1>

          <p className="mt-5 text-base sm:text-xl leading-relaxed text-[#94a3b8] max-w-5xl font-[Plus_Jakarta_Sans]">
            {excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[#1e293b]/80 pt-6 font-[JetBrains_Mono] text-xs text-[#94a3b8]">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-600/30 border border-indigo-400/50">
                <img src="/avatar.jpg" alt="Gray Nguyen" className="w-full h-full object-cover" />
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
            <span className="inline-flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Clock3 size={14} aria-hidden="true" />
              {post.readingTime}
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

        {/* Mobile Table of Contents Accordion (< lg) */}
        {headings.length > 0 && (
          <div className="lg:hidden mb-8 rounded-xl border border-[#1e293b] bg-[#0a0f1d] p-4 shadow-lg">
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between font-[JetBrains_Mono] text-xs font-bold text-white uppercase tracking-wider"
            >
              <div className="flex items-center gap-2 text-indigo-400">
                <List size={16} />
                <span>
                  {t("TABLE OF CONTENTS", "MỤC LỤC BÀI VIẾT")} ({headings.length})
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#94a3b8] transition-transform duration-200 ${mobileTocOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileTocOpen && (
              <nav className="mt-4 pt-3 border-t border-[#1e293b] flex flex-col gap-2 max-h-80 overflow-y-auto">
                {headings.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleJumpTo(e, item.id)}
                    className={`font-[JetBrains_Mono] text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      item.level === 3 ? "pl-5 text-[#94a3b8]" : "text-[#cbd5e1] font-semibold"
                    } ${
                      activeId === item.id
                        ? "bg-indigo-600/20 text-indigo-300 font-bold"
                        : "hover:text-white hover:bg-[#101827]"
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* 2-Column Responsive Layout: Content (Wider/Bigger) + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          {/* Main Article Content Column - Generous Width & Comfort */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            <div className="rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-6 sm:p-10 lg:p-12 xl:p-14 shadow-2xl">
              <div className="space-y-6 text-[17px] sm:text-[18px] lg:text-[19px] leading-[32px] sm:leading-[36px] text-[#e2e8f0] font-[Plus_Jakarta_Sans] [&_a]:text-indigo-400 [&_a]:underline [&_a:hover]:text-white [&_p]:mb-6 [&_li]:ml-6 [&_li]:list-disc [&_ol>li]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-[#1e293b] [&_pre]:bg-[#060911] [&_pre]:p-5 sm:[&_pre]:p-6 [&_pre]:my-8 [&_pre]:text-[14px] sm:[&_pre]:text-[15px] [&_pre]:leading-[25px] [&_ul]:space-y-3 [&_code]:rounded-md [&_code]:bg-[#141d30] [&_code]:border [&_code]:border-[#1e293b] [&_code]:px-2 [&_code]:py-0.5 [&_code]:font-[JetBrains_Mono] [&_code]:text-[15px] [&_code]:text-indigo-300 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:bg-[#101827] [&_blockquote]:p-6 [&_blockquote]:my-8 [&_blockquote]:rounded-r-2xl [&_blockquote]:text-[18px] sm:[&_blockquote]:text-[19px] [&_blockquote]:leading-[32px] [&_blockquote]:italic [&_strong]:text-white [&_strong]:font-bold">
                <ReactMarkdown
                  components={{
                    h2: ({ node, children, ...props }) => {
                      const text = getChildrenText(children);
                      const id = slugify(text) || "section";

                      return (
                        <h2
                          id={id}
                          className="scroll-mt-28 mt-12 mb-4 font-[Space_Grotesk] text-2xl sm:text-3xl font-extrabold text-white border-b border-[#1e293b] pb-3 flex items-center justify-between group"
                          {...props}
                        >
                          <span>{children}</span>
                          <a
                            href={`#${id}`}
                            onClick={(e) => handleJumpTo(e, id)}
                            className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-white transition-opacity text-base font-[JetBrains_Mono] px-2 cursor-pointer"
                            title="Anchor link"
                            aria-label={`Link to ${text}`}
                          >
                            #
                          </a>
                        </h2>
                      );
                    },
                    h3: ({ node, children, ...props }) => {
                      const text = getChildrenText(children);
                      const id = slugify(text) || "sub-section";

                      return (
                        <h3
                          id={id}
                          className="scroll-mt-28 mt-8 mb-3 font-[Space_Grotesk] text-xl font-bold text-white flex items-center justify-between group"
                          {...props}
                        >
                          <span>{children}</span>
                          <a
                            href={`#${id}`}
                            onClick={(e) => handleJumpTo(e, id)}
                            className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-white transition-opacity text-sm font-[JetBrains_Mono] px-2 cursor-pointer"
                            title="Anchor link"
                            aria-label={`Link to ${text}`}
                          >
                            #
                          </a>
                        </h3>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* End of article footer */}
              <div className="mt-14 border-t border-[#1e293b] pt-8 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/blog"
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
          </main>

          {/* Sticky Table of Contents Sidebar (Desktop >= lg) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 self-start space-y-6">
            {/* TOC Card */}
            <div className="rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <List size={16} className="text-indigo-400" />
                  <span className="font-[JetBrains_Mono] text-xs font-bold text-white uppercase tracking-wider">
                    {t("ON THIS PAGE", "MỤC LỤC BÀI VIẾT")}
                  </span>
                </div>
                <span className="font-[JetBrains_Mono] text-[11px] text-[#64748b]">
                  {headings.length} {t("topics", "phần")}
                </span>
              </div>

              {headings.length > 0 ? (
                <nav className="flex flex-col gap-1 max-h-[calc(100vh-22rem)] overflow-y-auto pr-2 custom-scrollbar">
                  {headings.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleJumpTo(e, item.id)}
                        className={`group flex items-start gap-2.5 py-1.5 px-2.5 rounded-lg text-[13px] font-[JetBrains_Mono] transition-all cursor-pointer ${
                          item.level === 3 ? "pl-6 text-[#94a3b8] text-xs" : "text-[#cbd5e1]"
                        } ${
                          isActive
                            ? "bg-indigo-600/20 text-indigo-300 font-semibold shadow-sm border-l-2 border-indigo-400"
                            : "hover:bg-[#101827] hover:text-white"
                        }`}
                      >
                        <span
                          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isActive ? "bg-indigo-400" : "bg-[#334155] group-hover:bg-[#64748b]"
                          }`}
                        />
                        <span className="line-clamp-2 leading-relaxed">{item.text}</span>
                      </a>
                    );
                  })}
                </nav>
              ) : (
                <div className="text-xs font-[JetBrains_Mono] text-[#64748b]">
                  {t("No headings found.", "Không có mục lục.")}
                </div>
              )}

              {/* Quick Jump to top */}
              <div className="mt-4 pt-3 border-t border-[#1e293b]/70 flex items-center justify-between text-xs font-[JetBrains_Mono]">
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowUp size={13} />
                  <span>{t("Top of page", "Về đầu trang")}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <span className="text-emerald-400">{t("Copied link!", "Đã chép!")}</span>
                  ) : (
                    <>
                      <Share2 size={12} />
                      <span>{t("Share link", "Sao chép link")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Author Profile Card */}
            <div className="rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-5 shadow-xl">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-13 h-13 rounded-full overflow-hidden bg-[#101827] border-2 border-indigo-500/40 shrink-0 shadow-sm">
                  <img
                    src="/avatar.jpg"
                    alt={PORTFOLIO_DATA.profile.name}
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
      </div>
    </div>
  );
}
