"use client";

/**
 * Sticky Lesson Toolbar (Batch 3) — Coursera-style bar pinned under the
 * header while reading: lesson title, live reading progress, resume-from-
 * last-position, mobile table of contents, and prev/next jumps.
 * 44px touch targets, full keyboard support, reduced-motion safe.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import { useReadingProgress } from "@/components/motion";
import { useReadingPosition } from "@/lib/reading";
import type { TocItem } from "@/components/LessonToc";
import {
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  PlayIcon,
} from "@/components/icons";

export type LessonNav = { href: string; title: string } | null;

export function LessonToolbar({
  lessonId,
  title,
  readingMinutes,
  tocItems,
  prev,
  next,
}: {
  lessonId: string;
  title: string;
  readingMinutes: number;
  tocItems: TocItem[];
  prev: LessonNav;
  next: LessonNav;
}) {
  const percent = useReadingProgress("lesson-body");
  const { canResume, resume } = useReadingPosition(lessonId);
  const [tocOpen, setTocOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement | null>(null);

  /* Close the TOC sheet on outside click / Escape. */
  useEffect(() => {
    if (!tocOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (tocRef.current && !tocRef.current.contains(e.target as Node)) setTocOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTocOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [tocOpen]);

  const rounded = Math.round(percent);

  return (
    <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-hairline bg-canvas/85 px-4 py-2.5 backdrop-blur-xl backdrop-saturate-150 sm:-mx-6 sm:px-6 md:top-[4.5rem] lg:-mx-8 lg:px-8 dark:bg-canvas/70">
      <div className="flex items-center gap-2.5">
        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{title}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-2xs font-medium text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="h-3 w-3" />
            {readingMinutes} دقيقة قراءة
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{rounded}%</span>
          </p>
        </div>

        {/* Reading progress (desktop) */}
        <div
          className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-neutral-200/80 md:block dark:bg-white/10"
          role="progressbar"
          aria-label="تقدم القراءة في الصفحة"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-200 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Resume from last position */}
        {canResume && (
          <button
            type="button"
            onClick={resume}
            className={`inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary-50 px-3 text-xs font-bold text-primary-700 ring-1 ring-inset ring-primary-500/25 transition-all duration-fast ease-smooth hover:bg-primary-100 hover:ring-primary-500/40 active:scale-95 md:h-9 dark:bg-primary-500/15 dark:text-primary-300 dark:ring-primary-400/25 dark:hover:bg-primary-500/25 ${focusRing}`}
          >
            <PlayIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">متابعة من آخر موضع</span>
            <span className="sm:hidden">استئناف</span>
          </button>
        )}

        {/* Mobile TOC */}
        {tocItems.length > 0 && (
          <div ref={tocRef} className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setTocOpen((o) => !o)}
              aria-expanded={tocOpen}
              aria-haspopup="menu"
              aria-label="محتويات الدرس"
              title="محتويات الدرس"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-surface text-neutral-600 transition-all duration-fast ease-smooth hover:border-hairline-strong hover:text-neutral-900 active:scale-95 md:h-9 md:w-9 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:text-white ${focusRing} ${
                tocOpen ? "border-primary-500/40 text-primary-600" : ""
              }`}
            >
              <BookIcon className="h-[18px] w-[18px]" />
            </button>

            {tocOpen && (
              <div
                role="menu"
                aria-label="محتويات الدرس"
                className="absolute end-0 top-full z-40 mt-2 max-h-[70vh] w-72 origin-top animate-scale-in overflow-y-auto rounded-2xl border border-hairline bg-surface p-2 shadow-xl dark:bg-surface-raised dark:shadow-black/60"
              >
                <p className="px-3 pb-2 pt-2 text-2xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  في هذا الدرس
                </p>
                <ul className="space-y-0.5">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        role="menuitem"
                        onClick={() => setTocOpen(false)}
                        className={`block rounded-xl px-3 py-2 text-xs leading-relaxed text-neutral-600 transition-colors duration-fast hover:bg-neutral-200/50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white ${focusRing} ${
                          item.level === 3 ? "ps-6" : "font-semibold"
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Prev / Next */}
        <div className="flex items-center gap-1.5">
          {prev ? (
            <Link
              href={prev.href}
              title={`الدرس السابق: ${prev.title}`}
              aria-label={`الدرس السابق: ${prev.title}`}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-surface text-neutral-600 transition-all duration-fast ease-smooth hover:-translate-y-px hover:border-hairline-strong hover:text-neutral-900 active:scale-95 md:h-9 md:w-9 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:text-white ${focusRing}`}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ) : null}
          {next ? (
            <Link
              href={next.href}
              title={`الدرس التالي: ${next.title}`}
              aria-label={`الدرس التالي: ${next.title}`}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-all duration-fast ease-smooth hover:-translate-y-px hover:bg-primary-700 hover:shadow-md active:scale-95 md:h-9 md:w-9 dark:bg-primary-500 dark:hover:bg-primary-400 ${focusRing}`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Thin progress bar on mobile */}
      <div
        className="mt-2 h-0.5 overflow-hidden rounded-full bg-neutral-200/70 md:hidden dark:bg-white/10"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
