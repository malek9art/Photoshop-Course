import { redirect } from "next/navigation";
import { Card } from "@/components/ui";

export const metadata = { title: "التحقق من الشهادة" };

const SERIAL_RE = /^ACA-\d{4}-\d{5}$/i;

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ serial?: string }> }) {
  const { serial } = await searchParams;
  const code = (serial ?? "").trim().toUpperCase();
  if (code && SERIAL_RE.test(code)) {
    redirect(`/verify/${code}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <p className="text-4xl text-center" aria-hidden="true">🔍</p>
        <h1 className="mt-3 text-center text-xl font-extrabold text-neutral-900">التحقق من الشهادة</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">
          أدخل الرقم التسلسلي للشهادة (مثال: <span dir="ltr">ACA-2026-00001</span>) للتحقق من صحتها.
        </p>
        {serial !== undefined && !SERIAL_RE.test(code) && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-700">
            صيغة الرقم التسلسلي غير صحيحة — الصيغة: <span dir="ltr" className="font-mono">ACA-YYYY-NNNNN</span>.
          </p>
        )}
        <form method="get" action="/verify" className="mt-6 space-y-3">
          <div>
            <label htmlFor="serial" className="label">الرقم التسلسلي</label>
            <input
              id="serial"
              name="serial"
              required
              dir="ltr"
              className="input text-left font-mono"
              placeholder="ACA-YYYY-NNNNN"
              pattern="[A-Za-z]{3}-\d{4}-\d{5}"
              defaultValue={serial}
            />
          </div>
          <button type="submit" className="btn-primary w-full">تحقق</button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          خدمة تحقق عامة من «أكاديمية أدوبي الإبداعية» — لا تتطلب تسجيل دخول.
        </p>
      </Card>
    </div>
  );
}
