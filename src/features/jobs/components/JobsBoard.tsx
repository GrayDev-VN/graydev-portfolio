"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { filterJobs } from "@/features/jobs/normalize";
import type { Job, JobCategory, JobLevel, JobSourceName, JobWorkMode } from "@/features/jobs/types";
import { JOB_SOURCE_NAMES } from "@/features/jobs/types";

const categories: { value: JobCategory; label: string }[] = [
  { value: "java-backend", label: "Java Backend" },
  { value: "ai-engineer", label: "AI Engineer" },
  { value: "backend-ai", label: "Backend + AI" },
];
const levels: JobLevel[] = ["intern", "fresher", "junior"];
const sourceNames = JOB_SOURCE_NAMES;
const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-700 bg-[#0c121f] px-3 text-sm text-slate-100 outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/40";

export default function JobsBoard({ jobs, collection }: { jobs: Job[]; collection?: { storage: "snapshot" | "postgres"; lastCollectedAt?: string } }) {
  const { locale, t } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [source, setSource] = useState("");
  const activeJobs = useMemo(() => filterJobs(jobs), [jobs]);
  const filtered = useMemo(() => filterJobs(activeJobs, {
    query,
    category: (category || undefined) as JobCategory | undefined,
    level: (level || undefined) as JobLevel | undefined,
    workMode: (workMode || undefined) as JobWorkMode | undefined,
    source: (source || undefined) as JobSourceName | undefined,
  }), [activeJobs, query, category, level, workMode, source]);
  const hasFilters = Boolean(query || category || level || workMode || source);

  function resetFilters() {
    setQuery(""); setCategory(""); setLevel(""); setWorkMode(""); setSource("");
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
  }

  function workLabel(value: Job["workMode"]) {
    if (value === "onsite") return t("On-site", "Tại văn phòng");
    if (value === "hybrid") return "Hybrid";
    if (value === "remote") return "Remote";
    return t("Work arrangement not specified", "Chưa rõ hình thức làm việc");
  }

  return <div className="mx-auto max-w-6xl py-8 sm:py-12">
    <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded text-sm text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-400"><ArrowLeft size={16} aria-hidden="true" />{t("Back to portfolio", "Về portfolio")}</Link>
    <header className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-950/60 via-[#0c121f] to-[#0c121f] p-6 sm:p-10">
      <p className="mb-5 font-mono text-xs tracking-[0.2em] text-indigo-300">GRAYDEV / JOBS</p>
      <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{t("Your next step in", "Bước tiếp theo cùng")}<span className="block text-indigo-300">Backend & AI</span></h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{t("Explore early-career Java Backend, AI Engineer and Backend + AI opportunities in Ho Chi Minh City. Check the original listing before applying.", "Khám phá cơ hội Java Backend, AI Engineer và Backend + AI cho người mới tại TP.HCM. Kiểm tra tin gốc trước khi ứng tuyển.")}</p>
      <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2"><MapPin size={14} aria-hidden="true" />{t("Ho Chi Minh City", "TP. Hồ Chí Minh")}</span>
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2">Intern / Fresher / Junior</span>
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2">{t("Original source links", "Dẫn về nguồn gốc")}</span>
      </div>
    </header>

    <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">{collection?.storage === "postgres"
      ? collection.lastCollectedAt
        ? <>{t("Last successful update: ", "Cập nhật thành công gần nhất: ")}<time dateTime={collection.lastCollectedAt}>{formatDate(collection.lastCollectedAt)}</time>. {t("Check each listing's review date and original source before applying.", "Kiểm tra ngày xác minh và tin gốc trước khi ứng tuyển.")}</>
        : t("No job collection has completed yet. Listings will appear after the first successful update.", "Chưa có lần thu thập job thành công. Tin sẽ xuất hiện sau lần cập nhật đầu tiên.")
      : t("Automated collection from the planned sources is not active. Check each listing's review date and original source before applying.", "Việc thu thập tự động từ các nguồn dự kiến chưa hoạt động. Kiểm tra ngày xác minh và tin gốc trước khi ứng tuyển.")}</p>

    <section aria-labelledby="job-filters-heading" className="mt-8 rounded-2xl border border-slate-800 bg-[#0c121f] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="job-filters-heading" className="flex items-center gap-2 text-base font-semibold"><SlidersHorizontal size={18} className="text-indigo-300" aria-hidden="true" />{t("Find your opportunity", "Tìm cơ hội phù hợp")}</h2>
        {hasFilters && <button type="button" onClick={resetFilters} className="min-h-11 rounded-lg px-3 text-sm text-indigo-300 hover:bg-indigo-400/10 focus-visible:outline-2 focus-visible:outline-indigo-400">{t("Clear filters", "Xóa bộ lọc")}</button>}
      </div>
      <label htmlFor="job-search" className="block text-sm text-slate-300">{t("Keyword, company or skill", "Từ khóa, công ty hoặc kỹ năng")}</label>
      <div className="relative"><Search size={18} className="pointer-events-none absolute left-3 top-6 text-slate-500" aria-hidden="true" /><input id="job-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("e.g. Spring Boot, Python, RAG", "Ví dụ: Spring Boot, Python, RAG")} className={`${fieldClass} pl-10`} /></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label htmlFor="job-category" className="text-sm text-slate-300">{t("Career path", "Nhóm nghề")}<select id="job-category" value={category} onChange={event => setCategory(event.target.value)} className={fieldClass}><option value="">{t("All paths", "Tất cả nhóm nghề")}</option>{categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label htmlFor="job-level" className="text-sm text-slate-300">{t("Level", "Cấp độ")}<select id="job-level" value={level} onChange={event => setLevel(event.target.value)} className={fieldClass}><option value="">{t("All levels", "Tất cả cấp độ")}</option>{levels.map(item => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
        <label htmlFor="job-work-mode" className="text-sm text-slate-300">{t("Work arrangement", "Hình thức làm việc")}<select id="job-work-mode" value={workMode} onChange={event => setWorkMode(event.target.value)} className={fieldClass}><option value="">{t("All arrangements", "Tất cả hình thức")}</option>{(["onsite", "hybrid", "remote", "unknown"] as const).map(item => <option key={item} value={item}>{workLabel(item)}</option>)}</select></label>
        <label htmlFor="job-source" className="text-sm text-slate-300">{t("Source", "Nguồn tin")}<select id="job-source" value={source} onChange={event => setSource(event.target.value)} className={fieldClass}><option value="">{t("All sources", "Tất cả nguồn")}</option>{sourceNames.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
    </section>

    <section aria-labelledby="job-results-heading" className="mt-9">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="job-results-heading" className="text-xl font-semibold">{t("Opportunities", "Cơ hội việc làm")}</h2>
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-slate-400">{filtered.length} / {activeJobs.length} {t("active jobs", "job còn hạn")}</p>
      </div>
      {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-700 bg-[#0c121f] px-5 py-14 text-center sm:px-10">
        <BriefcaseBusiness size={32} className="mx-auto mb-5 text-indigo-300" aria-hidden="true" />
        <h3 className="text-lg font-semibold">{activeJobs.length === 0 ? t("No published jobs yet", "Chưa có job được công bố") : t("No jobs match these filters", "Chưa có job khớp bộ lọc")}</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">{activeJobs.length === 0 ? t("There are no active listings in this board's scope right now. Please check again after the next source update.", "Hiện chưa có tin còn hạn trong phạm vi của bảng việc làm. Bạn có thể quay lại sau lần cập nhật nguồn tiếp theo.") : t("Try another keyword or clear some filters to explore more opportunities.", "Thử từ khóa khác hoặc bỏ bớt bộ lọc để xem thêm cơ hội.")}</p>
        {hasFilters && <button type="button" onClick={resetFilters} className="mt-6 min-h-11 rounded-xl border border-indigo-400/40 px-5 text-sm text-indigo-200 hover:bg-indigo-400/10 focus-visible:outline-2 focus-visible:outline-indigo-400">{t("Reset filters", "Đặt lại bộ lọc")}</button>}
      </div> : <ul className="grid gap-5 lg:grid-cols-2">{filtered.map(job => <li key={job.id} className="min-w-0"><article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-[#0c121f] p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap gap-2">{job.categories.map(item => <span key={item} className="rounded-full bg-indigo-400/10 px-3 py-1 text-xs text-indigo-300">{categories.find(value => value.value === item)?.label}</span>)}{job.levels.map(item => <span key={item} className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">{item}</span>)}</div>
        <h3 className="break-words text-xl font-semibold leading-snug">{job.title}</h3>
        <p className="mt-2 break-words text-sm font-medium text-slate-300">{job.company}</p>
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-400"><MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{job.location} · {workLabel(job.workMode)}</span></p>
        <p className="mt-3 text-sm text-emerald-300">{job.salary || t("Salary not disclosed", "Chưa công khai mức lương")}</p>
        <div className="mt-5 flex flex-wrap gap-2">{job.skills.map(skill => <span key={skill} className="max-w-full break-words rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300">{skill}</span>)}</div>
        <details className="my-5 text-sm"><summary className="min-h-11 cursor-pointer rounded py-3 text-indigo-300 focus-visible:outline-2 focus-visible:outline-indigo-400">{t("Read job description", "Đọc mô tả công việc")}</summary><p className="whitespace-pre-wrap break-words leading-7 text-slate-400">{job.description}</p></details>
        <div className="mt-auto border-t border-slate-800 pt-4">
          <dl className="mb-4 space-y-1 text-xs leading-6 text-slate-400">
            {job.postedAt && <div className="flex flex-wrap gap-x-1"><dt>{t("Posted:", "Ngày đăng:")}</dt><dd><time dateTime={job.postedAt}>{formatDate(job.postedAt)}</time></dd></div>}
            <div className="flex flex-wrap gap-x-1"><dt>{t("Last checked:", "Kiểm tra gần nhất:")}</dt><dd><time dateTime={job.checkedAt}>{formatDate(job.checkedAt)}</time></dd></div>
            {job.expiresAt && <div className="flex flex-wrap gap-x-1"><dt>{t("Expires:", "Hết hạn:")}</dt><dd><time dateTime={job.expiresAt}>{formatDate(job.expiresAt)}</time></dd></div>}
          </dl>
          <p className="mb-2 text-xs text-slate-400">{t("View original listing & apply", "Xem tin gốc & ứng tuyển")}</p>
          <div className="flex flex-wrap gap-2">{job.sources.map(origin => <a key={`${origin.name}-${origin.url}`} href={origin.url} target="_blank" rel="noopener noreferrer" aria-label={`${t("View", "Xem")} ${job.title} ${t("on", "trên")} ${origin.name}${origin.status === "expired" ? t(" (closed listing)", " (tin đã đóng)") : ""} (${t("opens in a new tab", "mở tab mới")})`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-indigo-400/30 px-3 text-sm text-indigo-200 hover:bg-indigo-400/10 focus-visible:outline-2 focus-visible:outline-indigo-400">{origin.name}{origin.status === "expired" && <span className="text-xs text-slate-400">{t("(closed)", "(đã đóng)")}</span>}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
        </div>
      </article></li>)}</ul>}
    </section>

    <aside aria-labelledby="cv-roadmap-heading" className="mt-9 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">{t("Planned next", "Giai đoạn tiếp theo")}</p>
      <h2 id="cv-roadmap-heading" className="text-lg font-semibold">{t("Find matches with your CV", "Tìm job phù hợp với CV")}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{t("CV upload and analysis are not available yet. A future version will let you review extracted information and understand matches using evidence from your CV and each job description.", "Tính năng tải và phân tích CV chưa khả dụng. Phiên bản sau sẽ cho bạn kiểm tra thông tin trích xuất và hiểu mức phù hợp qua bằng chứng từ CV cùng mô tả công việc.")}</p>
    </aside>
  </div>;
}
