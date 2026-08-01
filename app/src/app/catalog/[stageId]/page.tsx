import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressBar, ProgressRing, DifficultyBadge, LessonStateBadge, Breadcrumb, EmptyState, MetaChip } from "@/components/ui";
import { Reveal } from "@/components/motion";
import {
  LayersIcon,
  BookIcon,
  ClockIcon,
  ExamIcon,
  QuizIcon,
  ChevronLeftIcon,
  LockIcon,
  CompassIcon,
  CheckIcon,
} from "@/components/icons";
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
  const lessonsByModule = new Map(
    await Promise.all(modules.map(async (mod) => [mod.id, await listLessons(mod.id, user?.id)] as const))
  );
  const quizzes = buildQuizPathMap();
  const exams = buildExamPathMap();

  const totalLessons = modules.reduce((s, m) => s + m.lesson_count, 0);
  const doneLessons = modules.reduce((s, m) => s + m.completed_lessons, 0);
  const stagePercent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <div className="stack-lg">
      {/* ========================================================== Header */}
      <header className="relative overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-8 md:px-10 md:py-12">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 mask-fade-b" />
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
        </div>

        <div className="relative">
          <Breadcrumb items={[{ label: "المكتبة", href: "/catalog" }, { label: stage.title_ar }]} />

          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold tracking-wider text-primary-600">{stage.id}</span>
                <DifficultyBadge level={stage.difficulty} />
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tighter text-neutral-900 md:text-4xl">
                {stage.title_ar}
              </h1>
              <p className="mt-2 text-sm text-neutral-400" dir="ltr">
                {stage.title_en}
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                <MetaChip icon={<LayersIcon className="h-3 w-3" />}>{stage.module_count} وحدات</MetaChip>
                <MetaChip icon={<BookIcon className="h-3 w-3" />}>{stage.lesson_count} دروس</MetaChip>
                <MetaChip icon={<ClockIcon className="h-3 w-3" />}>{stage.effort_hours ?? "—"} ساعة تقديرية</MetaChip>
              </div>

              {exams.has(`${stage.id}-EXAM`) && (
                <Link href={`/exam/${stage.id}-EXAM`} className="btn-outline mt-6">
                  <ExamIcon className="h-4 w-4" />
                  اختبار المرحلة — {stage.id}-EXAM
                </Link>
              )}
            </div>

            {user && totalLessons > 0 && (
              <div className="flex shrink-0 items-center gap-5 rounded-2xl bg-surface-muted p-5 ring-1 ring-hairline">
                <ProgressRing percent={stagePercent} label={`تقدم مرحلة ${stage.title_ar}`} />
                <div>
                  <p className="text-xs font-semibold text-neutral-500">تقدّمك في المرحلة</p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">
                    {doneLessons} من {totalLessons} درسًا
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= Modules */}
      {modules.length === 0 ? (
        <EmptyState
          title="لا توجد وحدات في هذه المرحلة بعد"
          hint="ستُضاف الوحدات فور نشر المحتوى."
          icon={<CompassIcon className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-5">
          {modules.map((mod, mi) => {
            const lessons = lessonsByModule.get(mod.id) ?? [];
            const percent = mod.lesson_count > 0 ? Math.round((mod.completed_lessons / mod.lesson_count) * 100) : 0;
            const moduleDone = percent === 100 && mod.lesson_count > 0;
            return (
              <Reveal key={mod.id} as="section" delay={mi * 40}>
                <div className="card overflow-hidden p-0">
                  {/* Module header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline bg-surface-muted/50 p-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{mod.id}</span>
                        {moduleDone && (
                          <span className="badge-green">
                            <CheckIcon className="h-3 w-3" strokeWidth={2.6} />
                            مكتملة
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-lg font-bold text-neutral-900">{mod.title_ar}</h2>
                      <p className="mt-0.5 text-xs text-neutral-400" dir="ltr">
                        {mod.title_en}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <DifficultyBadge level={mod.difficulty} />
                    </div>
                  </div>

                  <div className="p-6">
                    {user && mod.lesson_count > 0 && (
                      <div className="mb-5 flex items-center gap-3">
                        <ProgressBar
                          percent={percent}
                          size="sm"
                          className="max-w-xs"
                          tone={moduleDone ? "success" : "primary"}
                          label={`تقدم وحدة ${mod.title_ar}`}
                        />
                        <span className="text-xs font-semibold text-neutral-500">{percent}%</span>
                      </div>
                    )}

                    {quizzes.has(`QUIZ-${mod.id}`) && (
                      <Link
                        href={`/quiz/QUIZ-${mod.id}`}
                        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-accent-500/25 bg-accent-50 px-4 py-2.5 text-sm font-semibold text-accent-700 transition-all duration-fast hover:border-accent-500/50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      >
                        <QuizIcon className="h-4 w-4" />
                        اختبار الوحدة (QUIZ-{mod.id})
                      </Link>
                    )}

                    {lessons.length === 0 ? (
                      <p className="text-sm text-neutral-500">لا توجد دروس في هذه الوحدة بعد.</p>
                    ) : (
                      <ol className="space-y-1.5">
                        {lessons.map((lesson) => {
                          const locked = !lesson.content_path;
                          const done = lesson.state === "completed";
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={locked ? "#" : `/learn/${lesson.id}`}
                                aria-disabled={locked}
                                tabIndex={locked ? -1 : 0}
                                className={`group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3.5 py-3 transition-all duration-fast ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                                  locked
                                    ? "cursor-not-allowed opacity-55"
                                    : "hover:border-hairline hover:bg-surface-muted"
                                }`}
                              >
                                <span className="flex min-w-0 items-center gap-3">
                                  <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                                      done
                                        ? "bg-success-100 text-success-700"
                                        : locked
                                          ? "bg-neutral-100 text-neutral-400"
                                          : "bg-surface-muted text-neutral-500 ring-1 ring-hairline group-hover:bg-primary-50 group-hover:text-primary-600"
                                    }`}
                                    aria-hidden="true"
                                  >
                                    {done ? <CheckIcon className="h-4 w-4" strokeWidth={2.6} /> : locked ? <LockIcon className="h-3.5 w-3.5" /> : lesson.position}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-neutral-800">
                                      {lesson.title_ar}
                                    </span>
                                    <span className="mt-0.5 flex items-center gap-2 text-2xs text-neutral-400">
                                      <span className="font-mono">{lesson.id}</span>
                                      {lesson.duration_min ? (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span className="inline-flex items-center gap-1">
                                            <ClockIcon className="h-3 w-3" />
                                            {lesson.duration_min} د
                                          </span>
                                        </>
                                      ) : null}
                                    </span>
                                  </span>
                                </span>
                                <span className="flex shrink-0 items-center gap-2">
                                  <LessonStateBadge state={lesson.state} status={lesson.status} />
                                  {!locked && (
                                    <ChevronLeftIcon className="h-4 w-4 text-neutral-300 transition-all duration-base group-hover:-translate-x-0.5 group-hover:text-primary-600" />
                                  )}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
