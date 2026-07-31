import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const errors: Record<string, string> = {
    bad: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    invalid: "البيانات المدخلة غير صحيحة.",
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <h1 className="text-xl font-extrabold text-neutral-900">تسجيل الدخول</h1>
        <p className="mt-1 text-sm text-neutral-500">مرحبًا بعودتك! تابع رحلتك التعليمية من حيث توقفت.</p>

        {error && errors[error] && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {errors[error]}
          </p>
        )}

        <form method="post" action="/api/auth/login" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next || "/profile"} />
          <div>
            <label htmlFor="email" className="label">البريد الإلكتروني</label>
            <input id="email" name="email" type="email" required dir="ltr" className="input text-left" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="label">كلمة المرور</label>
            <input id="password" name="password" type="password" required className="input" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-primary w-full">دخول</button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          ليس لديك حساب؟{" "}
          <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-primary-700 hover:text-primary-800">
            أنشئ حسابًا جديدًا
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-neutral-100 p-4 text-xs text-neutral-600">
          <p className="font-bold">حسابات تجريبية محلية:</p>
          <p dir="ltr" className="mt-1 text-left">طالب: student@academy.ar / student123</p>
          <p dir="ltr" className="text-left">مدير: admin@academy.ar / admin123</p>
        </div>
      </Card>
    </div>
  );
}
