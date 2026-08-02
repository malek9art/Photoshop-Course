"use client";

import { useEffect, useState } from "react";
import { focusRing } from "@/lib/a11y";
import { useReadingProgress } from "@/components/motion";

export type TocItem = { id: string; text: string; level: number };

/**
 * "On this page" table of contents with scroll-spy + section progress.
 * Headings are matched by the slug that `react-markdown` does *not* emit, so
 * we resolve them at runtime from the rendered article — no content changes.
 */
export function LessonToc({ items, articleId }: { items: TocItem[]; articleId: string }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const percent = useReadingProgress(articleId);
  const activeIndex = items.findIndex((i) => i.id === active);

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    // Assign ids to headings so anchors work (presentation-only enhancement).
    const headings = Array.from(article.querySelectorAll("h2, h3")) as HTMLElement[];
    headings.forEach((h, i) => {
      if (!h.id) h.id = items[i]?.id ?? `h-${i}`;
    });

    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -68% 0px", threshold: 0 }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [articleId, items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="محتويات الدرس" className="card p-4 text-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-2xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          في هذا الدرس
        </p>
        <span className="font-mono text-2xs font-bold tabular-nums text-primary-600 dark:text-primary-400">
          {Math.round(percent)}%
        </span>
      </div>

      {/* Section progress */}
      <div
        className="mb-3 h-1 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10"
        role="progressbar"
        aria-label="التقدم في أقسام الدرس"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="space-y-1">
        {items.map((item, i) => {
          const isActive = active === item.id;
          const passed = activeIndex > i;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`group flex items-start gap-2.5 rounded-xl px-3 py-2 text-xs leading-relaxed transition-all duration-fast ease-smooth ${focusRing} ${
                  isActive
                    ? "bg-primary-50 font-bold text-primary-700 ring-1 ring-inset ring-primary-500/20 dark:bg-primary-500/15 dark:text-primary-300 dark:ring-primary-400/20"
                    : "text-neutral-500 hover:bg-surface-muted hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100"
                } ${item.level === 3 ? "ps-7" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-fast ${
                    isActive
                      ? "bg-primary-500"
                      : passed
                        ? "bg-accent-500/70"
                        : "bg-neutral-300 group-hover:bg-neutral-400 dark:bg-white/20"
                  }`}
                />
                <span className="min-w-0">
                  <span className="block font-mono text-2xs opacity-50" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.text}
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      <a
        href="#main"
        className={`mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-hairline text-2xs font-semibold text-neutral-500 transition-colors duration-fast hover:border-hairline-strong hover:text-neutral-800 dark:border-white/10 dark:text-neutral-400 dark:hover:text-white ${focusRing}`}
      >
        العودة إلى الأعلى
      </a>
    </nav>
  );
}
