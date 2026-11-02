"use client";

import PortfolioShell from "@/components/PortfolioShell";
import { useLocale } from "@/components/LocaleProvider";

export default function JobsLoading() {
  const { t } = useLocale();
  return <PortfolioShell><div role="status" aria-live="polite" className="mx-auto max-w-6xl py-16"><p className="text-slate-300">{t("Loading opportunities…", "Đang tải cơ hội việc làm…")}</p><div aria-hidden="true" className="mt-6 h-64 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 motion-reduce:animate-none" /></div></PortfolioShell>;
}
