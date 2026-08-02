/**
 * Audio asset resolution — server side.
 *
 * Lesson audio files live in `content/audio/` next to the lesson packages
 * (ADR-006 content-as-data): `content/audio/LES-XXXXXX.mp3`.
 * Resolution is pure filesystem lookup — no database, no external service.
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./content";

export const AUDIO_DIR = path.join(REPO_ROOT, "content", "audio");

/** Preferred order (mp3 first, then common alternatives). */
export const AUDIO_EXTENSIONS = ["mp3", "m4a", "ogg", "wav", "webm", "aac"] as const;

export const AUDIO_MIME: Record<(typeof AUDIO_EXTENSIONS)[number], string> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
  webm: "audio/webm",
  aac: "audio/aac",
};

export type LessonAudioAsset = {
  lessonId: string;
  fileName: string;
  ext: (typeof AUDIO_EXTENSIONS)[number];
  mimeType: string;
  /** Absolute path on disk (for the streaming route). */
  absPath: string;
  /** Public URL the player uses. */
  url: string;
  sizeBytes: number;
};

const SAFE_ID = /^[A-Za-z0-9_-]+$/;

/** Resolve the audio file for a lesson, or null when it doesn't exist yet. */
export function resolveLessonAudio(lessonId: string): LessonAudioAsset | null {
  if (!SAFE_ID.test(lessonId)) return null;
  for (const ext of AUDIO_EXTENSIONS) {
    const fileName = `${lessonId}.${ext}`;
    const absPath = path.join(AUDIO_DIR, fileName);
    let stat: fs.Stats | null = null;
    try {
      stat = fs.statSync(absPath);
    } catch {
      stat = null;
    }
    if (stat && stat.isFile()) {
      return {
        lessonId,
        fileName,
        ext,
        mimeType: AUDIO_MIME[ext],
        absPath,
        url: `/api/audio/${encodeURIComponent(lessonId)}`,
        sizeBytes: stat.size,
      };
    }
  }
  return null;
}
