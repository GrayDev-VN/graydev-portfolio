"use client";

import React from "react";
import { User, Target, ExternalLink, ShieldCheck, Terminal, Database, CheckCircle2 } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function AboutBento() {
  return (
    <section className="w-full pb-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Bento Card: Profile & Competencies */}
        <div className="lg:col-span-7 bg-[#110d1c] border border-[#30233f] rounded-xl p-7 lg:p-9 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#a78bfa]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-[#a78bfa]" />
              <span className="font-mono-code text-xs text-[#a78bfa] uppercase tracking-widest font-bold">
                ABOUT ME // CORE IDENTITY
              </span>
            </div>

            {/* Content: Portrait + Synopsis */}
            <div className="flex flex-col sm:flex-row gap-7 items-start mb-6">
              {/* Technical Avatar Box */}
              <div className="flex flex-col items-center gap-3 shrink-0 mx-auto sm:mx-0">
                <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-xl overflow-hidden bg-[#241a32] border border-[#30233f] relative shadow-inner group-hover:border-[#a78bfa]/60 transition-colors">
                  {/* Cyber Grid Interior Background */}
                  <div className="absolute inset-0 bg-[#080510] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#110d1c] border-2 border-[#a78bfa] flex items-center justify-center text-[#a78bfa] mb-2 shadow-[0_0_15px_rgba(167,139,250,0.3)]">
                      <Terminal className="w-8 h-8" />
                    </div>
                    <span className="font-display font-bold text-sm text-white">Gray Nguyen</span>
                    <span className="font-mono-code text-[10px] text-[#a78bfa]">AI Developer</span>
                    <span className="font-mono-code text-[9px] text-[#b5aec7] mt-1">Nguyên Đức Toàn</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080510] via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Telemetry Dots */}
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-4 rounded-full bg-[#a78bfa] transition-all"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#30233f]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#30233f]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#30233f]"></span>
                </div>
              </div>

              {/* Text Description */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl sm:text-2xl text-white font-bold leading-tight mb-4 tracking-tight">
                  Bringing artificial intelligence from learning and teaching into software development.
                </h3>
                <p className="text-sm sm:text-base text-[#b5aec7] leading-relaxed">
                  Gray Nguyen (Nguyên Đức Toàn) has experience as an AI Teaching Assistant, an AWS Intern,
                  and an AI Developer at <span className="text-white font-medium">SOFTWORLD</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Competency Badges */}
          <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-[#30233f]">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0b0814] border border-[#241a32] text-[#f1edfa] text-xs font-mono-code hover:text-[#a78bfa] hover:border-[#a78bfa]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>AI Teaching Assistant</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0b0814] border border-[#241a32] text-[#f1edfa] text-xs font-mono-code hover:text-[#c4b5fd] hover:border-[#c4b5fd]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c4b5fd]" />
              <span>AWS Intern</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0b0814] border border-[#241a32] text-[#f1edfa] text-xs font-mono-code hover:text-[#a78bfa] hover:border-[#a78bfa]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>SOFTWORLD AI Developer</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#0b0814] border border-[#241a32] text-[#f1edfa] text-xs font-mono-code hover:text-[#e879f9] hover:border-[#e879f9]/40 transition-all flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#e879f9]" />
              <span>AWS Cloud</span>
            </div>
          </div>
        </div>

        {/* Right Bento Card: Key Signals Telemetry */}
        <div className="lg:col-span-5 bg-[#110d1c] border border-[#30233f] rounded-xl p-7 lg:p-9 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#c4b5fd]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-4 h-4 text-[#a78bfa]" />
              <span className="font-mono-code text-xs text-[#a78bfa] uppercase tracking-widest font-bold">
                KEY SIGNALS // TELEMETRY
              </span>
            </div>

            {/* 2x2 Telemetry Matrix */}
            <div className="grid grid-cols-2 gap-3.5 mb-6">
              {PORTFOLIO_DATA.keySignals.map((signal) => (
                <div
                  key={signal.label}
                  className="bg-[#0b0814] border border-[#241a32] p-5 rounded-lg flex flex-col justify-between hover:bg-[#1a1426] hover:border-[#a78bfa]/30 transition-all"
                >
                  <div className="font-display text-3xl font-extrabold tracking-tight text-white mb-1">
                    {signal.value}
                  </div>
                  <div>
                    <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#b5aec7] font-semibold">
                      {signal.label}
                    </div>
                    <div className="font-mono-code text-[9px] text-[#a78bfa] mt-0.5">
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
            className="group w-full py-3.5 px-4 rounded-lg bg-[#0b0814] border border-[#241a32] hover:border-[#a78bfa] hover:bg-[#1a1426] flex items-center justify-between transition-all"
          >
            <span className="font-mono-code text-xs font-bold tracking-widest text-[#a78bfa] uppercase">
              CONNECT ON LINKEDIN
            </span>
            <ExternalLink className="w-4 h-4 text-[#a78bfa] transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Security Clearance & Scope Strip */}
      <div className="w-full mt-6 bg-[#110d1c]/70 border border-[#30233f] rounded-xl p-5 lg:p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#a78bfa] animate-ping"></span>
          <span className="font-mono-code text-xs uppercase tracking-wider text-white font-semibold">
            PRACTICE SCOPE &amp; ENTERPRISE STACK
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono-code text-xs text-[#b5aec7]">
          {PORTFOLIO_DATA.securityScopes.map((scope) => (
            <div key={scope.title} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></span>
              <span className="text-white font-medium">{scope.title}</span>
              {scope.desc && <span className="text-[#766b8e]">({scope.desc})</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
