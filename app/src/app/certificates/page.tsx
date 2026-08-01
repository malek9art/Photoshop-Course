import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { CertificateIcon, ShieldCheckIcon, ArrowLeftIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { listCertificates } from "@/lib/certs";

export const dynamic = "force-dynamic";

export const metadata = { title: "شهاداتي" };

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/certificates");
  const certs = await listCertificates(user.id);

  return (
    <div className="stack-lg">
      <header className="relative overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-10 md:px-10 md:py-12">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 mask-fade-b" />
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-2xl">
          <p className="eyebrow">إنجازاتك الموثّقة</p>
          <h1 className="mt-3 text-4xl font-black tracking-tighter text-neutral-900">شهاداتي</h1>
          <p className="mt-4 text-base leading-loose text-neutral-500">
            أكمل مرحلة بالكامل (دروسها واختباراتها ومشروعها) لتحصل على شهادتها تلقائيًا — بسجل تحقّق
            عام قابل للمشاركة.
          </p>
        </div>
      </header>

      {certs.length === 0 ? (
        <EmptyState
          title="لا توجد شهادات بعد"
          hint="أكمل مرحلة دراسية كاملة (دروسها واختبارها ومشروعها) لتحصل على أول شهادة لك."
          action="تصفح المراحل الدراسية"
          actionHref="/catalog"
          icon={<CertificateIcon className="h-7 w-7" />}
        />
      ) : (
        <div className="stagger grid gap-5 sm:grid-cols-2">
          {certs.map((c) => {
            const active = c.status === "active";
            return (
              <Reveal key={c.id}>
                <article className="card card-hover group relative overflow-hidden p-0">
                  {/* Certificate ribbon */}
                  <div className="relative overflow-hidden bg-neutral-950 px-6 py-7">
                    <div aria-hidden="true" className="absolute inset-0">
                      <div className="absolute inset-0 animate-gradient-pan bg-aurora bg-[length:200%_200%] opacity-90 motion-reduce:animate-none" />
                      <div className="absolute inset-0 bg-grid-fade bg-grid opacity-[0.07]" />
                    </div>
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-2xs font-bold tracking-widest text-accent-300">{c.cert_code}</p>
                        <h2 className="mt-2 text-lg font-black leading-snug tracking-tight text-white">
                          {c.title_ar}
                        </h2>
                      </div>
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent-300 backdrop-blur-md"
                        aria-hidden="true"
                      >
                        <CertificateIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <dl className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-neutral-500">رقم التحقق</dt>
                        <dd dir="ltr" className="font-mono font-bold text-neutral-900">
                          {c.serial}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-neutral-500">تاريخ الإصدار</dt>
                        <dd className="font-semibold text-neutral-700">
                          {new Date(c.issued_at + "Z").toLocaleDateString("ar-SA")}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-neutral-500">الحالة</dt>
                        <dd>
                          <span className={active ? "badge-green" : "badge-red"}>
                            {active ? "سارية" : "ملغاة"}
                          </span>
                        </dd>
                      </div>
                    </dl>

                    <Link
                      href={`/verify/${c.serial}`}
                      className="btn-outline group/btn mt-5 w-full justify-center text-xs"
                    >
                      <ShieldCheckIcon className="h-4 w-4" />
                      صفحة التحقق العامة
                      <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform duration-base group-hover/btn:-translate-x-1" />
                    </Link>
                    <p className="mt-3 text-center text-2xs leading-relaxed text-neutral-400">
                      وثيقة رسمية من أكاديمية أدوبي الإبداعية — يُتحقق منها عبر الرقم التسلسلي.
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
