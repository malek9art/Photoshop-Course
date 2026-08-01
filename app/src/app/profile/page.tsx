import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgressBar, ProgressRing, StatCard, EmptyState, SectionHeader, Badge } from "@/components/ui";
import { Reveal } from "@/components/motion";
import {
  BookIcon,
  LayersIcon,
  CertificateIcon,
  CompassIcon,
  ChevronLeftIcon,
  SparkIcon,
  CheckIcon,
} from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { listStages, listModulesWithLessons } from "@/lib/data";
import { all } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  const [stages, overallRows, totalLessonRows] = await Promise.all([
    listStages(),
    all<{ c: number }>(
      "SELECT COUNT(*)::int AS c FROM progress WHERE user_id = $1 AND target_type='lesson' AND state='completed'",
      user.id
    ),
    all<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons WHERE content_path IS NOT NULL"),
  ]);
  const overall = overallRows[0] ?? { c: 0 };
  const totalLessons = totalLessonRows[0] ?? { c: 0 };
  const modulesByStage = new Map(
    await Promise.all(stages.map(async (stage) => [stage.id, await listModulesWithLessons(stage.id, user.id)] as const))
  );
  const percent = totalLessons.c > 0 ? Math.round((overall.c / totalLessons.c) * 100) : 0;

  const stageProgress = stages.map((stage) => {
    const modules = modulesByStage.get(stage.id) ?? [];
    const total = modules.reduce((s, m) => s + m.lesson_count, 0);
    const done = modules.reduce((s, m) => s + m.completed_lessons, 0);
    return { stage, modules, total, done, p: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  const startedStages = stageProgress.filter((s) => s.done > 0).length;
  const completedStages = stageProgress.filter((s) => s.total > 0 && s.done === s.total).length;
  const completedModules = stageProgress.reduce(
    (s, x) => s + x.modules.filter((m) => m.lesson_count > 0 && m.completed_lessons === m.lesson_count).length,
    0
  );

  return (
    <div className="stack-lg">
      {/* ========================================================== Header */}
      <header className="relative overflow-hidden rounded-3xl border border-hairline bg-surface p-6 md:p-10">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 mask-fade-b" />
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <span
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-3xl font-black text-white shadow-md"
              aria-hidden="true"
            >
              {user.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black tracking-tighter text-neutral-900">{user.name}</h1>
                <Badge tone={user.role === "admin" ? "brand" : "gray"}>
                  {user.role === "admin" ? "مدير" : "طالب"}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm text-neutral-500" dir="ltr">
                {user.email}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/catalog" className="btn-outline btn-sm">
                  متابعة التعلّم
                </Link>
                <Link href="/certificates" className="btn-ghost btn-sm">
                  <CertificateIcon className="h-3.5 w-3.5" />
                  شهاداتي
                </Link>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-5 rounded-2xl bg-surface-muted p-5 ring-1 ring-hairline">
            <ProgressRing percent={percent} size={104} label="التقدم العام في الدروس المتاحة" />
            <div>
              <p className="text-xs font-semibold text-neutral-500">تقدّمك العام</p>
              <p className="mt-1 text-sm font-bold text-neutral-900">
                {overall.c} من {totalLessons.c} درسًا
              </p>
              <ProgressBar percent={percent} size="sm" className="mt-3 w-36" label="التقدم العام" />
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================== KPIs */}
      <Reveal as="section">
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="دروس مكتملة"
            value={overall.c}
            hint={`من ${totalLessons.c} درسًا متاحًا`}
            icon={<BookIcon className="h-5 w-5" />}
            tone="brand"
          />
          <StatCard
            label="وحدات مكتملة"
            value={completedModules}
            hint="وحدة أنهيت كل دروسها"
            icon={<LayersIcon className="h-5 w-5" />}
            tone="accent"
          />
          <StatCard
            label="مراحل بدأتها"
            value={startedStages}
            hint={`من ${stages.length} مرحلة`}
            icon={<CompassIcon className="h-5 w-5" />}
            tone="neutral"
          />
          <StatCard
            label="مراحل مكتملة"
            value={completedStages}
            hint="مؤهلة للشهادة"
            icon={<CertificateIcon className="h-5 w-5" />}
            tone="success"
          />
        </div>
      </Reveal>

      {/* ================================================= Stage progress */}
      <Reveal as="section">
        <SectionHeader
          eyebrow="التفاصيل"
          title="تقدم المراحل"
          subtitle="نظرة تفصيلية على إنجازك في كل مرحلة دراسية."
          action="المكتبة"
          actionHref="/catalog"
        />
        {stages.length === 0 ? (
          <EmptyState
            title="لا توجد مراحل بعد"
            hint="ستظهر المراحل فور نشر المحتوى."
            action="تصفح المكتبة"
            actionHref="/catalog"
            icon={<CompassIcon className="h-7 w-7" />}
          />
        ) : (
          <div className="stagger grid gap-4 md:grid-cols-2">
            {stageProgress.map(({ stage, total, done, p }) => {
              const complete = total > 0 && done === total;
              return (
                <Link
                  key={stage.id}
                  href={`/catalog/${stage.id}`}
                  className="card card-hover group flex flex-col overflow-hidden p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{stage.id}</span>
                      <h3 className="mt-1 truncate text-base font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                        {stage.title_ar}
                      </h3>
                    </div>
                    {complete ? (
                      <span className="badge-green shrink-0">
                        <CheckIcon className="h-3 w-3" strokeWidth={2.6} />
                        مكتملة
                      </span>
                    ) : (
                      <span className="shrink-0 text-lg font-black tracking-tighter text-neutral-900">{p}%</span>
                    )}
                  </div>
                  <ProgressBar
                    percent={p}
                    size="sm"
                    tone={complete ? "success" : "primary"}
                    className="mt-4"
                    label={`تقدم مرحلة ${stage.title_ar}`}
                  />
                  <p className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      {done} / {total} درسًا مكتملًا
                    </span>
                    <ChevronLeftIcon className="h-4 w-4 text-neutral-300 transition-all duration-base group-hover:-translate-x-0.5 group-hover:text-primary-600" />
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </Reveal>

      {/* ============================================================= Tip */}
      <Reveal as="section">
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-hairline bg-surface-muted/60 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-500/20">
              <SparkIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-neutral-900">التعلّم المنتظم يتفوّق على التعلّم المكثّف</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                درس واحد يوميًا يوصلك إلى نهاية المرحلة أسرع مما تظن — وتقدّمك يُحفَظ تلقائيًا.
              </p>
            </div>
          </div>
          <Link href="/catalog" className="btn-primary shrink-0">
            الدرس التالي
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
