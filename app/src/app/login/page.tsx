import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const errors: Record<string, string> = {
    bad: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    invalid: "البيانات المدخلة غير صحيحة.",
  };

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="مرحبًا بعودتك! تابع رحلتك التعليمية من حيث توقفت.">
      {error && errors[error] && (
        <div className="mt-5 animate-shake">
          <Alert tone="danger" role="alert">
            {errors[error]}
          </Alert>
        </div>
      )}

      <form method="post" action="/api/auth/login" className="mt-7 space-y-5">
        <input type="hidden" name="next" value={next || "/profile"} />
        <div>
          <label htmlFor="email" className="label">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            className="input text-left"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-primary btn-lg w-full">
          دخول
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-neutral-500">
        ليس لديك حساب؟{" "}
        <Link
          href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-primary-600 underline-offset-4 hover:underline"
        >
          أنشئ حسابًا جديدًا
        </Link>
      </p>

      <div className="mt-7 rounded-2xl border border-dashed border-hairline-strong bg-surface-muted p-4 text-xs text-neutral-600">
        <p className="font-bold text-neutral-800">حسابات تجريبية محلية</p>
        <dl className="mt-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-neutral-500">طالب</dt>
            <dd dir="ltr" className="font-mono text-2xs text-neutral-700">
              student@academy.ar / student123
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-neutral-500">مدير</dt>
            <dd dir="ltr" className="font-mono text-2xs text-neutral-700">
              admin@academy.ar / admin123
            </dd>
          </div>
        </dl>
      </div>
    </AuthLayout>
  );
}
