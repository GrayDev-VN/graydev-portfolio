"use client";

import { useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import type { Project } from "@/data/portfolioData";
import { Github } from "./BrandIcons";
import { useLocale } from "./LocaleProvider";
import AccessibleDialog from "./AccessibleDialog";
import ProjectVideoOverview from "./ProjectVideoOverview";

export default function ProjectActions({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#101827] px-3 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-indigo-400 hover:text-white sm:text-sm";
  return <>
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
    <a href={project.githubUrl} target="_blank" rel="noreferrer" className={buttonClass}>
    <Github size={16} aria-hidden="true" /><span>{t("View on GitHub", "Xem trên GitHub")}</span><ArrowUpRight size={15} aria-hidden="true" />
    </a>
    <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={buttonClass}><Play size={16} aria-hidden="true" /><span>Video overview</span></button>
    </div>
    <AccessibleDialog open={open} onClose={() => setOpen(false)} labelledBy={`video-title-${project.id}`}>
      {open && <div className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0c121f] p-4 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={`video-title-${project.id}`} className="pt-2 text-base font-semibold text-white sm:text-lg">{locale === "vi" ? project.titleVi ?? project.title : project.title}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={t("Close video", "Đóng video")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"><X size={20} /></button>
        </div>
        <ProjectVideoOverview project={project} />
      </div>}
    </AccessibleDialog>
  </>;
}
