/**
 * Achievements — Phase 11 (Batch 7)
 * ----------------------------------------------------------------------------
 * Server-side awarding only. Called after a verified lesson completion;
 * every achievement is guarded by UNIQUE(user_id, code) so it can never be
 * awarded twice. Newly earned rows are returned so the UI can celebrate.
 */
import { randomBytes } from "node:crypto";
import { all, get, run } from "./db";

export type AchievementCode = "first_lesson" | "first_module" | "half_stage" | "stage_complete" | "course_complete";

export const ACHIEVEMENT_META: Record<AchievementCode, { title: string; icon: string; hint: string }> = {
  first_lesson: { title: "أول درس مكتمل", icon: "🏅", hint: "أكملت أول درس في رحلتك" },
  first_module: { title: "أول وحدة مكتملة", icon: "🥇", hint: "أنهيت كل دروس وحدة كاملة" },
  half_stage: { title: "نصف المرحلة", icon: "🎖", hint: "أتممت 50% من دروس المرحلة" },
  stage_complete: { title: "إنهاء المرحلة", icon: "🏆", hint: "أتممت جميع دروس مرحلة كاملة" },
  course_complete: { title: "إنهاء الدورة", icon: "🎓", hint: "أتممت جميع مراحل المنهج" },
};

export type AchievementRow = {
  id: string;
  user_id: string;
  code: AchievementCode;
  title_ar: string;
  icon: string;
  earned_at: string;
};

export function listAchievements(userId: string): Promise<AchievementRow[]> {
  return all<AchievementRow>("SELECT * FROM achievements WHERE user_id = $1 ORDER BY earned_at", userId);
}

/** Count of available lessons in a module / stage. */
async function countLessons(where: string, param: string): Promise<number> {
  const row = await get<{ c: number }>(
    `SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id WHERE ${where} AND l.content_path IS NOT NULL`,
    param
  );
  return row?.c ?? 0;
}

async function countCompletedLessons(userId: string, where: string, param: string): Promise<number> {
  const row = await get<{ c: number }>(
    `SELECT COUNT(*)::int AS c FROM lessons l
     JOIN modules m ON m.id = l.module_id
     JOIN progress p ON p.target_type = 'lesson' AND p.target_id = l.id AND p.user_id = $1 AND p.state = 'completed'
     WHERE ${where} AND l.content_path IS NOT NULL`,
    userId,
    param
  );
  return row?.c ?? 0;
}

async function award(userId: string, code: AchievementCode): Promise<AchievementRow | null> {
  const meta = ACHIEVEMENT_META[code];
  const rows = await run(
    `INSERT INTO achievements (id, user_id, code, title_ar, icon)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT(user_id, code) DO NOTHING`,
    "a-" + randomBytes(8).toString("hex"),
    userId,
    code,
    meta.title,
    meta.icon
  );
  if (rows.rowCount === 0) return null;
  return (await get<AchievementRow>("SELECT * FROM achievements WHERE user_id = $1 AND code = $2", userId, code)) ?? null;
}

/**
 * Check & award achievements after a lesson in (moduleId, stageId) completed.
 * Returns the newly earned achievements (empty when nothing new).
 */
export async function awardAchievements(
  userId: string,
  context: { moduleId: string; stageId: string }
): Promise<AchievementRow[]> {
  const earned: AchievementRow[] = [];

  const totalAll = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons WHERE content_path IS NOT NULL"))?.c ?? 0;
  const doneAll = await countCompletedLessons(userId, "1=1", "1=1");

  if (doneAll === 1) {
    const a = await award(userId, "first_lesson");
    if (a) earned.push(a);
  }

  // First module completed?
  const modTotal = await countLessons("m.id = $1", context.moduleId);
  const modDone = await countCompletedLessons(userId, "m.id = $1", context.moduleId);
  if (modTotal > 0 && modDone >= modTotal) {
    const completedModules = (await get<{ c: number }>(
      `SELECT COUNT(*)::int AS c FROM (
         SELECT m.id FROM modules m
         JOIN lessons l ON l.module_id = m.id AND l.content_path IS NOT NULL
         JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 AND p.state='completed'
         GROUP BY m.id
         HAVING COUNT(*) = (SELECT COUNT(*)::int FROM lessons l2 WHERE l2.module_id = m.id AND l2.content_path IS NOT NULL)
       ) done`,
      userId
    ))?.c ?? 0;
    if (completedModules === 1) {
      const a = await award(userId, "first_module");
      if (a) earned.push(a);
    }
  }

  // Stage milestones.
  const stageTotal = await countLessons("m.stage_id = $1", context.stageId);
  const stageDone = await countCompletedLessons(userId, "m.stage_id = $1", context.stageId);
  if (stageTotal > 0) {
    if (stageDone >= Math.ceil(stageTotal / 2)) {
      const a = await award(userId, "half_stage");
      if (a) earned.push(a);
    }
    if (stageDone >= stageTotal) {
      const a = await award(userId, "stage_complete");
      if (a) earned.push(a);
    }
  }

  // Course complete: every available lesson in every stage done.
  if (totalAll > 0 && doneAll >= totalAll) {
    const a = await award(userId, "course_complete");
    if (a) earned.push(a);
  }

  return earned;
}
