"use client";

import React from "react";
import { Terminal, ShieldCheck } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0e17] border-t border-[#1e293b] relative z-10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Branding */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-white">
              Gray<span className="text-[#9ee939]">Dev</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#9ee939]"></span>
            <span className="font-mono-code text-[11px] text-[#9ee939] bg-[#181b25] border border-[#262a34] px-2 py-0.5 rounded">
              AI BACKEND &amp; IT AUDIT
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] text-center md:text-left mt-1">
            Enterprise AI Model Serving, Distributed Data Pipelines &amp; ITGC Governance Architecture.
          </p>
        </div>

        {/* Center Quick Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono-code text-xs text-[#94a3b8]">
          <a href="#about" className="hover:text-[#9ee939] transition-colors">
            ABOUT
          </a>
          <a href="#career" className="hover:text-[#9ee939] transition-colors">
            CAREER
          </a>
          <a href="#projects" className="hover:text-[#9ee939] transition-colors">
            PROJECTS
          </a>
          <a href="#credentials" className="hover:text-[#9ee939] transition-colors">
            CREDENTIALS
          </a>
          <a href="#contact" className="hover:text-[#9ee939] transition-colors">
            CONTACT
          </a>
        </div>

        {/* Right Verification Status */}
        <div className="font-mono-code text-[11px] text-[#64748b] text-center md:text-right">
          © 2025 Gray Nguyen (GrayDev). Cryptographically Verified Portfolio.
        </div>
      </div>
    </footer>
  );
}
