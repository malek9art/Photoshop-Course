"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motion primitives — CSS/IntersectionObserver only (no animation library).
 * Every effect is GPU-friendly (transform/opacity), reduced-motion aware and
 * degrades to "already visible" when JS or IO is unavailable.
 */

/** True when the user asked for reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
}

/**
 * Reveals children once they scroll into view.
 *
 * Fail-safe by design: the server renders the content **visible** (no
 * `reveal` class), so a hydration failure, disabled JS or an unsupported
 * IntersectionObserver can never hide content. The hidden→visible animation
 * is only armed on the client, and only for elements that start below the
 * fold — elements already on screen simply stay visible.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  // "idle" = server/first paint (visible), "armed" = hidden awaiting scroll.
  const [phase, setPhase] = useState<"idle" | "armed" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate what the user has not seen yet.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;

    setPhase("armed");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`${phase === "idle" ? "" : phase === "armed" ? "reveal" : "reveal is-visible"} ${className}`}
      style={phase === "idle" ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Animated number counter (eases to its target once on screen). */
export function Counter({
  value,
  duration = 1200,
  suffix = "",
  prefix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let start = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const step = (ts: number) => {
          if (!start) start = ts;
          const t = Math.min(1, (ts - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(value * eased));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

/** Thin reading-progress bar pinned under the header. */
export function ReadingProgress({ targetId }: { targetId?: string }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = targetId ? document.getElementById(targetId) : null;
      const scrollTop = window.scrollY;
      let total: number;
      let start = 0;
      if (el) {
        start = el.offsetTop;
        total = el.offsetHeight - window.innerHeight * 0.6;
      } else {
        total = document.documentElement.scrollHeight - window.innerHeight;
      }
      const p = total > 0 ? ((scrollTop - start) / total) * 100 : 0;
      setPercent(Math.max(0, Math.min(100, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
      role="progressbar"
      aria-label="تقدم القراءة"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full origin-right bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-150 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
