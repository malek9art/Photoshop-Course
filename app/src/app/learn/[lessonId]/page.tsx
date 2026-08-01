import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonStateBadge, Breadcrumb, ProgressBar } from "@/components/ui";
import Markdown from "@/components/Markdown";
import { CompleteLessonButton } from "@/components/CompleteLessonButton";
import { LessonToc, type TocItem } from "@/components/LessonToc";
import { ReadingProgress } from "@/components/motion";
import { ClockIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, LockIcon, BookIcon } from "@/components/icons";
import { getLesson, listLessons, getLessonProgress } from "@/lib/data";
import { loadLessonFile } from "@/lib/content";
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

  const moduleLessons = await listLessons(lesson.module_id, user?.id);
  const idx = moduleLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? moduleLessons[idx - 1] : null;
  const next = idx >= 0 && idx < moduleLessons.length - 1 ? moduleLessons[idx + 1] : null;
  const completed = user ? (await getLessonProgress(user.id, lessonId)) === "completed" : false;

  const readingMinutes = doc.frontmatter.duration_min
    ? Number(doc.frontmatter.duration_min) || estimateReadingMinutes(doc.markdown)
    : lesson.duration_min ?? estimateReadingMinutes(doc.markdown);
  const toc = extractToc(doc.markdown);

  const doneInModule = moduleLessons.filter((l) => l.state === "completed").length;
  const modulePercent =
    moduleLessons.length > 0 ? Math.round((doneInModule / moduleLessons.length) * 100) : 0;

  return (
    <>
      <ReadingProgress targetId="lesson-body" />

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

          <header className="mt-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{lesson.id}</span>
              <LessonStateBadge
                state={user ? moduleLessons.find((l) => l.id === lesson.id)?.state ?? null : null}
                status={lesson.status}
              />
              <span className="inline-flex items-center gap-1.5 text-2xs font-medium text-neutral-500">
                <ClockIcon className="h-3.5 w-3.5" />
                {readingMinutes} دقيقة قراءة
              </span>
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

          <div id="lesson-body" className="mt-8">
            <Markdown>{doc.markdown}</Markdown>
          </div>

          {/* Lesson actions */}
          <div className="mt-12 rounded-3xl border border-hairline bg-surface-muted/60 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <CompleteLessonButton lessonId={lessonId} alreadyCompleted={completed} />
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

            <div className="mt-6 grid gap-3 border-t border-hairline pt-5 sm:grid-cols-2">
              {prev?.content_path ? (
                <Link
                  href={`/learn/${prev.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-hairline bg-surface p-4 transition-all duration-fast hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-sm"
                >
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-base group-hover:translate-x-1" />
                  <span className="min-w-0">
                    <span className="block text-2xs font-semibold text-neutral-400">الدرس السابق</span>
                    <span className="block truncate text-sm font-bold text-neutral-800">{prev.title_ar}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next?.content_path ? (
                <Link
                  href={`/learn/${next.id}`}
                  className="group flex items-center justify-end gap-3 rounded-2xl border border-primary-500/20 bg-primary-50/60 p-4 text-left transition-all duration-fast hover:-translate-y-0.5 hover:border-primary-500/40 hover:shadow-sm sm:col-start-2"
                >
                  <span className="min-w-0 text-right">
                    <span className="block text-2xs font-semibold text-primary-600">الدرس التالي</span>
                    <span className="block truncate text-sm font-bold text-neutral-900">{next.title_ar}</span>
                  </span>
                  <ArrowLeftIcon className="h-4 w-4 shrink-0 text-primary-600 transition-transform duration-base group-hover:-translate-x-1" />
                </Link>
              ) : null}
            </div>
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
                {moduleLessons.map((l, i) => {
                  const current = l.id === lessonId;
                  const locked = !l.content_path;
                  return (
                    <li key={l.id}>
                      <Link
                        href={locked ? "#" : `/learn/${l.id}`}
                        aria-current={current ? "page" : undefined}
                        aria-disabled={locked}
                        tabIndex={locked ? -1 : 0}
                        className={`flex min-h-[40px] items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs transition-all duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                          current
                            ? "bg-primary-600 font-bold text-white shadow-sm dark:text-neutral-50"
                            : locked
                              ? "cursor-not-allowed text-neutral-400"
                              : "text-neutral-600 hover:bg-surface-muted hover:text-neutral-900"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className={`shrink-0 font-mono text-2xs ${current ? "opacity-80" : "opacity-50"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{l.title_ar}</span>
                        </span>
                        {locked ? (
                          <LockIcon className="h-3 w-3 shrink-0 opacity-60" />
                        ) : user && l.state === "completed" ? (
                          <CheckIcon
                            className={`h-3.5 w-3.5 shrink-0 ${current ? "text-white" : "text-success-600"}`}
                            strokeWidth={2.8}
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
