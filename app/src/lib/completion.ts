/**
 * Verified lesson completion — Phase 11 (Batch 3)
 * ----------------------------------------------------------------------------
 * A lesson counts as completed ONLY when ALL of the following are proven
 * server-side:
 *   1. The lesson is unlocked (path gate).
 *   2. The student opened the lesson (opened_at recorded).
 *   3. The student spent >= 70% of the expected reading time.
 *   4. The student reached the end of the page (reached_end = 1).
 *   5. The student pressed "إكمال الدرس" (completion POST).
 *
 * The client reports activity through the same progress API ("sync" action);
 * the server persists it and performs the final authoritative check.
 */
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { get, run } from "./db";
import { REPO_ROOT } from "./content";
import { getLessonLock } from "./locks";

/** Fraction of the expected reading time required to complete. */
export const COMPLETION_TIME_RATIO = 0.7;

/** DB-native timestamp (matches the schema's CURRENT_TIMESTAMP::text). */
function dbNow(): string {
  return new Date().toISOString().replace("T", " ").replace("Z", "");
}

export type CompletionRequirement = {
  opened: boolean;
  reachedEnd: boolean;
  /** Wall-clock seconds since first open (server-computed). */
  elapsedSeconds: number;
  /** 70% of the expected reading time. */
  thresholdSeconds: number;
  /** 0..100 — how far along the time requirement the student is. */
  timePercent: number;
  state: string | null;
  completed: boolean;
};

/** Expected reading seconds: DB duration, else estimate from the content. */
export async function expectedReadingSeconds(lessonId: string): Promise<number> {
  const row = await get<{ duration_min: number | null; content_path: string | null }>(
    "SELECT duration_min, content_path FROM lessons WHERE id = $1",
    lessonId
  );
  if (!row) return 5 * 60; // unknown lesson → 5 minutes default floor
  if (row.duration_min && row.duration_min > 0) return row.duration_min * 60;
  if (row.content_path) {
    try {
      const abs = path.isAbsolute(row.content_path)
        ? row.content_path
        : path.join(REPO_ROOT, row.content_path);
      const md = fs.readFileSync(abs, "utf8");
      const words = md.replace(/[#*`>_\-|]/g, " ").split(/\s+/).filter(Boolean).length;
      return Math.max(60, Math.round((words / 180) * 60)); // ≈180 wpm Arabic
    } catch {
      /* fall through to default */
    }
  }
  return 5 * 60;
}

/** Current completion status for a lesson (server truth). */
export async function getCompletionStatus(userId: string, lessonId: string): Promise<CompletionRequirement> {
  const row = await get<{
    state: string | null;
    opened_at: string | null;
    reached_end: number | null;
  }>(
    `SELECT state, opened_at, reached_end FROM progress
     WHERE user_id = $1 AND target_type = 'lesson' AND target_id = $2`,
    userId,
    lessonId
  );

  const openedAt = row?.opened_at ? new Date(row.opened_at + (row.opened_at.includes("Z") ? "" : "Z")).getTime() : null;
  const elapsed = openedAt && Number.isFinite(openedAt) ? Math.max(0, Math.floor((Date.now() - openedAt) / 1000)) : 0;
  const threshold = Math.max(60, Math.round((await expectedReadingSeconds(lessonId)) * COMPLETION_TIME_RATIO));

  return {
    opened: Boolean(row?.opened_at),
    reachedEnd: (row?.reached_end ?? 0) === 1,
    elapsedSeconds: elapsed,
    thresholdSeconds: threshold,
    timePercent: threshold > 0 ? Math.min(100, Math.round((elapsed / threshold) * 100)) : 0,
    state: row?.state ?? null,
    completed: row?.state === "completed",
  };
}

/**
 * Persist activity reported by the client (first open / scroll-end / time).
 * Idempotent — safe to call many times.
 */
export async function syncLessonActivity(
  userId: string,
  lessonId: string,
  input: { opened?: boolean; reachedEnd?: boolean; spentSeconds?: number }
): Promise<CompletionRequirement> {
  const row = await get<{ state: string | null; opened_at: string | null; reached_end: number | null; spent_seconds: number | null }>(
    `SELECT state, opened_at, reached_end, spent_seconds FROM progress
     WHERE user_id = $1 AND target_type = 'lesson' AND target_id = $2`,
    userId,
    lessonId
  );

  const now = dbNow();
  const openedAt = row?.opened_at ?? (input.opened ? new Date().toISOString() : null);
  const reachedEnd = input.reachedEnd ? 1 : row?.reached_end ?? 0;
  const spent = Math.max(row?.spent_seconds ?? 0, Math.floor(input.spentSeconds ?? 0));
  const state = row?.state && row.state !== "not_started" ? row.state : input.opened ? "in_progress" : row?.state ?? "not_started";

  await run(
    `INSERT INTO progress (id, user_id, target_type, target_id, state, percent, opened_at, reached_end, spent_seconds, updated_at)
     VALUES ($1, $2, 'lesson', $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET
       state = CASE WHEN progress.state = 'completed' THEN 'completed' ELSE EXCLUDED.state END,
       percent = CASE WHEN progress.state = 'completed' THEN 100 ELSE EXCLUDED.percent END,
       opened_at = COALESCE(progress.opened_at, EXCLUDED.opened_at),
       reached_end = GREATEST(progress.reached_end, EXCLUDED.reached_end),
       spent_seconds = GREATEST(progress.spent_seconds, EXCLUDED.spent_seconds),
       updated_at = EXCLUDED.updated_at`,
    randomBytes(8).toString("hex"),
    userId,
    lessonId,
    state,
    state === "completed" ? 100 : state === "in_progress" ? 50 : 0,
    openedAt,
    reachedEnd,
    spent,
    now
  );

  return getCompletionStatus(userId, lessonId);
}

export type CompletionVerdict =
  | { allowed: true }
  | { allowed: false; code: "locked" | "not-opened" | "not-reached-end" | "time"; message: string };

/**
 * The authoritative server-side completion check.
 * Called by POST /api/progress — the client cannot bypass it.
 */
export async function canCompleteLesson(userId: string, lessonId: string): Promise<CompletionVerdict> {
  const lock = await getLessonLock(userId, lessonId);
  if (lock.locked) {
    return { allowed: false, code: "locked", message: lock.message };
  }

  const status = await getCompletionStatus(userId, lessonId);
  if (!status.opened) {
    return { allowed: false, code: "not-opened", message: "افتح الدرس واقرأه أولاً قبل إكماله." };
  }
  if (!status.reachedEnd) {
    return { allowed: false, code: "not-reached-end", message: "صل إلى نهاية صفحة الدرس أولاً." };
  }
  if (status.elapsedSeconds < status.thresholdSeconds) {
    return {
      allowed: false,
      code: "time",
      message: `اقضِ ${Math.ceil(status.thresholdSeconds / 60)} دقيقة على الأقل في القراءة (${Math.round(
        COMPLETION_TIME_RATIO * 100
      )}% من زمن القراءة المتوقع) قبل إكمال الدرس.`,
    };
  }
  return { allowed: true };
}
