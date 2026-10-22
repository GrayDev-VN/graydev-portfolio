"use client";

import React from "react";
import { User, Target, ExternalLink, ShieldCheck, Terminal, Database, CheckCircle2 } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function AboutBento() {
  return (
    <section className="w-full pb-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Bento Card: Profile & Competencies */}
        <div className="lg:col-span-7 bg-[#181b25] border border-[#1e293b] rounded-xl p-7 lg:p-9 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#9ee939]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-[#9ee939]" />
              <span className="font-mono-code text-xs text-[#9ee939] uppercase tracking-widest font-bold">
                ABOUT ME // CORE IDENTITY
              </span>
            </div>

            {/* Content: Portrait + Synopsis */}
            <div className="flex flex-col sm:flex-row gap-7 items-start mb-6">
              {/* Technical Avatar Box */}
              <div className="flex flex-col items-center gap-3 shrink-0 mx-auto sm:mx-0">
                <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-xl overflow-hidden bg-[#262a34] border border-[#31353f] relative shadow-inner group-hover:border-[#9ee939]/60 transition-colors">
                  {/* Cyber Grid Interior Background */}
                  <div className="absolute inset-0 bg-[#0a0e17] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#181b25] border-2 border-[#9ee939] flex items-center justify-center text-[#9ee939] mb-2 shadow-[0_0_15px_rgba(158,233,57,0.3)]">
                      <Terminal className="w-8 h-8" />
                    </div>
                    <span className="font-display font-bold text-sm text-white">GrayDev</span>
                    <span className="font-mono-code text-[10px] text-[#9ee939]">AI Backend</span>
                    <span className="font-mono-code text-[9px] text-[#94a3b8] mt-1">HCM-UTE / Deloitte</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Telemetry Dots */}
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-4 rounded-full bg-[#9ee939] transition-all"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#31353f]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#31353f]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#31353f]"></span>
                </div>
              </div>

              {/* Text Description */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl sm:text-2xl text-white font-bold leading-tight mb-4 tracking-tight">
                  Applying Data Engineering &amp; AI foundations to enterprise backend systems.
                </h3>
                <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                  Final-year Data Engineering student at HCM-UTE with hands-on proficiency in{" "}
                  <span className="text-[#fea518] font-medium">database systems</span>, distributed data pipelines, and
                  AI model serving. Concurrently working as an IT Audit Intern at{" "}
                  <span className="text-white font-medium">Deloitte Vietnam</span>, focusing on IT General Controls (ITGC),
                  system workflows, and audit analytics.
                </p>
              </div>
            </div>
          </div>

          {/* Competency Badges */}
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-[#1e293b]">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0f131c] border border-[#262a34] text-[#dfe2ef] text-xs font-mono-code hover:text-[#9ee939] hover:border-[#9ee939]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#9ee939]" />
              <span>AI Backend &amp; LLMs</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0f131c] border border-[#262a34] text-[#dfe2ef] text-xs font-mono-code hover:text-[#7bd0ff] hover:border-[#7bd0ff]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7bd0ff]" />
              <span>Java Spring Boot</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0f131c] border border-[#262a34] text-[#dfe2ef] text-xs font-mono-code hover:text-[#9ee939] hover:border-[#9ee939]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#9ee939]" />
              <span>ITGC &amp; Enterprise Controls</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0f131c] border border-[#262a34] text-[#dfe2ef] text-xs font-mono-code hover:text-[#fea518] hover:border-[#fea518]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#fea518]" />
              <span>Data Warehousing (BigQuery)</span>
            </div>
          </div>
        </div>

        {/* Right Bento Card: Key Signals Telemetry */}
        <div className="lg:col-span-5 bg-[#181b25] border border-[#1e293b] rounded-xl p-7 lg:p-9 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#7bd0ff]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-4 h-4 text-[#9ee939]" />
              <span className="font-mono-code text-xs text-[#9ee939] uppercase tracking-widest font-bold">
                KEY SIGNALS // TELEMETRY
              </span>
            </div>

            {/* 2x2 Telemetry Matrix */}
            <div className="grid grid-cols-2 gap-3.5 mb-6">
              {PORTFOLIO_DATA.keySignals.map((signal) => (
                <div
                  key={signal.label}
                  className="bg-[#0f131c] border border-[#262a34] p-5 rounded-lg flex flex-col justify-between hover:bg-[#1c1f29] hover:border-[#9ee939]/30 transition-all"
                >
                  <div className="font-display text-3xl font-extrabold tracking-tight text-white mb-1">
                    {signal.value}
                  </div>
                  <div>
                    <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">
                      {signal.label}
                    </div>
                    <div className="font-mono-code text-[9px] text-[#9ee939] mt-0.5">
                      {signal.highlight}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LinkedIn Profile Action Link */}
          <a
            href={PORTFOLIO_DATA.profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group w-full py-3.5 px-4 rounded-lg bg-[#0f131c] border border-[#262a34] hover:border-[#9ee939] hover:bg-[#1c1f29] flex items-center justify-between transition-all"
          >
            <span className="font-mono-code text-xs font-bold tracking-widest text-[#9ee939] uppercase">
              CONNECT ON LINKEDIN
            </span>
            <ExternalLink className="w-4 h-4 text-[#9ee939] transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Security Clearance & Scope Strip */}
      <div className="w-full mt-6 bg-[#181b25]/70 border border-[#1e293b] rounded-xl p-5 lg:p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#9ee939] animate-ping"></span>
          <span className="font-mono-code text-xs uppercase tracking-wider text-white font-semibold">
            PRACTICE SCOPE &amp; ENTERPRISE STACK
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono-code text-xs text-[#94a3b8]">
          {PORTFOLIO_DATA.securityScopes.map((scope) => (
            <div key={scope.title} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9ee939]"></span>
              <span className="text-white font-medium">{scope.title}</span>
              <span className="text-[#64748b]">({scope.desc})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
