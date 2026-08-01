import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, ProgressBar, DifficultyBadge, LessonStateBadge } from "@/components/ui";
import { getStage, listModulesWithLessons, listLessons } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { buildQuizPathMap } from "@/lib/quiz";
import { buildExamPathMap } from "@/lib/exam";

export const dynamic = "force-dynamic";

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId } = await params;
  const user = await getCurrentUser();
  const stage = await getStage(stageId);
  if (!stage) notFound();

  const modules = await listModulesWithLessons(stageId, user?.id);
  const lessonsByModule = new Map(await Promise.all(modules.map(async (mod) => [mod.id, await listLessons(mod.id, user?.id)] as const)));
  const quizzes = buildQuizPathMap();
  const exams = buildExamPathMap();

  return (
    <div className="space-y-8">
      <header>
        <Link href="/catalog" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
          → المكتبة
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-neutral-900">{stage.title_ar}</h1>
          <DifficultyBadge level={stage.difficulty} />
        </div>
        <p className="mt-1 text-sm text-neutral-500">{stage.title_en}</p>
        <p className="mt-3 text-sm text-neutral-600">
          {stage.module_count} وحدات · {stage.lesson_count} دروس · {stage.effort_hours ?? "—"} ساعات تقديرية
        </p>
        {exams.has(`${stage.id}-EXAM`) && (
          <Link href={`/exam/${stage.id}-EXAM`} className="btn-outline mt-4">
            📋 اختبار المرحلة (AT-06) — {stage.id}-EXAM
          </Link>
        )}
      </header>

      {modules.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-4xl" aria-hidden="true">📭</p>
          <p className="text-lg font-bold text-neutral-800">لا توجد وحدات في هذه المرحلة بعد</p>
          <p className="max-w-sm text-sm text-neutral-500">ستُضاف الوحدات فور نشر المحتوى.</p>
        </div>
      ) : (
      <div className="space-y-6">
        {modules.map((mod) => {
          const lessons = lessonsByModule.get(mod.id) ?? [];
          const percent = mod.lesson_count > 0 ? Math.round((mod.completed_lessons / mod.lesson_count) * 100) : 0;
          return (
            <Card key={mod.id} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-primary-700">{mod.id}</span>
                  <h2 className="mt-1 text-lg font-bold text-neutral-900">{mod.title_ar}</h2>
                  <p className="text-xs text-neutral-500">{mod.title_en}</p>
                </div>
                <DifficultyBadge level={mod.difficulty} />
              </div>

              {user && (
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar percent={percent} className="max-w-xs" label={`تقدم وحدة ${mod.title_ar}`} />
                  <span className="text-xs text-neutral-500">{percent}% مكتمل</span>
                </div>
              )}

              {quizzes.has(`QUIZ-${mod.id}`) && (
                <Link href={`/quiz/QUIZ-${mod.id}`} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                  <span aria-hidden="true">📝</span> اختبار الوحدة (QUIZ-{mod.id})
                </Link>
              )}

              {lessons.length === 0 ? (
                <p className="mt-5 text-sm text-neutral-500">لا توجد دروس في هذه الوحدة بعد.</p>
              ) : (
              <ol className="mt-5 space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={lesson.content_path ? `/learn/${lesson.id}` : "#"}
                      aria-disabled={!lesson.content_path}
                      tabIndex={lesson.content_path ? 0 : -1}
                      className={`flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                        lesson.content_path
                          ? "hover:border-primary-300 hover:bg-primary-50/40"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600">
                          {lesson.position}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-neutral-800">{lesson.title_ar}</span>
                          <span className="block text-xs text-neutral-500">{lesson.id}</span>
                        </span>
                      </span>
                      <LessonStateBadge state={lesson.state} status={lesson.status} />
                    </Link>
                  </li>
                ))}
              </ol>
              )}
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
