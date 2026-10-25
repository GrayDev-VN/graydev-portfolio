"use client";

import React, { useState } from "react";
import { Linkedin } from "@/components/BrandIcons";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "@/components/LocaleProvider";

export default function ContactSection() {
  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState("");
  const { t } = useLocale();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => setSubmitError(t("Could not copy the email address.", "Không thể sao chép địa chỉ email.")));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitted(false);
    setSubmitError("");
    setMailtoUrl("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result?.error ||
          t(
            "The message could not be sent. Please try again or email me directly.",
            "Chưa gửi được tin nhắn. Bạn thử lại hoặc gửi email trực tiếp giúp mình nhé.",
          )
        );
      }

      form.reset();
      setCharCount(0);
      setSubmitted(true);

      if (result.mailtoUrl) {
        setMailtoUrl(result.mailtoUrl);
        // Automatically attempt to trigger mail client in a new window/tab
        try {
          window.open(result.mailtoUrl, "_blank");
        } catch {
          // Fallback handled by rendered button
        }
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t(
        "The message could not be sent. Please try again or email me directly.",
        "Chưa gửi được tin nhắn. Bạn thử lại hoặc gửi email trực tiếp giúp mình nhé.",
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full pb-20 relative z-10">
      <div className="flex flex-col gap-6">
        <div className="max-w-3xl">
          <h2 className="font-[Space_Grotesk] text-[36px] sm:text-[42px] leading-tight font-extrabold tracking-tight text-white">
            {t("Let’s connect", "Cùng kết nối")}<span className="text-indigo-400">.</span>
          </h2>
          <p className="font-[Plus_Jakarta_Sans] text-[16px] leading-[26px] text-[#94a3b8] mt-2">
            {t(
              "Have a project in mind or want to talk about AI, backend architectures, or fintech engineering? Send me a message.",
              "Bạn có dự án muốn trao đổi, hoặc muốn trò chuyện về AI, kiến trúc backend hay công nghệ Fintech? Gửi lời nhắn cho mình nhé.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Contact Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-[JetBrains_Mono] text-[11px] text-indigo-400 uppercase tracking-widest font-bold">
                {t("DIRECT REACH", "KÊNH KẾT NỐI")}
              </span>
            </div>

            {/* Contact Channels */}
            <div className="flex flex-col space-y-3">
              {/* Email */}
              <div className="p-4 rounded-2xl bg-[#0c121f] border border-[#1e293b] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#101827] border border-[#1e293b] flex items-center justify-center text-indigo-400">
                    <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-[JetBrains_Mono] text-[10px] text-[#64748b] uppercase tracking-wider">{t("Email", "Email")}</span>
                    <span id="target-email" className="font-[JetBrains_Mono] text-[13px] text-white font-semibold">
                      {PORTFOLIO_DATA.profile.email}
                    </span>
                  </div>
                </div>
                <button
                  id="copy-email-btn"
                  onClick={handleCopyEmail}
                  type="button"
                  aria-label={t("Copy email address", "Sao chép địa chỉ email")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    copied ? "bg-emerald-500 text-white" : "bg-[#141d30] border border-[#1e293b] text-[#94a3b8] hover:text-white"
                  }`}
                >
                  <span id="copy-icon" className="material-symbols-outlined text-[16px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                </button>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-[#0c121f] border border-[#1e293b] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#101827] border border-[#1e293b] flex items-center justify-center text-sky-400">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-[JetBrains_Mono] text-[10px] text-[#64748b] uppercase tracking-wider">
                    {t("LOCATION", "ĐỊA ĐIỂM")}
                  </span>
                  <span className="font-[Plus_Jakarta_Sans] text-[15px] text-white font-medium">
                    {t("Ho Chi Minh City, Vietnam", "TP. Hồ Chí Minh, Việt Nam")}
                  </span>
                </div>
              </div>

              {/* LinkedIn */}
              <a
                href={PORTFOLIO_DATA.profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-[#0c121f] border border-[#1e293b] hover:border-slate-600 flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#101827] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] group-hover:text-indigo-400">
                  <Linkedin aria-hidden="true" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-[JetBrains_Mono] text-[10px] text-[#64748b] uppercase tracking-wider">LinkedIn</span>
                  <span className="font-[JetBrains_Mono] text-[13px] text-white font-semibold group-hover:text-indigo-300">
                    {t("CONNECT ON LINKEDIN", "KẾT NỐI TRÊN LINKEDIN")}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#64748b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ml-auto">
                  open_in_new
                </span>
              </a>
            </div>

            {/* Assurance Box */}
            <div className="p-5 rounded-2xl bg-[#0c121f] border border-[#1e293b] flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-[JetBrains_Mono] text-[11px] text-emerald-400 uppercase tracking-wider font-bold">
                  {t("DIRECT RESPONSE", "PHẢN HỒI NHANH")}
                </span>
              </div>
              <p className="font-[Plus_Jakarta_Sans] text-[13px] leading-[22px] text-[#94a3b8]">
                {t(
                  "Messages sent here go straight to my inbox. I usually reply within 24 hours.",
                  "Tin nhắn sẽ được gửi trực tiếp đến hộp thư của mình. Mình thường phản hồi trong vòng 24 giờ.",
                )}
              </p>
            </div>
          </div>

          {/* RIGHT: Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0c121f] border border-[#1e293b] shadow-2xl relative overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col space-y-1.5">
                  <label
                    className="font-[JetBrains_Mono] text-[12px] text-[#cbd5e1] font-semibold flex items-center gap-1"
                    htmlFor="contact-name"
                  >
                    {t("Your Name", "Tên của bạn")} <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder={t("Your Name", "Tên của bạn")}
                    className="w-full px-4 py-3 rounded-xl bg-[#060911] border border-[#1e293b] text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500 font-[Plus_Jakarta_Sans] text-[14px] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label
                    className="font-[JetBrains_Mono] text-[12px] text-[#cbd5e1] font-semibold flex items-center gap-1"
                    htmlFor="contact-email"
                  >
                    {t("Your Email", "Email của bạn")} <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#060911] border border-[#1e293b] text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500 font-[Plus_Jakarta_Sans] text-[14px] transition-all"
                  />
                </div>
              </div>

              {/* Topic */}
              <div className="flex flex-col space-y-1.5">
                <label className="font-[JetBrains_Mono] text-[12px] text-[#cbd5e1] font-semibold" htmlFor="contact-topic">
                  {t("Topic / Subject", "Chủ đề")}
                </label>
                <div className="relative">
                  <select
                    id="contact-topic"
                    name="topic"
                    className="w-full px-4 py-3 rounded-xl bg-[#060911] border border-[#1e293b] text-white appearance-none focus:outline-none focus:border-indigo-500 font-[Plus_Jakarta_Sans] text-[14px] transition-all cursor-pointer"
                  >
                    <option value="banking">{t("Banking App / Core Fintech", "Hệ thống Ngân hàng Số / Core Fintech")}</option>
                    <option value="goutms">{t("GoutMS Healthcare AI Project", "Dự án AI Y tế GoutMS")}</option>
                    <option value="backend">{t("Backend Engineering & API Design", "Kỹ thuật Backend & Thiết kế API")}</option>
                    <option value="ai-developer">{t("AI Developer Collaboration", "Hợp tác phát triển AI")}</option>
                    <option value="aws">AWS Cloud Infrastructure</option>
                    <option value="other">{t("Other Inquiry", "Chủ đề khác")}</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="font-[JetBrains_Mono] text-[12px] text-[#cbd5e1] font-semibold flex items-center gap-1"
                    htmlFor="contact-message"
                  >
                    {t("Message", "Nội dung")} <span className="text-indigo-400">*</span>
                  </label>
                  <span className="font-[JetBrains_Mono] text-[10px] text-[#64748b]">{charCount}/1000</span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={1000}
                  rows={5}
                  onChange={(e) => setCharCount(e.target.value.length)}
                  placeholder={t("Write your message here...", "Viết lời nhắn của bạn...")}
                  className="w-full px-4 py-3 rounded-xl bg-[#060911] border border-[#1e293b] text-white placeholder:text-[#64748b] focus:outline-none focus:border-indigo-500 font-[Plus_Jakarta_Sans] text-[14px] transition-all resize-y"
                />
              </div>

              {/* Honeypot */}
              <input
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait text-white font-[Space_Grotesk] text-[15px] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">{isSubmitting ? "progress_activity" : "send"}</span>
                <span>{isSubmitting ? t("Sending...", "Đang gửi...") : t("Send Message", "Gửi tin nhắn")}</span>
              </button>

              {submitted && (
                <div role="status" className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-[#cbd5e1] font-[JetBrains_Mono] text-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>{t("Message recorded & prepared successfully!", "Đã ghi nhận lời nhắn thành công!")}</span>
                  </div>
                  <p className="text-[#94a3b8] font-[Plus_Jakarta_Sans] text-xs leading-relaxed">
                    {mailtoUrl
                      ? t(
                          "Your message has been pre-filled. You can click below to dispatch it directly to graynguyen.dev@gmail.com:",
                          "Lời nhắn đã được lưu vào hệ thống. Bạn có thể nhấn nút bên dưới để gửi trực tiếp tới graynguyen.dev@gmail.com:",
                        )
                      : t(
                          "Message sent successfully. I’ll get back to you soon.",
                          "Đã gửi tin nhắn thành công. Mình sẽ phản hồi bạn sớm nhé.",
                        )}
                  </p>
                  {mailtoUrl && (
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <a
                        href={mailtoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        <span>{t("Open Email Client", "Mở ứng dụng Email để gửi")}</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="px-3.5 py-2 rounded-lg bg-[#101827] hover:bg-[#141d30] border border-[#1e293b] text-[#cbd5e1] hover:text-white inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">content_copy</span>
                        <span>{copied ? t("Copied email!", "Đã chép!") : t("Copy graynguyen.dev@gmail.com", "Chép địa chỉ email")}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {submitError && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-center text-sm text-red-200">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
