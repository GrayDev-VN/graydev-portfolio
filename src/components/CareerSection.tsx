"use client";

import React from "react";
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Award,
  Layers
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function CareerSection() {
  return (
    <section id="career" className="w-full pb-20 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col space-y-3 mb-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a34] text-[#9ee939] font-mono-code text-xs uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ee939] animate-pulse"></span>
            Audit &amp; Governance Timeline
          </span>
          <span className="font-mono-code text-xs text-[#94a3b8]">/ SYS_EXP_V4.2</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Work Experience
        </h2>
        <p className="text-base text-[#94a3b8] max-w-3xl leading-relaxed">
          Professional experience spanning IT audit &amp; internal controls at Big 4 (Deloitte Vietnam), software systems planning &amp; schema architecture, and academic instruction.
        </p>
      </div>

      {/* Telemetry Filter / Quick Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#181b25] border border-[#1e293b] mb-10 shadow-sm">
        <div className="flex flex-col p-3.5 rounded-lg bg-[#0f131c] border border-[#262a34]">
          <span className="font-mono-code text-[10px] text-[#94a3b8] uppercase tracking-wider">Active Domain</span>
          <span className="font-display text-lg font-bold text-[#9ee939] mt-1">IT Audit &amp; AI</span>
          <span className="font-mono-code text-[11px] text-[#94a3b8] mt-0.5">Assurance &amp; Systems</span>
        </div>
        <div className="flex flex-col p-3.5 rounded-lg bg-[#0f131c] border border-[#262a34]">
          <span className="font-mono-code text-[10px] text-[#94a3b8] uppercase tracking-wider">Enterprise Framework</span>
          <span className="font-display text-lg font-bold text-[#7bd0ff] mt-1">Big 4</span>
          <span className="font-mono-code text-[11px] text-[#94a3b8] mt-0.5">Deloitte Vietnam</span>
        </div>
        <div className="flex flex-col p-3.5 rounded-lg bg-[#0f131c] border border-[#262a34]">
          <span className="font-mono-code text-[10px] text-[#94a3b8] uppercase tracking-wider">Scope Coverage</span>
          <span className="font-display text-lg font-bold text-[#fea518] mt-1">SOX / ITGC</span>
          <span className="font-mono-code text-[11px] text-[#94a3b8] mt-0.5">5+ Core Controls</span>
        </div>
        <div className="flex flex-col p-3.5 rounded-lg bg-[#0f131c] border border-[#262a34]">
          <span className="font-mono-code text-[10px] text-[#94a3b8] uppercase tracking-wider">Verification Level</span>
          <span className="font-display text-lg font-bold text-white flex items-center gap-1.5 mt-1">
            Level 3
            <ShieldCheck className="w-4 h-4 text-[#9ee939]" />
          </span>
          <span className="font-mono-code text-[11px] text-[#9ee939] mt-0.5">Fully Documented</span>
        </div>
      </div>

      {/* Main Experience Cards List */}
      <div className="flex flex-col space-y-8">
        {PORTFOLIO_DATA.career.map((item, index) => {
          const isDeloitte = item.company.includes("Deloitte");
          const isBA = item.company.includes("Freelance");

          return (
            <div
              key={item.company + item.role}
              className="relative group rounded-xl bg-[#181b25] border border-[#1e293b] shadow-md overflow-hidden transition-all duration-300 hover:border-[#26354d]"
            >
              {/* Left Accent Stripe */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isDeloitte
                    ? "bg-[#9ee939] shadow-[0_0_16px_rgba(158,233,57,0.7)]"
                    : isBA
                    ? "bg-[#7bd0ff] shadow-[0_0_16px_rgba(123,208,255,0.5)]"
                    : "bg-[#fea518]"
                }`}
              ></div>

              <div className="p-6 lg:p-8 pl-8 lg:pl-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Sub-Pane: Metadata & Role Identity */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded font-mono-code text-xs uppercase tracking-wider font-bold ${
                        isDeloitte
                          ? "bg-[#9ee939] text-[#0a0e17] shadow-[0_0_12px_rgba(158,233,57,0.3)]"
                          : "bg-[#262a34] text-white"
                      }`}
                    >
                      {item.company}
                    </span>

                    {item.isCurrent ? (
                      <span className="px-2.5 py-1 rounded bg-[#262a34] text-[#9ee939] font-mono-code text-xs flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9ee939] animate-ping"></span>
                        {item.statusBadge}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-[#0f131c] text-[#94a3b8] font-mono-code text-xs border border-[#262a34]">
                        {item.statusBadge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                      {item.role}
                    </h3>
                    <div className="flex flex-col">
                      <span
                        className={`font-display text-base font-semibold ${
                          isDeloitte ? "text-[#9ee939]" : isBA ? "text-[#7bd0ff]" : "text-[#fea518]"
                        }`}
                      >
                        {item.company}
                      </span>
                      <span className="text-xs text-[#94a3b8]">{item.division}</span>
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="pt-2 flex flex-col space-y-2 text-[#94a3b8] font-mono-code text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#9ee939]" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#7bd0ff]" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#fea518]" />
                      <span>{item.scope}</span>
                    </div>
                  </div>

                  {/* Mini Framework Telemetry Box */}
                  {item.frameworkScore && (
                    <div className="mt-4 p-3.5 rounded-lg bg-[#0f131c] border border-[#262a34] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#9ee939]" />
                        <div className="flex flex-col">
                          <span className="font-mono-code text-[10px] uppercase text-[#94a3b8]">Framework Adherence</span>
                          <span className="font-mono-code text-xs text-white font-semibold">{item.frameworkScore.name}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#262a34] font-mono-code text-xs font-bold text-[#9ee939]">
                        {item.frameworkScore.scoreLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Sub-Pane: Detailed Responsibilities & Skills */}
                <div className="lg:col-span-7 flex flex-col space-y-5">
                  <p className="text-sm sm:text-base text-white bg-[#0f131c] border border-[#262a34] p-4 rounded-lg leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono-code text-xs uppercase tracking-wider font-bold ${
                          isDeloitte ? "text-[#9ee939]" : isBA ? "text-[#7bd0ff]" : "text-[#fea518]"
                        }`}
                      >
                        KEY RESPONSIBILITIES:
                      </span>
                      <div className="h-px flex-1 bg-[#262a34]"></div>
                    </div>

                    <ul className="space-y-2.5 text-xs sm:text-sm text-[#94a3b8]">
                      {item.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isDeloitte ? "text-[#9ee939]" : isBA ? "text-[#7bd0ff]" : "text-[#fea518]"
                            }`}
                          />
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills Badges */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded bg-[#262a34] text-white font-mono-code text-xs hover:bg-[#31353f] hover:text-[#9ee939] transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Trace Terminal Log Strip */}
      <div className="mt-10 rounded-xl bg-[#0a0e17] border border-[#1e293b] p-6 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e293b] mb-4">
          <div className="flex items-center gap-2 font-mono-code text-xs text-[#9ee939] font-bold">
            <Terminal className="w-4 h-4" />
            <span>VERIFICATION_TRACE_LOG.SH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#262a34]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#262a34]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#9ee939] animate-pulse"></span>
          </div>
        </div>

        <div className="font-mono-code text-xs space-y-2 text-[#94a3b8]">
          {PORTFOLIO_DATA.traceLogs.map((log, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[10px] w-fit ${
                  log.type === "OK"
                    ? "bg-[#9ee939]/20 text-[#9ee939]"
                    : log.type === "DATA"
                    ? "bg-[#7bd0ff]/20 text-[#7bd0ff]"
                    : log.type === "AI"
                    ? "bg-[#fea518]/20 text-[#fea518]"
                    : "bg-[#acf847]/20 text-[#acf847]"
                }`}
              >
                [{log.type}]
              </span>
              <span className="text-[#64748b] text-[11px]">{log.timestamp}</span>
              <span className="text-[#dfe2ef]">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
