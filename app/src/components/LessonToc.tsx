"use client";

import { useEffect, useState } from "react";
import { focusRing } from "@/lib/a11y";

export type TocItem = { id: string; text: string; level: number };

/**
 * "On this page" table of contents with scroll-spy.
 * Headings are matched by the slug that `react-markdown` does *not* emit, so
 * we resolve them at runtime from the rendered article — no content changes.
 */
export function LessonToc({ items, articleId }: { items: TocItem[]; articleId: string }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

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
    <nav aria-label="محتويات الدرس" className="text-sm">
      <p className="mb-3 text-2xs font-bold uppercase tracking-widest text-neutral-400">في هذا الدرس</p>
      <ul className="space-y-0.5 border-e border-hairline pe-3">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-me-px block border-e-2 py-1.5 pe-3 text-xs leading-relaxed transition-all duration-fast ${focusRing} ${
                  isActive
                    ? "border-primary-500 font-semibold text-primary-600"
                    : "border-transparent text-neutral-500 hover:border-hairline-strong hover:text-neutral-800"
                } ${item.level === 3 ? "ps-3" : ""}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
