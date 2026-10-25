"use client";

import React from "react";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";
import {
  JavaIcon,
  SpringIcon,
  AwsIcon,
  DockerIcon,
  PostgresIcon,
  RedisIcon,
  KafkaIcon,
  PythonIcon,
  GitIcon,
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  MailIcon,
  TypeScriptIcon,
  PowerBIIcon,
} from "@/components/BrandIcons";

interface FrameworkItem {
  name: string;
  category: string;
  categoryVi: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
}

const HERO_FRAMEWORKS: FrameworkItem[] = [
  {
    name: "Spring Boot 3",
    category: "Enterprise Backend",
    categoryVi: "Backend Doanh nghiệp",
    icon: <SpringIcon size={18} className="text-emerald-400" />,
    color: "#34d399",
    bgGlow: "rgba(52,211,153,0.15)",
  },
  {
    name: "Java 17/21",
    category: "Core OOP & Streams",
    categoryVi: "Lập trình Hướng đối tượng Lõi",
    icon: <JavaIcon size={18} className="text-amber-400" />,
    color: "#fbbf24",
    bgGlow: "rgba(251,191,36,0.15)",
  },
  {
    name: "AWS Cloud",
    category: "S3 • Lambda • RDS",
    categoryVi: "S3 • Lambda • RDS Cloud",
    icon: <AwsIcon size={18} className="text-orange-400" />,
    color: "#fb923c",
    bgGlow: "rgba(251,146,60,0.15)",
  },
  {
    name: "PostgreSQL",
    category: "RDBMS & Indexing",
    categoryVi: "Cơ sở Dữ liệu & Đánh chỉ mục",
    icon: <PostgresIcon size={18} className="text-sky-400" />,
    color: "#38bdf8",
    bgGlow: "rgba(56,189,248,0.15)",
  },
  {
    name: "Redis",
    category: "Distributed Caching",
    categoryVi: "Bộ nhớ Đệm & Khóa Phân tán",
    icon: <RedisIcon size={18} className="text-rose-400" />,
    color: "#fb7185",
    bgGlow: "rgba(251,113,133,0.15)",
  },
  {
    name: "Docker",
    category: "Containers & Compose",
    categoryVi: "Ảo hóa Container & Compose",
    icon: <DockerIcon size={18} className="text-cyan-400" />,
    color: "#22d3ee",
    bgGlow: "rgba(34,211,238,0.15)",
  },
  {
    name: "Apache Kafka",
    category: "Event Streaming Pub/Sub",
    categoryVi: "Hàng đợi Phân tán Pub/Sub",
    icon: <KafkaIcon size={18} className="text-purple-400" />,
    color: "#c084fc",
    bgGlow: "rgba(192,132,252,0.15)",
  },
  {
    name: "Python",
    category: "AI, RAG & PyTorch",
    categoryVi: "AI, RAG & PyTorch",
    icon: <PythonIcon size={18} className="text-indigo-400" />,
    color: "#818cf8",
    bgGlow: "rgba(129,140,248,0.15)",
  },
  {
    name: "GitHub & Git",
    category: "CI/CD & Version Control",
    categoryVi: "CI/CD & Quản lý Mã nguồn",
    icon: <GithubIcon size={18} className="text-slate-200" />,
    color: "#e2e8f0",
    bgGlow: "rgba(226,232,240,0.15)",
  },
  {
    name: "TypeScript",
    category: "Fullstack Architecture",
    categoryVi: "Kiến trúc Web Fullstack",
    icon: <TypeScriptIcon size={18} className="text-blue-400" />,
    color: "#60a5fa",
    bgGlow: "rgba(96,165,250,0.15)",
  },
  {
    name: "Power BI",
    category: "Analytics & Data Modeling",
    categoryVi: "Phân tích & Trực quan Dữ liệu",
    icon: <PowerBIIcon size={18} className="text-amber-300" />,
    color: "#fcd34d",
    bgGlow: "rgba(252,211,77,0.15)",
  },
];

