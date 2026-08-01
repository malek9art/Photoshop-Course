import Link from "next/link";
import { Brand, focusRing, touchTarget } from "./ui";
import { ThemeToggle } from "./theme";
import { NavLink, MobileNav } from "./Nav";
import {
  LogoutIcon,
} from "./icons";

type HeaderUser = { role: string; name?: string } | null;

export type NavItem = { href: string; label: string };

function buildNav(user: HeaderUser): NavItem[] {
  const items: NavItem[] = [
    { href: "/", label: "الرئيسية" },
    { href: "/catalog", label: "المكتبة" },
    { href: "/certificates", label: "شهاداتي" },
    { href: "/projects", label: "المشاريع" },
  ];
  if (user?.role === "admin") items.push({ href: "/admin", label: "الإدارة" });
  return items;
}

export async function Header({ user }: { user: HeaderUser }) {
  const NAV = buildNav(user);
  return (
    <header className="sticky top-0 z-header border-b border-hairline bg-canvas/72 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-canvas/62">
      <div className="container-app flex h-16 items-center justify-between gap-3 md:h-[4.5rem]">
        <div className="flex items-center gap-2">
          <MobileNav items={NAV} isAuthed={Boolean(user)} userName={user?.name} />
          <Brand />
        </div>

        <nav
          className="hidden items-center gap-0.5 rounded-2xl border border-hairline bg-surface/60 p-1 md:flex"
          aria-label="التنقل الرئيسي"
        >
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/profile"
                className={`hidden items-center gap-2 rounded-xl border border-hairline bg-surface py-1.5 pe-3 ps-1.5 text-sm font-semibold text-neutral-700 transition-all duration-fast ease-smooth hover:border-hairline-strong hover:text-neutral-900 sm:flex ${focusRing}`}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-xs font-black text-white"
                  aria-hidden="true"
                >
                  {user.name?.charAt?.(0) ?? "؟"}
                </span>
                <span className="max-w-[9rem] truncate">{user.name ?? ""}</span>
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  title="تسجيل الخروج"
                  className={`btn-ghost h-9 w-9 !p-0 text-neutral-500 hover:text-danger-600 ${focusRing}`}
                >
                  <LogoutIcon className="h-[18px] w-[18px]" />
                  <span className="sr-only">تسجيل الخروج</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={`btn-ghost hidden sm:inline-flex ${focusRing}`}>
                دخول
              </Link>
              <Link href="/register" className={`btn-primary ${focusRing}`}>
                ابدأ مجانًا
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const BOTTOM_ICONS: Record<string, string> = {
  "/": "HomeIcon",
  "/catalog": "LibraryIcon",
  "/certificates": "CertificateIcon",
  "/projects": "ProjectIcon",
  "/admin": "AdminIcon",
};

/** Mobile bottom navigation (DOC-04 §12): max 5 items, RTL, 44px targets. */
export function BottomNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const items = [
    { href: "/", label: "الرئيسية" },
    { href: "/catalog", label: "المكتبة" },
    { href: "/certificates", label: "شهاداتي" },
    { href: "/projects", label: "المشاريع" },
    ...(isAdmin ? [{ href: "/admin", label: "الإدارة" }] : []),
  ];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-header border-t border-hairline bg-canvas/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="التنقل السفلي"
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <BottomNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            iconName={BOTTOM_ICONS[item.href] ?? "HomeIcon"}
          />
        ))}
      </div>
    </nav>
  );
}

/* Client bit lives in ./Nav to keep the header a server component. */
import { BottomNavLink } from "./Nav";
export { touchTarget };
