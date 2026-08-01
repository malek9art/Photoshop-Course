"use client";

import { useEffect, useState } from "react";

/** Skeleton block with a premium sheen sweep — DOC-04 §4 Loading. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`shimmer rounded-xl ${className}`} />;
}

/** Text-line skeleton group (keeps Arabic reading rhythm while loading). */
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
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

/** Success burst — a check that pops once (lesson/quiz completion). */
export function SuccessCheck({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex animate-pop-check items-center justify-center rounded-full bg-success-100 text-success-600 motion-reduce:animate-none ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-1/2 w-1/2">
        <path d="m5 12.6 4.4 4.4L19 7.4" />
      </svg>
    </span>
  );
}
