import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { get, run } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { maybeIssueStageCert } from "@/lib/certs";
export const runtime = "nodejs";
const VALID_TARGETS = new Set(["lesson", "module", "stage"]), VALID_STATES = new Set(["not_started", "in_progress", "completed"]);
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body: { targetType?: string; targetId?: string; state?: string }; try { body = await req.json(); } catch { return NextResponse.json({ error: "bad-json" }, { status: 400 }); }
  const { targetType, targetId, state } = body;
  if (!targetType || !targetId || !state) return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  if (!VALID_TARGETS.has(targetType) || !VALID_STATES.has(state)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  await run(`INSERT INTO progress (id, user_id, target_type, target_id, state, percent) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET state=EXCLUDED.state, percent=EXCLUDED.percent, updated_at=CURRENT_TIMESTAMP::text`, randomBytes(8).toString("hex"), user.id, targetType, targetId, state, state === "completed" ? 100 : state === "in_progress" ? 50 : 0);
  if (targetType === "lesson" && state === "completed") { const lesson = await get<{ module_id: string }>("SELECT module_id FROM lessons WHERE id = $1", targetId); if (lesson) await recomputeModule(user.id, lesson.module_id); }
  return NextResponse.json({ ok: true });
}
async function recomputeModule(userId: string, moduleId: string) {
  const total = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons WHERE module_id = $1", moduleId))?.c ?? 0;
  const done = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 WHERE l.module_id = $2 AND p.state='completed'", userId, moduleId))?.c ?? 0;
  const percent = total ? Math.round(done / total * 100) : 0;
  await run(`INSERT INTO progress (id, user_id, target_type, target_id, state, percent) VALUES ($1, $2, 'module', $3, $4, $5) ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET percent=EXCLUDED.percent, state=EXCLUDED.state, updated_at=CURRENT_TIMESTAMP::text`, randomBytes(8).toString("hex"), userId, moduleId, percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started", percent);
  const stage = await get<{ stage_id: string }>("SELECT stage_id FROM modules WHERE id = $1", moduleId);
  if (!stage) return;
  const totalLessons = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.stage_id = $1", stage.stage_id))?.c ?? 0;
  const doneLessons = (await get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons l JOIN modules m ON m.id = l.module_id JOIN progress p ON p.target_type='lesson' AND p.target_id = l.id AND p.user_id = $1 WHERE m.stage_id = $2 AND p.state='completed'", userId, stage.stage_id))?.c ?? 0;
  const stagePercent = totalLessons ? Math.round(doneLessons / totalLessons * 100) : 0;
  await run(`INSERT INTO progress (id, user_id, target_type, target_id, state, percent) VALUES ($1, $2, 'stage', $3, $4, $5) ON CONFLICT(user_id, target_type, target_id) DO UPDATE SET percent=EXCLUDED.percent, state=EXCLUDED.state, updated_at=CURRENT_TIMESTAMP::text`, randomBytes(8).toString("hex"), userId, stage.stage_id, stagePercent >= 100 ? "completed" : stagePercent > 0 ? "in_progress" : "not_started", stagePercent);
  await maybeIssueStageCert(userId, stage.stage_id);
}
