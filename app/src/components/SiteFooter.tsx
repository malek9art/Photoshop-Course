import Link from "next/link";
import { focusRing } from "@/lib/a11y";

const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "التعلّم",
    links: [
      { href: "/catalog", label: "المكتبة الدراسية" },
      { href: "/projects", label: "المشاريع العملية" },
      { href: "/certificates", label: "الشهادات" },
    ],
  },
  {
    title: "الحساب",
    links: [
      { href: "/profile", label: "ملفي الشخصي" },
      { href: "/login", label: "تسجيل الدخول" },
      { href: "/register", label: "إنشاء حساب" },
    ],
  },
  {
    title: "الموثوقية",
    links: [{ href: "/verify", label: "التحقق من شهادة" }],
  },
];

/** Elegant, quiet footer — hidden behind the mobile bottom-nav padding. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-hairline bg-surface-muted/60">
      <div className="container-app py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-base font-black text-white shadow-sm"
                aria-hidden="true"
              >
                أ
              </span>
              <span className="text-sm font-bold text-neutral-900">أكاديمية أدوبي الإبداعية</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              منصة عربية احترافية لتعلّم برامج أدوبي الإبداعية — منهج متدرّج، تقييم عادل، وشهادات
              قابلة للتحقق.
            </p>
          </div>

          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-2xs font-bold uppercase tracking-widest text-neutral-400">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`rounded text-sm text-neutral-600 transition-colors hover:text-primary-600 ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-hairline pt-6 text-xs text-neutral-500 sm:flex-row sm:justify-between">
          <p>© {year} أكاديمية أدوبي الإبداعية — جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success-500" aria-hidden="true" />
            المنصة تعمل بشكل طبيعي
          </p>
        </div>
      </div>
    </footer>
  );
}
