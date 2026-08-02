import Link from "next/link";
import {
  ProgressBar,
  ProgressRing,
  DifficultyBadge,
  EmptyState,
  SectionHeader,
  MetaChip,
} from "@/components/ui";
import { Reveal, Counter } from "@/components/motion";
import {
  SparkIcon,
  ClockIcon,
  BookIcon,
  LayersIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  CertificateIcon,
  ShieldCheckIcon,
  CompassIcon,
  PlayIcon,
} from "@/components/icons";
import { listStages } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { getLessonLock, getLastVisitedLesson, type LockInfo } from "@/lib/locks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const stages = await listStages();

  // Continue-learning: the first incomplete lesson is by construction the
  // recommended (unlocked) next step; verified against the lock engine.
  let nextLesson: { id: string; title_ar: string; module_title_ar: string; stage_title_ar: string } | null = null;
  let nextLock: LockInfo = { locked: false, message: "", reason: null };
  let lastVisited: { title: string; href: string } | null = null;
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
    nextLock = nextLesson ? await getLessonLock(user.id, nextLesson.id) : nextLock;
    lastVisited = await getLastVisitedLesson(user.id);
    totalAvailable = (await all<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons WHERE content_path IS NOT NULL"))[0]?.c ?? 0;
    totalDone = (await all<{ c: number }>(
      "SELECT COUNT(*)::int AS c FROM progress WHERE user_id = $1 AND target_type='lesson' AND state='completed'",
      user.id
    ))[0]?.c ?? 0;
    overallPercent = totalAvailable > 0 ? Math.round((totalDone / totalAvailable) * 100) : 0;
  }

  const totalModules = stages.reduce((s, x) => s + (x.module_count ?? 0), 0);
  const totalLessons = stages.reduce((s, x) => s + (x.lesson_count ?? 0), 0);
  const totalHours = stages.reduce((s, x) => s + (x.effort_hours ?? 0), 0);

  return (
    <div className="stack-lg">
      {/* ============================================================ Hero */}
      <section className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {/* Gradient ring (1px) — glass edge that reads beautifully in dark */}
        <div className="rounded-3xl bg-gradient-to-b from-neutral-300/60 via-neutral-300/25 to-transparent p-px sm:rounded-4xl dark:from-white/14 dark:via-white/6 dark:to-white/0">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-neutral-950 px-6 py-14 sm:rounded-[calc(2.25rem-1px)] md:px-14 md:py-20">
          {/* Animated aurora background (GPU: transform/opacity only) */}
          <div aria-hidden="true" className="absolute inset-0 -z-0">
            <div className="absolute inset-0 bg-aurora bg-[length:180%_180%] animate-gradient-pan motion-reduce:animate-none" />
            <div className="absolute inset-0 bg-grid-fade bg-grid opacity-[0.06]" />
            <div className="absolute -right-24 top-[-6rem] h-80 w-80 animate-float rounded-full bg-primary-500/25 blur-3xl motion-reduce:animate-none" />
            <div
              className="absolute -left-16 bottom-[-8rem] h-72 w-72 animate-float rounded-full bg-accent-500/20 blur-3xl motion-reduce:animate-none"
              style={{ animationDelay: "1.6s" }}
            />
            {/* Gold crown glow — signature of the premium dark hero */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[-10rem] h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent-400/10 blur-3xl"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />
          </div>

          <div className="relative max-w-3xl">
            <span className="inline-flex animate-fade-down items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-2xs font-bold tracking-widest text-white/90 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] backdrop-blur-md">
              <SparkIcon className="h-3.5 w-3.5 text-accent-300" />
              منصة عربية احترافية — تصميم RTL أصيل
            </span>

            <h1 className="mt-6 animate-fade-up text-4xl font-black leading-[1.25] tracking-tighter text-white md:text-5xl">
              من المبتدئ إلى{" "}
              <span className="bg-gradient-to-l from-accent-300 via-accent-400 to-primary-300 bg-clip-text text-transparent">
                المحترف المعتمد
              </span>{" "}
              في برامج أدوبي
            </h1>

            <p
              className="mt-5 max-w-2xl animate-fade-up text-base leading-loose text-white/70 md:text-lg"
              style={{ animationDelay: "90ms" }}
            >
              منهج متكامل بالعربية الفصحى: دروس مصمّمة بعناية، تمارين عملية، اختبارات عادلة، ومشاريع
              حقيقية تبني ملف أعمالك — خطوة بخطوة، وبإيقاع يناسبك.
            </p>

            <div className="mt-9 flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: "160ms" }}>
              <Link href="/catalog" className="btn-lg group bg-white text-neutral-950 shadow-lg hover:bg-white/92">
                <PlayIcon className="h-4 w-4" />
                تصفح المراحل الدراسية
                <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-1" />
              </Link>
              {!user ? (
                <Link
                  href="/register"
                  className="btn-lg border border-white/20 bg-white/10 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] backdrop-blur-md hover:bg-white/16"
                >
                  ابدأ رحلتك مجانًا
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="btn-lg border border-white/20 bg-white/10 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] backdrop-blur-md hover:bg-white/16"
                >
                  لوحة تقدّمي
                </Link>
              )}
            </div>

            {/* Inline trust strip */}
            <dl
              className="mt-12 grid max-w-2xl animate-fade-up grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4"
              style={{ animationDelay: "240ms" }}
            >
              {[
                { label: "مراحل دراسية", value: stages.length },
                { label: "وحدة تعليمية", value: totalModules },
                { label: "درسًا", value: totalLessons },
                { label: "ساعة تعلّم", value: totalHours },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-black tracking-tighter text-white md:text-3xl">
                      <Counter value={stat.value} />
                      <span className="text-accent-300">+</span>
                    </span>
                    <span className="mt-1 block text-xs text-white/65">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        </div>
      </section>

      {/* ================================================ Continue learning */}
      {user && (
        <Reveal as="section" className="scroll-mt-24">
          <SectionHeader eyebrow="استئناف" title="واصل التعلّم" subtitle="عُد إلى حيث توقّفت — تقدّمك محفوظ تلقائيًا." />
          <div className="card overflow-hidden p-0">
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="min-w-0">
                {nextLesson ? (
                  <>
                    <p className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500">
                      <span>{nextLesson.stage_title_ar}</span>
                      <ChevronLeftIcon className="h-3 w-3 opacity-40" />
                      <span>{nextLesson.module_title_ar}</span>
                    </p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-neutral-900">{nextLesson.title_ar}</p>

                    {/* Path blocked? The lock engine decides (Batch 9). */}
                    {nextLock.locked ? (
                      <p className="mt-2.5 max-w-md rounded-xl border border-warning-500/25 bg-warning-50 px-3.5 py-2.5 text-xs font-medium text-warning-700 dark:border-warning-400/20 dark:bg-warning-500/10 dark:text-warning-500">
                        {nextLock.message} — أكمل الدرس السابق أولاً لمتابعة المسار.
                      </p>
                    ) : (
                      <Link href={`/learn/${nextLesson.id}`} className="btn-primary group mt-5">
                        متابعة الدرس
                        <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-1" />
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2 text-xl font-bold text-neutral-900">
                      <SparkIcon className="h-5 w-5 text-accent-500" />
                      أكملت كل الدروس المتاحة
                    </p>
                    <p className="mt-1.5 text-sm text-neutral-500">دروس جديدة قادمة عند نشر المحتوى القادم.</p>
                    <Link href="/catalog" className="btn-outline mt-5">
                      تصفح المكتبة
                    </Link>
                  </>
                )}

                {/* Last visited (Batch 6 progress map) */}
                {lastVisited && (
                  <p className="mt-4 flex items-center gap-2 text-2xs font-medium text-neutral-400">
                    <ClockIcon className="h-3 w-3" />
                    آخر درس تمت زيارته:
                    <Link
                      href={lastVisited.href}
                      className="font-semibold text-primary-600 underline decoration-primary-500/30 underline-offset-2 transition-colors hover:text-primary-700"
                    >
                      {lastVisited.title}
                    </Link>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-5 rounded-2xl bg-surface-muted p-5 ring-1 ring-hairline dark:bg-gradient-to-b dark:from-white/[0.06] dark:to-white/[0.02] dark:ring-white/10">
                <ProgressRing percent={overallPercent} label="التقدم العام في الدروس المتاحة" />
                <div>
                  <p className="text-xs font-semibold text-neutral-500">تقدمك العام</p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">
                    {totalDone} من {totalAvailable} درسًا
                  </p>
                  <ProgressBar percent={overallPercent} size="sm" className="mt-3 w-36" label="التقدم العام" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ================================================= Learning journey */}
      <Reveal as="section">
        <SectionHeader
          eyebrow="كيف تتعلّم"
          title="رحلة تعلّم مصمّمة بعناية"
          subtitle="أربع خطوات متكرّرة في كل مرحلة — من الفهم إلى الإتقان الموثّق."
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookIcon, title: "تعلّم", body: "دروس عربية مركّزة بأمثلة عملية وشروح بصرية واضحة." },
            { icon: LayersIcon, title: "طبّق", body: "تمارين ومشاريع حقيقية تبني ملف أعمالك خطوة بخطوة." },
            { icon: CompassIcon, title: "قيّم", body: "اختبارات وحدات ومراحل تقيس الفهم لا الحفظ." },
            { icon: CertificateIcon, title: "اعتمد", body: "شهادة رقمية بسجل تحقّق عام لكل مرحلة تُتمّها." },
          ].map((step, i) => (
            <li
              key={step.title}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <span
                aria-hidden="true"
                className="absolute -left-4 -top-5 text-7xl font-black text-neutral-900/[0.04] transition-transform duration-slow ease-out-expo group-hover:scale-110"
              >
                {i + 1}
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-500/15 transition-transform duration-base ease-spring group-hover:scale-110 dark:bg-primary-500/15 dark:text-primary-300 dark:ring-primary-400/25">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="relative mt-4 text-base font-bold text-neutral-900 dark:text-white">{step.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{step.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* ========================================================== Stages */}
      <Reveal as="section">
        <SectionHeader
          eyebrow="المنهج"
          title="المراحل الدراسية"
          subtitle="مسار متدرّج من الأساسيات إلى الاحتراف — كل مرحلة تُتوَّج بشهادة."
          action="عرض الكل"
          actionHref="/catalog"
        />
        {stages.length === 0 ? (
          <EmptyState
            title="لا توجد مراحل بعد"
            hint="ستظهر المراحل الدراسية فور نشر المحتوى."
            icon={<CompassIcon className="h-7 w-7" />}
          />
        ) : (
          <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                href={`/catalog/${stage.id}`}
                className="card card-hover group flex flex-col overflow-hidden p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-gradient-to-l from-primary-500 to-accent-500 transition-transform duration-slow ease-out-expo group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{stage.id}</span>
                  <DifficultyBadge level={stage.difficulty} />
                </div>
                <h3 className="mt-3 text-base font-bold leading-snug text-neutral-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-300">
                  {stage.title_ar}
                </h3>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500" dir="ltr">
                  {stage.title_en}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <MetaChip icon={<LayersIcon className="h-3 w-3" />}>{stage.module_count} وحدات</MetaChip>
                  <MetaChip icon={<BookIcon className="h-3 w-3" />}>{stage.lesson_count} دروس</MetaChip>
                </div>
                <div className="mt-auto flex items-center justify-between pt-5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {stage.effort_hours ?? "—"} ساعة
                  </span>
                  <ArrowLeftIcon className="h-4 w-4 text-primary-600 opacity-0 transition-all duration-base group-hover:-translate-x-1 group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Reveal>

      {/* ===================================================== Testimonials */}
      <Reveal as="section">
        <SectionHeader
          eyebrow="آراء المتعلّمين"
          title="ماذا يقول من سبقوك"
          subtitle="قصص المتعلّمين تُنشر هنا فور اكتمال أول دفعة من الشهادات."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="card relative overflow-hidden p-6"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3">
                <div className="shimmer h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-3 w-24 rounded-full" />
                  <div className="shimmer h-2.5 w-16 rounded-full" />
                </div>
              </div>
              <div className="mt-5 space-y-2.5">
                <div className="shimmer h-3 w-full rounded-full" />
                <div className="shimmer h-3 w-11/12 rounded-full" />
                <div className="shimmer h-3 w-2/3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-neutral-400">
          مساحة محجوزة لآراء المتعلّمين — تُملأ عند توفر شهادات صادرة.
        </p>
      </Reveal>

      {/* =============================================================== CTA */}
      <Reveal as="section">
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-14 text-center md:px-16 md:py-20 dark:bg-gradient-to-b dark:from-surface-raised/70 dark:via-surface/50 dark:to-surface/80 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
          <div aria-hidden="true" className="absolute inset-0 -z-0">
            <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 mask-fade-b dark:opacity-20" />
            <div className="absolute -top-24 right-1/2 h-72 w-72 translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-500/15" />
            <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-400/10" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-muted px-3.5 py-1.5 text-2xs font-bold tracking-widest text-primary-600 dark:border-white/10 dark:bg-white/5 dark:text-primary-300">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              شهادات قابلة للتحقق العام
            </span>
            <h2 className="mt-6 text-3xl font-black tracking-tighter text-neutral-900 md:text-4xl dark:text-white">
              ابدأ اليوم. أتقن على مهلك.
            </h2>
            <p className="mt-4 text-base leading-loose text-neutral-500 dark:text-neutral-400">
              انضم مجانًا وتابع تقدّمك عبر كل الأجهزة — بلا إعلانات، وبمحتوى عربي أصيل.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {!user ? (
                <Link href="/register" className="btn-primary btn-lg">
                  أنشئ حسابك المجاني
                </Link>
              ) : (
                <Link href="/catalog" className="btn-primary btn-lg">
                  تابع رحلتك
                </Link>
              )}
              <Link href="/verify" className="btn-outline btn-lg">
                التحقق من شهادة
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
