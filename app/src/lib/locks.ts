/**
 * Learning Path & Progress Lock System — Phase 11 (Batch 1)
 * ----------------------------------------------------------------------------
 * The platform is a strict sequential path:
 *
 *   Stage N  depends on Stage N-1
 *   Module M depends on Module M-1 (inside its stage)
 *   Lesson L depends on Lesson L-1 (inside its module)
 *
 * Because completion is sequential, the whole path collapses to ONE rule:
 * every *available* lesson (content exists) has exactly one required
 * predecessor — the previous available lesson in global order
 * (stage position → module position → lesson position). Unlocking anything
 * (stage/module/lesson) is therefore a single-chain check, and skipping is
 * impossible by construction.
 *
 * ALL checks in this module are server-side (SQL over the authoritative DB).
 * Client components only render what these functions say.
 */
import { all, get } from "./db";

/* ---------------------------------------------------------------- types */

export type LessonRef = { id: string; title: string; href: string };

export type LockReason =
  | { code: "prev-lesson"; lesson: LessonRef; message: string }
  | { code: "quiz-module"; moduleTitle: string; lesson: LessonRef | null; message: string }
  | { code: "exam-stage"; stageTitle: string; lesson: LessonRef | null; message: string }
  | { code: "unavailable"; message: string };

export type LockInfo = {
  locked: boolean;
  /** "أكمل المتطلبات السابقة أولاً." — generic headline. */
  message: string;
  /** Exact explanation + what to do (localized). */
  reason: LockReason | null;
};

export type PathItem = {
  id: string;
  moduleId: string;
  stageId: string;
  titleAr: string;
  durationMin: number | null;
};

export type PathContext = {
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  stageId: string;
  stageTitle: string;
  /** 0-based index inside the global chain. */
  chainIndex: number;
  chainLength: number;
  /** % of all available lessons completed by the user. */
  overallPercent: number;
  /** % of this stage's available lessons completed by the user. */
  stagePercent: number;
  nextLesson: LessonRef | null;
  prevLesson: LessonRef | null;
  lastVisited: LessonRef | null;
};

/* --------------------------------------------------------------- helpers */

const UNLOCKED = { locked: false, message: "", reason: null } satisfies LockInfo;

function lockedInfo(reason: LockReason): LockInfo {
  return { locked: true, message: "أكمل المتطلبات السابقة أولاً.", reason };
}

/** Map: lessonId → completed (only 'completed' counts — the path gate). */
async function completedMap(userId: string, lessonIds: string[]): Promise<Map<string, boolean>> {
  const map = new Map<string, boolean>();
  if (lessonIds.length === 0) return map;
  const rows = await all<{ target_id: string; state: string }>(
    `SELECT target_id, state FROM progress
     WHERE user_id = $1 AND target_type = 'lesson' AND target_id = ANY($2::text[])`,
    userId,
    lessonIds
  );
  for (const row of rows) map.set(row.target_id, row.state === "completed");
  return map;
}

/** The global ordered chain of *available* lessons (content exists). */
export async function getPathChain(): Promise<PathItem[]> {
  return all<PathItem>(
    `SELECT l.id, l.module_id AS "moduleId", m.stage_id AS "stageId",
            l.title_ar AS "titleAr", l.duration_min AS "durationMin"
     FROM lessons l
     JOIN modules m ON m.id = l.module_id
     JOIN stages s ON s.id = m.stage_id
     WHERE l.content_path IS NOT NULL
     ORDER BY s.position, m.position, l.position`
  );
}

/** All available lessons of one module, in path order. */
async function getModuleLessons(moduleId: string): Promise<PathItem[]> {
  return all<PathItem>(
    `SELECT l.id, l.module_id AS "moduleId", m.stage_id AS "stageId",
            l.title_ar AS "titleAr", l.duration_min AS "durationMin"
     FROM lessons l JOIN modules m ON m.id = l.module_id
     WHERE l.module_id = $1 AND l.content_path IS NOT NULL
     ORDER BY l.position`,
    moduleId
  );
}

/** All available lessons of one stage, in path order. */
async function getStageLessons(stageId: string): Promise<PathItem[]> {
  return all<PathItem>(
    `SELECT l.id, l.module_id AS "moduleId", m.stage_id AS "stageId",
            l.title_ar AS "titleAr", l.duration_min AS "durationMin"
     FROM lessons l JOIN modules m ON m.id = l.module_id
     WHERE m.stage_id = $1 AND l.content_path IS NOT NULL
     ORDER BY m.position, l.position`,
    stageId
  );
}

async function getLessonRef(lessonId: string): Promise<LessonRef | undefined> {
  return get<LessonRef>(
    `SELECT l.id, l.title_ar AS title, '/learn/' || l.id AS href
     FROM lessons l WHERE l.id = $1`,
    lessonId
  );
}

/* --------------------------------------------------------- lesson locks */

/**
 * Server-side unlock check for a lesson.
 * Guests (userId = null) keep read-only preview access — the lock system
 * governs learners' progress; there is nothing to track for anonymous users.
 */
