"use client";

/**
 * Lesson audio block (Batch 2): renders the full AudioPlayer when an audio
 * file exists for the lesson, or a graceful "coming soon" card otherwise.
 * Lives inside the article column, under the lesson header.
 */
import { useAudio } from "@/lib/audio/hooks";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { formatFileSize } from "@/lib/audio/format";
import { HeadphonesIcon, MusicNoteIcon } from "@/components/audio/audio-icons";

export function LessonAudioBlock({ title, sizeBytes }: { title: string; sizeBytes?: number }) {
  const { source } = useAudio();

  if (source?.kind === "url") {
    return <AudioPlayer title={title} sizeLabel={sizeBytes ? formatFileSize(sizeBytes) : undefined} />;
  }

  return <AudioComingSoon title={title} />;
}

/** Beautiful placeholder shown while the audio version is in production. */
export function AudioComingSoon({ title }: { title: string }) {
  return (
    <section
      aria-label="النسخة الصوتية للدرس"
      className="relative mt-8 overflow-hidden rounded-3xl border border-dashed border-hairline-strong bg-surface-muted/50 p-6 md:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_120%_at_85%_0%,rgb(var(--accent-500)/0.09),transparent_60%),radial-gradient(50%_100%_at_10%_100%,rgb(var(--primary-500)/0.08),transparent_60%)]"
      />

      <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-start">
        <span
          aria-hidden="true"
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400/20 to-accent-600/20 text-accent-600 ring-1 ring-inset ring-accent-500/25 dark:text-accent-400"
        >
          <span className="absolute inset-0 animate-ping rounded-2xl bg-accent-500/10 motion-reduce:animate-none" />
          <HeadphonesIcon className="h-6 w-6" />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-white">النسخة الصوتية ستتوفر قريبًا</p>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            نعمل حاليًا على تسجيل صوتي احترافي لدرس «{title}». يمكنك القراءة الآن، وسيظهر المشغّل
            تلقائيًا في هذا الموضع فور توفّره — دون أي تحديث منك.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-2xs font-semibold text-neutral-500 ring-1 ring-inset ring-hairline dark:text-neutral-400">
            <MusicNoteIcon className="h-3 w-3" />
            دعم الصوتيات في الطريق — تابع القراءة
          </p>
        </div>
      </div>
    </section>
  );
}
