"use client";

/**
 * Lesson experience shell (Batches 2 & 3).
 * Wraps the lesson page in the AudioProvider, adds the sticky toolbar and
 * the fixed mini player. The article/sidebar are server-rendered children —
 * context from the provider reaches the client components inside them
 * (e.g. LessonAudioBlock) through React's normal context propagation.
 */
import { AudioProvider } from "@/lib/audio/audio-provider";
import type { AudioSource } from "@/lib/audio/types";
import { MiniAudioPlayer } from "@/components/audio/MiniAudioPlayer";
import { LessonToolbar, type LessonNav } from "./LessonToolbar";
import type { TocItem } from "@/components/LessonToc";

export function LessonExperience({
  lessonId,
  title,
  audio,
  readingMinutes,
  tocItems,
  prev,
  next,
  children,
}: {
  lessonId: string;
  title: string;
  audio: AudioSource | null;
  readingMinutes: number;
  tocItems: TocItem[];
  prev: LessonNav;
  next: LessonNav;
  children: React.ReactNode;
}) {
  return (
    <AudioProvider key={lessonId} source={audio}>
      <LessonToolbar
        lessonId={lessonId}
        title={title}
        readingMinutes={readingMinutes}
        tocItems={tocItems}
        prev={prev}
        next={next}
      />
      {children}
      {audio ? <MiniAudioPlayer title={title} /> : null}
    </AudioProvider>
  );
}
