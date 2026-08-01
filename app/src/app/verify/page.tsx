import { redirect } from "next/navigation";
import { Alert } from "@/components/ui";
import { ShieldCheckIcon, SearchIcon } from "@/components/icons";

export const metadata = { title: "التحقق من الشهادة" };

const SERIAL_RE = /^ACA-\d{4}-\d{5}$/i;

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ serial?: string }> }) {
  const { serial } = await searchParams;
  const code = (serial ?? "").trim().toUpperCase();
  if (code && SERIAL_RE.test(code)) {
    redirect(`/verify/${code}`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="card relative overflow-hidden p-8 md:p-10">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute -top-24 right-1/2 h-56 w-56 translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
        </div>

        <div className="relative text-center">
          <span
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-500/20"
            aria-hidden="true"
          >
            <ShieldCheckIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-black tracking-tighter text-neutral-900">التحقق من الشهادة</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-500">
            أدخل الرقم التسلسلي للشهادة (مثال:{" "}
            <span dir="ltr" className="font-mono text-neutral-700">
              ACA-2026-00001
            </span>
            ) للتحقق من صحتها.
          </p>
        </div>

        {serial !== undefined && !SERIAL_RE.test(code) && (
          <div className="mt-6 animate-shake">
            <Alert tone="danger" role="alert">
              صيغة الرقم التسلسلي غير صحيحة — الصيغة:{" "}
              <span dir="ltr" className="font-mono font-bold">
                ACA-YYYY-NNNNN
              </span>
              .
            </Alert>
          </div>
        )}

        <form method="get" action="/verify" className="relative mt-7 space-y-4">
          <div>
            <label htmlFor="serial" className="label">
              الرقم التسلسلي
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-neutral-400" />
              <input
                id="serial"
                name="serial"
                required
                dir="ltr"
                className={`input ps-10 text-left font-mono tracking-wider ${
                  serial !== undefined && !SERIAL_RE.test(code) ? "input-invalid" : ""
                }`}
                placeholder="ACA-YYYY-NNNNN"
                pattern="[A-Za-z]{3}-\d{4}-\d{5}"
                defaultValue={serial}
                aria-describedby="serial-hint"
              />
            </div>
            <p id="serial-hint" className="hint">
              الرقم مطبوع على الشهادة الرقمية الصادرة من الأكاديمية.
            </p>
          </div>
          <button type="submit" className="btn-primary btn-lg w-full">
            تحقّق الآن
          </button>
        </form>

        <p className="relative mt-6 text-center text-xs text-neutral-400">
          خدمة تحقق عامة من «أكاديمية أدوبي الإبداعية» — لا تتطلب تسجيل دخول.
        </p>
      </div>
    </div>
  );
}
