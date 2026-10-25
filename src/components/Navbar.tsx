"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Facebook, Mail } from "@/components/BrandIcons";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";

interface NavbarProps {
  activeSection?: string;
}

const navLinks = [
  { label: "ABOUT", labelVi: "GIỚI THIỆU", href: "/#about", section: "about" },
  { label: "CAREER", labelVi: "SỰ NGHIỆP", href: "/#career", section: "career" },
  { label: "PROJECTS", labelVi: "DỰ ÁN", href: "/#projects", section: "projects" },
  { label: "BLOG", labelVi: "BLOG", href: "/blog", section: "blog" },
  { label: "CREDENTIALS", labelVi: "CHỨNG CHỈ", href: "/#credentials", section: "credentials" },
  { label: "CONTACT", labelVi: "LIÊN HỆ", href: "/#contact", section: "contact" },
];

export default function Navbar({ activeSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, toggleLocale, t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all border-b ${
        scrolled
          ? "bg-[#080c15]/95 backdrop-blur-xl border-[#1e293b] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          : "bg-[#080c15]/85 backdrop-blur-xl border-transparent"
      }`}
    >
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="font-[Space_Grotesk] text-[22px] sm:text-[24px] leading-tight font-extrabold tracking-tight text-white">
            {PORTFOLIO_DATA.profile.name}
          </span>
          <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)] group-hover:scale-125 transition-transform" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0c121f]/90 border border-[#1e293b] backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.section;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3.5 py-1.5 font-[JetBrains_Mono] text-[12px] tracking-wider uppercase transition-all rounded-lg ${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "text-[#94a3b8] hover:text-white hover:bg-[#141d30]"
                }`}
              >
                {t(link.label, link.labelVi)}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <Link
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="w-9 h-9 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-indigo-500/50 hover:bg-[#141d30] transition-all"
            >
              <Github aria-hidden="true" size={17} />
            </Link>
            <a
              href={PORTFOLIO_DATA.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="w-9 h-9 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-indigo-500/50 hover:bg-[#141d30] transition-all"
            >
              <Linkedin aria-hidden="true" size={17} />
            </a>
            <a
              href={PORTFOLIO_DATA.profile.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Profile"
              className="w-9 h-9 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#1877F2] hover:border-blue-500/50 hover:bg-[#141d30] transition-all"
            >
              <Facebook aria-hidden="true" size={17} />
            </a>
            <a
              href={`mailto:${PORTFOLIO_DATA.profile.email}`}
              aria-label="Email Contact"
              className="w-9 h-9 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-[#141d30] transition-all"
            >
              <Mail aria-hidden="true" size={17} />
            </a>
          </div>

          <div className="h-4 w-px bg-[#1e293b] hidden sm:block mx-1" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t("Switch to Vietnamese", "Chuyển sang tiếng Anh")}
              className="px-2.5 py-1.5 rounded-lg bg-[#0c121f] border border-[#1e293b] text-[#cbd5e1] hover:text-white hover:border-indigo-500/50 hover:bg-[#141d30] text-[11px] font-[JetBrains_Mono] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-indigo-400">language</span>
              <span>{locale.toUpperCase()}</span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080c15] border-b border-[#1e293b] px-6 py-5 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-[JetBrains_Mono] font-semibold tracking-wider transition-colors ${
                activeSection === link.section
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-[#0c121f] text-white hover:text-indigo-300 hover:bg-[#141d30]"
              }`}
            >
              {t(link.label, link.labelVi)}
            </Link>
          ))}

          {/* Mobile Social Links */}
          <div className="grid grid-cols-4 gap-2 pt-3 mt-1 border-t border-[#1e293b]">
            <Link
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="py-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white"
            >
              <Github size={17} />
            </Link>
            <a
              href={PORTFOLIO_DATA.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="py-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={PORTFOLIO_DATA.profile.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Profile"
              className="py-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#1877F2]"
            >
              <Facebook size={17} />
            </a>
            <a
              href={`mailto:${PORTFOLIO_DATA.profile.email}`}
              aria-label="Email Contact"
              className="py-2.5 rounded-lg bg-[#0c121f] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-emerald-400"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
