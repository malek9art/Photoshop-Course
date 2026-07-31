/**
 * Quiz BFF routes (C-08 assessment module).
 * DOC-08 §5 (module quiz AT-04): 3 graded attempts, 24 h between attempts,
 * best graded score recorded; DOC-07 §5.3: pool >= 2x drawn (16/8) refreshes per attempt.
 * GET  /api/quiz/[code]  -> { meta, items (8 random, answers stripped), attempt state }
 * POST /api/quiz/[code]  -> enforce attempts/cooldown, grade, record attempt, best score
 */
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { loadQuiz } from "@/lib/quiz";
import { getCurrentUser } from "@/lib/auth";
import { getDb, get, all, run } from "@/lib/db";

export const runtime = "nodejs";

const DRAWN_COUNT = 8; // DOC-07 §5.3
const MAX_ATTEMPTS = 3; // DOC-08 §5 (AT-04)
const COOLDOWN_HOURS = 24; // DOC-08 §5 (AT-04)
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

function ensureSchema() {
  getDb().exec(
    `CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quiz_code TEXT NOT NULL,
      score_pct INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      answers_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  );
}

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
  ensureSchema();
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
  ensureSchema();

  // DOC-08 §5: 3 graded attempts, 24 h between attempts
  const state = attemptState(user.id, code);
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

  const byId = new Map(quiz.items.map((it) => [it.id, it]));
  const results = (body.itemIds ?? []).map((id, i) => {
    const item = byId.get(id);
    if (!item) return null;
    const chosen = (body.answers ?? [])[i];
    const correct = item.answerIndex === chosen;
    return {
      id,
      correct,
      chosen: chosen ?? -1,
      answerIndex: item.answerIndex,
      explanation: item.explanation,
    };
  });
  const graded = results.filter((r): r is NonNullable<typeof r> => r !== null);
  const score = graded.length > 0 ? Math.round((graded.filter((r) => r.correct).length / graded.length) * 100) : 0;
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
  return NextResponse.json({ score, passed, passPct: quiz.config.passPct, results: graded, attemptsLeft: after.attemptsLeft, bestScore: after.bestScore });
}
