"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { focusRing } from "@/lib/a11y";
import {
  MenuIcon,
  XIcon,
  ChevronLeftIcon,
  HomeIcon,
  LibraryIcon,
  CertificateIcon,
  ProjectIcon,
  AdminIcon,
} from "./icons";

function useIsActive(href: string) {
  const pathname = usePathname() ?? "/";
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop nav pill with an animated active indicator. */
export function NavLink({ href, label }: { href: string; label: string }) {
  const active = useIsActive(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-fast ease-smooth ${focusRing} ${
        active
          ? "bg-surface text-neutral-900 shadow-xs ring-1 ring-hairline"
          : "text-neutral-500 hover:bg-surface/70 hover:text-neutral-800"
      }`}
    >
      {label}
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-l from-primary-500 to-accent-500"
        />
      )}
    </Link>
  );
}

const ICON_MAP: Record<string, (p: { className?: string }) => React.ReactElement> = {
  HomeIcon,
  LibraryIcon,
  CertificateIcon,
  ProjectIcon,
  AdminIcon,
};

export function BottomNavLink({
  href,
  label,
  iconName,
}: {
  href: string;
  label: string;
  iconName: string;
}) {
  const active = useIsActive(href);
  const Icon = ICON_MAP[iconName] ?? HomeIcon;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex min-h-[52px] flex-col items-center justify-center gap-1 py-2 text-2xs font-semibold transition-colors duration-fast ${focusRing} ${
        active ? "text-primary-600" : "text-neutral-500"
      }`}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-l from-primary-500 to-accent-500"
        />
      )}
      <Icon className={`h-[20px] w-[20px] transition-transform duration-fast ${active ? "scale-110" : ""}`} />
      {label}
    </Link>
  );
}

/** Mobile slide-over navigation (hamburger) — focus-trapped by native dialog semantics. */
export function MobileNav({
  items,
  isAuthed,
  userName,
}: {
  items: { href: string; label: string }[];
  isAuthed: boolean;
  userName?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="فتح قائمة التنقل"
        aria-expanded={open}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface text-neutral-600 transition-colors hover:text-neutral-900 md:hidden ${focusRing}`}
      >
        <MenuIcon className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-overlay md:hidden" role="dialog" aria-modal="true" aria-label="قائمة التنقل">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 animate-fade-in bg-neutral-950/45 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-[82%] max-w-xs animate-slide-in flex-col border-s border-hairline bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <p className="text-sm font-bold text-neutral-900">
                {isAuthed ? `أهلًا، ${userName ?? "بك"}` : "أكاديمية أدوبي الإبداعية"}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق القائمة"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900 ${focusRing}`}
              >
                <XIcon className="h-[18px] w-[18px]" />
              </button>
            </div>

            <nav className="stagger flex-1 space-y-1 overflow-y-auto p-3" aria-label="التنقل الرئيسي">
              {items.map((item) => (
                <MobileNavItem key={item.href} href={item.href} label={item.label} />
              ))}
              {isAuthed && <MobileNavItem href="/profile" label="ملفي الشخصي" />}
              <MobileNavItem href="/verify" label="التحقق من شهادة" />
            </nav>

            <div className="border-t border-hairline p-4">
              {isAuthed ? (
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="btn-outline w-full">
                    تسجيل الخروج
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn-outline justify-center">
                    دخول
                  </Link>
                  <Link href="/register" className="btn-primary justify-center">
                    ابدأ مجانًا
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  const active = useIsActive(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm font-semibold transition-colors ${focusRing} ${
        active ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-200/50"
      }`}
    >
      {label}
      <ChevronLeftIcon className="h-4 w-4 opacity-50" />
    </Link>
  );
}
