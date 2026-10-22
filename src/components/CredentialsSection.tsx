"use client";

import React, { useState } from "react";
import { ShieldCheck, Award, FileText, CheckCircle2 } from "lucide-react";
import { PORTFOLIO_DATA, Credential } from "@/data/portfolioData";

export default function CredentialsSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "aws", label: "AWS" },
    { id: "google", label: "Google" },
    { id: "industry", label: "Industry" },
    { id: "award", label: "Award" },
    { id: "academic", label: "Academic" },
  ];

  const filteredCredentials = PORTFOLIO_DATA.credentials.filter((c) => {
    if (selectedFilter === "all") return true;
    return c.category === selectedFilter;
  });

  return (
    <section id="credentials" className="w-full pb-20 relative z-10">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1e293b] mb-10">
        <div className="flex flex-col space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#9ee939]" />
            <span className="font-mono-code text-xs text-[#9ee939] uppercase tracking-widest font-semibold">
              VERIFIED CREDENTIALS &amp; EVIDENCE
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            11 Verified Credentials for Enterprise Trust.
          </h2>

          <p className="text-sm sm:text-base text-[#94a3b8]">
            Authentic digital credentials and academic honors officially issued and verifiable via Credly, Coursera, and HCM-UTE.
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0a0e17] border border-[#1e293b] flex-wrap">
          {filterOptions.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedFilter(btn.id)}
              className={`px-3 py-1.5 rounded-md font-mono-code text-xs transition-all ${
                selectedFilter === btn.id
                  ? "bg-[#9ee939] text-[#0a0e17] font-bold shadow-[0_0_12px_rgba(158,233,57,0.4)]"
                  : "text-[#94a3b8] hover:text-white hover:bg-[#181b25]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Credentials Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredCredentials.map((cred) => {
          const isAws = cred.category === "aws";
          const isGoogle = cred.category === "google";
          const isAward = cred.category === "award" || cred.category === "academic";

          return (
            <article
              key={cred.id}
              className="group flex flex-col justify-between rounded-xl bg-[#181b25] border border-[#1e293b] hover:border-[#26354d] hover:bg-[#1c2130] transition-all shadow-md overflow-hidden relative"
            >
              <div className="p-4 flex flex-col space-y-4">
                {/* Certificate Visual Specimen */}
                <div className="relative w-full aspect-[4/3] rounded-lg bg-[#0a0e17] border border-[#262a34] overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-[11px] font-bold tracking-wider uppercase flex items-center gap-1">
                      {isAws ? (
                        <span className="text-[#fea518] font-bold">aws academy</span>
                      ) : isGoogle ? (
                        <span className="text-[#7bd0ff] font-bold">Google Cert</span>
                      ) : (
                        <span className="text-[#9ee939] font-bold">Verified Cert</span>
                      )}
                    </span>
                    <span className="font-mono-code text-[9px] px-2 py-0.5 rounded bg-[#262a34] text-white">
                      {cred.badgeType}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="font-mono-code text-[10px] text-[#64748b]">
                      Candidate: {PORTFOLIO_DATA.profile.name}
                    </span>
                    <p
                      className={`font-mono-code text-xs font-bold leading-tight line-clamp-2 ${
                        isAws ? "text-[#9ee939]" : isGoogle ? "text-[#7bd0ff]" : "text-white"
                      }`}
                    >
                      {cred.title}
                    </p>
                    {cred.hours && (
                      <span className="font-mono-code text-[10px] text-[#94a3b8]">
                        Scope: {cred.hours}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[#8b947d] font-mono-code text-[10px] pt-1 border-t border-[#1e293b]">
                    <span>{cred.verifiedId}</span>
                    <span className="text-[#9ee939] font-bold">{cred.year}</span>
                  </div>
                </div>

                {/* Metadata & Title */}
                <div className="flex flex-col space-y-1">
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-[#9ee939] transition-colors leading-snug">
                    {cred.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8]">{cred.issuer}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-[#0f131c] border-t border-[#1e293b] flex items-center justify-between font-mono-code text-xs">
                <span className="text-[#64748b]">{cred.date}</span>
                <div className="flex items-center gap-1 text-[#9ee939]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-bold text-[11px] uppercase">Verified</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
