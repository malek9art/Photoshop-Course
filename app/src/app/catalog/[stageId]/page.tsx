import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, ProgressBar, DifficultyBadge, LessonStateBadge } from "@/components/ui";
import { getStage, listModulesWithLessons, listLessons } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId } = await params;
  const user = await getCurrentUser();
  const stage = getStage(stageId);
  if (!stage) notFound();

  const modules = listModulesWithLessons(stageId, user?.id);

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
      </header>

      <div className="space-y-6">
        {modules.map((mod) => {
          const lessons = listLessons(mod.id, user?.id);
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
                  <ProgressBar percent={percent} className="max-w-xs" />
                  <span className="text-xs text-neutral-500">{percent}% مكتمل</span>
                </div>
              )}

              <ol className="mt-5 space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={lesson.content_path ? `/learn/${lesson.id}` : "#"}
                      aria-disabled={!lesson.content_path}
                      className={`flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3 transition-colors ${
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}
