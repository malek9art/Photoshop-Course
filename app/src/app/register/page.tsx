import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/AuthLayout";
import { Alert } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "إنشاء حساب" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const errors: Record<string, string> = {
    invalid: "البيانات المدخلة غير صحيحة. تأكد من البريد وكلمة المرور (8 أحرف على الأقل).",
    short: "كلمة المرور قصيرة جدًا — يجب أن تكون 8 أحرف على الأقل.",
    taken: "هذا البريد الإلكتروني مسجل مسبقًا — جرّب تسجيل الدخول.",
  };

  return (
    <AuthLayout title="إنشاء حساب جديد" subtitle="ابدأ رحلتك نحو الاحتراف الإبداعي — دقيقة واحدة فقط.">
      {error && errors[error] && (
        <div className="mt-5 animate-shake">
          <Alert tone="danger" role="alert">
            {errors[error]}
          </Alert>
        </div>
      )}

      <form method="post" action="/api/auth/register" className="mt-7 space-y-5">
        <input type="hidden" name="next" value={next || "/profile"} />
        <div>
          <label htmlFor="name" className="label">
            الاسم
          </label>
          <input id="name" name="name" type="text" required className="input" autoComplete="name" placeholder="اسمك الكامل" />
        </div>
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
            minLength={8}
            className="input"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="hint">
            8 أحرف على الأقل — استخدم مزيجًا من الحروف والأرقام.
          </p>
        </div>
        <button type="submit" className="btn-primary btn-lg w-full">
          إنشاء الحساب
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-neutral-500">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-semibold text-primary-600 underline-offset-4 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}
