import Link from "next/link";
import { Brand } from "./ui";
import type { User } from "@/lib/auth";

function buildNav(user: User | null) {
  const items = [
    { href: "/", label: "الرئيسية" },
    { href: "/catalog", label: "المكتبة" },
    { href: "/certificates", label: "شهاداتي" },
    { href: "/projects", label: "المشاريع" },
  ];
  if (user?.role === "admin") items.push({ href: "/admin", label: "الإدارة" });
  return items;
}

export async function Header({ user }: { user: User | null }) {
  const NAV = buildNav(user);
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-800">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/profile" className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800" aria-hidden="true">
                  {user.name.charAt(0)}
                </span>
                {user.name}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="btn-outline text-sm">
                  خروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                دخول
              </Link>
              <Link href="/register" className="btn-primary">
                تسجيل
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/** Mobile bottom navigation (DOC-04 §12): max 5 items, RTL. */
export function BottomNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const items = [
    { href: "/", label: "الرئيسية", icon: "🏠" },
    { href: "/catalog", label: "المكتبة", icon: "📚" },
    { href: "/certificates", label: "شهاداتي", icon: "🎓" },
    { href: "/projects", label: "المشاريع", icon: "🛠️" },
    ...(isAdmin ? [{ href: "/admin", label: "الإدارة", icon: "📊" }] : []),
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="التنقل السفلي">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-neutral-600 hover:text-primary-800">
            <span aria-hidden="true" className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
