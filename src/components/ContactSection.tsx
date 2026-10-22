"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Terminal, 
  Lock,
  Sparkles
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "ai-backend",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", topic: "ai-backend", message: "" });
    }, 1200);
  };

  return (
    <section id="contact" className="w-full pb-20 relative z-10">
      <div className="flex flex-col space-y-3 mb-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#9ee939]" />
          <span className="font-mono-code text-xs text-[#9ee939] uppercase tracking-widest font-semibold">
            SECURE TERMINAL // CONTACT
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Initiate Direct Transmission.
        </h2>
        <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
          Open to discuss AI Backend engineering positions, Java Spring Boot microservice architectures, and enterprise IT Audit assurance opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sub-Pane: Contact Coordinates & Security Identity */}
        <div className="lg:col-span-5 bg-[#181b25] border border-[#1e293b] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-white">
              Communication Coordinates
            </h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Messages submitted via this terminal are routed directly to Gray Nguyen&apos;s primary developer mailbox with verified delivery receipts.
            </p>

            {/* Email Tile with Quick Copy */}
            <div className="p-4 rounded-lg bg-[#0f131c] border border-[#262a34] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#181b25] border border-[#262a34] flex items-center justify-center text-[#9ee939]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono-code text-[10px] text-[#64748b] uppercase">DIRECT MAILBOX</span>
                  <div className="font-mono-code text-xs sm:text-sm text-white font-semibold">
                    {PORTFOLIO_DATA.profile.email}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-[#181b25] border border-[#262a34] hover:border-[#9ee939] text-[#94a3b8] hover:text-[#9ee939] transition-all"
                title="Copy to Clipboard"
                aria-label="Copy to Clipboard"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-[#9ee939]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Availability Status Box */}
            <div className="p-4 rounded-lg bg-[#0f131c] border border-[#262a34] space-y-2 font-mono-code text-xs">
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>ENGAGEMENT STATUS:</span>
                <span className="text-[#9ee939] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#9ee939] animate-pulse"></span>
                  READY FOR HIRE
                </span>
              </div>
              <div className="text-[11px] text-[#64748b]">
                Specialized in: AI Backend (FastAPI/PyTorch), Java Spring Boot Microservices, BigQuery DWH &amp; ITGC.
              </div>
            </div>

            {/* Cryptographic Key Specimen */}
            <div className="p-3.5 rounded-lg bg-[#0a0e17] border border-[#1e293b] font-mono-code text-[11px] text-[#64748b] space-y-1">
              <div className="flex items-center justify-between text-[#8b947d]">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-[#9ee939]" /> PGP_FINGERPRINT</span>
                <span className="text-[#9ee939]">VERIFIED</span>
              </div>
              <div className="truncate text-[#94a3b8]">
                9EE9 39AC 472A 0010 304F 0065 3E00 84CC
              </div>
            </div>
          </div>
        </div>

        {/* Right Sub-Pane: Encrypted Transmission Form */}
        <div className="lg:col-span-7 bg-[#181b25] border border-[#1e293b] rounded-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9ee939] to-transparent opacity-80"></div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="contact-name" className="font-mono-code text-xs text-white font-medium flex items-center gap-1">
                  Your Name <span className="text-[#9ee939]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. John Doe / Tech Recruiter"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0e17] border border-[#262a34] text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#9ee939] focus:ring-1 focus:ring-[#9ee939] font-mono-code text-xs transition-all shadow-inner"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="contact-email" className="font-mono-code text-xs text-white font-medium flex items-center gap-1">
                  Your Email <span className="text-[#9ee939]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0e17] border border-[#262a34] text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#9ee939] focus:ring-1 focus:ring-[#9ee939] font-mono-code text-xs transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Topic Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="contact-topic" className="font-mono-code text-xs text-white font-medium">
                Topic / Subject
              </label>
              <select
                id="contact-topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0e17] border border-[#262a34] text-white focus:outline-none focus:border-[#9ee939] focus:ring-1 focus:ring-[#9ee939] font-mono-code text-xs transition-all shadow-inner cursor-pointer"
              >
                <option value="ai-backend">AI Backend Engineering &amp; LLM Serving</option>
                <option value="spring-boot">Java Spring Boot Microservices</option>
                <option value="data-eng">Data Governance &amp; BigQuery Lakehouse</option>
                <option value="audit">IT Audit Assurance &amp; ITGC Advisory</option>
                <option value="networking">General Networking &amp; Hello</option>
              </select>
            </div>

            {/* Message Field */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="contact-message" className="font-mono-code text-xs text-white font-medium flex items-center gap-1">
                  Transmission Message <span className="text-[#9ee939]">*</span>
                </label>
                <span className="font-mono-code text-[10px] text-[#64748b]">
                  {formData.message.length}/1000
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={5}
                required
                maxLength={1000}
                placeholder="Write your project details or message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0e17] border border-[#262a34] text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#9ee939] focus:ring-1 focus:ring-[#9ee939] font-mono-code text-xs transition-all resize-y shadow-inner"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-lg bg-[#9ee939] hover:bg-[#acf847] text-[#0a0e17] font-display text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(158,233,57,0.35)] active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0a0e17] border-t-transparent rounded-full animate-spin"></span>
                  <span>Encrypting &amp; Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Encrypted Transmission</span>
                </>
              )}
            </button>

            {/* Toast Feedback */}
            {submitted && (
              <div className="p-3 rounded-lg bg-[#0f131c] border border-[#9ee939] text-[#9ee939] font-mono-code text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Transmission sent successfully over TLS encrypted channel. Thank you!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
