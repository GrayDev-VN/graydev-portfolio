"use client";

import React from "react";
import { ArrowRight, Briefcase, Terminal, Sparkles, ShieldCheck } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

interface HeroSectionProps {
  onOpenAiConsole: () => void;
}

export default function HeroSection({ onOpenAiConsole }: HeroSectionProps) {
  return (
    <section id="about" className="pt-12 pb-16 lg:pt-16 lg:pb-24 w-full relative z-10">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#9ee939]/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-80 h-80 bg-[#7bd0ff]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl flex flex-col items-start text-left">
        {/* Salutation Pill */}
        <div className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#181b25] border border-[#262a34]">
          <span className="font-mono-code text-xs text-[#94a3b8] tracking-wider">
            Hi, I&apos;m <strong className="text-white font-bold tracking-widest uppercase">{PORTFOLIO_DATA.profile.name}</strong>
          </span>
          <span className="text-[#9ee939] font-mono-code text-xs font-bold">({PORTFOLIO_DATA.profile.handle})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#9ee939] animate-pulse"></span>
        </div>

        {/* Master Statement Header */}
        <div className="flex flex-col mb-6 select-none">
          <div className="flex items-baseline gap-2">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              GrayDev<span className="text-[#9ee939] inline-block font-extrabold">.</span>
            </h1>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9ee939] via-[#acf847] to-[#7bd0ff] mt-1">
            AI Backend &amp; Distributed Systems.
          </h2>
        </div>

        {/* Executive Subtitle */}
        <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl leading-relaxed mb-9">
          Data Engineering background from HCM-UTE and IT Audit Intern at{" "}
          <span className="text-white font-semibold">Deloitte Vietnam</span>. Bridging high-performance{" "}
          <span className="text-[#9ee939] font-medium">AI model serving (Python/LLM)</span>,{" "}
          <span className="text-[#7bd0ff] font-medium">Java Spring Boot microservices</span>, and{" "}
          <span className="text-[#fea518] font-medium">enterprise ITGC controls</span> for production-ready reliability.
        </p>

        {/* CTA Cluster */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group px-6 py-3.5 rounded-lg bg-[#9ee939] hover:bg-[#acf847] text-[#0a0e17] font-display text-sm font-bold tracking-wide flex items-center gap-2.5 transition-all shadow-[0_0_24px_rgba(158,233,57,0.35)] hover:shadow-[0_0_32px_rgba(158,233,57,0.5)] hover:-translate-y-0.5"
          >
            <span>View Systems &amp; Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="#career"
            className="px-6 py-3.5 rounded-lg bg-[#181b25] hover:bg-[#262a34] text-white border border-[#262a34] hover:border-[#9ee939]/50 font-display text-sm font-semibold tracking-wide flex items-center gap-2.5 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <Briefcase className="w-4 h-4 text-[#9ee939]" />
            <span>Explore Career Path</span>
          </a>

          <button
            onClick={onOpenAiConsole}
            className="px-5 py-3.5 rounded-lg bg-[#131b2c] hover:bg-[#18233c] text-[#7bd0ff] border border-[#7bd0ff]/30 font-mono-code text-xs font-bold tracking-wide flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-[#7bd0ff]" />
            <span>Test AI Terminal</span>
          </button>
        </div>
      </div>
    </section>
  );
}
