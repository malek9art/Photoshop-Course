/** Typed PostgreSQL query helpers for UI read models. */
import { all, get } from "./db";

export type StageRow = { id: string; title_ar: string; title_en: string; difficulty: string; effort_hours: number | null; position: number; module_count: number; lesson_count: number; published_count: number };
export type ModuleRow = { id: string; stage_id: string; title_ar: string; title_en: string; difficulty: string; position: number; lesson_count: number; completed_lessons: number };
export type LessonRow = { id: string; module_id: string; title_ar: string; title_en: string; position: number; content_path: string | null; duration_min: number | null; status: string; state: string | null };

export async function listStages(): Promise<StageRow[]> {
  return all<StageRow>(`SELECT s.*,
    (SELECT COUNT(*)::int FROM modules m WHERE m.stage_id = s.id) AS module_count,
    (SELECT COUNT(*)::int FROM lessons l JOIN modules m2 ON m2.id = l.module_id WHERE m2.stage_id = s.id) AS lesson_count,
    (SELECT COUNT(*)::int FROM lessons l JOIN modules m3 ON m3.id = l.module_id WHERE m3.stage_id = s.id AND l.status = 'published') AS published_count
    FROM stages s ORDER BY s.position`);
}

export async function getStage(id: string): Promise<StageRow | undefined> {
  return (await listStages()).find((s) => s.id === id);
}

export async function listModulesWithLessons(stageId: string, userId?: string): Promise<ModuleRow[]> {
  return all<ModuleRow>(`SELECT m.*,
    (SELECT COUNT(*)::int FROM lessons l WHERE l.module_id = m.id) AS lesson_count,
    (SELECT COUNT(*)::int FROM lessons l JOIN progress p ON p.target_type = 'lesson' AND p.target_id = l.id AND p.user_id = $1 WHERE l.module_id = m.id AND p.state = 'completed') AS completed_lessons
    FROM modules m WHERE m.stage_id = $2 ORDER BY m.position`, userId ?? "__none__", stageId);
}

export async function listLessons(moduleId: string, userId?: string): Promise<LessonRow[]> {
  return all<LessonRow>(`SELECT l.*, p.state FROM lessons l
    LEFT JOIN progress p ON p.target_type = 'lesson' AND p.target_id = l.id AND p.user_id = $1
    WHERE l.module_id = $2 ORDER BY l.position`, userId ?? "__none__", moduleId);
}

export function getLesson(id: string): Promise<(LessonRow & { module_title_ar: string; stage_id: string; stage_title_ar: string }) | undefined> {
  return get(`SELECT l.*, m.title_ar AS module_title_ar, s.id AS stage_id, s.title_ar AS stage_title_ar
    FROM lessons l JOIN modules m ON m.id = l.module_id JOIN stages s ON s.id = m.stage_id WHERE l.id = $1`, id);
}

export function getModule(id: string): Promise<ModuleRow | undefined> {
  return get(`SELECT m.*, 0::int AS lesson_count, 0::int AS completed_lessons FROM modules m WHERE m.id = $1`, id);
}

export async function getLessonProgress(userId: string, lessonId: string): Promise<string> {
  const row = await get<{ state: string }>("SELECT state FROM progress WHERE user_id = $1 AND target_type = 'lesson' AND target_id = $2", userId, lessonId);
  return row?.state ?? "not_started";
}
