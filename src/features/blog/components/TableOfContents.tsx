"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUp, BookOpen, ChevronDown } from "lucide-react";
import type { TocItem } from "../types";
import { useLocale } from "@/components/LocaleProvider";
import { formatWithAmpersand } from "@/components/CleanAmpersand";

interface TableOfContentsProps {
  headings: TocItem[];
  activeId: string;
  progress: number;
  onJump: (event: React.MouseEvent, id: string) => void;
  onBackToTop: () => void;
  mobile?: boolean;
}

export default function TableOfContents({ headings, activeId, progress, onJump, onBackToTop, mobile = false }: TableOfContentsProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const sectionCount = headings.filter((item) => item.level === 2).length;
  const currentId = activeId || headings[0]?.id;
  let sectionNumber = 0;

  useEffect(() => {
    const list = listRef.current;
    if (!list || (mobile && !open)) return;
    const active = list.querySelector<HTMLElement>('[aria-current="location"]');
    if (!active) return;
    const bounds = list.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    // Keep the current link in view without scrolling the article itself.
    if (item.top < bounds.top + 12 || item.bottom > bounds.bottom - 12) {
      list.scrollTo({ top: list.scrollTop + item.top - bounds.top - list.clientHeight / 2 + item.height / 2, behavior: "auto" });
    }
  }, [currentId, mobile, open]);

  if (!headings.length) return null;

  const header = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300">
        <BookOpen size={16} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold tracking-tight text-slate-100">{t("In this article", "Trong bài viết này")}</span>
        <span className="mt-0.5 block text-[11px] font-normal text-slate-500">
          {sectionCount || headings.length} {t("sections to explore", "phần nội dung")}
        </span>
      </span>
    </>
  );

  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#101827] to-[#0a101c] font-[Plus_Jakarta_Sans] ${mobile ? "mb-7 lg:hidden" : "shadow-[0_16px_48px_-32px_rgba(0,0,0,0.7)]"}`}>
      {mobile ? (
        <button type="button" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400">
          {header}
          <ChevronDown size={16} aria-hidden="true" className={`text-slate-400 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <div className="flex items-center gap-3 px-5 pb-4 pt-5">{header}</div>
      )}

      <div id={listId} hidden={mobile && !open}>
        <nav aria-label={t("Table of contents", "Mục lục bài viết")} className="px-3 pb-3">
          <ol ref={listRef} className={`blog-toc-scroll relative space-y-0.5 overflow-y-auto overscroll-contain pr-1 ${mobile ? "max-h-[min(55dvh,24rem)]" : "max-h-[min(52dvh,32rem)]"}`}>
            {headings.map((item) => {
              const primary = item.level === 2;
              if (primary) sectionNumber++;
              const active = currentId === item.id;
              const label = primary ? item.text.replace(/^\d+[.):]\s+/, "") : item.text;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={(event) => { onJump(event, item.id); if (mobile) setOpen(false); }}
                    className={`group relative flex items-start gap-3 rounded-lg py-2.5 pr-3 text-[13px] leading-[1.65] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 motion-reduce:transition-none ${primary ? "pl-3" : "pl-[3.25rem]"} ${active ? "bg-indigo-400/[0.09] text-indigo-200" : primary ? "text-slate-300 hover:bg-white/[0.03] hover:text-slate-100" : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"}`}
                  >
                    {active && <span aria-hidden="true" className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-indigo-400" />}
                    {primary ? (
                      <span aria-hidden="true" className={`mt-0.5 w-5 shrink-0 font-[JetBrains_Mono] text-[10px] tabular-nums ${active ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-500"}`}>{String(sectionNumber).padStart(2, "0")}</span>
                    ) : (
                      <span aria-hidden="true" className={`absolute bottom-0 left-[1.3rem] top-0 w-px ${active ? "bg-indigo-400/40" : "bg-slate-800"}`} />
                    )}
                    <span className={`min-w-0 break-words ${primary || active ? "font-medium" : "font-normal"}`}>{formatWithAmpersand(label)}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="border-t border-slate-800/80 px-5 pb-4 pt-3.5">
          <div className="mb-2.5 flex items-center justify-between text-[10px] font-medium text-slate-500">
            <span>{t("Reading progress", "Tiến độ đọc")}</span>
            <span className="font-[JetBrains_Mono] tabular-nums text-indigo-300">{Math.round(progress)}%</span>
          </div>
          <div role="progressbar" aria-label={t("Reading progress", "Tiến độ đọc")} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-[width] duration-150 motion-reduce:transition-none" />
          </div>
          <button type="button" onClick={onBackToTop} className="mt-3.5 inline-flex items-center gap-1.5 rounded text-[11px] text-slate-500 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            <ArrowUp size={12} aria-hidden="true" />
            {t("Back to top", "Về đầu bài viết")}
          </button>
        </div>
      </div>
    </section>
  );
}
