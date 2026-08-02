import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import type { PathContext } from "@/lib/locks";
import { ChevronLeftIcon, ClockIcon, BookIcon, CheckIcon } from "@/components/icons";

/**
 * Progress Map trail (Phase 11 — Batch 6).
 * A single bar showing: current stage → current module → current lesson,
 * the overall percent, and the last visited lesson. Coursera-style breadcrumb.
 */
export function PathTrail({ context, className = "" }: { context: PathContext; className?: string }) {
  const { stageTitle, moduleTitle, lessonTitle, overallPercent, lastVisited } = context;

  return (
    <nav
      aria-label="مسار التقدم"
      className={`rounded-2xl border border-hairline bg-surface-muted/50 p-3.5 dark:border-white/10 dark:bg-white/[0.03] ${className}`}
    >
      {/* Trail */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
        <li className="flex items-center gap-2">
          <span className="font-mono font-bold text-primary-600 dark:text-primary-400" aria-hidden="true">
            {context.stageId}
          </span>
          <Link
            href={`/catalog/${context.stageId}`}
            className={`max-w-[10rem] truncate font-semibold text-neutral-700 transition-colors hover:text-primary-600 dark:text-neutral-200 dark:hover:text-primary-300 ${focusRing}`}
          >
            {stageTitle}
          </Link>
        </li>
        <ChevronLeftIcon className="h-3 w-3 shrink-0 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
        <li className="max-w-[10rem] truncate font-semibold text-neutral-600 dark:text-neutral-300">{moduleTitle}</li>
        <ChevronLeftIcon className="h-3 w-3 shrink-0 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
        <li className="truncate font-bold text-neutral-900 dark:text-white" aria-current="location">
          {lessonTitle}
        </li>
      </ol>

      {/* Metrics */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-3 dark:border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10"
            role="progressbar"
            aria-label="نسبة الإنجاز الكلية"
            aria-valuenow={overallPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-500 ease-out-expo"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <span className="font-mono text-2xs font-bold tabular-nums text-primary-600 dark:text-primary-400">
            {overallPercent}%
          </span>
          <span className="hidden text-2xs font-medium text-neutral-500 sm:inline dark:text-neutral-400">
            إجمالي التقدم
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"
            aria-hidden="true"
          >
            <BookIcon className="h-3 w-3" />
          </span>
          <span className="text-2xs font-medium text-neutral-500 dark:text-neutral-400">
            الدرس {context.chainIndex + 1} من {context.chainLength} في المسار
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400"
            aria-hidden="true"
          >
            <ClockIcon className="h-3 w-3" />
          </span>
          <span className="text-2xs font-medium text-neutral-500 dark:text-neutral-400">
            تقدم المرحلة الحالية {context.stagePercent}%
          </span>
        </div>

        {lastVisited && (
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
              aria-hidden="true"
            >
              <CheckIcon className="h-3 w-3" strokeWidth={2.4} />
            </span>
            <Link
              href={lastVisited.href}
              className={`truncate text-2xs font-medium text-neutral-500 underline decoration-hairline-strong underline-offset-2 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-300 ${focusRing}`}
            >
              آخر درس تمت زيارته: {lastVisited.title}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
