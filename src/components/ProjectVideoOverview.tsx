"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Film } from "lucide-react";
import type { Project } from "@/data/portfolioData";
import { PROJECT_VIDEOS } from "@/data/projectVideos";
import ProjectVideos from "./ProjectVideos";
import { useLocale } from "./LocaleProvider";

export default function ProjectVideoOverview({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const projectId = project.id;
  const [playing, setPlaying] = useState(false);
  const [scene, setScene] = useState(0);
  const title = locale === "vi" ? project.titleVi ?? project.title : project.title;
  const highlights = (locale === "vi" ? project.highlightsVi ?? project.highlights : project.highlights).slice(0, 3);
  const hasVideo = !!PROJECT_VIDEOS[projectId]?.length;

  useEffect(() => {
    if (!playing || hasVideo) return;
    const timer = window.setInterval(() => setScene(current => (current + 1) % highlights.length), 4000);
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", pause);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", pause); };
  }, [playing, hasVideo, highlights.length]);

  return <div className="mb-5 overflow-hidden rounded-xl border border-[#1e293b] bg-[#080d17]">
    <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3 text-xs font-mono text-indigo-300"><Film size={15} aria-hidden="true" />Video overview</div>
    {hasVideo ? <ProjectVideos key={projectId} projectId={projectId} sectionId={`videos-${projectId}`} /> : <>
      <div className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden bg-[#060911] px-5 pb-6 pt-14 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 cyber-grid" />
        <div aria-hidden="true" className="pointer-events-none absolute h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <span className="absolute left-4 top-4 rounded border border-slate-700 bg-[#101827] px-2.5 py-1 text-[10px] font-mono tracking-wider text-slate-400">{t("MOCK PREVIEW · NOT A VIDEO", "BẢN MINH HỌA · CHƯA CÓ VIDEO")}</span>
        <div className="relative max-w-2xl">
          {!playing && <button type="button" onClick={() => setPlaying(true)} aria-label={t("Play mock preview", "Chạy bản minh họa")} className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/20 text-indigo-200 transition-colors hover:bg-indigo-500/40"><Play size={25} className="ml-1" /></button>}
          <p className="mb-3 text-[11px] font-mono uppercase tracking-widest text-indigo-400">{playing ? `${t("HIGHLIGHT", "ĐIỂM NỔI BẬT")} 0${scene + 1}` : "PROJECT OVERVIEW"}</p>
          <h4 className="font-display text-base font-semibold leading-snug text-white">{title}</h4>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-slate-400">{playing ? highlights[scene] : t("A preview of the player layout. The project recording will appear here once added.", "Xem thử bố cục trình phát. Video dự án sẽ hiển thị tại đây khi được thêm vào.")}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-slate-800 px-4 py-2">
        <button type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? t("Pause preview", "Tạm dừng minh họa") : t("Play preview", "Chạy minh họa")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-indigo-300 hover:bg-slate-800">{playing ? <Pause size={19} /> : <Play size={19} />}</button>
        <div className="flex flex-1 gap-2">{highlights.map((_, index) => <button key={index} type="button" onClick={() => { setScene(index); setPlaying(true); }} aria-label={`${t("Preview scene", "Cảnh minh họa")} ${index + 1}`} aria-current={scene === index ? "step" : undefined} className="flex min-h-11 flex-1 items-center"><span className={`h-1 w-full rounded-full ${scene === index ? "bg-indigo-400" : "bg-slate-700"}`} /></button>)}</div>
        <button type="button" onClick={() => { setScene(0); setPlaying(false); }} aria-label={t("Reset preview", "Đặt lại minh họa")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800"><RotateCcw size={17} /></button>
      </div>
    </>}
  </div>;
}
