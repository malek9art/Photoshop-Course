import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/QuizPlayer";
import { loadQuiz } from "@/lib/quiz";
import { getCurrentUser } from "@/lib/auth";
import { getQuizLock } from "@/lib/locks";
import { LockedContent } from "@/components/LockUI";
import { LockIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quiz = loadQuiz(code);
  if (!quiz || quiz.items.length === 0) notFound();

  // Module quizzes record graded attempts (DOC-08 §5) — auth required before starting.
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="card mx-auto max-w-md animate-fade-up p-8 text-center md:p-10">
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-500/20"
          aria-hidden="true"
        >
          <LockIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-neutral-900">تسجيل الدخول مطلوب</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          اختبارات الوحدات تسجَّل نتائجها ومحاولاتها في ملفك — سجّل الدخول لتبدأ الاختبار ({quiz.code}).
        </p>
        <Link href={`/login?next=/quiz/${quiz.code}`} className="btn-primary mt-7 w-full justify-center">
          تسجيل الدخول
        </Link>
        <Link href={`/register?next=/quiz/${quiz.code}`} className="btn-outline mt-2.5 w-full justify-center">
          إنشاء حساب جديد
        </Link>
      </div>
    );
  }

  /* ---- Server-side quiz gate (Batch 4 / Batch 9): direct URL is blocked. */
  const lock = await getQuizLock(user.id, code);
  if (lock.locked) {
    return (
      <LockedContent
        lock={lock}
        title={`اختبار الوحدة — ${quiz.code}`}
        icon={
          <span className="text-4xl" aria-hidden="true">
            🔒
          </span>
        }
      />
    );
  }

  return <QuizPlayer code={quiz.code} />;
}
