"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code2, Play } from "lucide-react";
import type { Project } from "@/data/portfolioData";
import { PROJECT_VIDEOS } from "@/data/projectVideos";
import { useLocale } from "./LocaleProvider";

export default function ProjectHeader({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  return <>
    <Link href="/projects" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"><ArrowLeft size={16} />{t("All projects", "Tất cả dự án")}</Link>
    <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c121f]">
      <div aria-hidden="true" className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="mb-5 text-[11px] font-mono uppercase tracking-[0.16em] text-indigo-300">{locale === "vi" ? project.categoryVi ?? project.category : project.category}</p>
          <h1 className="max-w-3xl font-display text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-[40px]">{locale === "vi" ? project.titleVi ?? project.title : project.title}</h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-400 sm:text-base">{locale === "vi" ? project.summaryVi ?? project.summary : project.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"><Code2 size={17} />{t("Source code", "Xem mã nguồn")}<ArrowUpRight size={15} /></a>
            {!!PROJECT_VIDEOS[project.id]?.length && <a href="#videos" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-200 hover:border-indigo-400"><Play size={15} />{t("Watch overview", "Xem video tổng quan")}</a>}
          </div>
        </div>
        <aside className="border-t border-slate-800 bg-[#080d18]/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">{t("Project status", "Trạng thái")}</p>
          <p className="flex items-center gap-2 text-sm text-slate-200"><span className={`h-1.5 w-1.5 rounded-full ${project.status === "completed" ? "bg-emerald-400" : "bg-amber-400"}`} />{project.status === "completed" ? t("Completed", "Hoàn thành") : project.status === "planned" ? t("Planned", "Dự kiến") : t("In development", "Đang phát triển")}</p>
          <div className="my-6 h-px bg-slate-800" />
          <p className="mb-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">{t("Built with", "Công nghệ sử dụng")}</p>
          <div className="flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300">{tag}</span>)}</div>
        </aside>
      </div>
    </header>
  </>;
}
