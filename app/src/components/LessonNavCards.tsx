"use client";

/**
 * Bottom prev/next cards (Phase 11 — Batch 2/5).
 * When the next lesson is locked, the card becomes a button that opens the
 * lock dialog instead of navigating.
 */
import { useState } from "react";
import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import type { LockInfo } from "@/lib/locks";
import { LockModal } from "./LockUI";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from "@/components/icons";

export type NavRef = { href: string; title: string };

export function LessonNavCards({
  prev,
  next,
  nextLock,
  prevLock,
}: {
  prev: NavRef | null;
  next: NavRef | null;
  nextLock?: LockInfo | null;
  prevLock?: LockInfo | null;
}) {
  const [modalLock, setModalLock] = useState<LockInfo | null>(null);

  return (
    <div className="mt-6 grid gap-3 border-t border-hairline pt-5 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className={`group flex items-center gap-3 rounded-2xl border border-hairline bg-surface p-4 transition-all duration-fast hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-sm ${focusRing}`}
        >
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-base group-hover:translate-x-1" />
          <span className="min-w-0">
            <span className="block text-2xs font-semibold text-neutral-400">الدرس السابق</span>
            <span className="block truncate text-sm font-bold text-neutral-800 dark:text-neutral-100">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        nextLock?.locked ? (
          <button
            type="button"
            onClick={() => setModalLock(nextLock)}
            className={`group flex items-center justify-end gap-3 rounded-2xl border border-hairline bg-surface-muted/60 p-4 text-left opacity-80 transition-all duration-fast hover:border-warning-500/40 ${focusRing} sm:col-start-2`}
          >
            <span className="min-w-0 text-right">
              <span className="block text-2xs font-semibold text-warning-600">الدرس التالي — مقفل</span>
              <span className="block truncate text-sm font-bold text-neutral-700 dark:text-neutral-300">
                {next.title}
              </span>
              <span className="mt-0.5 block text-2xs text-neutral-400">أكمل هذا الدرس أولاً لفتحه</span>
            </span>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
              aria-hidden="true"
            >
              <LockIcon className="h-4 w-4" />
            </span>
          </button>
        ) : (
          <Link
            href={next.href}
            className={`group flex items-center justify-end gap-3 rounded-2xl border border-primary-500/20 bg-primary-50/60 p-4 text-left transition-all duration-fast hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-sm ${focusRing} sm:col-start-2`}
          >
            <span className="min-w-0 text-right">
              <span className="block text-2xs font-semibold text-primary-600">الدرس التالي</span>
              <span className="block truncate text-sm font-bold text-neutral-900 dark:text-white">
                {next.title}
              </span>
            </span>
            <ArrowLeftIcon className="h-4 w-4 shrink-0 text-primary-600 transition-transform duration-base group-hover:-translate-x-1" />
          </Link>
        )
      ) : null}

      <LockModal open={Boolean(modalLock)} lock={modalLock ?? { locked: true, message: "", reason: null }} onClose={() => setModalLock(null)} />
    </div>
  );
}