export async function getLessonLock(userId: string | null, lessonId: string): Promise<LockInfo> {
  if (!userId) return UNLOCKED;

  const lesson = await get<{ module_id: string; title_ar: string }>(
    "SELECT module_id, title_ar FROM lessons WHERE id = $1 AND content_path IS NOT NULL",
    lessonId
  );
  if (!lesson) {
    return lockedInfo({ code: "unavailable", message: "هذا الدرس غير متاح بعد." });
  }

  const chain = await getPathChain();
  const idx = chain.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return UNLOCKED; // first available lesson — always open

  const pred = chain[idx - 1];
  const done = await completedMap(userId, [pred.id]);
  if (done.get(pred.id)) return UNLOCKED;

  return lockedInfo({
    code: "prev-lesson",
    lesson: { id: pred.id, title: pred.titleAr, href: `/learn/${pred.id}` },
    message: `أكمل درس «${pred.titleAr}» أولاً للانتقال إلى «${lesson.title_ar}».`,
  });
}

/** Map lessonId → LockInfo for many lessons at once (lists/sidebars). */
export async function getLessonLocks(userId: string | null, lessonIds: string[]): Promise<Map<string, LockInfo>> {
  const out = new Map<string, LockInfo>();
  if (!userId) {
    for (const id of lessonIds) out.set(id, UNLOCKED);
    return out;
  }
  if (lessonIds.length === 0) return out;

  const chain = await getPathChain();
  const position = new Map(chain.map((l, i) => [l.id, i]));
  const relevant = lessonIds.filter((id) => position.has(id));
  const done = await completedMap(userId, chain.map((l) => l.id));
  const titleOf = new Map(chain.map((l) => [l.id, l.titleAr]));

  for (const id of lessonIds) {
    const idx = position.get(id);
    if (idx === undefined) {
      // lesson has no content yet
      out.set(id, lockedInfo({ code: "unavailable", message: "هذا الدرس غير متاح بعد." }));
      continue;
    }
    if (idx === 0) {
      out.set(id, UNLOCKED);
      continue;
    }
    const pred = chain[idx - 1];
    if (done.get(pred.id)) out.set(id, UNLOCKED);
    else
      out.set(
        id,
        lockedInfo({
          code: "prev-lesson",
          lesson: { id: pred.id, title: pred.titleAr, href: `/learn/${pred.id}` },
          message: `أكمل درس «${pred.titleAr}» أولاً للانتقال إلى «${titleOf.get(id)}».`,
        })
      );
  }
  return out;
}

/* ------------------------------------------------- module / stage locks */

/** A module is locked iff its first available lesson is locked. */
export async function getModuleLock(userId: string | null, moduleId: string): Promise<LockInfo> {
  if (!userId) return UNLOCKED;
  const lessons = await getModuleLessons(moduleId);
  if (lessons.length === 0) return lockedInfo({ code: "unavailable", message: "هذه الوحدة غير متاحة بعد." });
  const first = lessons[0];
  const lock = await getLessonLock(userId, first.id);
  if (!lock.locked) return UNLOCKED;
  return lock;
}

/** A stage is locked iff its first available lesson is locked. */
export async function getStageLock(userId: string | null, stageId: string): Promise<LockInfo> {
  if (!userId) return UNLOCKED;
  const lessons = await getStageLessons(stageId);
  if (lessons.length === 0) return lockedInfo({ code: "unavailable", message: "هذه المرحلة غير متاحة بعد." });
  const first = lessons[0];
  const lock = await getLessonLock(userId, first.id);
  if (!lock.locked) return UNLOCKED;
  return lock;
}

/* ------------------------------------------------------- quiz / exam locks */

export function moduleIdFromQuizCode(code: string): string | null {
  const m = code.match(/^QUIZ-(MOD-\d{4})$/);
  return m ? m[1] : null;
}

export function stageIdFromExamCode(code: string): string | null {
  const m = code.match(/^(STG-\d{2})-EXAM$/);
  return m ? m[1] : null;
}

/**
 * Quiz gate (Batch 4): a module quiz unlocks only when EVERY lesson of the
 * module is completed. Returns the first incomplete lesson as the target to
 * finish first.
 */
export async function getQuizLock(userId: string | null, quizCode: string): Promise<LockInfo> {
  if (!userId) return UNLOCKED;
  const moduleId = moduleIdFromQuizCode(quizCode);
  if (!moduleId) return lockedInfo({ code: "unavailable", message: "هذا الاختبار غير متاح." });
  const module = await get<{ title_ar: string }>("SELECT title_ar FROM modules WHERE id = $1", moduleId);
  if (!module) return lockedInfo({ code: "unavailable", message: "هذا الاختبار غير متاح." });

  const lessons = await getModuleLessons(moduleId);
  if (lessons.length === 0) return lockedInfo({ code: "unavailable", message: "هذا الاختبار غير متاح بعد." });
  const done = await completedMap(userId, lessons.map((l) => l.id));
  const incomplete = lessons.find((l) => !done.get(l.id));
  if (!incomplete) return UNLOCKED;

  return lockedInfo({
    code: "quiz-module",
    moduleTitle: module.title_ar,
    lesson: { id: incomplete.id, title: incomplete.titleAr, href: `/learn/${incomplete.id}` },
    message: `أكمل جميع دروس وحدة «${module.title_ar}» أولاً لفتح اختبارها.`,
  });
}

