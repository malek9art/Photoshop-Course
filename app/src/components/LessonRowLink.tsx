"use client";

/**
 * Lesson row with lock awareness (Phase 11 — Batch 2).
 * Renders a lesson list item; when the lesson is locked it becomes a button
 * that opens the professional LockModal (Batch 8) instead of navigating.
 * Reused by the stage page and the lesson sidebar.
 */
import { useState } from "react";
import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import type { LockInfo } from "@/lib/locks";
import { LockModal } from "./LockUI";
import { CheckIcon, LockIcon, ChevronLeftIcon, ClockIcon } from "@/components/icons";

export type LessonRowModel = {
  id: string;
  title: string;
  durationMin: number | null;
  position: number;
  state: string | null;
  status: string;
  available: boolean;
};

function StateChip({ state, status }: { state: string | null; status: string }) {
  if (state === "completed")
    return (
      <span className="badge-green">
        <CheckIcon className="h-3 w-3" strokeWidth={2.6} />
        مكتمل
      </span>
    );
  if (state === "in_progress") return <span className="badge-amber">قيد التقدم</span>;
  if (status === "published") return <span className="badge-brand">متاح</span>;
  if (status === "in_review") return <span className="badge-amber">قيد المراجعة</span>;
  return <span className="badge-gray">قريبًا</span>;
}

export function LessonRowLink({
  lesson,
  lock,
  current = false,
  onOpen,
}: {
  lesson: LessonRowModel;
  lock: LockInfo;
  current?: boolean;
  onOpen?: (lock: LockInfo) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const locked = lock.locked;

  const rowClass = `group flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-start transition-all duration-fast ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
    current
      ? "border-primary-500/30 bg-primary-50/70 dark:border-primary-400/25 dark:bg-primary-500/10"
      : locked
        ? "cursor-not-allowed border-transparent opacity-60"
        : "border-transparent hover:border-hairline hover:bg-surface-muted dark:hover:bg-white/5"
  }`;

  const iconBox = `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
    lesson.state === "completed"
      ? "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500"
      : locked
        ? "bg-neutral-100 text-neutral-400 dark:bg-white/5 dark:text-neutral-500"
        : current
          ? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
          : "bg-surface-muted text-neutral-500 ring-1 ring-hairline group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-500/15 dark:group-hover:text-primary-300"
  }`;

  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span className={iconBox} aria-hidden="true">
          {lesson.state === "completed" ? (
            <CheckIcon className="h-4 w-4" strokeWidth={2.6} />
          ) : locked ? (
            <LockIcon className="h-4 w-4" />
          ) : (
            lesson.position
          )}
        </span>
        <span className="min-w-0">
          <span
            className={`block truncate text-sm font-semibold ${
              current
                ? "text-primary-800 dark:text-primary-200"
                : locked
                  ? "text-neutral-500 dark:text-neutral-500"
                  : "text-neutral-800 dark:text-neutral-100"
            }`}
          >
            {lesson.title}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-2xs text-neutral-400 dark:text-neutral-500">
            <span className="font-mono" dir="ltr">
              {lesson.id}
            </span>
            {lesson.durationMin ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {lesson.durationMin} د
                </span>
              </>
            ) : null}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <StateChip state={lesson.state} status={lesson.status} />
        {!locked && !current && (
          <ChevronLeftIcon className="h-4 w-4 text-neutral-300 transition-all duration-base group-hover:-translate-x-0.5 group-hover:text-primary-600 dark:text-neutral-600" />
        )}
      </span>
    </>
  );

  const handleClick = () => {
    if (onOpen) onOpen(lock);
    else setModalOpen(true);
  };

  return (
    <>
      {locked ? (
        <li>
          <button type="button" onClick={handleClick} aria-label={`فتح تفاصيل: ${lesson.title} (مقفل)`} className={rowClass}>
            {inner}
          </button>
          <LockModal open={modalOpen} lock={lock} onClose={() => setModalOpen(false)} />
        </li>
      ) : (
        <li>
          <Link
            href={`/learn/${lesson.id}`}
            aria-current={current ? "page" : undefined}
            aria-label={lesson.title}
            className={`${rowClass} ${focusRing}`}
          >
            {inner}
          </Link>
        </li>
      )}
    </>
  );
}
