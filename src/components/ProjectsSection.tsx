"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";

export default function ProjectsSection() {
  const { locale, t } = useLocale();
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(false);

  const featuredProject = PORTFOLIO_DATA.projects.find((p) => p.isFeatured) ?? PORTFOLIO_DATA.projects[0];
  const otherProjects = PORTFOLIO_DATA.projects.filter((p) => p.id !== featuredProject.id);

  const projectAccents: Record<string, { border: string; glow: string; text: string; bg: string }> = {
    "goutms": { border: "#06b6d4", glow: "rgba(6, 182, 212, 0.25)", text: "#38bdf8", bg: "rgba(6, 182, 212, 0.08)" },
    "flowassist-chatbot": { border: "#8b5cf6", glow: "rgba(139, 92, 246, 0.25)", text: "#a78bfa", bg: "rgba(139, 92, 246, 0.08)" },
    "yhct-knowledge-graph": { border: "#10b981", glow: "rgba(16, 185, 129, 0.25)", text: "#34d399", bg: "rgba(16, 185, 129, 0.08)" },
    "hadoop-hive-platform": { border: "#f59e0b", glow: "rgba(245, 158, 11, 0.25)", text: "#fbbf24", bg: "rgba(245, 158, 11, 0.08)" },
  };

  return (
    <section id="projects" className="w-full pb-20 relative z-10">
      {/* Section Header */}
      <div className="w-full pt-0 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182338] border border-[#334155] text-[#818cf8] font-[JetBrains_Mono] text-[11px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            {t("ENGINEERING PORTFOLIO", "DỰ ÁN KỸ THUẬT")}
          </span>
          <span className="text-[#64748b] font-[JetBrains_Mono] text-[12px] hidden sm:inline">SYS.CORE // v2.6</span>
          <div className="h-px flex-1 bg-[#1e293b] hidden sm:block" />
          <span className="text-[#94a3b8] font-[JetBrains_Mono] text-[10px] uppercase tracking-widest hidden md:inline-block">
            FINTECH • HEALTHCARE AI • DISTRIBUTED
          </span>
        </div>

        <div className="max-w-4xl">
          <h2 className="font-[Space_Grotesk] text-[36px] leading-[44px] sm:text-[42px] sm:leading-[50px] font-bold tracking-tight text-white mb-3">
            {t("Featured Engineering Work", "Dự án Nổi bật & Đang Phát triển")}
          </h2>
          <p className="font-[Plus_Jakarta_Sans] text-[17px] leading-[28px] text-[#94a3b8]">
            {t(
              "Practical software engineering across fintech backends, clinical health systems, and applied AI applications.",
              "Các hệ thống phần mềm thực tế bao gồm backend ngân hàng số, AI hỗ trợ y tế và ứng dụng phân tán hiệu năng cao.",
            )}
          </p>
        </div>
      </div>

      {/* Featured Badge Divider */}
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 font-[JetBrains_Mono] text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-indigo-400">star</span>
          {t("FLAGSHIP PROJECT", "DỰ ÁN TRỌNG TÂM")}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 via-slate-800 to-transparent" />
      </div>

      {/* FEATURED PROJECT: Modern Interactive Architecture Showcase */}
      <div className="w-full bg-[#0c121f] border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 mb-16 hover:border-indigo-500/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left: Interactive Banking Architecture Console (7 cols) */}
          <div className="lg:col-span-7 bg-[#060911] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1e293b]">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Console Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[#1e293b]/70">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                <span className="font-[JetBrains_Mono] text-[13px] font-semibold text-white tracking-wide">
                  BANKING-CORE // AWS-DWH-PIPELINE
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-[JetBrains_Mono] text-[10px] uppercase font-bold">
                  {t("ACTIVE SPEC", "ĐANG PHÁT TRIỂN")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsDiagramExpanded(true)}
                className="px-3 py-1.5 rounded-lg bg-[#101827] hover:bg-[#182338] border border-[#1e293b] text-indigo-400 hover:text-white font-[JetBrains_Mono] text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                <span>{t("Expand Diagram", "Phóng to sơ đồ")}</span>
              </button>
            </div>

            {/* Architecture Visualizer Body */}
            <div className="flex-1 flex flex-col justify-center my-2">
              <div className="space-y-4">
                {/* Architecture Diagram Interactive Container */}
                <div
                  onClick={() => setIsDiagramExpanded(true)}
                  className="group relative rounded-xl overflow-hidden bg-[#0c121f] border border-[#1e293b] hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex items-center justify-between px-3.5 py-2 bg-[#101827] border-b border-[#1e293b] text-[11px] font-[JetBrains_Mono]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-semibold">AWS CLOUD ARCHITECTURE // 1.26M TRANSACTIONS</span>
                    </div>
                    <span className="text-indigo-400 group-hover:text-white flex items-center gap-1 font-semibold text-[10px] transition-colors">
                      <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                      {t("Click to Expand", "Phóng to")}
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] w-full bg-white/95 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src="/banking-architecture.png"
                      alt="AWS Cloud Banking Data Warehouse & Transaction Analytics Architecture"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-indigo-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1.5 rounded-lg bg-[#0c121f]/90 border border-indigo-500/40 text-white font-[JetBrains_Mono] text-xs font-semibold shadow-xl flex items-center gap-1.5 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[16px] text-indigo-400">fullscreen</span>
                        {t("View High-Res Diagram", "Xem sơ đồ độ phân giải cao")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Pipeline Milestones based on the diagram */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-[JetBrains_Mono] text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b]">
                    <div className="text-amber-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">dataset</span>
                      <span>1. Ingestion</span>
                    </div>
                    <div className="text-[#94a3b8] text-[10px] mt-1">Kaggle CSV (~1.26M) → Amazon S3</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b]">
                    <div className="text-amber-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>2. Lambda ETL</span>
                    </div>
                    <div className="text-[#94a3b8] text-[10px] mt-1">Python: clean, warehouse & marts</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b]">
                    <div className="text-sky-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">database</span>
                      <span>3. RDS Postgres</span>
                    </div>
                    <div className="text-[#94a3b8] text-[10px] mt-1">Staging → Warehouse → Marts</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b]">
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">monitoring</span>
                      <span>4. BI & Alerts</span>
                    </div>
                    <div className="text-[#94a3b8] text-[10px] mt-1">EventBridge, SNS & Power BI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status telemetry */}
            <div className="pt-4 mt-2 border-t border-[#1e293b]/70 flex items-center justify-between text-[11px] font-[JetBrains_Mono] text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Target Architecture: Java Spring Boot / Cloud Native
              </span>
              <span>DOC_ID: BANKING-FINTECH-01</span>
            </div>
          </div>

          {/* Right: Project Details & Action (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0c121f]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#818cf8] font-[JetBrains_Mono] text-[11px] uppercase tracking-wider font-semibold">
                  {locale === "vi" ? featuredProject.categoryVi ?? featuredProject.category : featuredProject.category}
                </span>
                <span className="text-[#475569]">•</span>
                <span className="text-[#94a3b8] font-[JetBrains_Mono] text-[12px]">
                  {locale === "vi" ? featuredProject.domainVi ?? featuredProject.domain : featuredProject.domain}
                </span>
              </div>

              <h3 className="font-[Space_Grotesk] text-[24px] sm:text-[28px] leading-[34px] font-bold text-white tracking-tight mb-3">
                {locale === "vi" ? featuredProject.titleVi ?? featuredProject.title : featuredProject.title}
              </h3>

              <p className="font-[Plus_Jakarta_Sans] text-[15px] leading-[25px] text-[#94a3b8] mb-6">
                {locale === "vi" ? featuredProject.summaryVi ?? featuredProject.summary : featuredProject.summary}
              </p>

              {/* Highlights */}
              <div className="space-y-2.5 mb-6 p-4 rounded-xl bg-[#101827] border border-[#1e293b]">
                {(locale === "vi" ? featuredProject.highlightsVi ?? featuredProject.highlights : featuredProject.highlights).slice(0, 3).map((h: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-indigo-400 shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="font-[Plus_Jakarta_Sans] text-[13px] text-[#cbd5e1] leading-[20px]">{h}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {featuredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[#141d30] border border-[#1e293b] text-[#cbd5e1] font-[JetBrains_Mono] text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 border-t border-[#1e293b] flex flex-wrap items-center gap-3">
              <a
                href={featuredProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-[Space_Grotesk] text-[14px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
              >
                <span>{t("View Source Code", "Xem mã nguồn")}</span>
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </a>
              <a
                href="#contact"
                className="py-3 px-4 rounded-lg bg-[#101827] hover:bg-[#182338] border border-[#1e293b] text-white font-[JetBrains_Mono] text-[13px] font-medium transition-all"
              >
                {t("Discuss Architecture", "Trao đổi kỹ thuật")}
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ALL OTHER PROJECTS GRID */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-[JetBrains_Mono] text-[12px] uppercase tracking-wider text-[#818cf8] font-bold">
              {t("MORE ACTIVE & RESEARCH PROJECTS", "CÁC DỰ ÁN NGHIÊN CỨU & ỨNG DỤNG KHÁC")}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#182338] text-[11px] font-[JetBrains_Mono] text-[#94a3b8]">
              {otherProjects.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherProjects.map((p) => {
            const accent = projectAccents[p.id] ?? {
              border: "#6366f1",
              glow: "rgba(99, 102, 241, 0.2)",
              text: "#818cf8",
              bg: "rgba(99, 102, 241, 0.08)",
            };

            return (
              <div
                key={p.id}
                className="group p-6 rounded-2xl bg-[#0c121f] border border-[#1e293b] hover:border-slate-600 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 rounded-md font-[JetBrains_Mono] text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: accent.text, backgroundColor: accent.bg }}
                    >
                      {locale === "vi" ? p.categoryVi ?? p.category : p.category}
                    </span>
                    <span className="text-[#64748b] font-[JetBrains_Mono] text-[11px]">
                      {(locale === "vi" ? p.domainVi ?? p.domain : p.domain).split("•")[0]?.trim()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-[Space_Grotesk] text-[20px] font-bold text-white mb-2.5 group-hover:text-indigo-300 transition-colors">
                    {locale === "vi" ? p.titleVi ?? p.title : p.title}
                  </h3>

                  {/* Summary */}
                  <p className="font-[Plus_Jakarta_Sans] text-[14px] leading-[22px] text-[#94a3b8] mb-5 line-clamp-3">
                    {locale === "vi" ? p.summaryVi ?? p.summary : p.summary}
                  </p>

                  {/* Highlights Bullet */}
                  <div className="mb-5 space-y-2">
                    {(locale === "vi" ? p.highlightsVi ?? p.highlights : p.highlights).slice(0, 2).map((hl: string, hidx: number) => (
                      <div key={hidx} className="flex items-start gap-2 text-[12px] text-[#cbd5e1] font-[Plus_Jakarta_Sans]">
                        <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0" style={{ color: accent.text }}>
                          arrow_right
                        </span>
                        <span className="line-clamp-2">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1e293b] mb-4">
                    {p.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#101827] border border-[#1e293b] text-[#94a3b8] font-[JetBrains_Mono] text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-[JetBrains_Mono] text-[12px] font-semibold text-[#818cf8] hover:text-white transition-colors"
                  >
                    <span>{t("Repository Details", "Chi tiết dự án")}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Fullscreen Architecture Modal */}
      {isDiagramExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-all"
          onClick={() => setIsDiagramExpanded(false)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] bg-[#0c121f] border border-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <h4 className="font-[Space_Grotesk] text-lg sm:text-xl font-bold text-white">
                  {t(
                    "AWS Cloud Banking Data Warehouse & Transaction Analytics Architecture",
                    "Kiến trúc Kho Dữ liệu & Phân tích Giao dịch Ngân hàng trên AWS Cloud",
                  )}
                </h4>
                <p className="font-[JetBrains_Mono] text-xs text-[#94a3b8] mt-1">
                  Kaggle (~1.26M Tx) • Amazon S3 • AWS Lambda (Python ETL) • Amazon RDS PostgreSQL (Staging / Warehouse / Marts) • Power BI
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDiagramExpanded(false)}
                className="w-9 h-9 rounded-xl bg-[#101827] border border-[#1e293b] text-[#94a3b8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-white p-2 sm:p-4 flex items-center justify-center">
              <img
                src="/banking-architecture.png"
                alt="AWS Cloud Banking Data Warehouse Architecture"
                className="max-w-full max-h-[75vh] object-contain shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
