/**
 * Reading position tracking (Batch 3) — "متابعة من آخر موضع".
 * Stores the scroll position per lesson in localStorage; no server involved.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export function readingPositionKey(lessonId: string): string {
  return `aca:read-pos:${lessonId}`;
}

export function loadReadingPosition(lessonId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(readingPositionKey(lessonId));
    const n = Number(raw ?? 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function saveReadingPosition(lessonId: string, y: number): void {
  try {
    window.localStorage.setItem(readingPositionKey(lessonId), String(Math.round(y)));
  } catch {
    /* storage unavailable — position is just not remembered */
  }
}

export function clearReadingPosition(lessonId: string): void {
  try {
    window.localStorage.removeItem(readingPositionKey(lessonId));
  } catch {
    /* ignore */
  }
}

const SAVE_DEBOUNCE_MS = 1000;

/**
 * Tracks scroll depth for a lesson and exposes a `resume()` action that
 * returns the learner to their last position. Throttled via rAF + debounce;
 * flushed on page hide / tab switch.
 */
export function useReadingPosition(lessonId: string) {
  const [saved, setSaved] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const lastSavedAtRef = useRef(0);

  useEffect(() => {
    setSaved(loadReadingPosition(lessonId));
    setScrollY(window.scrollY);
  }, [lessonId]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrollY(y);
        const now = Date.now();
        if (now - lastSavedAtRef.current > SAVE_DEBOUNCE_MS) {
          lastSavedAtRef.current = now;
          saveReadingPosition(lessonId, y);
          setSaved(y);
        }
      });
    };
    const flush = () => saveReadingPosition(lessonId, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lessonId]);

  const resume = useCallback(() => {
    const y = loadReadingPosition(lessonId);
    if (y <= 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }, [lessonId]);

  /** Whether the "resume" affordance makes sense right now. */
  const canResume = saved > 280 && Math.abs(scrollY - saved) > 320;

  return { saved, scrollY, canResume, resume };
}
