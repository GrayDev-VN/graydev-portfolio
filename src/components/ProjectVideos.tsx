"use client";

import { useState } from "react";
import { useLocale } from "./LocaleProvider";
import { PROJECT_VIDEOS, type ProjectVideo } from "@/data/projectVideos";

function Recording({ video }: { video: ProjectVideo }) {
  const { locale, t } = useLocale();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const title = locale === "vi" ? video.titleVi ?? video.title : video.title;
  const description = locale === "vi" ? video.descriptionVi ?? video.description : video.description;
  return <article className="overflow-hidden rounded-xl border border-slate-800 bg-[#060911]">
    {video.provider === "youtube" ? (
      playing ? <iframe className="aspect-video w-full border-0" src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}`} title={title} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        : <button type="button" onClick={() => setPlaying(true)} className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-950/60 to-[#060911] px-6 text-indigo-200 hover:bg-indigo-950/40">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full border border-indigo-400/40 text-2xl">▶</span>
          <span>{t("Watch video", "Xem video")}: {title}</span>
        </button>
    ) : <video controls playsInline preload="none" poster={video.poster} onError={() => setFailed(true)} aria-label={title} className="aspect-video w-full bg-black">
      <source src={video.src} />
      {video.captions?.map((track, index) => <track key={track.src} kind="captions" src={track.src} srcLang={track.language} label={track.label} default={index === 0} />)}
    </video>}
    <div className="space-y-3 p-5">
      <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">{video.kind === "overview" ? t("Project overview", "Tổng quan dự án") : t("Walkthrough", "Hướng dẫn sử dụng")}</p>
      <h3 className="font-semibold text-white">{title}</h3>
      {description && <p className="text-sm leading-6 text-slate-400">{description}</p>}
      {failed && <p role="alert" className="text-sm text-amber-300">{t("The video could not load. Try opening it directly below.", "Không tải được video. Bạn có thể mở trực tiếp bằng liên kết bên dưới.")}</p>}
      <a href={video.provider === "youtube" ? `https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}` : video.src} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm text-indigo-300 hover:text-white">{t("Open video in a new tab", "Mở video trong tab mới")} ↗</a>
    </div>
  </article>;
}

export default function ProjectVideos({ projectId, sectionId = "videos" }: { projectId: string; sectionId?: string }) {
  const { t } = useLocale();
  const videos = PROJECT_VIDEOS[projectId] ?? [];
  if (!videos.length) return null;
  return <section id={sectionId} className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 sm:p-8">
    <h2 className="mb-3 text-2xl font-bold">{t("Overview & walkthroughs", "Video tổng quan & hướng dẫn")}</h2>
    {videos.length ? <div className="mt-6 grid gap-6">{videos.map(video => <Recording key={video.id} video={video} />)}</div>
      : <p className="text-sm leading-7 text-slate-400">{t("No video has been published for this project yet. Explore the overview and source code on this page.", "Dự án chưa có video được đăng. Bạn có thể xem phần tổng quan và mã nguồn trên trang này.")}</p>}
  </section>;
}
