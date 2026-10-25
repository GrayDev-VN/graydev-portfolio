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

function CredentialCard({ cred }: { cred: Credential }) {
  const { t } = useLocale();
  const color = categoryColors[cred.category] ?? "#818cf8";

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-[#0a0f1d] border border-[#1e293b] hover:border-indigo-500/50 transition-all duration-300 shadow-lg overflow-hidden relative hover:-translate-y-1">
      <div className="p-4 sm:p-5 flex flex-col space-y-4">
        {/* Certificate Visual Specimen */}
        <div className="relative w-full aspect-[4/3] rounded-xl bg-[#060911] border border-[#1e293b] overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span
              className="font-[JetBrains_Mono] text-[11px] font-bold tracking-wider uppercase"
              style={{ color }}
            >
              {cred.issuer.split(" ")[0]}
            </span>
            <span className="font-[JetBrains_Mono] text-[10px] px-2 py-0.5 rounded bg-[#0e1629] border border-[#1e293b] text-[#cbd5e1]">
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
              <span className="font-[JetBrains_Mono] text-[9.5px] text-[#94a3b8]">
                {typeof cred.hours === "string" && cred.hours.includes("hours")
                  ? `${t("Course completed", "Đã hoàn thành")}: ${cred.hours}`
                  : cred.hours}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[#64748b] font-[JetBrains_Mono] text-[9.5px] pt-1 border-t border-[#1e293b]/50">
            <span className="truncate max-w-[170px]">{cred.verifiedId}</span>
            <span className="font-semibold text-white px-1.5 py-0.5 rounded bg-[#152038]">{cred.year}</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col space-y-1">
          <h3 className="font-[Space_Grotesk] text-[17px] leading-[23px] text-white font-bold group-hover:text-indigo-300 transition-colors line-clamp-2">
            {cred.title}
          </h3>
          <p className="font-[Plus_Jakarta_Sans] text-[12px] leading-[18px] text-[#94a3b8] font-medium">
            {cred.issuer}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-5 py-3 bg-[#060911]/80 border-t border-[#1e293b] flex items-center justify-between">
        <span className="font-[JetBrains_Mono] text-[11px] text-[#64748b]">{cred.date}</span>
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
  const { t } = useLocale();

  const allCreds = PORTFOLIO_DATA.credentials;

  const filtered = activeFilter === "all"
    ? allCreds
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

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0a0f1d] border border-[#1e293b] max-w-full">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cred) => (
            <CredentialCard key={cred.id} cred={cred} />
          ))}
        </div>
      </div>
    </section>
  );
}
