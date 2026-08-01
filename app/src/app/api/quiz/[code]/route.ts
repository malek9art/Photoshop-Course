/**
 * Quiz BFF routes (C-08 assessment module).
 * DOC-08 §5 (module quiz AT-04): 3 graded attempts, 24 h between attempts,
 * best graded score recorded; DOC-07 §5.3: pool >= 2x drawn (16/8) refreshes per attempt.
 *
 * GET  /api/quiz/[code]  -> { meta, items (8 random, answers stripped), attempt state }
 * POST /api/quiz/[code]  -> two modes:
 *   - { itemIds:[id], answers:[i] }            formative per-question feedback
 *                                              (NOT recorded, does NOT consume an attempt)
 *   - { itemIds:[...all], answers:[...], finalize: true }
 *                                              end-of-attempt grading: enforces attempts
 *                                              & cooldown, records ONE attempt, returns score.
 */
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { loadQuiz } from "@/lib/quiz";
import { getCurrentUser } from "@/lib/auth";
import { all, run } from "@/lib/db";

export const runtime = "nodejs";

const DRAWN_COUNT = 8; // DOC-07 §5.3
const MAX_ATTEMPTS = 3; // DOC-08 §5 (AT-04)
const COOLDOWN_HOURS = 24; // DOC-08 §5 (AT-04)
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function attemptState(userId: string, code: string) {
  const rows = all<{ score_pct: number; passed: number; created_at: string }>(
    "SELECT score_pct, passed, created_at FROM quiz_attempts WHERE user_id = ? AND quiz_code = ? ORDER BY created_at DESC",
    userId,
    code
  );
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - rows.length);
  let cooldownUntil: string | null = null;
  if (rows.length > 0) {
    const last = new Date(rows[0].created_at + "Z").getTime();
    const until = last + COOLDOWN_MS;
    if (Date.now() < until) cooldownUntil = new Date(until).toISOString();
  }
  // DOC-08 §5: best graded score recorded
  const bestScore = rows.reduce((best, r) => Math.max(best, r.score_pct), 0);
  return { attemptsLeft, cooldownUntil, bestScore, totalAttempts: rows.length };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quiz = loadQuiz(code);
  if (!quiz || quiz.items.length === 0) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  const user = await getCurrentUser();
  const drawn = shuffle(quiz.items).slice(0, DRAWN_COUNT);
  return NextResponse.json({
    code: quiz.code,
    title: quiz.title,
    config: quiz.config,
    items: drawn.map((it) => ({ id: it.id, question: it.question, options: it.options })),
    ...(user ? attemptState(user.id, code) : {}),
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const quiz = loadQuiz(code);
  if (!quiz || quiz.items.length === 0) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  let body: { itemIds?: number[]; answers?: number[]; finalize?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }
  if (!Array.isArray(body.itemIds) || body.itemIds.length === 0) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  const byId = new Map(quiz.items.map((it) => [it.id, it]));
  const grade = (ids: number[], answers: number[]) =>
    ids
      .map((id, i) => {
        const item = byId.get(id);
        if (!item) return null;
        const chosen = answers[i];
        return {
          id,
          correct: item.answerIndex === chosen,
          chosen: chosen ?? -1,
          answerIndex: item.answerIndex,
          explanation: item.explanation,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

  // ---------- formative feedback mode (no attempt consumed) ----------
  if (body.finalize !== true) {
    const results = grade(body.itemIds, body.answers ?? []);
    return NextResponse.json({ results });
  }

  // ---------- final grading mode (consumes one attempt) ----------
  // DOC-08 §5: 3 graded attempts, 24 h between attempts
  const state = attemptState(user.id, code);
  if (state.attemptsLeft <= 0) {
    return NextResponse.json({ error: "no-attempts-left" }, { status: 403 });
  }
  if (state.cooldownUntil) {
    return NextResponse.json({ error: "cooldown", cooldownUntil: state.cooldownUntil }, { status: 429 });
  }

  const results = grade(body.itemIds, body.answers ?? []);
  const score = results.length > 0 ? Math.round((results.filter((r) => r.correct).length / results.length) * 100) : 0;
  const passed = score >= quiz.config.passPct;

  run(
    "INSERT INTO quiz_attempts (id, user_id, quiz_code, score_pct, passed, answers_json) VALUES (?, ?, ?, ?, ?, ?)",
    randomBytes(8).toString("hex"),
    user.id,
    code,
    score,
    passed ? 1 : 0,
    JSON.stringify({ itemIds: body.itemIds ?? [], answers: body.answers ?? [] })
  );

  const after = attemptState(user.id, code);
  return NextResponse.json({ score, passed, passPct: quiz.config.passPct, results, attemptsLeft: after.attemptsLeft, bestScore: after.bestScore });
}
