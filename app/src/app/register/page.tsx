import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const errors: Record<string, string> = {
    invalid: "البيانات المدخلة غير صحيحة. تأكد من البريد وكلمة المرور (8 أحرف على الأقل).",
    short: "كلمة المرور قصيرة جدًا — يجب أن تكون 8 أحرف على الأقل.",
    taken: "هذا البريد الإلكتروني مسجل مسبقًا — جرّب تسجيل الدخول.",
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <h1 className="text-xl font-extrabold text-neutral-900">إنشاء حساب جديد</h1>
        <p className="mt-1 text-sm text-neutral-500">ابدأ رحلتك نحو الاحتراف الإبداعي — دقيقة واحدة.</p>

        {error && errors[error] && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {errors[error]}
          </p>
        )}

        <form method="post" action="/api/auth/register" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next || "/profile"} />
          <div>
            <label htmlFor="name" className="label">الاسم</label>
            <input id="name" name="name" type="text" required className="input" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="email" className="label">البريد الإلكتروني</label>
            <input id="email" name="email" type="email" required dir="ltr" className="input text-left" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="label">كلمة المرور (8 أحرف على الأقل)</label>
            <input id="password" name="password" type="password" required minLength={8} className="input" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn-primary w-full">إنشاء الحساب</button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-semibold text-primary-700 hover:text-primary-800">تسجيل الدخول</Link>
        </p>
      </Card>
    </div>
  );
}
