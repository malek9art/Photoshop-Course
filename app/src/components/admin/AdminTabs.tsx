"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/lib/a11y";

/** Admin section tabs with an active indicator (routes unchanged). */
export function AdminTabs({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="أقسام الإدارة" className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative shrink-0 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-fast ${focusRing} ${
              active ? "text-primary-600" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {item.label}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-l from-primary-500 to-accent-500"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
