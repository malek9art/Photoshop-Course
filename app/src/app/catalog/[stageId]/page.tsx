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
import { getStageLock, getModuleLock, getLessonLocks, getQuizLock, getExamLock, type LockInfo } from "@/lib/locks";
import { LessonRowLink, type LessonRowModel } from "@/components/LessonRowLink";
import { GateLink, LockChip } from "@/components/GateLink";
import { LockedContent } from "@/components/LockUI";

export const dynamic = "force-dynamic";

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId } = await params;
  const user = await getCurrentUser();
  const stage = await getStage(stageId);
  if (!stage) notFound();

  /* ---- Server-side stage gate (Batch 2 / Batch 9): no entry when locked */
  const stageLock = await getStageLock(user?.id ?? null, stageId);
  if (stageLock.locked) {
    return (
      <LockedContent
        lock={stageLock}
        title={stage.title_ar}
        icon={
          <span className="text-4xl" aria-hidden="true">
            🔒
          </span>
        }
      />
    );
  }

  const modules = await listModulesWithLessons(stageId, user?.id);
  const lessonsByModule = new Map(
    await Promise.all(modules.map(async (mod) => [mod.id, await listLessons(mod.id, user?.id)] as const))
  );
  const quizzes = buildQuizPathMap();
  const exams = buildExamPathMap();

  /* Lock info for every module + every lesson (server-side truth). */
  const moduleLocks = new Map<string, LockInfo>(
    await Promise.all(modules.map(async (mod) => [mod.id, await getModuleLock(user?.id ?? null, mod.id)] as const))
  );
  const allLessonIds = modules.flatMap((m) => lessonsByModule.get(m.id) ?? []).map((l) => l.id);
  const lessonLocks = await getLessonLocks(user?.id ?? null, allLessonIds);

  /* Quiz/exam gates for this stage (server-side, computed once). */
  const examCode = `${stageId}-EXAM`;
  const examLock = user && exams.has(examCode) ? await getExamLock(user.id, examCode) : null;
  const quizLocks = new Map<string, LockInfo>(
    await Promise.all(
      modules
        .filter((m) => quizzes.has(`QUIZ-${m.id}`))
        .map(async (m) => {
          const ql = user ? await getQuizLock(user.id, `QUIZ-${m.id}`) : { locked: false, message: "", reason: null };
          return [`QUIZ-${m.id}`, ql] as const;
        })
    )
  );

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

              {exams.has(examCode) && user && examLock ? (
                <GateLink
                  href={`/exam/${examCode}`}
                  lock={examLock}
                  className="btn-outline mt-6"
                  lockedClassName="btn-outline mt-6 !cursor-not-allowed opacity-60"
                >
                  <ExamIcon className="h-4 w-4" />
                  اختبار المرحلة — {examCode}
                  {examLock.locked ? <LockIcon className="h-3.5 w-3.5" /> : null}
                </GateLink>
              ) : exams.has(examCode) ? (
                <Link href={`/exam/${examCode}`} className="btn-outline mt-6">
                  <ExamIcon className="h-4 w-4" />
                  اختبار المرحلة — {examCode}
                </Link>
              ) : null}
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
            const modLock = moduleLocks.get(mod.id) ?? { locked: false, message: "", reason: null };
            return (
              <Reveal key={mod.id} as="section" delay={mi * 40}>
                <div className={`card overflow-hidden p-0 ${modLock.locked ? "opacity-90" : ""}`}>
                  {/* Module header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline bg-surface-muted/50 p-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{mod.id}</span>
                        {moduleDone ? (
                          <span className="badge-green">
                            <CheckIcon className="h-3 w-3" strokeWidth={2.6} />
                            مكتملة
                          </span>
                        ) : modLock.locked ? (
                          <LockChip label="مقفلة — أكمل الوحدة السابقة" />
                        ) : null}
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

                    {quizzes.has(`QUIZ-${mod.id}`) && user ? (
                      <GateLink
                        href={`/quiz/QUIZ-${mod.id}`}
                        lock={quizLocks.get(`QUIZ-${mod.id}`) ?? { locked: false, message: "", reason: null }}
                        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-accent-500/25 bg-accent-50 px-4 py-2.5 text-sm font-semibold text-accent-700 transition-all duration-fast hover:border-accent-500/50 hover:shadow-sm"
                        lockedClassName="mb-5 inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface-muted px-4 py-2.5 text-sm font-semibold text-neutral-500 opacity-75"
                      >
                        <QuizIcon className="h-4 w-4" />
                        اختبار الوحدة (QUIZ-{mod.id})
                        {(quizLocks.get(`QUIZ-${mod.id}`)?.locked ?? false) ? <LockIcon className="h-3.5 w-3.5" /> : null}
                      </GateLink>
                    ) : quizzes.has(`QUIZ-${mod.id}`) ? (
                      <Link
                        href={`/quiz/QUIZ-${mod.id}`}
                        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-accent-500/25 bg-accent-50 px-4 py-2.5 text-sm font-semibold text-accent-700 transition-all duration-fast hover:border-accent-500/50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      >
                        <QuizIcon className="h-4 w-4" />
                        اختبار الوحدة (QUIZ-{mod.id})
                      </Link>
                    ) : null}

                    {lessons.length === 0 ? (
                      <p className="text-sm text-neutral-500">لا توجد دروس في هذه الوحدة بعد.</p>
                    ) : (
                      <ol className="space-y-1.5">
                        {lessons.map((lesson) => {
                          const lock = lessonLocks.get(lesson.id) ?? { locked: false, message: "", reason: null };
                          const model: LessonRowModel = {
                            id: lesson.id,
                            title: lesson.title_ar,
                            durationMin: lesson.duration_min,
                            position: lesson.position,
                            state: lesson.state,
                            status: lesson.status,
                            available: Boolean(lesson.content_path),
                          };
                          return (
                            <LessonRowLink key={lesson.id} lesson={model} lock={lock} />
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
