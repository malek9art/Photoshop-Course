import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonStateBadge, Breadcrumb, ProgressBar } from "@/components/ui";
import Markdown from "@/components/Markdown";
import { CompleteLessonButton } from "@/components/CompleteLessonButton";
import { LessonToc, type TocItem } from "@/components/LessonToc";
import { ReadingProgress } from "@/components/motion";
import { LessonExperience } from "@/components/lesson/LessonExperience";
import { LessonAudioBlock } from "@/components/lesson/LessonAudioBlock";
import { LessonRowLink, type LessonRowModel } from "@/components/LessonRowLink";
import { LessonNavCards } from "@/components/LessonNavCards";
import { LockedContent } from "@/components/LockUI";
import { PathTrail } from "@/components/PathTrail";
import {
  ClockIcon,
  BookIcon,
  HeadphonesIcon,
} from "@/components/icons";
import { getLesson, listLessons, getLessonProgress } from "@/lib/data";
import { loadLessonFile } from "@/lib/content";
import { resolveLessonAudio } from "@/lib/audio-assets";
import { getLessonLock, getLessonLocks, getPathContext, type LockInfo } from "@/lib/locks";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Arabic reading speed ≈ 180 wpm; floor at 1 minute. */
function estimateReadingMinutes(markdown: string): number {
  const words = markdown.replace(/[#*`>_\-|]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

/** Collect h2/h3 headings for the table of contents (presentation only). */
function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  let inCode = false;
  let i = 0;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = line.match(/^(#{2,3})\s+(.*)$/);
    if (m) {
      const text = m[2].replace(/[*`_]/g, "").trim();
      if (text) items.push({ id: `sec-${i}`, text, level: m[1].length });
      i += 1;
    }
  }
  return items;
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  const lesson = await getLesson(lessonId);
  if (!lesson) notFound();

  const doc = lesson.content_path ? loadLessonFile(lesson.content_path) : null;
  if (!doc) notFound();

  /* ---------------- Server-side lock enforcement (Batch 2 / Batch 9) ---- */
  const lock = await getLessonLock(user?.id ?? null, lessonId);
  if (lock.locked) {
    return (
      <LockedContent
        lock={lock}
        title={lesson.title_ar}
        icon={
          <span className="text-4xl" aria-hidden="true">
            🔒
          </span>
        }
      />
    );
  }

  const [moduleLessons, pathContext] = await Promise.all([
    listLessons(lesson.module_id, user?.id),
    getPathContext(user?.id ?? null, lessonId),
  ]);
  const idx = moduleLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? moduleLessons[idx - 1] : null;
  const next = idx >= 0 && idx < moduleLessons.length - 1 ? moduleLessons[idx + 1] : null;
  const completed = user ? (await getLessonProgress(user.id, lessonId)) === "completed" : false;

  const readingMinutes = doc.frontmatter.duration_min
    ? Number(doc.frontmatter.duration_min) || estimateReadingMinutes(doc.markdown)
    : lesson.duration_min ?? estimateReadingMinutes(doc.markdown);
  const toc = extractToc(doc.markdown);
  const audio = resolveLessonAudio(lesson.id);
  const wordCount = doc.markdown.replace(/[#*`>_\-|]/g, " ").split(/\s+/).filter(Boolean).length;

  const doneInModule = moduleLessons.filter((l) => l.state === "completed").length;
  const modulePercent =
    moduleLessons.length > 0 ? Math.round((doneInModule / moduleLessons.length) * 100) : 0;

  /* Locks for every lesson in this module (sidebar + bottom nav). */
  const lessonLocks = await getLessonLocks(user?.id ?? null, moduleLessons.map((l) => l.id));
  const nextLock = next?.content_path ? lessonLocks.get(next.id) ?? null : null;
  const prevLock = prev?.content_path ? lessonLocks.get(prev.id) ?? null : null;

  const rows: (LessonRowModel & { lock: LockInfo })[] = moduleLessons.map((l) => ({
    id: l.id,
    title: l.title_ar,
    durationMin: l.duration_min,
    position: l.position,
    state: l.state,
    status: l.status,
    available: Boolean(l.content_path),
    lock: lessonLocks.get(l.id) ?? { locked: false, message: "", reason: null },
  }));

  return (
    <>
      <ReadingProgress targetId="lesson-body" />

      <LessonExperience
        lessonId={lesson.id}
        title={doc.titleAr}
        audio={
          audio
            ? { kind: "url", url: audio.url, title: doc.titleAr, mimeType: audio.mimeType }
            : null
        }
        readingMinutes={readingMinutes}
        tocItems={toc}
        prev={prev?.content_path ? { href: `/learn/${prev.id}`, title: prev.title_ar } : null}
        next={next?.content_path ? { href: `/learn/${next.id}`, title: next.title_ar } : null}
        nextLocked={nextLock?.locked ?? false}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
          {/* ==================================================== Lesson body */}
          <article className="min-w-0">
            <Breadcrumb
              items={[
                { label: "المكتبة", href: "/catalog" },
                { label: lesson.stage_title_ar, href: `/catalog/${lesson.stage_id}` },
                { label: lesson.module_title_ar },
              ]}
            />

            {/* Progress map trail (Batch 6) */}
            {user && pathContext ? <PathTrail context={pathContext} className="mt-5" /> : null}

            <header className="mt-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{lesson.id}</span>
                <LessonStateBadge
                  state={user ? moduleLessons.find((l) => l.id === lesson.id)?.state ?? null : null}
                  status={lesson.status}
                />
                <span className="inline-flex items-center gap-1.5 text-2xs font-medium text-neutral-500 dark:text-neutral-400">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {readingMinutes} دقيقة قراءة
                </span>
                <span className="hidden items-center gap-1.5 text-2xs font-medium text-neutral-500 sm:inline-flex dark:text-neutral-400">
                  <BookIcon className="h-3.5 w-3.5" />
                  {wordCount.toLocaleString("ar-EG")} كلمة
                </span>
                {audio ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-2xs font-bold text-primary-700 ring-1 ring-inset ring-primary-500/20 dark:bg-primary-500/15 dark:text-primary-300">
                    <HeadphonesIcon className="h-3 w-3" />
                    النسخة الصوتية متاحة
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl font-black leading-[1.3] tracking-tighter text-neutral-900 md:text-4xl">
                {doc.titleAr}
              </h1>

              <div className="mt-6 flex items-center gap-3 border-b border-hairline pb-6">
                <span className="text-2xs font-semibold text-neutral-500">
                  الدرس {idx + 1} من {moduleLessons.length}
                </span>
                <ProgressBar
                  percent={moduleLessons.length ? ((idx + 1) / moduleLessons.length) * 100 : 0}
                  size="sm"
                  className="max-w-[10rem]"
                  label={`الدرس ${idx + 1} من ${moduleLessons.length}`}
                />
              </div>
            </header>

            {/* Premium audio player — or a graceful coming-soon card */}
            <LessonAudioBlock title={doc.titleAr} sizeBytes={audio?.sizeBytes} />

            <div id="lesson-body" className="mt-10">
              <Markdown>{doc.markdown}</Markdown>
            </div>

            {/* Lesson actions */}
            <div className="mt-12 rounded-3xl border border-hairline bg-surface-muted/60 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {user ? (
                    <CompleteLessonButton
                      lessonId={lessonId}
                      alreadyCompleted={completed}
                      readingSeconds={readingMinutes * 60}
                    />
                  ) : (
                    <Link href={`/login?next=/learn/${lessonId}`} className="btn-primary">
                      سجّل الدخول لتتبع تقدمك
                    </Link>
                  )}
                  {user && (
                    <span className="text-xs text-neutral-500">
                      {doneInModule} من {moduleLessons.length} دروس الوحدة مكتملة ({modulePercent}%)
                    </span>
                  )}
                </div>
              </div>

              <LessonNavCards
                prev={
                  prev?.content_path
                    ? { href: `/learn/${prev.id}`, title: prev.title_ar }
                    : null
                }
                next={
                  next?.content_path
                    ? { href: `/learn/${next.id}`, title: next.title_ar }
                    : null
                }
                nextLock={nextLock}
                prevLock={prevLock}
              />
            </div>
          </article>

          {/* ======================================================= Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pe-1">
              <LessonToc items={toc} articleId="lesson-body" />

              <div className="card p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <BookIcon className="h-4 w-4 text-neutral-400" />
                    دروس الوحدة
                  </h2>
                  {user && <span className="text-2xs font-semibold text-neutral-500">{modulePercent}%</span>}
                </div>
                {user && <ProgressBar percent={modulePercent} size="sm" className="mb-3" label="تقدم الوحدة" />}
                <ol className="space-y-0.5">
                  {rows.map((l) => (
                    <LessonRowLink
                      key={l.id}
                      lesson={l}
                      lock={l.lock}
                      current={l.id === lessonId}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      </LessonExperience>
    </>
  );
}
