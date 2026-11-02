"use client";

import Link from "next/link";
import PortfolioShell from "@/components/PortfolioShell";
import { useLocale } from "@/components/LocaleProvider";

export default function JobsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();
  return <PortfolioShell><section role="alert" className="mx-auto my-12 max-w-3xl rounded-2xl border border-slate-700 bg-[#0c121f] p-6 sm:p-10"><h1 className="text-2xl font-semibold">{t("We couldn't load the jobs", "Chưa tải được danh sách job")}</h1><p className="mt-4 text-sm leading-7 text-slate-400">{t("The job data is temporarily unavailable. Please try again in a moment.", "Dữ liệu việc làm tạm thời chưa khả dụng. Bạn hãy thử lại sau một chút.")}</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={reset} className="min-h-11 rounded-xl bg-indigo-600 px-5 text-sm text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-300">{t("Try again", "Thử lại")}</button><Link href="/" className="inline-flex min-h-11 items-center rounded-xl border border-slate-700 px-5 text-sm text-slate-300 focus-visible:outline-2 focus-visible:outline-indigo-300">{t("Back to portfolio", "Về portfolio")}</Link></div></section></PortfolioShell>;
}
