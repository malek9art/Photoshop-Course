import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { listCertificates } from "@/lib/certs";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/certificates");
  const certs = listCertificates(user.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">شهاداتي</h1>
        <p className="mt-1 text-sm text-neutral-500">
          الشهادات المكتسبة — أكمل مرحلة بالكامل (دروسها واختباراتها) لتحصل على شهادتها تلقائيًا.
        </p>
      </header>

      {certs.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-4xl" aria-hidden="true">🎓</p>
          <p className="text-lg font-bold text-neutral-800">لا توجد شهادات بعد</p>
          <p className="max-w-sm text-sm text-neutral-500">أكمل مرحلة دراسية كاملة (دروسها واختبارها ومشروعها) لتحصل على أول شهادة لك.</p>
          <a href="/catalog" className="btn-primary mt-2">تصفح المراحل الدراسية</a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((c) => (
            <Card key={c.id} className="relative overflow-hidden border-primary-200">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-primary-600 to-accent-500" aria-hidden="true" />
              <p className="text-xs font-bold text-primary-700">{c.cert_code}</p>
              <h2 className="mt-1 text-lg font-extrabold text-neutral-900">{c.title_ar}</h2>
              <dl className="mt-4 space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between gap-4">
                  <dt>رقم التحقق (Serial)</dt>
                  <dd dir="ltr" className="font-mono font-bold text-neutral-800">{c.serial}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>تاريخ الإصدار</dt>
                  <dd>{new Date(c.issued_at + "Z").toLocaleDateString("ar-SA")}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>الحالة</dt>
                  <dd className="font-semibold text-primary-700">{c.status === "active" ? "سارية" : "ملغاة"}</dd>
                </div>
              </dl>
              <Link
                href={`/verify/${c.serial}`}
                className="btn-outline mt-4 w-full justify-center text-xs"
              >
                🔍 صفحة التحقق العامة (SCR-05)
              </Link>
              <p className="mt-3 text-[10px] text-neutral-400">وثيقة رسمية من أكاديمية أدوبي الإبداعية — يُتحقق منها عبر الرقم التسلسلي.</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