function HeroFrameworkPill({ item }: { item: FrameworkItem }) {
  const { locale } = useLocale();
  return (
    <div className="shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0a0f1d] border border-[#1e293b] hover:border-indigo-500/50 transition-all duration-300 shadow-md group hover:bg-[#0e1629] cursor-pointer">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/5"
        style={{ backgroundColor: item.bgGlow }}
      >
        {item.icon}
      </div>
      <div className="flex flex-col">
        <span className="font-[Space_Grotesk] text-[12px] font-bold text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
          {item.name}
        </span>
        <span className="font-[JetBrains_Mono] text-[9.5px] text-[#94a3b8] whitespace-nowrap">
          {locale === "vi" ? item.categoryVi : item.category}
        </span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { locale, t } = useLocale();

  // Duplicate for seamless right-to-left infinite loop
  const marqueeItems = [...HERO_FRAMEWORKS, ...HERO_FRAMEWORKS];

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Glow */}
      <div className="relative w-full overflow-x-clip">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* 1. HERO SECTION (WITH VISIBLE CIRCULAR AVATAR ABOVE THE FOLD) */}
        <section id="about" className="pt-6 pb-10 lg:pt-10 lg:pb-14 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Salutation, Title, Bio & CTAs */}
            <div className="lg:col-span-8 flex flex-col items-start text-left">
              {/* Salutation Tag */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-[JetBrains_Mono] text-[12px] text-[#94a3b8] tracking-wider">
                  {t("Hi, I’m ", "Xin chào, mình là ")}
                  <strong className="text-white font-semibold tracking-widest uppercase">
                    {PORTFOLIO_DATA.profile.name.toUpperCase()}
                  </strong>
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Master Statement */}
              <div className="flex flex-col mb-4 select-none">
                <h1 className="font-[Space_Grotesk] text-[46px] leading-[54px] sm:text-[56px] sm:leading-[64px] lg:text-[70px] lg:leading-[76px] tracking-tight text-white font-extrabold">
                  {PORTFOLIO_DATA.profile.name}<span className="text-indigo-400 inline-block font-extrabold">.</span>
                </h1>
                <h2 className="font-[Space_Grotesk] text-[34px] leading-[40px] sm:text-[44px] sm:leading-[52px] lg:text-[58px] lg:leading-[64px] tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#94a3b8] via-[#cbd5e1] to-[#64748b]">
                  {locale === "vi" ? (
                    <>Kỹ sư AI <span className="font-[Plus_Jakarta_Sans] inline-block font-bold">&amp;</span> Backend.</>
                  ) : (
                    <>AI <span className="font-[Plus_Jakarta_Sans] inline-block font-bold">&amp;</span> Backend Engineer.</>
                  )}
                </h2>
              </div>

              {/* Subtitle / Bio */}
              <p className="font-[Plus_Jakarta_Sans] text-[16px] sm:text-[17px] leading-[28px] text-[#94a3b8] max-w-2xl mb-7">
                {t(
                  "AI Developer at SOFTWORLD, former AWS Intern, and AI Teaching Assistant. I’m Gray Nguyen (Nguyễn Đức Toàn), crafting resilient backend architectures, Fintech transaction cores, and applied AI systems.",
                  "Lập trình viên AI tại SOFTWORLD, cựu Thực tập sinh AWS và Trợ giảng AI. Mình là Gray Nguyen (Nguyễn Đức Toàn), chuyên xây dựng kiến trúc backend ngân hàng, xử lý giao dịch lõi và ứng dụng AI thực tế.",
                )}
              </p>

              {/* CTA Cluster */}
              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/projects"
                  className="group px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-[JetBrains_Mono] text-[13px] font-bold tracking-wide flex items-center gap-2 transition-all shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_32px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
                >
                  <span>{t("View Projects", "Xem dự án")}</span>
                  <span className="material-symbols-outlined text-[17px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/career"
                  className="px-5 py-3 rounded-xl bg-[#0a0f1d] hover:bg-[#152038] border border-[#1e293b] text-white font-[JetBrains_Mono] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-indigo-400 text-[17px]">
                    business_center
                  </span>
                  <span>{t("Career Path", "Hành trình nghề nghiệp")}</span>
                </Link>
                <Link
                  href="/blog"
                  className="px-5 py-3 rounded-xl bg-[#0a0f1d] hover:bg-[#152038] border border-[#1e293b] text-[#cbd5e1] hover:text-white font-[JetBrains_Mono] text-[13px] font-semibold tracking-wide flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sky-400 text-[17px]">
                    menu_book
                  </span>
                  <span>{t("Blog & Roadmaps", "Đọc Blog & Lộ trình")}</span>
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: CIRCULAR PORTRAIT (VISIBLE IMMEDIATELY ON FIRST SCREEN) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative group/avatar">
                {/* Ambient glow backdrop */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-indigo-600 opacity-40 blur-xl group-hover/avatar:opacity-60 transition duration-500" />
                
                {/* Glowing Circular Ring */}
                <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-indigo-600 shadow-[0_0_35px_rgba(99,102,241,0.35)] group-hover/avatar:shadow-[0_0_50px_rgba(99,102,241,0.55)] transition-all duration-500">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-full overflow-hidden bg-[#070a13] border-4 border-[#070a13] relative">
                    <img
                      src="/avatar.jpg"
                      alt="Gray Nguyen (Nguyễn Đức Toàn) Profile"
                      className="w-full h-full object-cover object-top contrast-[1.04] transition-transform duration-500 group-hover/avatar:scale-105"
                    />
                  </div>
                  {/* Status Beacon */}
                  <span
                    className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#070a13] shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse"
                    title="Active / Available"
                  />
                </div>
              </div>

              {/* Profile Card Underneath Avatar */}
              <div className="mt-4 text-center font-[JetBrains_Mono] flex flex-col items-center">
                <div className="text-[15px] font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>Gray Nguyen</span>
                  <span className="text-indigo-400">•</span>
                  <span className="text-[#cbd5e1] font-normal">Nguyễn Đức Toàn</span>
                </div>
                <div className="text-[12px] text-[#94a3b8] flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[15px] text-indigo-400">location_on</span>
                  <span>Ho Chi Minh City, Vietnam</span>
                </div>
                {/* Fast Highlights */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0a0f1d] border border-[#1e293b] text-[#cbd5e1] text-[10.5px]">
                    SOFTWORLD AI Dev
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0a0f1d] border border-[#1e293b] text-[#cbd5e1] text-[10.5px]">
                    AWS Cloud Intern
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0a0f1d] border border-[#1e293b] text-[#cbd5e1] text-[10.5px]">
                    AI TA HCM-UTE
                  </span>
                </div>

                {/* Social Connect Cluster */}
                <div className="flex items-center gap-2 mt-3.5">
                  <a
                    href={PORTFOLIO_DATA.profile.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub Profile"
                    className="w-8 h-8 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-indigo-500/50 hover:bg-[#152038] transition-all"
                  >
                    <GithubIcon size={15} />
                  </a>
                  <a
                    href={PORTFOLIO_DATA.profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn Profile"
                    className="w-8 h-8 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-indigo-500/50 hover:bg-[#152038] transition-all"
                  >
                    <LinkedinIcon size={15} />
                  </a>
                  <a
                    href={PORTFOLIO_DATA.profile.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook Profile"
                    className="w-8 h-8 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#1877F2] hover:border-blue-500/50 hover:bg-[#152038] transition-all"
                  >
                    <FacebookIcon size={15} />
                  </a>
                  <a
                    href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                    aria-label="Email Contact"
                    className="w-8 h-8 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-[#152038] transition-all"
                  >
                    <MailIcon size={15} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. CONTINUOUS HORIZONTAL MARQUEE TICKER: FRAMEWORKS & SKILLS (RIGHT TO LEFT) DIRECTLY UNDER INTRO */}
        <section className="w-full mb-12 relative z-10">
          <div className="w-full rounded-2xl bg-[#0a0f1d]/90 border border-[#1e293b] p-3.5 sm:p-4 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#1e293b] text-[11px] font-[JetBrains_Mono]">
              <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[17px]">terminal</span>
                <span>{t("CORE FRAMEWORKS & SKILLS STREAM", "DÒNG CHẢY FRAMEWORK & KỸ NĂNG CHỦ LỰC")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-[JetBrains_Mono] text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE</span>
              </div>
            </div>

            {/* Continuous Marquee (translates 0% to -50% -> glides from right to left) */}
            <div className="marquee-container relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] py-1">
              <div className="animate-marquee flex gap-3.5 py-1">
                {marqueeItems.map((item, idx) => (
                  <HeroFrameworkPill key={`hero-marquee-${item.name}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ABOUT ARCHITECTURAL PHILOSOPHY & CAPABILITIES */}
        <section className="w-full pb-14 relative z-10">
          <div className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-[#1e293b]/70">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-[18px]">verified_user</span>
                <span className="font-[JetBrains_Mono] text-[11px] text-indigo-400 uppercase tracking-widest font-bold">
                  {t("ARCHITECTURAL FOCUS & COMMITMENT", "ĐỊNH HƯỚNG KIẾN TRÚC & CAM KẾT")}
                </span>
              </div>
              <span className="font-[JetBrains_Mono] text-[12px] text-[#64748b]">/ SYS_IDENTITY_V4</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 flex flex-col space-y-4">
                <h3 className="font-[Space_Grotesk] text-[22px] sm:text-[26px] leading-[34px] text-white font-extrabold tracking-tight">
                  {t(
                    "Engineering resilient backend systems and applied AI software solutions with zero-compromise reliability.",
                    "Xây dựng hệ thống backend chịu tải cao và giải pháp AI ứng dụng với tiêu chuẩn tin cậy tuyệt đối.",
                  )}
                </h3>
                <p className="font-[Plus_Jakarta_Sans] text-[15px] sm:text-[16px] leading-[28px] text-[#94a3b8]">
                  {t(
                    "Focused on enterprise-grade software architecture, concurrent transaction processing, and practical LLM integration with production readiness. Passionate about clean domain boundaries, idempotent message pipelines, reliable database schemas, and observable cloud infrastructures.",
                    "Tập trung vào kiến trúc phần mềm tiêu chuẩn doanh nghiệp, xử lý giao dịch đồng thời và tích hợp mô hình ngôn ngữ lớn vào quy trình thực tế. Đam mê thiết kế ranh giới nghiệp vụ sạch sẽ, pipeline thông điệp bất biến, lược đồ cơ sở dữ liệu bền vững và hạ tầng đám mây có khả năng quan sát toàn diện.",
                  )}
                </p>
              </div>

              {/* Highlights & Security Scopes */}
              <div className="lg:col-span-4 flex flex-col space-y-3 p-4 rounded-xl bg-[#070a13] border border-[#1e293b]">
                <span className="font-[JetBrains_Mono] text-[10px] uppercase tracking-wider text-indigo-300 font-bold">
                  {t("KEY TECHNICAL PILLARS", "CÁC TRỤ CỘT KỸ THUẬT")}
                </span>
                <div className="space-y-2 pt-1 font-[JetBrains_Mono] text-[12px] text-[#cbd5e1]">
                  {PORTFOLIO_DATA.securityScopes.map((s) => (
                    <div key={s.title} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[15px]">check_circle</span>
                      <span>{locale === "vi" ? s.titleVi : s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
