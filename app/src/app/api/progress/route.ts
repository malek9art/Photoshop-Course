import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { get, run } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { maybeIssueStageCert } from "@/lib/certs";
import { syncLessonActivity, canCompleteLesson, getCompletionStatus } from "@/lib/completion";
import { awardAchievements } from "@/lib/achievements";
import { getPathChain } from "@/lib/locks";
import { buildQuizPathMap } from "@/lib/quiz";
import { buildExamPathMap } from "@/lib/exam";
export const runtime = "nodejs";

const VALID_TARGETS = new Set(["lesson", "module", "stage"]);
const VALID_STATES = new Set(["not_started", "in_progress", "completed"]);

/**
 * Phase 11 — the ONLY way to mutate progress:
 *  - action "sync"        → records opened / reached-end / reading time.
 *  - state "completed"    → server-verified completion (Batch 3/9).
 *  - module/stage writes  → always recomputed server-side from lessons.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { targetType?: string; targetId?: string; state?: string; action?: string; opened?: boolean; reachedEnd?: boolean; spentSeconds?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const { targetType, targetId, state, action } = body;
  if (!targetType || !targetId) return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  if (!VALID_TARGETS.has(targetType)) return NextResponse.json({ error: "invalid" }, { status: 400 });

  /* ------------------------------------------------ activity sync (lesson) */
  if (action === "sync") {
    if (targetType !== "lesson") return NextResponse.json({ error: "invalid" }, { status: 400 });
    const status = await syncLessonActivity(user.id, targetId, {
      opened: body.opened,
      reachedEnd: body.reachedEnd,
      spentSeconds: body.spentSeconds,
    });
    return NextResponse.json({ ok: true, status });
  }

  if (!state || !VALID_STATES.has(state)) return NextResponse.json({ error: "invalid" }, { status: 400 });

  /* ------------------------------------------- verified lesson completion */
  if (targetType === "lesson") {
    if (state !== "completed") {
      // in_progress / not_started — plain state write (no path bypass possible).
      await run(
        `INSERT INTO progress (id, user_id, target_type, target_id, state, percent, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP::text)
         ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET
           state = CASE WHEN progress.state = 'completed' THEN 'completed' ELSE EXCLUDED.state END,
           percent = CASE WHEN progress.state = 'completed' THEN 100 ELSE EXCLUDED.percent END,
           updated_at = CURRENT_TIMESTAMP::text`,
        randomBytes(8).toString("hex"), user.id, "lesson", targetId,
        state, state === "in_progress" ? 50 : 0
      );
      return NextResponse.json({ ok: true });
    }

    const verdict = await canCompleteLesson(user.id, targetId);
    if (!verdict.allowed) {
      return NextResponse.json(
        { error: "completion-requirements", code: verdict.code, message: verdict.message },
        { status: 403 }
      );
    }

    const status = await getCompletionStatus(user.id, targetId);
    await run(
      `INSERT INTO progress (id, user_id, target_type, target_id, state, percent, updated_at)
       VALUES ($1, $2, 'lesson', $3, 'completed', 100, CURRENT_TIMESTAMP::text)
       ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET
         state = 'completed', percent = 100, updated_at = CURRENT_TIMESTAMP::text`,
      randomBytes(8).toString("hex"), user.id, targetId
    );

    const lesson = await get<{ module_id: string; stage_id: string }>(
      `SELECT l.module_id, m.stage_id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE l.id = $1`,
      targetId
    );
    if (lesson) {
      await recomputeModule(user.id, lesson.module_id);
      // Achievements are evaluated server-side right after completion.
      await awardAchievements(user.id, { moduleId: lesson.module_id, stageId: lesson.stage_id });
    }

    /* Smart next step (Batch 4/5): next lesson, or the module quiz when the
       module just completed, or the stage exam when the stage completed. */
    const chain = await getPathChain();
    const idx = chain.findIndex((l) => l.id === targetId);
    const nextLesson = idx >= 0 && idx < chain.length - 1
      ? { id: chain[idx + 1].id, title: chain[idx + 1].titleAr, href: `/learn/${chain[idx + 1].id}` }
      : null;

    let nextAction: { type: "lesson" | "quiz" | "exam" | "done"; title: string; href: string } | null = null;
    if (lesson) {
      const moduleDone =
        (await get<{ c: number }>(
          `SELECT COUNT(*)::int AS c FROM lessons l
           LEFT JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 AND p.state='completed'
           WHERE l.module_id = $2 AND l.content_path IS NOT NULL AND p.id IS NULL`,
          user.id, lesson.module_id
        ))?.c === 0;
      const stageDone =
        (await get<{ c: number }>(
          `SELECT COUNT(*)::int AS c FROM lessons l
           JOIN modules m ON m.id = l.module_id
           LEFT JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 AND p.state='completed'
           WHERE m.stage_id = $2 AND l.content_path IS NOT NULL AND p.id IS NULL`,
          user.id, lesson.stage_id
        ))?.c === 0;

      if (stageDone && buildExamPathMap().has(`${lesson.stage_id}-EXAM`)) {
        nextAction = { type: "exam", title: `اختبار المرحلة — ${lesson.stage_id}-EXAM`, href: `/exam/${lesson.stage_id}-EXAM` };
      } else if (moduleDone && buildQuizPathMap().has(`QUIZ-${lesson.module_id}`)) {
        nextAction = { type: "quiz", title: `اختبار الوحدة — QUIZ-${lesson.module_id}`, href: `/quiz/QUIZ-${lesson.module_id}` };
      } else if (nextLesson) {
        nextAction = { type: "lesson", title: nextLesson.title, href: nextLesson.href };
      } else {
        nextAction = { type: "done", title: "انتهى المسار المتاح", href: "/catalog" };
      }
    }

    return NextResponse.json({
      ok: true,
      completed: true,
      nextLesson,
      nextAction,
      status,
      moduleHref: lesson ? `/catalog/${lesson.stage_id}` : "/catalog",
    });
  }

  /* ------------------------- module/stage: server-side authoritative only */
  const existing = await get<{ state: string }>(
    "SELECT state FROM progress WHERE user_id = $1 AND target_type = $2 AND target_id = $3",
    user.id, targetType, targetId
  );
  if (targetType === "module") {
    await recomputeModule(user.id, targetId);
  } else if (targetType === "stage") {
    await recomputeStage(user.id, targetId);
  }
  const after = await get<{ state: string }>(
    "SELECT state FROM progress WHERE user_id = $1 AND target_type = $2 AND target_id = $3",
    user.id, targetType, targetId
  );
  return NextResponse.json({
    ok: true,
    state: after?.state ?? existing?.state ?? "not_started",
  });
}

