"use client";

import React from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";
import { getTechIcon } from "@/components/BrandIcons";
import { formatWithAmpersand } from "@/components/CleanAmpersand";

export default function CareerSection() {
  const { locale, t } = useLocale();

  const accentColors: Record<number, { primary: string; icon: string; lineClass: string; accentHex: string }> = {
    0: { primary: "#818cf8", icon: "text-indigo-400", lineClass: "bg-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.7)]", accentHex: "#818cf8" },
    1: { primary: "#38bdf8", icon: "text-sky-400", lineClass: "bg-sky-500 shadow-[0_0_16px_rgba(56,189,248,0.7)]", accentHex: "#38bdf8" },
    2: { primary: "#34d399", icon: "text-emerald-400", lineClass: "bg-emerald-500 shadow-[0_0_16px_rgba(52,211,153,0.7)]", accentHex: "#34d399" },
  };

  return (
    <section id="career" className="w-full pb-20 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#152038] border border-[#1e293b] text-indigo-400 font-[JetBrains_Mono] text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("PROFESSIONAL TRAJECTORY", "HÀNH TRÌNH CHUYÊN MÔN")}
          </span>
          <span className="font-[JetBrains_Mono] text-[13px] text-[#64748b]">/ SYS_EXP_V4.2</span>
        </div>
        <h2 className="font-[Space_Grotesk] text-[36px] leading-[44px] lg:text-[52px] lg:leading-[60px] font-extrabold tracking-tight text-white">
          {formatWithAmpersand(t("Work Experience & Track Record", "Kinh nghiệm làm việc & Vai trò chuyên môn"))}
        </h2>
        <p className="font-[Plus_Jakarta_Sans] text-[17px] leading-[28px] text-[#94a3b8] max-w-3xl">
          {t(
            "Hands-on production background spanning AI Development at SOFTWORLD, an AWS Cloud Internship, and AI Teaching Assistance at HCM-UTE.",
            "Kinh nghiệm thực tiễn từ phát triển AI tại SOFTWORLD, thực tập điện toán đám mây AWS và hỗ trợ giảng dạy AI tại HCM-UTE.",
          )}
        </p>
      </div>

      {/* Telemetry Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#0a0f1d] border border-[#1e293b] shadow-sm mb-10">
        {[
          { micro: t("AI DEVELOPMENT", "PHÁT TRIỂN AI"), val: "SOFTWORLD", sub: t("AI Developer", "Lập trình viên AI"), color: "text-emerald-400" },
          { micro: t("CLOUD INFRA", "ĐIỆN TOÁN ĐÁM MÂY"), val: "AWS", sub: t("Cloud Intern", "Thực tập sinh Cloud"), color: "text-sky-400" },
          { micro: t("AI EDUCATION", "GIÁO DỤC AI"), val: "HCM-UTE", sub: t("Teaching Assistant", "Trợ giảng"), color: "text-indigo-400" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col p-4 rounded-xl bg-[#0e1629] border border-[#1e293b]">
            <span className="font-[JetBrains_Mono] text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">{item.micro}</span>
            <span className={`font-[Space_Grotesk] text-[20px] leading-[28px] font-bold ${item.color} mt-1 flex items-center gap-1.5`}>
              {item.val}
            </span>
            <span className="font-[JetBrains_Mono] text-[11px] mt-0.5 text-[#94a3b8]">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Experience Cards */}
      <div className="flex flex-col space-y-8">
        {PORTFOLIO_DATA.career.map((role, idx) => {
          const accent = accentColors[idx] ?? accentColors[0];
          const responsibilities = locale === "vi" && role.responsibilitiesVi && role.responsibilitiesVi.length > 0
            ? role.responsibilitiesVi
            : role.responsibilities;

          return (
            <div
              key={role.company + idx}
              className="relative group rounded-2xl bg-[#0a0f1d] border border-[#1e293b] hover:border-slate-600 shadow-xl overflow-hidden transition-all duration-300"
            >
              {/* Left Accent Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${accent.lineClass}`} />

              <div className="p-6 lg:p-8 pl-8 lg:pl-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: Metadata */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-md font-[JetBrains_Mono] text-[11px] uppercase tracking-wider font-bold bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                    >
                      {formatWithAmpersand(locale === "vi" ? role.categoryVi ?? role.category : role.category)}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-md font-[JetBrains_Mono] text-[11px] flex items-center gap-1 bg-[#0e1629] border border-[#1e293b] text-indigo-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {locale === "vi" ? role.statusBadgeVi ?? role.statusBadge : role.statusBadge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-[Space_Grotesk] text-[24px] sm:text-[26px] leading-[32px] font-bold text-white tracking-tight">
                      {locale === "vi" ? role.roleVi ?? role.role : role.role}
                    </h3>
                    <div className="flex flex-col">
                      <span className={`font-[Plus_Jakarta_Sans] text-[18px] font-bold ${accent.icon}`}>{role.company}</span>
                      <span className="font-[Plus_Jakarta_Sans] text-[13px] text-[#94a3b8]">
                        {formatWithAmpersand(locale === "vi" ? role.divisionVi ?? role.division : role.division)}
                      </span>
                    </div>
                  </div>

                  {(role.period || role.location || role.scope) && (
                    <div className="pt-2 flex flex-col space-y-2 text-[#94a3b8] font-[JetBrains_Mono] text-[12px]">
                      {role.period && (
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[16px] ${accent.icon}`}>calendar_today</span>
                          <span>{role.period}</span>
                        </div>
                      )}
                      {role.location && (
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[16px] ${accent.icon}`}>location_on</span>
                          <span>{locale === "vi" ? role.locationVi ?? role.location : role.location}</span>
                        </div>
                      )}
                      {role.scope && (
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[16px] ${accent.icon}`}>tune</span>
                          <span>{formatWithAmpersand(locale === "vi" ? role.scopeVi ?? role.scope : role.scope)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT: Synopsis & Responsibilities */}
                <div className="lg:col-span-7 flex flex-col space-y-5">
                  <p className="font-[Plus_Jakarta_Sans] text-[15px] leading-[26px] text-[#cbd5e1] bg-[#0e1629] border border-[#1e293b] p-5 rounded-xl">
                    {locale === "vi" ? role.descriptionVi ?? role.description : role.description}
                  </p>

                  {responsibilities && responsibilities.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-[JetBrains_Mono] text-[11px] uppercase tracking-wider font-bold text-indigo-400"
                        >
                          {t("KEY RESPONSIBILITIES:", "TRÁCH NHIỆM CHÍNH:")}
                        </span>
                        <div className="h-px flex-1 bg-[#1e293b]" />
                      </div>
                      <ul className="space-y-2.5 font-[Plus_Jakarta_Sans] text-[13px] leading-[22px] text-[#94a3b8]">
                        {responsibilities.map((r, ri) => (
                          <li key={ri} className="flex items-start gap-3">
                            <span
                              className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${accent.icon}`}
                            >
                              check_circle
                            </span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills with Brand Icons */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {role.skills.map((sk) => {
                      const iconNode = getTechIcon(sk, 14, "shrink-0");
                      return (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141d30] border border-[#1e293b] font-[JetBrains_Mono] text-[11px] text-[#cbd5e1] hover:border-indigo-400/50 hover:text-white transition-all cursor-default"
                        >
                          {iconNode}
                          <span>{sk}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
