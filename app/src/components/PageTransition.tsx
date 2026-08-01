"use client";

import { usePathname } from "next/navigation";

/**
 * Route transition: re-keys the subtree on pathname change so the CSS
 * enter animation replays. Pure CSS (opacity + translate) → GPU accelerated,
 * and neutralised automatically under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade-up motion-reduce:animate-none">
      {children}
    </div>
  );
}
