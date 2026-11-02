"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Database, Network, HeartPulse, Bot, Layers } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useLocale } from "./LocaleProvider";

const icons = [Database, HeartPulse, Bot, Network, Layers];

export default function ProjectCollection() {
  const { locale, t } = useLocale();
  return <div className="mx-auto max-w-6xl py-8 sm:py-12">
    <Link href="/#projects" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} />{t("Back to portfolio", "Về portfolio")}</Link>
    <header className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-slate-800 pb-8">
      <div><p className="mb-4 text-[11px] font-mono tracking-[0.2em] text-indigo-400">ENGINEERING / PROJECTS</p><h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("Project collection", "Các dự án của mình")}</h1><p className="mt-4 max-w-xl text-base leading-7 text-slate-400">{t("Explore the ideas, architecture and implementation behind each project.", "Từ ý tưởng đến triển khai — khám phá bài toán, kiến trúc và cách mình xây dựng từng dự án.")}</p></div>
      <span className="text-xs font-mono text-slate-500">{String(PORTFOLIO_DATA.projects.length).padStart(2, "0")} {t("PROJECTS", "DỰ ÁN")}</span>
    </header>
    <div className="grid gap-5 md:grid-cols-2">
      {PORTFOLIO_DATA.projects.map((project, index) => {
        const Icon = icons[index % icons.length];
        return <Link key={project.id} href={`/projects/${project.id}`} className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0c121f] p-6 transition-colors hover:border-indigo-400/60 sm:p-8 ${project.isFeatured ? "md:col-span-2" : ""}`}>
          <div className="mb-7 flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300"><Icon size={23} strokeWidth={1.5} /></span><span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{project.isFeatured ? t("Featured project", "Dự án nổi bật") : `0${index + 1}`}</span></div>
          <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-indigo-400">{locale === "vi" ? project.categoryVi ?? project.category : project.category}</p>
          <h2 className="max-w-3xl font-display text-xl font-semibold leading-snug text-white sm:text-2xl">{locale === "vi" ? project.titleVi ?? project.title : project.title}</h2>
          <p className="mb-7 mt-4 max-w-3xl text-sm leading-7 text-slate-400">{locale === "vi" ? project.summaryVi ?? project.summary : project.summary}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-5 border-t border-slate-800 pt-5"><div className="flex flex-wrap gap-2">{project.tags.slice(0, 4).map(tag => <span key={tag} className="rounded bg-slate-800/50 px-2 py-1 text-[11px] text-slate-400">{tag}</span>)}</div><span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 group-hover:text-white">{t("Explore project", "Khám phá dự án")}<ArrowUpRight size={17} /></span></div>
        </Link>;
      })}
    </div>
  </div>;
}
