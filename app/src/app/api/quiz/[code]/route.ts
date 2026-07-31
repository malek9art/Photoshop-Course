/**
 * Quiz BFF routes (C-08 assessment module, batch B-04).
 * GET  /api/quiz/[code]  -> { meta, items (8 random, answers stripped) }
 * POST /api/quiz/[code]  -> grade submission, record attempt, return feedback
 */
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { loadQuiz } from "@/lib/quiz";
import { getCurrentUser } from "@/lib/auth";
import { getDb, run } from "@/lib/db";

export const runtime = "nodejs";

const DRAWN_COUNT = 8; // DOC-07 §5.3: 8 items per attempt from pool

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const quiz = loadQuiz(code);
  if (!quiz || quiz.items.length === 0) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  const drawn = shuffle(quiz.items).slice(0, DRAWN_COUNT);
  return NextResponse.json({
    code: quiz.code,
    title: quiz.title,
    config: quiz.config,
    items: drawn.map((it) => ({ id: it.id, question: it.question, options: it.options })),
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await getCurrentUser();
  const quiz = loadQuiz(code);
  if (!quiz || quiz.items.length === 0) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
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

  if (user) {
    // Ensure schema for attempts (created on first use).
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
    run(
      "INSERT INTO quiz_attempts (id, user_id, quiz_code, score_pct, passed, answers_json) VALUES (?, ?, ?, ?, ?, ?)",
      randomBytes(8).toString("hex"),
      user.id,
      code,
      score,
      passed ? 1 : 0,
      JSON.stringify({ itemIds: body.itemIds ?? [], answers: body.answers ?? [] })
    );
  }

  return NextResponse.json({ score, passed, passPct: quiz.config.passPct, results: graded });
}
