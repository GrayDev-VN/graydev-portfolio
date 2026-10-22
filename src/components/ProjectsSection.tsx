"use client";

import React, { useState } from "react";
import { 
  Star, 
  RefreshCw, 
  Share2, 
  ExternalLink, 
  Code, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function ProjectsSection() {
  const [activeCluster, setActiveCluster] = useState<number | null>(null);
  const featured = PORTFOLIO_DATA.projects.find((p) => p.isFeatured) || PORTFOLIO_DATA.projects[0];
  const secondaryProjects = PORTFOLIO_DATA.projects.filter((p) => !p.isFeatured);

  return (
    <section id="projects" className="w-full pb-20 relative z-10">
      {/* Top Technical Breadcrumbs & Section Title */}
      <div className="w-full pt-8 pb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a34] text-[#9ee939] font-mono-code text-xs tracking-wider uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ee939] animate-pulse"></span>
            PORTFOLIO // CASE_STUDIES
          </span>
          <span className="text-[#8b947d] font-mono-code text-xs">SYS.VER.2025.4</span>
          <div className="h-px flex-1 bg-[#1e293b] hidden sm:block"></div>
          <span className="text-[#94a3b8] font-mono-code text-xs uppercase tracking-widest hidden md:inline-block">
            DATA_SYS // LAKEHOUSE // AUDIT_READY
          </span>
        </div>

        <div className="max-w-4xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
            Systems &amp; Technical Case Studies
          </h2>
          <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
            Core systems showcasing practical engineering in enterprise financial data warehousing, high-concurrency e-commerce architecture, Medallion lakehouse pipelines, and LLM optimization.
          </p>
        </div>
      </div>

      {/* Featured Project: Vietnamese Banking Analytics (Hero Split Card) */}
      <div className="w-full bg-[#181b25] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden hover:border-[#26354d] transition-all duration-300 mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left: Interactive High-Fidelity Dashboard Mockup */}
          <div className="lg:col-span-7 bg-[#0a0e17] p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1e293b]">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#9ee939]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              {/* Mockup Chrome Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#262a34] text-[#9ee939] font-mono-code text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#9ee939]" />
                    FEATURED SYSTEM
                  </span>
                  <span className="font-mono-code text-xs text-[#94a3b8] hidden sm:inline">vn-banking-dwh-analytics</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono-code text-[#94a3b8]">
                  <span className="px-2 py-1 rounded bg-[#181b25] text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 text-[#9ee939]" /> Auto Sync
                  </span>
                  <span className="px-2 py-1 rounded bg-[#181b25] text-[#7bd0ff]">
                    k=4 Clusters
                  </span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5 font-mono-code text-xs">
                <div className="bg-[#181b25] border border-[#262a34] px-3 py-2 rounded flex items-center justify-between text-[#dfe2ef]">
                  <span className="truncate">SOCB / JSCB Banks</span>
                  <span className="text-[#9ee939]">31</span>
                </div>
                <div className="bg-[#181b25] border border-[#262a34] px-3 py-2 rounded flex items-center justify-between text-[#dfe2ef]">
                  <span className="truncate">Range: 2003-2024</span>
                  <span className="text-[#7bd0ff]">20 Yrs</span>
                </div>
                <div className="bg-[#181b25] border border-[#262a34] px-3 py-2 rounded flex items-center justify-between text-[#dfe2ef]">
                  <span className="truncate">Model: RF Classifier</span>
                  <span className="text-[#fea518]">91.4%</span>
                </div>
              </div>

              {/* Visual Analytics Matrix Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart 1: K-Means Clustering Plot */}
                <div className="bg-[#181b25] border border-[#262a34] p-3.5 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-code text-xs text-white font-medium">K-Means Scatter Plot</span>
                    <span className="font-mono-code text-[10px] text-[#9ee939]">Risk Stratification</span>
                  </div>

                  {/* SVG Scatter Visual */}
                  <div className="w-full h-44 relative bg-[#0f131c] border border-[#1e293b] rounded flex items-center justify-center p-2">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
                      {/* Axis Lines */}
                      <line stroke="#31353f" strokeWidth="1" x1="24" x2="230" y1="110" y2="110"></line>
                      <line stroke="#31353f" strokeWidth="1" x1="24" x2="24" y1="10" y2="110"></line>
                      <line stroke="#262a34" strokeDasharray="2 2" x1="24" x2="230" y1="70" y2="70"></line>
                      
                      {/* Grid Labels */}
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="5" y="15">0.08</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="5" y="65">0.04</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="5" y="112">0.00</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="24" y="124">NPL 1%</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="90" y="124">2%</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="160" y="124">3%</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="7" x="210" y="124">5%</text>

                      {/* Cluster 0: Low Risk/Balanced (Lime) */}
                      <g className="cursor-pointer transition-opacity" onClick={() => setActiveCluster(0)}>
                        <circle cx="50" cy="92" fill="#9ee939" opacity="0.9" r="4.5"></circle>
                        <circle cx="62" cy="85" fill="#9ee939" opacity="0.8" r="4"></circle>
                        <circle cx="78" cy="88" fill="#9ee939" opacity="0.9" r="5"></circle>
                        <circle cx="95" cy="80" fill="#9ee939" opacity="0.9" r="4.5"></circle>
                      </g>

                      {/* Cluster 1: High Yield SOCBs (Cyan) */}
                      <g className="cursor-pointer transition-opacity" onClick={() => setActiveCluster(1)}>
                        <circle cx="140" cy="74" fill="#7bd0ff" opacity="0.9" r="5"></circle>
                        <circle cx="155" cy="68" fill="#7bd0ff" opacity="0.85" r="5.5"></circle>
                        <circle cx="168" cy="72" fill="#7bd0ff" opacity="0.9" r="4"></circle>
                        <circle cx="185" cy="62" fill="#7bd0ff" opacity="0.95" r="5.5"></circle>
                      </g>

                      {/* Cluster 2: Stressed NPL Banks (Amber) */}
                      <g className="cursor-pointer transition-opacity" onClick={() => setActiveCluster(2)}>
                        <circle cx="45" cy="38" fill="#fea518" opacity="0.95" r="5.5"></circle>
                        <circle cx="58" cy="45" fill="#fea518" opacity="0.85" r="4.5"></circle>
                        <circle cx="68" cy="32" fill="#fea518" opacity="0.9" r="5"></circle>
                        <circle cx="82" cy="52" fill="#fea518" opacity="0.8" r="4"></circle>
                      </g>

                      {/* Cluster 3: Special/Outliers (Violet) */}
                      <g className="cursor-pointer transition-opacity" onClick={() => setActiveCluster(3)}>
                        <circle cx="120" cy="42" fill="#c4b5fd" opacity="0.85" r="4.5"></circle>
                        <circle cx="198" cy="35" fill="#c4b5fd" opacity="0.9" r="5"></circle>
                      </g>
                    </svg>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 text-[10px] text-[#94a3b8] font-mono-code">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#9ee939]"></span> Cụm 0 (An toàn)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7bd0ff]"></span> Cụm 1 (SOCB)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#fea518]"></span> Cụm 2 (NPL cao)</span>
                  </div>
                </div>

                {/* Chart 2: Comparative Cluster Metrics Bar Chart */}
                <div className="bg-[#181b25] border border-[#262a34] p-3.5 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-code text-xs text-white font-medium">Metric Distribution</span>
                    <div className="flex items-center gap-1 font-mono-code text-[10px] text-[#94a3b8]">
                      <span className="text-[#7bd0ff]">ROA</span> • <span className="text-[#fea518]">ROE</span> • <span className="text-[#9ee939]">NIM</span>
                    </div>
                  </div>

                  {/* Bar Chart SVG */}
                  <div className="w-full h-44 relative bg-[#0f131c] border border-[#1e293b] rounded flex items-center justify-center p-2">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
                      <line stroke="#31353f" strokeWidth="1" x1="20" x2="230" y1="110" y2="110"></line>
                      <line stroke="#31353f" strokeWidth="1" x1="20" x2="20" y1="15" y2="110"></line>

                      {/* Cluster 1 Group */}
                      <rect fill="#7bd0ff" height="40" rx="1" width="10" x="36" y="70"></rect>
                      <rect fill="#fea518" height="58" rx="1" width="10" x="48" y="52"></rect>
                      <rect fill="#9ee939" height="72" rx="1" width="10" x="60" y="38"></rect>

                      {/* Cluster 2 Group */}
                      <rect fill="#7bd0ff" height="25" rx="1" width="10" x="88" y="85"></rect>
                      <rect fill="#fea518" height="36" rx="1" width="10" x="100" y="74"></rect>
                      <rect fill="#9ee939" height="50" rx="1" width="10" x="112" y="60"></rect>

                      {/* Cluster 3 Group */}
                      <rect fill="#7bd0ff" height="65" rx="1" width="10" x="140" y="45"></rect>
                      <rect fill="#fea518" height="78" rx="1" width="10" x="152" y="32"></rect>
                      <rect fill="#9ee939" height="86" rx="1" width="10" x="164" y="24"></rect>

                      {/* Cluster 4 Group */}
                      <rect fill="#7bd0ff" height="20" rx="1" width="10" x="192" y="90"></rect>
                      <rect fill="#fea518" height="26" rx="1" width="10" x="204" y="84"></rect>
                      <rect fill="#9ee939" height="30" rx="1" width="10" x="216" y="80"></rect>

                      {/* Labels */}
                      <text fill="#8b947d" fontFamily="monospace" fontSize="8" x="44" y="122">Cụm 1</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="8" x="96" y="122">Cụm 2</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="8" x="148" y="122">Cụm 3</text>
                      <text fill="#8b947d" fontFamily="monospace" fontSize="8" x="200" y="122">Cụm 4</text>
                    </svg>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 font-mono-code text-[10px] text-[#94a3b8]">
                    <span>Mean ROE: <strong className="text-white">14.82%</strong></span>
                    <span>NPL Target: <strong className="text-[#9ee939]">&lt; 2.15%</strong></span>
                    <span>Schema: <strong className="text-[#7bd0ff]">Star</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Ingestion Status */}
            <div className="mt-4 pt-3 flex items-center justify-between text-[#94a3b8] font-mono-code text-[11px] border-t border-[#1e293b]">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-[#9ee939]"></span>
                BigQuery ELT: 28,490 Records Ingested OK
              </span>
              <span className="text-[#8b947d]">PARTITIONED BY (report_year, bank_code)</span>
            </div>
          </div>

          {/* Right: Executive Synopsis & System Highlights */}
          <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between bg-[#181b25]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#9ee939] font-mono-code text-xs uppercase tracking-wider font-bold">
                  {featured.category}
                </span>
                <span className="text-[#8b947d]">•</span>
                <span className="text-[#94a3b8] font-mono-code text-xs">{featured.domain}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                {featured.title}
              </h3>

              <p className="text-sm text-[#94a3b8] mb-6 leading-relaxed">
                {featured.summary}
              </p>

              {/* Highlights List */}
              <div className="space-y-3 mb-6 bg-[#0f131c] border border-[#262a34] p-4 rounded-lg">
                {featured.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#9ee939] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#dfe2ef] leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded bg-[#262a34] text-white font-mono-code text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#1e293b]">
              <a
                href={featured.demoUrl || "#"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#9ee939] hover:bg-[#acf847] text-[#0a0e17] font-display text-xs font-bold shadow-[0_0_20px_rgba(158,233,57,0.3)] transition-all"
              >
                <span>View Architecture</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={featured.githubUrl || PORTFOLIO_DATA.profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f131c] border border-[#262a34] hover:border-[#9ee939] text-white font-mono-code text-xs transition-all"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>

              <span className="text-[#64748b] font-mono-code text-[11px] ml-auto">
                DOC_ID: VN-DWH-01
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Projects Matrix (3 Columns) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Architectural &amp; Research Portfolio
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#7bd0ff]"></span>
          </div>
          <span className="font-mono-code text-xs text-[#94a3b8] hidden sm:inline">
            3 ACTIVE SYSTEM DEPLOYMENTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secondaryProjects.map((p, idx) => {
            const isEcom = p.id.includes("ecommerce");
            const isLakehouse = p.id.includes("minio");
            const isAI = p.id.includes("llm") || p.id.includes("turboquant");

            return (
              <article
                key={p.id}
                className="bg-[#181b25] border border-[#1e293b] rounded-xl overflow-hidden hover:border-[#26354d] transition-all duration-300 flex flex-col group"
              >
                {/* Visual Header Banner */}
                <div className="h-44 bg-[#0a0e17] relative overflow-hidden flex flex-col justify-between p-4 border-b border-[#1e293b]">
                  <div className="flex items-center justify-between z-10">
                    <span
                      className={`px-2.5 py-0.5 rounded font-mono-code text-[10px] font-bold ${
                        isEcom
                          ? "bg-[#fea518]/20 text-[#fea518]"
                          : isLakehouse
                          ? "bg-[#7bd0ff]/20 text-[#7bd0ff]"
                          : "bg-[#9ee939]/20 text-[#9ee939]"
                      }`}
                    >
                      {p.category}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#64748b]">
                      PROD_SYS // {idx + 1}
                    </span>
                  </div>

                  {/* Icon representation */}
                  <div className="flex items-center justify-center my-auto">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center border ${
                        isEcom
                          ? "bg-[#fea518]/10 border-[#fea518]/30 text-[#fea518]"
                          : isLakehouse
                          ? "bg-[#7bd0ff]/10 border-[#7bd0ff]/30 text-[#7bd0ff]"
                          : "bg-[#9ee939]/10 border-[#9ee939]/30 text-[#9ee939]"
                      }`}
                    >
                      {isEcom ? (
                        <Layers className="w-7 h-7" />
                      ) : isLakehouse ? (
                        <Database className="w-7 h-7" />
                      ) : (
                        <Cpu className="w-7 h-7" />
                      )}
                    </div>
                  </div>

                  <div className="z-10 font-mono-code text-[10px] text-[#94a3b8]">
                    {p.domain}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white group-hover:text-[#9ee939] transition-colors mb-2.5">
                      {p.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mb-4 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-[#0f131c] border border-[#262a34] text-[#dfe2ef] font-mono-code text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#1e293b] font-mono-code text-xs">
                      <a
                        href={p.demoUrl || "#"}
                        className="text-[#9ee939] hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>Architecture Specs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={p.githubUrl || PORTFOLIO_DATA.profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#94a3b8] hover:text-white"
                        aria-label="View Source Code"
                      >
                        <Code className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Systems Telemetry Bar at Base */}
      <div className="w-full mt-14 pt-6 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-4 text-[#94a3b8] font-mono-code text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-white">
            <span className="w-2 h-2 rounded-full bg-[#9ee939] animate-ping"></span>
            ALL PIPELINES OPERATIONAL
          </span>
          <span>STORAGE ENGINE: MINIO + GOOGLE BIGQUERY</span>
          <span className="hidden md:inline">AUDIT COMPLIANCE: SOC2 / ITGC READY</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#64748b]">ENCRYPTED TELEMETRY STREAM</span>
          <span className="px-2 py-0.5 rounded bg-[#262a34] text-[#9ee939] font-mono-code text-[11px]">
            0.024s LATENCY
          </span>
        </div>
      </div>
    </section>
  );
}
