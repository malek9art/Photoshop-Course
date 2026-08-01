import Link from "next/link";
import { Card } from "@/components/ui";
import { get } from "@/lib/db";

export const dynamic = "force-dynamic";

type CertRow = {
  id: string; cert_code: string; title_ar: string; serial: string; status: string;
  issued_at: string; revoked_at: string | null; revoked_reason: string | null;
  user_name: string;
};

export default async function VerifySerialPage({ params }: { params: Promise<{ serial: string }> }) {
  const { serial } = await params;
  const code = serial.toUpperCase();
  const cert = await get<CertRow>(
    `SELECT c.*, u.name AS user_name
     FROM certificates c JOIN users u ON u.id = c.user_id
     WHERE c.serial = $1`,
    code
  );

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/verify" className="text-sm font-semibold text-primary-700 hover:text-primary-800">→ التحقق من شهادة أخرى</Link>

      <Card className={`mt-4 p-8 text-center ${cert && cert.status === "active" ? "border-primary-300" : ""}`}>
        {!cert ? (
          <>
            <p className="text-5xl" aria-hidden="true">❓</p>
            <h1 className="mt-3 text-xl font-extrabold text-neutral-900">شهادة غير موجودة</h1>
            <p className="mt-2 text-sm text-neutral-600">
              لم نعثر على شهادة بالرقم التسلسلي <span dir="ltr" className="font-mono font-bold">{code}</span>. تحقق من الرقم وأعد المحاولة.
            </p>
          </>
        ) : cert.status === "revoked" ? (
          <>
            <p className="text-5xl" aria-hidden="true">⛔</p>
            <h1 className="mt-3 text-xl font-extrabold text-red-700">شهادة ملغاة</h1>
            <p className="mt-2 text-sm text-neutral-600">
              هذه الشهادة صدرت سابقًا ثم أُلغيت{cert.revoked_reason ? ` (السبب: ${cert.revoked_reason})` : ""}.
            </p>
          </>
        ) : (
          <>
            <p className="text-5xl" aria-hidden="true">✅</p>
            <h1 className="mt-3 text-xl font-extrabold text-primary-700">شهادة سارية المفعول</h1>
            <p className="mt-2 text-xs text-neutral-500">هذه الوثيقة صادرة رسميًا عن أكاديمية أدوبي الإبداعية.</p>
          </>
        )}

        {cert && (
          <dl className="mt-6 space-y-3 rounded-lg bg-neutral-50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">حامل الشهادة / Holder</dt>
              <dd className="font-bold text-neutral-900">{cert.user_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">نوع الشهادة / Type</dt>
              <dd className="font-bold text-neutral-900">{cert.cert_code} — {cert.title_ar}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">الرقم التسلسلي / Serial</dt>
              <dd dir="ltr" className="font-mono font-bold text-neutral-900">{cert.serial}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">تاريخ الإصدار / Issued</dt>
              <dd>{new Date(cert.issued_at + "Z").toLocaleDateString("ar-SA")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">الجهة المصدرة / Authority</dt>
              <dd className="font-bold text-neutral-900">أكاديمية أدوبي الإبداعية</dd>
            </div>
            {cert.status === "revoked" && cert.revoked_at && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">تاريخ الإلغاء</dt>
                <dd>{new Date(cert.revoked_at + "Z").toLocaleDateString("ar-SA")}</dd>
              </div>
            )}
          </dl>
        )}
      </Card>
    </div>
  );
}
