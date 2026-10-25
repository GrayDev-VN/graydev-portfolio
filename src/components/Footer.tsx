import React from "react";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="w-full bg-[#060911] border-t border-[#1e293b] relative z-10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-[Space_Grotesk] text-[20px] leading-[28px] font-bold text-white">
              {PORTFOLIO_DATA.profile.name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span className="font-[JetBrains_Mono] text-[11px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              {t("AI & BACKEND", "AI & BACKEND")}
            </span>
          </div>
          <p className="font-[Plus_Jakarta_Sans] text-[13px] leading-[20px] text-[#94a3b8]">
            {t("Fintech backends, cloud engineering, and applied AI software.", "Backend ngân hàng, kỹ thuật cloud và phát triển ứng dụng AI.")}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-[JetBrains_Mono] text-[12px] text-[#94a3b8]">
          <Link href="/" className="hover:text-white transition-colors">{t("ABOUT", "GIỚI THIỆU")}</Link>
          <Link href="/career" className="hover:text-white transition-colors">{t("CAREER", "SỰ NGHIỆP")}</Link>
          <Link href="/projects" className="hover:text-white transition-colors">{t("PROJECTS", "DỰ ÁN")}</Link>
          <Link href="/blog" className="hover:text-white transition-colors">BLOG</Link>
          <Link href="/credentials" className="hover:text-white transition-colors">{t("CREDENTIALS", "CHỨNG CHỈ")}</Link>
          <Link href="/credentials#contact" className="hover:text-white transition-colors">{t("CONTACT", "LIÊN HỆ")}</Link>
        </div>

        {/* Copyright */}
        <div className="font-[JetBrains_Mono] text-[11px] text-[#64748b] text-center md:text-right">
          © 2026 {PORTFOLIO_DATA.profile.name} ({PORTFOLIO_DATA.profile.realName}).
        </div>
      </div>
    </footer>
  );
}
