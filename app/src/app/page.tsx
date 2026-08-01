import Link from "next/link";
import { ProgressBar, Badge, DifficultyBadge, EmptyState } from "@/components/ui";
import { listStages } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const stages = await listStages();

  // Continue-learning: most recent incomplete lesson for logged-in users.
  let nextLesson: { id: string; title_ar: string; module_title_ar: string; stage_title_ar: string } | null = null;
  let overallPercent = 0;
  let totalDone = 0;
  let totalAvailable = 0;
  if (user) {
    nextLesson =
      (await all<{ id: string; title_ar: string; module_title_ar: string; stage_title_ar: string }>(
        `SELECT l.id, l.title_ar, m.title_ar AS module_title_ar, s.title_ar AS stage_title_ar
         FROM lessons l
         JOIN modules m ON m.id = l.module_id
         JOIN stages s ON s.id = m.stage_id
         WHERE l.content_path IS NOT NULL
           AND NOT EXISTS (
             SELECT 1 FROM progress p
             WHERE p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 AND p.state='completed'
           )
         ORDER BY l.id LIMIT 1`,
        user.id
      ))[0] ?? null;
    totalAvailable = (await all<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons WHERE content_path IS NOT NULL"))[0]?.c ?? 0;
    totalDone = (await all<{ c: number }>(
      "SELECT COUNT(*)::int AS c FROM progress WHERE user_id = $1 AND target_type='lesson' AND state='completed'",
      user.id
    ))[0]?.c ?? 0;
    overallPercent = totalAvailable > 0 ? Math.round((totalDone / totalAvailable) * 100) : 0;
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary-800 to-primary-700 px-6 py-10 text-white md:px-10 md:py-14">
        <div className="max-w-2xl">
          <Badge tone="amber">منصة عربية احترافية — RTL</Badge>
          <h1 className="mt-3 text-2xl font-extrabold leading-relaxed md:text-4xl">
            من المبتدئ إلى المحترف المعتمد في برامج أدوبي
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-primary-100 md:text-base">
            منهج متكامل بالعربية الفصحى: دروس، تمارين عملية، اختبارات، ومشاريع حقيقية تبني ملف أعمالك —
            خطوة بخطوة، وبإيقاع يناسبك.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn bg-accent-500 text-neutral-900 hover:bg-accent-600">
              تصفح المراحل الدراسية
            </Link>
            {!user && (
              <Link href="/register" className="btn bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20">
                ابدأ رحلتك مجانًا
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Continue learning */}
      {user && (
        <section aria-label="واصل التعلم">
          <h2 className="mb-4 text-xl font-bold text-neutral-900">واصل التعلم</h2>
          <div className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              {nextLesson ? (
                <>
                  <p className="text-sm text-neutral-500">
                    {nextLesson.stage_title_ar} — {nextLesson.module_title_ar}
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900">{nextLesson.title_ar}</p>
                  <Link href={`/learn/${nextLesson.id}`} className="btn-primary mt-3">
                    متابعة الدرس ←
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-neutral-900">أكملت كل الدروس المتاحة 🎉</p>
                  <p className="mt-1 text-sm text-neutral-500">دروس جديدة قادمة عند نشر المحتوى القادم.</p>
                  <Link href="/catalog" className="btn-outline mt-3">تصفح المكتبة</Link>
                </>
              )}
            </div>
            <div className="w-full md:w-64">
              <div className="mb-1 flex justify-between text-xs text-neutral-500">
                <span>تقدمك العام</span>
                <span>{overallPercent}%</span>
              </div>
              <ProgressBar percent={overallPercent} label="التقدم العام في الدروس المتاحة" />
              <p className="mt-1 text-xs text-neutral-500">{totalDone} من {totalAvailable} درسًا مكتملًا</p>
            </div>
          </div>
        </section>
      )}

      {/* Stages */}
      <section aria-label="المراحل الدراسية">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold text-neutral-900">المراحل الدراسية</h2>
          <Link href="/catalog" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
            عرض الكل ←
          </Link>
        </div>
        {stages.length === 0 ? (
          <EmptyState title="لا توجد مراحل بعد" hint="ستظهر المراحل الدراسية فور نشر المحتوى." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <Link key={stage.id} href={`/catalog/${stage.id}`} className="card group p-5 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-700">{stage.id}</span>
                  <DifficultyBadge level={stage.difficulty} />
                </div>
                <h3 className="mt-2 font-bold text-neutral-900 group-hover:text-primary-800">{stage.title_ar}</h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {stage.module_count} وحدات · {stage.lesson_count} دروس
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>{stage.effort_hours ?? "—"} ساعات تقديرية</span>
                  <span aria-hidden="true">←</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
