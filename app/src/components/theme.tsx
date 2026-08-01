"use client";

import { useCallback, useEffect, useState } from "react";
import { focusRing } from "@/lib/a11y";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "aca-theme";

/**
 * Inline, render-blocking script that applies the stored theme *before* paint.
 * Prevents the classic dark-mode flash. Kept tiny and dependency-free.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=s?s==="dark":m;var e=document.documentElement;e.classList.toggle("dark",d);e.classList.add("js");e.style.colorScheme=d?"dark":"light";}catch(_){}})();`;

function readTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Theme switch — accessible, animated, persists to localStorage. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next: ThemeMode = readTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setTheme(next);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface text-neutral-600 transition-all duration-fast ease-smooth hover:border-hairline-strong hover:text-neutral-900 ${focusRing} ${className}`}
    >
      <span className="sr-only">{isDark ? "الوضع الفاتح" : "الوضع الداكن"}</span>
      <SunIcon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ease-spring ${
          mounted && isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <MoonIcon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ease-spring ${
          mounted && isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2M12 19.6v2M2.4 12h2M19.6 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8Z" />
    </svg>
  );
}
