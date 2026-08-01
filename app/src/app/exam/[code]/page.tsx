import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamPlayer } from "@/components/ExamPlayer";
import { loadExam } from "@/lib/exam";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ExamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = loadExam(code);
  if (!exam || exam.items.length === 0) notFound();

  // Stage exams (AT-06) record graded attempts — auth required before starting.
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-4xl" aria-hidden="true">🔐</p>
        <h1 className="mt-3 text-lg font-bold text-neutral-900">تسجيل الدخول مطلوب</h1>
        <p className="mt-2 text-sm text-neutral-600">
          اختبار المرحلة ({exam.code}) تسجَّل محاولاته ونتيجته رسميًا — سجّل الدخول لتبدأ.
        </p>
        <Link href={`/login?next=/exam/${exam.code}`} className="btn-primary mt-6 w-full">
          تسجيل الدخول
        </Link>
        <Link href={`/register?next=/exam/${exam.code}`} className="btn-outline mt-2 w-full">
          إنشاء حساب جديد
        </Link>
      </div>
    );
  }

  return <ExamPlayer code={exam.code} />;
}
