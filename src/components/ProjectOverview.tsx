"use client";

import Image from "next/image";
import type { Project } from "@/data/portfolioData";
import { useLocale } from "./LocaleProvider";
import ProjectVideos from "./ProjectVideos";
import ProjectHeader from "./ProjectHeader";

export default function ProjectOverview({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const highlights = locale === "vi" ? project.highlightsVi ?? project.highlights : project.highlights;
  return <article className="mx-auto max-w-6xl space-y-8 py-8 sm:py-12">
    <ProjectHeader project={project} />
    <section className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold">{t("Project scope", "Phạm vi dự án")}</h2>
      <ul className="grid gap-4 md:grid-cols-2">{highlights.map((item, index) => <li key={item} className="flex gap-4 rounded-xl border border-slate-800/70 bg-[#0c121f] p-5 text-sm leading-7 text-slate-300"><span aria-hidden="true" className="text-xs font-mono text-indigo-400">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></li>)}</ul>
    </section>
    {project.id === "banking-app" && <figure className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-4">
      <a href="/banking-architecture.png" target="_blank" rel="noreferrer"><Image src="/banking-architecture.webp" alt={t("AWS banking data platform architecture", "Kiến trúc nền tảng dữ liệu ngân hàng AWS")} width={1024} height={597} sizes="(max-width: 1024px) 100vw, 1024px" className="h-auto w-full rounded-lg" /></a>
      <figcaption className="mt-3 text-sm text-slate-400">{t("Architecture — select to open the full image.", "Kiến trúc hệ thống — nhấn để xem ảnh đầy đủ.")}</figcaption>
    </figure>}
    <ProjectVideos projectId={project.id} />
  </article>;
}
