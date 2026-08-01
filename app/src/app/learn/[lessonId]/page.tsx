import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, LessonStateBadge } from "@/components/ui";
import Markdown from "@/components/Markdown";
import { CompleteLessonButton } from "@/components/CompleteLessonButton";
import { getLesson, listLessons, getLessonProgress } from "@/lib/data";
import { loadLessonFile } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
  const completed = user ? await getLessonProgress(user.id, lessonId) === "completed" : false;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Lesson body */}
      <article>
        <nav className="mb-4 text-sm text-neutral-500" aria-label="مسار التنقل">
          <Link href="/catalog" className="hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">المكتبة</Link>
          {" / "}
          <Link href={`/catalog/${lesson.stage_id}`} className="hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">{lesson.stage_title_ar}</Link>
          {" / "}
          <span className="text-neutral-700">{lesson.module_title_ar}</span>
        </nav>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-bold text-primary-700">{lesson.id}</span>
            <span>·</span>
            <LessonStateBadge state={user ? (moduleLessons.find((l) => l.id === lesson.id)?.state ?? null) : null} status={lesson.status} />
          </div>
          <h1 className="mt-2 text-2xl font-extrabold leading-relaxed text-neutral-900">{doc.titleAr}</h1>
        </header>

        <div className="card p-6 md:p-8">
          <article className="prose-ar" dir="rtl" lang="ar">
            <Markdown>{doc.markdown}</Markdown>
          </article>
        </div>

        {/* Lesson actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {prev?.content_path ? (
            <Link href={`/learn/${prev.id}`} className="btn-outline">→ الدرس السابق</Link>
          ) : <span aria-hidden="true" />}
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <CompleteLessonButton lessonId={lessonId} alreadyCompleted={completed} />
            ) : (
              <Link href={`/login?next=/learn/${lessonId}`} className="btn-primary">سجّل الدخول لتتبع تقدمك</Link>
            )}
            {next?.content_path && (
              <Link href={`/learn/${next.id}`} className="btn-primary">الدرس التالي ←</Link>
            )}
          </div>
        </div>
      </article>

      {/* Module sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-4">
          <h2 className="mb-3 text-sm font-bold text-neutral-900">دروس الوحدة</h2>
          <ol className="space-y-1.5">
            {moduleLessons.map((l, i) => (
              <li key={l.id}>
                <Link
                  href={l.content_path ? `/learn/${l.id}` : "#"}
                  aria-current={l.id === lessonId ? "page" : undefined}
                  aria-disabled={!l.content_path}
                  tabIndex={l.content_path ? 0 : -1}
                  className={`flex min-h-[40px] items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                    l.id === lessonId
                      ? "bg-primary-700 font-semibold text-white"
                      : l.content_path
                        ? "text-neutral-700 hover:bg-neutral-100"
                        : "cursor-not-allowed text-neutral-400"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs opacity-70">{i + 1}</span>
                    <span className="truncate">{l.title_ar}</span>
                  </span>
                  {user && l.state === "completed" && <span aria-hidden="true">✓</span>}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
