import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamPlayer } from "@/components/ExamPlayer";
import { loadExam } from "@/lib/exam";
import { getCurrentUser } from "@/lib/auth";
import { getExamLock } from "@/lib/locks";
import { LockedContent } from "@/components/LockUI";
import { LockIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ExamPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = loadExam(code);
  if (!exam || exam.items.length === 0) notFound();

  // Stage exams (AT-06) record graded attempts — auth required before starting.
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
          اختبار المرحلة ({exam.code}) تسجَّل محاولاته ونتيجته رسميًا — سجّل الدخول لتبدأ.
        </p>
        <Link href={`/login?next=/exam/${exam.code}`} className="btn-primary mt-7 w-full justify-center">
          تسجيل الدخول
        </Link>
        <Link href={`/register?next=/exam/${exam.code}`} className="btn-outline mt-2.5 w-full justify-center">
          إنشاء حساب جديد
        </Link>
      </div>
    );
  }

  /* ---- Server-side exam gate (Batch 4 / Batch 9): direct URL is blocked. */
  const lock = await getExamLock(user.id, code);
  if (lock.locked) {
    return (
      <LockedContent
        lock={lock}
        title={`اختبار المرحلة — ${exam.code}`}
        icon={
          <span className="text-4xl" aria-hidden="true">
            🔒
          </span>
        }
      />
    );
  }

  return <ExamPlayer code={exam.code} />;
}
