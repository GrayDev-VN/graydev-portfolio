"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

export default function CodeBlock({ language, text, children }: { language: string; text: string; children: ReactNode }) {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="blog-code-block">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] bg-white/[0.025] px-4 py-2.5 sm:px-5">
        <span className="font-[JetBrains_Mono] text-[11px] leading-5 text-slate-400">{language || "text"}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded px-1 py-0.5 font-[Plus_Jakarta_Sans] text-[11px] leading-5 text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          {status === "copied" ? <Check size={13} aria-hidden="true" className="text-emerald-400" /> : <Copy size={13} aria-hidden="true" />}
          <span aria-live="polite">{status === "copied" ? t("Copied", "Đã chép") : status === "error" ? t("Could not copy", "Chưa chép được") : t("Copy code", "Sao chép code")}</span>
        </button>
      </div>
      <pre tabIndex={0} aria-label={t(`${language || "Plain text"} code block`, `Khối code ${language || "văn bản"}`)}>{children}</pre>
    </div>
  );
}
