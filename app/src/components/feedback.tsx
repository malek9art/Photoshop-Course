"use client";

import { useEffect, useState } from "react";

/** Skeleton block — DOC-04 §4 Loading (skeleton placeholders, not raw spinners). */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-neutral-200 ${className}`}
    />
  );
}

/**
 * Spinner — reduced-motion safe (DOC-06 §7): static when prefers-reduced-motion.
 * Used only as a minimal fallback inside buttons/actions; skeletons preferred for content.
 */
export function Spinner({ label = "جارٍ التحميل…", className = "h-5 w-5" }: { label?: string; className?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return (
    <span role="status" aria-label={label} className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-block rounded-full border-2 border-current border-t-transparent ${className} ${reduced ? "animate-none" : "animate-spin"}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Live region for async feedback (toasts/alerts) — DOC-06 §8 aria-live. */
export function LiveRegion({ children, polite = true }: { children: React.ReactNode; polite?: boolean }) {
  return (
    <span className="sr-only" role="status" aria-live={polite ? "polite" : "assertive"}>
      {children}
    </span>
  );
}
