import { Card } from "@/components/ui";

export const metadata = { title: "التحقق من الشهادة" };

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <p className="text-4xl text-center" aria-hidden="true">🔍</p>
        <h1 className="mt-3 text-center text-xl font-extrabold text-neutral-900">التحقق من الشهادة</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">
          أدخل الرقم التسلسلي للشهادة (مثال: <span dir="ltr">ACA-2026-00001</span>) للتحقق من صحتها.
        </p>
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
            />
          </div>
          <button type="submit" className="btn-primary w-full">تحقق</button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-400">
          خدمة تحقق عامة من «أكاديمية أدوبي الإبداعية» — لا تتطلب تسجيل دخول.
        </p>
      </Card>
    </div>
  );
}
