import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/QuizPlayer";
import { loadQuiz } from "@/lib/quiz";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quiz = loadQuiz(code);
  if (!quiz || quiz.items.length === 0) notFound();

  // Module quizzes record graded attempts (DOC-08 §5) — auth required before starting.
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-4xl" aria-hidden="true">🔐</p>
        <h1 className="mt-3 text-lg font-bold text-neutral-900">تسجيل الدخول مطلوب</h1>
        <p className="mt-2 text-sm text-neutral-600">
          اختبارات الوحدات تسجَّل نتائجها ومحاولاتها في ملفك — سجّل الدخول لتبدأ الاختبار ({quiz.code}).
        </p>
        <Link href={`/login?next=/quiz/${quiz.code}`} className="btn-primary mt-6 w-full">
          تسجيل الدخول
        </Link>
        <Link href={`/register?next=/quiz/${quiz.code}`} className="btn-outline mt-2 w-full">
          إنشاء حساب جديد
        </Link>
      </div>
    );
  }

  return <QuizPlayer code={quiz.code} />;
}
