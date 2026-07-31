import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { get, run } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { maybeIssueStageCert } from "@/lib/certs";

export const runtime = "nodejs";

const VALID_TARGETS = new Set(["lesson", "module", "stage"]);
const VALID_STATES = new Set(["not_started", "in_progress", "completed"]);

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { targetType?: string; targetId?: string; state?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const { targetType, targetId, state } = body;
  if (!targetType || !targetId || !state) return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  if (!VALID_TARGETS.has(targetType) || !VALID_STATES.has(state)) return NextResponse.json({ error: "invalid" }, { status: 400 });

  run(
    `INSERT INTO progress (id, user_id, target_type, target_id, state, percent)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET state=excluded.state, percent=excluded.percent, updated_at=datetime('now')`,
    randomBytes(8).toString("hex"),
    user.id,
    targetType,
    targetId,
    state,
    state === "completed" ? 100 : state === "in_progress" ? 50 : 0
  );

  // Roll up module/stage completion when a lesson completes (DOC-03 §15 gating).
  if (targetType === "lesson" && state === "completed") {
    const lesson = get<{ module_id: string }>("SELECT module_id FROM lessons WHERE id = ?", targetId);
    if (lesson) {
      recomputeModule(user.id, lesson.module_id);
    }
  }

  return NextResponse.json({ ok: true });
}

function recomputeModule(userId: string, moduleId: string) {
  const total = (get("SELECT COUNT(*) AS c FROM lessons WHERE module_id = ?", moduleId) as any).c as number;
  const done = (get(
    `SELECT COUNT(*) AS c FROM lessons l
     JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = ?
     WHERE l.module_id = ? AND p.state='completed'`,
    userId,
    moduleId
  ) as any).c as number;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  run(
    `INSERT INTO progress (id, user_id, target_type, target_id, state, percent)
     VALUES (?, ?, 'module', ?, ?, ?)
     ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET percent=excluded.percent, state=excluded.state, updated_at=datetime('now')`,
    randomBytes(8).toString("hex"),
    userId,
    moduleId,
    percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started",
    percent
  );

  const stage = get<{ stage_id: string }>("SELECT stage_id FROM modules WHERE id = ?", moduleId);
  if (stage) {
    const totalLessons = (get(
      "SELECT COUNT(*) AS c FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.stage_id = ?",
      stage.stage_id
    ) as any).c as number;
    const doneLessons = (get(
      `SELECT COUNT(*) AS c FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = ?
       WHERE m.stage_id = ? AND p.state='completed'`,
      userId,
      stage.stage_id
    ) as any).c as number;
    const stagePercent = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
    run(
      `INSERT INTO progress (id, user_id, target_type, target_id, state, percent)
       VALUES (?, ?, 'stage', ?, ?, ?)
       ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET percent=excluded.percent, state=excluded.state, updated_at=datetime('now')`,
      randomBytes(8).toString("hex"),
      userId,
      stage.stage_id,
      stagePercent >= 100 ? "completed" : stagePercent > 0 ? "in_progress" : "not_started",
      stagePercent
    );

    // Auto-issue the stage certificate when 100% lessons completed (DOC-08 §7; proxy gate until exams land).
    maybeIssueStageCert(userId, stage.stage_id);
  }
}
