/**
 * Exam BFF routes (AT-06, DOC-08 §4-§5):
 * GET  /api/exam/[code]  -> meta + items (answers stripped) + attempt state
 * POST /api/exam/[code]  -> enforce attempts/cooldown, grade, record attempt,
 *                           auto-issue stage certificate on pass (DOC-08 §7.1)
 */
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { loadExam, gradeExam, stageFromExamCode } from "@/lib/exam";
import { getCurrentUser } from "@/lib/auth";
import { all, get, run } from "@/lib/db";
import { maybeIssueStageCert } from "@/lib/certs";

export const runtime = "nodejs";

const DAY_MS = 24 * 60 * 60 * 1000;

function attemptState(userId: string, code: string, config: { attempts: number; cooldownDays: number }) {
  const rows = all<{ score_pct: number; passed: number; created_at: string }>(
    "SELECT score_pct, passed, created_at FROM exam_attempts WHERE user_id = ? AND exam_code = ? ORDER BY created_at DESC",
    userId,
    code
  );
  const attemptsLeft = Math.max(0, config.attempts - rows.length);
  let cooldownUntil: string | null = null;
  if (rows.length > 0) {
    const last = new Date(rows[0].created_at + "Z").getTime();
    const until = last + config.cooldownDays * DAY_MS;
    if (Date.now() < until) cooldownUntil = new Date(until).toISOString();
  }
  return { attemptsLeft, cooldownUntil, lastScore: rows[0]?.score_pct ?? null, lastPassed: rows[0]?.passed === 1 };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = loadExam(code);
  if (!exam || exam.items.length === 0) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  const user = await getCurrentUser();
  const items = exam.items.map((it) => ({ id: it.id, question: it.question, options: it.options }));
  return NextResponse.json({
    code: exam.code,
    title: exam.title,
    config: exam.config,
    items,
    ...(user ? attemptState(user.id, code, exam.config) : {}),
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const exam = loadExam(code);
  if (!exam || exam.items.length === 0) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  // DOC-08 §5: 2 graded attempts, 7 days between attempts
  const state = attemptState(user.id, code, exam.config);
  if (state.attemptsLeft <= 0) {
    return NextResponse.json({ error: "no-attempts-left" }, { status: 403 });
  }
  if (state.cooldownUntil) {
    return NextResponse.json({ error: "cooldown", cooldownUntil: state.cooldownUntil }, { status: 429 });
  }

  let body: { itemIds?: number[]; answers?: number[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const { results, score } = gradeExam(exam.items, body.itemIds ?? [], body.answers ?? []);
  const passed = score >= exam.config.passPct;

  run(
    "INSERT INTO exam_attempts (id, user_id, exam_code, score_pct, passed, answers_json) VALUES (?, ?, ?, ?, ?, ?)",
    randomBytes(8).toString("hex"),
    user.id,
    code,
    score,
    passed ? 1 : 0,
    JSON.stringify({ itemIds: body.itemIds ?? [], answers: body.answers ?? [] })
  );

  // DOC-08 §7.1: certificate requires lessons 100% + exam pass + project pass — re-evaluate on exam pass.
  const stageId = stageFromExamCode(code);
  if (passed && stageId) {
    maybeIssueStageCert(user.id, stageId);
  }

  return NextResponse.json({ score, passed, passPct: exam.config.passPct, results });
}