/* ------------------------------------------------------------------ recompute */

async function recomputeModule(userId: string, moduleId: string) {
  const total = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons WHERE module_id = $1", moduleId))?.c ?? 0;
  const done = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 WHERE l.module_id = $2 AND p.state='completed'", userId, moduleId))?.c ?? 0;
  const percent = total ? Math.round((done / total) * 100) : 0;
  await run(
    `INSERT INTO progress (id, user_id, target_type, target_id, state, percent, updated_at)
     VALUES ($1, $2, 'module', $3, $4, $5, CURRENT_TIMESTAMP::text)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET
       percent = EXCLUDED.percent, state = EXCLUDED.state, updated_at = CURRENT_TIMESTAMP::text`,
    randomBytes(8).toString("hex"), userId, moduleId,
    percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started", percent
  );

  const stage = await get<{ stage_id: string }>("SELECT stage_id FROM modules WHERE id = $1", moduleId);
  if (stage) {
    await recomputeStage(userId, stage.stage_id);
  }
}

async function recomputeStage(userId: string, stageId: string) {
  const total = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.stage_id = $1", stageId))?.c ?? 0;
  const done = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 WHERE m.stage_id = $2 AND p.state='completed'", userId, stageId))?.c ?? 0;
  const percent = total ? Math.round((done / total) * 100) : 0;
  await run(
    `INSERT INTO progress (id, user_id, target_type, target_id, state, percent, updated_at)
     VALUES ($1, $2, 'stage', $3, $4, $5, CURRENT_TIMESTAMP::text)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET
       percent = EXCLUDED.percent, state = EXCLUDED.state, updated_at = CURRENT_TIMESTAMP::text`,
    randomBytes(8).toString("hex"), userId, stageId,
    percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started", percent
  );
  await maybeIssueStageCert(userId, stageId);
}
