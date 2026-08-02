"use client";

/**
 * Link with server-side lock awareness (Phase 11 — Batch 2).
 * Unlocked → normal Link. Locked → button that opens the LockModal,
 * so direct navigation never happens from the UI.
 */
import { useState } from "react";
import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import type { LockInfo } from "@/lib/locks";
import { LockModal } from "./LockUI";
import { LockIcon } from "@/components/icons";

export function GateLink({
  href,
  lock,
  className = "",
  children,
  lockedClassName = "",
}: {
  href: string;
  lock: LockInfo;
  className?: string;
  lockedClassName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!lock.locked) {
    return (
      <Link href={href} className={`${className} ${focusRing}`}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="عنصر مقفل — اضغط للتفاصيل"
        className={`${className} ${lockedClassName} ${focusRing}`}
      >
        {children}
      </button>
      <LockModal open={open} lock={lock} onClose={() => setOpen(false)} />
    </>
  );
}

/** Small lock chip used next to locked titles. */
export function LockChip({ label = "مقفل" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-2xs font-bold text-neutral-500 ring-1 ring-inset ring-hairline dark:bg-white/5 dark:text-neutral-400 dark:ring-white/10">
      <LockIcon className="h-3 w-3" />
      {label}
    </span>
  );
}