/**
 * Exam gate (Batch 4): a stage exam unlocks only when EVERY lesson of the
 * stage is completed. Returns the first incomplete lesson as the target.
 */
export async function getExamLock(userId: string | null, examCode: string): Promise<LockInfo> {
  if (!userId) return UNLOCKED;
  const stageId = stageIdFromExamCode(examCode);
  if (!stageId) return lockedInfo({ code: "unavailable", message: "هذا الاختبار غير متاح." });
  const stage = await get<{ title_ar: string }>("SELECT title_ar FROM stages WHERE id = $1", stageId);
  if (!stage) return lockedInfo({ code: "unavailable", message: "هذا الاختبار غير متاح." });

  const lessons = await getStageLessons(stageId);
  if (lessons.length === 0) return lockedInfo({ code: "unavailable", message: "هذا الاختبار غير متاح بعد." });
  const done = await completedMap(userId, lessons.map((l) => l.id));
  const incomplete = lessons.find((l) => !done.get(l.id));
  if (!incomplete) return UNLOCKED;

  return lockedInfo({
    code: "exam-stage",
    stageTitle: stage.title_ar,
    lesson: { id: incomplete.id, title: incomplete.titleAr, href: `/learn/${incomplete.id}` },
    message: `أكمل جميع دروس مرحلة «${stage.title_ar}» أولاً لفتح اختبارها.`,
  });
}

/* ----------------------------------------------------- last visited */

/** Most recently visited lesson (progress updated_at — server truth). */
export async function getLastVisitedLesson(userId: string | null): Promise<LessonRef | null> {
  if (!userId) return null;
  const row = await get<{ target_id: string }>(
    `SELECT target_id FROM progress
     WHERE user_id = $1 AND target_type = 'lesson'
       AND (state != 'not_started' OR opened_at IS NOT NULL)
     ORDER BY updated_at DESC LIMIT 1`,
    userId
  );
  if (!row) return null;
  return (await getLessonRef(row.target_id)) ?? null;
}

/* ------------------------------------------------------- path context */

/**
 * Everything the UI needs to draw the progress trail (Batch 6) and the
 * smart next-step navigation (Batch 5) — one call.
 */
export async function getPathContext(userId: string | null, lessonId: string): Promise<PathContext | null> {
  const lesson = await get<{ module_id: string; title_ar: string }>(
    "SELECT module_id, title_ar FROM lessons WHERE id = $1 AND content_path IS NOT NULL",
    lessonId
  );
  if (!lesson) return null;

  const [chain, module, stage] = await Promise.all([
    getPathChain(),
    get<{ id: string; title_ar: string; stage_id: string }>(
      "SELECT id, title_ar, stage_id FROM modules WHERE id = $1",
      lesson.module_id
    ),
    get<{ id: string; title_ar: string }>(
      `SELECT s.id, s.title_ar FROM stages s
       JOIN modules m ON m.stage_id = s.id WHERE m.id = $1`,
      lesson.module_id
    ),
  ]);
  if (!module || !stage) return null;

  const idx = chain.findIndex((l) => l.id === lessonId);
  const done = await completedMap(userId ?? "", chain.map((l) => l.id));

  const stageLessons = chain.filter((l) => l.stageId === stage.id);
  const doneStage = stageLessons.filter((l) => done.get(l.id)).length;
  const doneAll = chain.filter((l) => done.get(l.id)).length;

  const next = idx >= 0 && idx < chain.length - 1 ? chain[idx + 1] : null;
  const prev = idx > 0 ? chain[idx - 1] : null;

  let lastVisited: LessonRef | null = null;
  if (userId) {
    const row = await get<{ target_id: string }>(
      `SELECT target_id FROM progress
       WHERE user_id = $1 AND target_type = 'lesson'
         AND (state != 'not_started' OR opened_at IS NOT NULL)
       ORDER BY updated_at DESC LIMIT 1`,
      userId
    );
    if (row) {
      const item = chain.find((l) => l.id === row.target_id);
      if (item) lastVisited = { id: item.id, title: item.titleAr, href: `/learn/${item.id}` };
    }
  }

  return {
    lessonId,
    lessonTitle: lesson.title_ar,
    moduleId: module.id,
    moduleTitle: module.title_ar,
    stageId: stage.id,
    stageTitle: stage.title_ar,
    chainIndex: idx,
    chainLength: chain.length,
    overallPercent: chain.length > 0 ? Math.round((doneAll / chain.length) * 100) : 0,
    stagePercent: stageLessons.length > 0 ? Math.round((doneStage / stageLessons.length) * 100) : 0,
    nextLesson: next ? { id: next.id, title: next.titleAr, href: `/learn/${next.id}` } : null,
    prevLesson: prev ? { id: prev.id, title: prev.titleAr, href: `/learn/${prev.id}` } : null,
    lastVisited,
  };
}
