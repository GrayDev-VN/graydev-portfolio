"use client";

import React, { useState } from "react";
import { 
  Code, 
  Terminal, 
  ShieldCheck, 
  Mail, 
  Menu, 
  X, 
  Bot, 
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

interface NavbarProps {
  onOpenAiConsole: () => void;
}

export default function Navbar({ onOpenAiConsole }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { label: "ABOUT", href: "#about" },
    { label: "CAREER", href: "#career" },
    { label: "PROJECTS", href: "#projects" },
    { label: "CREDENTIALS", href: "#credentials" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0e17]/85 backdrop-blur-xl border-b border-[#1e293b] shadow-[0_1px_16px_rgba(0,0,0,0.6)]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#about" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[#181b25] border border-[#262a34] flex items-center justify-center text-[#9ee939] group-hover:border-[#9ee939] transition-colors">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              Gray<span className="text-[#9ee939]">Dev</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#9ee939] shadow-[0_0_10px_#9ee939] animate-pulse"></span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181b25]/70 border border-[#1e293b] backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 font-mono-code text-xs font-semibold tracking-wider text-[#94a3b8] hover:text-[#9ee939] hover:bg-[#262a34]/60 transition-all rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onOpenAiConsole}
            className="ml-2 px-3 py-1.5 rounded-lg bg-[#9ee939]/10 border border-[#9ee939]/40 text-[#9ee939] font-mono-code text-xs font-bold tracking-wider hover:bg-[#9ee939] hover:text-[#0a0e17] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CONSOLE</span>
          </button>
        </nav>

        {/* Quick Social & Action Cluster */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <a
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="w-9 h-9 rounded-lg bg-[#181b25] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#9ee939] hover:border-[#9ee939] hover:bg-[#262a34] transition-all"
            >
              <Code className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_DATA.profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="w-9 h-9 rounded-lg bg-[#181b25] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#7bd0ff] hover:border-[#7bd0ff] hover:bg-[#262a34] transition-all"
            >
              <Terminal className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyEmail}
              aria-label="Copy Email"
              title="Copy Email"
              className="w-9 h-9 rounded-lg bg-[#181b25] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#9ee939] hover:border-[#9ee939] hover:bg-[#262a34] transition-all"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-[#9ee939]" /> : <Mail className="w-4 h-4" />}
            </button>
          </div>

          <div className="h-5 w-px bg-[#262a34] hidden sm:block mx-1"></div>

          {/* AI Backend Ready Status Badge */}
          <button
            onClick={onOpenAiConsole}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181b25] border border-[#1e293b] hover:border-[#9ee939] transition-all group"
          >
            <div className="w-2 h-2 rounded-full bg-[#9ee939] animate-ping"></div>
            <span className="font-mono-code text-[11px] text-[#9ee939] font-bold tracking-wide">
              AI READY
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg bg-[#181b25] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0e17] border-b border-[#1e293b] px-6 py-5 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg bg-[#181b25] text-sm font-mono-code font-semibold tracking-wider text-[#dfe2ef] hover:text-[#9ee939] hover:bg-[#262a34]"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAiConsole();
            }}
            className="px-4 py-2.5 rounded-lg bg-[#9ee939] text-[#0a0e17] text-sm font-mono-code font-bold tracking-wider flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>LAUNCH AI CONSOLE</span>
          </button>
        </div>
      )}
    </header>
  );
}
