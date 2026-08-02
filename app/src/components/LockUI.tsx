"use client";

/**
 * Professional lock dialog (Phase 11 — Batch 8): explains WHY an item is
 * locked, WHAT to complete first, and offers a direct jump button.
 * Native dialog semantics (role=dialog, focus trap, Escape), RTL, 44px
 * touch targets, reduced-motion safe.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import type { LockInfo } from "@/lib/locks";
import { LockIcon, ArrowLeftIcon, BookIcon, QuizIcon, ExamIcon, XIcon } from "@/components/icons";

export function lockHeadline(lock: LockInfo): string {
  switch (lock.reason?.code) {
    case "prev-lesson":
      return "هذا الدرس مقفل";
    case "quiz-module":
      return "اختبار الوحدة مقفل";
    case "exam-stage":
      return "اختبار المرحلة مقفل";
    case "unavailable":
      return "غير متاح بعد";
    default:
      return "مقفل";
  }
}

export function lockCta(lock: LockInfo): { label: string; href: string } | null {
  const r = lock.reason;
  if (!r) return null;
  if (r.code === "unavailable") return null;
  if (r.code === "quiz-module" || r.code === "exam-stage") {
    if (r.lesson) return { label: `الانتقال إلى الدرس: ${r.lesson.title}`, href: r.lesson.href };
    return { label: "العودة إلى المرحلة", href: "#" };
  }
  return { label: `إكمال درس «${r.lesson.title}»`, href: r.lesson.href };
}

function LockIconBadge({ code }: { code: string }) {
  if (code === "quiz-module") return <QuizIcon className="h-6 w-6" />;
  if (code === "exam-stage") return <ExamIcon className="h-6 w-6" />;
  return <LockIcon className="h-6 w-6" />;
}

/** Full-screen locked state (server pages) — no content is rendered. */
export function LockedContent({
  lock,
  title,
  icon,
}: {
  lock: LockInfo;
  title: string;
  icon?: React.ReactNode;
}) {
  const cta = lockCta(lock);
  const headline = lockHeadline(lock);
  const r = lock.reason;

  return (
    <div className="mx-auto max-w-lg animate-fade-up">
      <div className="card relative overflow-hidden p-8 text-center md:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,rgb(var(--accent-500)/0.08),transparent_60%)]"
        />
        <div className="relative">
          <span
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 ring-1 ring-inset ring-hairline dark:bg-white/5 dark:text-neutral-500 dark:ring-white/10"
            aria-hidden="true"
          >
            {icon ?? (
              <span className="text-3xl">
                <LockIconBadge code={r?.code ?? "unavailable"} />
              </span>
            )}
          </span>

          <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-3 py-1 text-2xs font-bold text-warning-700 ring-1 ring-inset ring-warning-500/25 dark:bg-warning-500/10 dark:text-warning-500">
            <LockIcon className="h-3 w-3" />
            {headline}
          </p>

          <h1 className="mt-4 text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">{title}</h1>

          <div className="mx-auto mt-4 max-w-sm">
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{lock.message}</p>
            {r?.code === "prev-lesson" && (
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                {r.message}
              </p>
            )}
            {r?.code === "quiz-module" && (
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                {r.message}
              </p>
            )}
            {r?.code === "exam-stage" && (
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                {r.message}
              </p>
            )}
          </div>

          {/* What to complete first */}
          {r?.code !== "unavailable" && r && (
            <div className="mt-6 flex items-center justify-center">
              <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-hairline bg-surface-muted/70 px-4 py-3.5 text-start">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-500/20 dark:bg-primary-500/15 dark:text-primary-300"
                  aria-hidden="true"
                >
                  <BookIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-2xs font-semibold text-neutral-400 dark:text-neutral-500">المطلوب إكماله أولاً</p>
                  <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                    {r.code === "prev-lesson"
                      ? r.lesson.title
                      : r.code === "quiz-module"
                        ? `جميع دروس وحدة «${r.moduleTitle}»`
                        : `جميع دروس مرحلة «${r.stageTitle}»`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
            {cta ? (
              <Link href={cta.href} className="btn-primary w-full justify-center sm:w-auto">
                {cta.label}
                <ArrowLeftIcon className="h-4 w-4" />
              </Link>
            ) : null}
            <Link href="/catalog" className="btn-outline w-full justify-center sm:w-auto">
              تصفح المكتبة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- LockModal */

/**
 * Inline lock dialog used by list rows (stage page, lesson sidebar).
 * Controlled by the parent (open/onClose) — zero global state.
 */
export function LockModal({
  open,
  lock,
  onClose,
}: {
  open: boolean;
  lock: LockInfo;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Trap Tab inside the dialog.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Move focus into the dialog.
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
    }, 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  const cta = lockCta(lock);
  const r = lock.reason;

  return (
    <div className="fixed inset-0 z-overlay flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="العنصر مقفل">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-neutral-950/55 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-md animate-scale-in rounded-3xl border border-hairline bg-surface p-6 shadow-xl dark:border-white/10 dark:bg-surface-raised md:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className={`absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900 md:h-9 md:w-9 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing}`}
        >
          <XIcon className="h-[18px] w-[18px]" />
        </button>

        <div className="flex items-start gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-500/25 dark:bg-warning-500/10 dark:text-warning-500"
            aria-hidden="true"
          >
            <LockIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tighter text-neutral-900 dark:text-white">
              {lockHeadline(lock)}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{lock.message}</p>
          </div>
        </div>

        {r && r.code !== "unavailable" && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-hairline bg-surface-muted/70 px-4 py-3.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"
              aria-hidden="true"
            >
              <BookIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-2xs font-semibold text-neutral-400 dark:text-neutral-500">أكمل أولاً</p>
              <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                {r.code === "prev-lesson"
                  ? r.lesson.title
                  : r.code === "quiz-module"
                    ? `جميع دروس وحدة «${r.moduleTitle}»`
                    : `جميع دروس مرحلة «${r.stageTitle}»`}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
          {cta ? (
            <Link href={cta.href} className="btn-primary w-full justify-center sm:flex-1" onClick={onClose}>
              {cta.label}
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          ) : null}
          <button type="button" onClick={onClose} className="btn-outline w-full justify-center sm:flex-1">
            لاحقًا
          </button>
        </div>
      </div>
    </div>
  );
}
