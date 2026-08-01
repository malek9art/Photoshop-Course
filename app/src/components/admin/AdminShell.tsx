import Link from "next/link";
import { AdminTabs } from "./AdminTabs";

/**
 * Admin shell — consistent header + section navigation for every admin route.
 * Routes are unchanged; this only makes them reachable from one another.
 */
export const ADMIN_NAV = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/projects", label: "تصحيح المشاريع" },
  { href: "/admin/certificates", label: "الشهادات" },
];

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="border-b border-hairline pb-6">
        <p className="eyebrow">لوحة الإدارة</p>
        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-neutral-900">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        <div className="mt-6">
          <AdminTabs items={ADMIN_NAV} />
        </div>
      </header>
      {children}
    </div>
  );
}

export function AdminQuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-outline btn-sm">
      {label}
    </Link>
  );
}
