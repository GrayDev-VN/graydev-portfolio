"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA, Credential } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "AWS", value: "aws" },
  { label: "Google", value: "google" },
  { label: "Industry", value: "industry" },
  { label: "Award", value: "award" },
  { label: "Academic", value: "academic" },
];

const categoryColors: Record<string, string> = {
  aws: "#f59e0b",
  google: "#38bdf8",
  industry: "#818cf8",
  award: "#10b981",
  academic: "#a78bfa",
};

function MarqueeCredentialCard({ cred }: { cred: Credential }) {
  const { t } = useLocale();
  const color = categoryColors[cred.category] ?? "#818cf8";

  return (
    <div className="w-[320px] sm:w-[360px] shrink-0 flex flex-col justify-between rounded-2xl bg-[#0c121f] border border-[#1e293b] hover:border-indigo-500/60 transition-all duration-300 p-5 shadow-lg group hover:-translate-y-1">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span
            className="font-[JetBrains_Mono] text-[11px] font-bold tracking-wider uppercase"
            style={{ color }}
          >
            {cred.issuer.split("/")[0].trim()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-[JetBrains_Mono] text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="material-symbols-outlined text-[13px]">verified</span>
          <span>{t("VERIFIED", "XÁC THỰC")}</span>
        </div>
      </div>

      {/* Middle: Title & Badge */}
      <div className="py-4 flex flex-col space-y-2">
        <h4 className="font-[Space_Grotesk] text-[16px] leading-[22px] font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
          {cred.title}
        </h4>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-[JetBrains_Mono] text-[11px] px-2.5 py-0.5 rounded bg-[#101827] border border-[#1e293b] text-[#cbd5e1]">
            {cred.badgeType}
          </span>
          {cred.hours && (
            <span className="font-[JetBrains_Mono] text-[10px] text-[#94a3b8] flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-indigo-400">schedule</span>
              {cred.hours}
            </span>
          )}
        </div>
      </div>

      {/* Bottom: ID and Year */}
      <div className="pt-3 border-t border-[#1e293b]/70 flex items-center justify-between text-[#64748b] font-[JetBrains_Mono] text-[11px]">
        <span className="truncate max-w-[190px]">{cred.verifiedId}</span>
        <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#182338]">
          {cred.year}
        </span>
      </div>
    </div>
  );
}

function CredentialGridCard({ cred }: { cred: Credential }) {
  const { t } = useLocale();
  const color = categoryColors[cred.category] ?? "#818cf8";

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-[#0c121f] border border-[#1e293b] hover:border-slate-600 transition-all shadow-lg overflow-hidden relative hover:-translate-y-1">
      <div className="p-4 flex flex-col space-y-4">
        {/* Certificate Visual Specimen */}
        <div className="relative w-full aspect-[4/3] rounded-xl bg-[#060911] border border-[#1e293b] overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span
              className="font-[JetBrains_Mono] text-[11px] font-bold tracking-wider uppercase"
              style={{ color }}
            >
              {cred.issuer.split(" ")[0]}
            </span>
            <span className="font-[JetBrains_Mono] text-[10px] px-2 py-0.5 rounded bg-[#101827] border border-[#1e293b] text-[#cbd5e1]">
              {cred.category.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-[JetBrains_Mono] text-[10px] text-[#64748b]">{PORTFOLIO_DATA.profile.realName}</span>
            <p
              className="font-[JetBrains_Mono] text-[12px] font-semibold leading-tight line-clamp-2"
              style={{ color }}
            >
              {cred.title} — {cred.badgeType}
            </p>
            {cred.hours && (
              <span className="font-[JetBrains_Mono] text-[9px] text-[#94a3b8]">
                {typeof cred.hours === "string" && cred.hours.includes("hours")
                  ? `${t("Course completed", "Đã hoàn thành khóa học")}: ${cred.hours}`
                  : cred.hours}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[#64748b] font-[JetBrains_Mono] text-[9px] pt-1">
            <span>{cred.verifiedId}</span>
            <span className="font-semibold" style={{ color }}>{cred.year}</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col space-y-1">
          <h3 className="font-[Space_Grotesk] text-[18px] leading-[24px] text-white font-bold group-hover:text-indigo-300 transition-colors line-clamp-2">
            {cred.title}
          </h3>
          <p className="font-[Plus_Jakarta_Sans] text-[12px] leading-[18px] text-[#94a3b8] font-medium">
            {cred.issuer}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-[#060911]/80 border-t border-[#1e293b] flex items-center justify-between">
        <span className="font-[JetBrains_Mono] text-[12px] text-[#64748b]">{cred.date}</span>
        <div className="flex items-center gap-1 text-emerald-400">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span className="font-[JetBrains_Mono] text-[10px] uppercase font-bold">{t("Verified", "Đã xác minh")}</span>
        </div>
      </div>
    </article>
  );
}

export default function CredentialsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showAllGrid, setShowAllGrid] = useState<boolean>(false);
  const { t } = useLocale();

  const allCreds = PORTFOLIO_DATA.credentials;
  // Duplicate array for seamless infinite marquee loop
  const marqueeCreds = [...allCreds, ...allCreds];

  const filtered = activeFilter === "all"
    ? showAllGrid ? allCreds : allCreds.slice(0, 4)
    : allCreds.filter((c) => c.category === activeFilter);

  return (
    <section id="credentials" className="w-full pb-20 relative z-10">
      <div className="flex flex-col w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="flex flex-col space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">verified</span>
              <span className="font-[JetBrains_Mono] text-[11px] text-indigo-400 uppercase tracking-widest font-bold">
                {t("VERIFIED CREDENTIALS & EVIDENCE", "CHỨNG CHỈ & MINH CHỨNG")}
              </span>
            </div>
            <h2 className="font-[Space_Grotesk] text-[36px] leading-[44px] text-white tracking-tight font-extrabold">
              {allCreds.length} {t("Verified Credentials for Enterprise Trust.", "chứng chỉ đã xác minh.")}
            </h2>
            <p className="font-[Plus_Jakarta_Sans] text-[16px] leading-[26px] text-[#94a3b8]">
              {t(
                "Authentic digital badges and academic honors officially issued and verifiable online via Credly, Coursera, and HCM-UTE.",
                "Chứng chỉ số và thành tích học thuật được cấp chính thức, có thể xác minh qua Credly, Coursera và HCM-UTE.",
              )}
            </p>
          </div>
        </div>

        {/* 1. HORIZONTAL MARQUEE SLIDER (GLIDES CONTINUOUSLY ACROSS) */}
        <div className="relative w-full rounded-2xl bg-[#060911]/60 border border-[#1e293b] p-3 overflow-hidden shadow-2xl">
          <div className="marquee-container relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] py-2">
            <div className="animate-marquee flex gap-5 py-1">
              {marqueeCreds.map((cred, idx) => (
                <MarqueeCredentialCard key={`${cred.id}-${idx}`} cred={cred} />
              ))}
            </div>
          </div>
        </div>

        {/* 2. FILTER & DETAILED GRID VIEW */}
        <div className="flex flex-col space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-[JetBrains_Mono] text-[12px] text-[#94a3b8] uppercase font-bold tracking-wider">
                {t("FILTER BY DOMAIN:", "LỌC THEO LĨNH VỰC:")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#060911] border border-[#1e293b] max-w-full">
              {FILTER_TABS.map((tab) => {
                const isSelected = activeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-lg font-[JetBrains_Mono] text-[12px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]"
                        : "text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {tab.value === "all"
                      ? t("All", "Tất cả")
                      : tab.value === "industry"
                      ? t("Industry", "Doanh nghiệp")
                      : tab.value === "award"
                      ? t("Award", "Giải thưởng")
                      : tab.value === "academic"
                      ? t("Academic", "Học thuật")
                      : tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((cred) => (
              <CredentialGridCard key={cred.id} cred={cred} />
            ))}
          </div>

          {activeFilter === "all" && allCreds.length > 4 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowAllGrid(!showAllGrid)}
                className="px-5 py-2.5 rounded-xl bg-[#101827] border border-[#1e293b] hover:border-indigo-500/60 text-indigo-300 font-[JetBrains_Mono] text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer hover:bg-[#141d30]"
              >
                <span>{showAllGrid ? t("Show Less", "Thu gọn") : t(`View All (${allCreds.length}) Credentials`, `Xem tất cả (${allCreds.length}) chứng chỉ`)}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {showAllGrid ? "expand_less" : "expand_more"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
