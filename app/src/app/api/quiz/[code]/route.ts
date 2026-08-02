import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { loadQuiz } from "@/lib/quiz";
import { getCurrentUser } from "@/lib/auth";
import { all, run } from "@/lib/db";
import { getQuizLock } from "@/lib/locks";
export const runtime = "nodejs";
const DRAWN_COUNT = 8, MAX_ATTEMPTS = 3, COOLDOWN_MS = 24 * 60 * 60 * 1000;

/** 403 payload shared by GET/POST — the client renders the lock UI. */
function lockedResponse(lock: Awaited<ReturnType<typeof getQuizLock>>) {
  return NextResponse.json({ error: "locked", lock }, { status: 403 });
}
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
async function attemptState(userId: string, code: string) {
  const rows = await all<{ score_pct: number; passed: number; created_at: string }>("SELECT score_pct, passed, created_at FROM quiz_attempts WHERE user_id = $1 AND quiz_code = $2 ORDER BY created_at DESC", userId, code);
  let cooldownUntil: string | null = null;
  if (rows.length) { const until = new Date(rows[0].created_at + "Z").getTime() + COOLDOWN_MS; if (Date.now() < until) cooldownUntil = new Date(until).toISOString(); }
  return { attemptsLeft: Math.max(0, MAX_ATTEMPTS - rows.length), cooldownUntil, bestScore: rows.reduce((best, r) => Math.max(best, r.score_pct), 0), totalAttempts: rows.length };
}
export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params; const quiz = loadQuiz(code);
  if (!quiz || !quiz.items.length) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const user = await getCurrentUser();
  if (user) {
    const lock = await getQuizLock(user.id, code);
    if (lock.locked) return lockedResponse(lock);
  }
  const drawn = shuffle(quiz.items).slice(0, DRAWN_COUNT);
  return NextResponse.json({ code: quiz.code, title: quiz.title, config: quiz.config, items: drawn.map((it) => ({ id: it.id, question: it.question, options: it.options })), ...(user ? await attemptState(user.id, code) : {}) });
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params; const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const lock = await getQuizLock(user.id, code);
  if (lock.locked) return lockedResponse(lock);
  const quiz = loadQuiz(code); if (!quiz || !quiz.items.length) return NextResponse.json({ error: "not-found" }, { status: 404 });
  let body: { itemIds?: number[]; answers?: number[]; finalize?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad-json" }, { status: 400 }); }
  if (!Array.isArray(body.itemIds) || !body.itemIds.length) return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  const byId = new Map(quiz.items.map((it) => [it.id, it]));
  const grade = (ids: number[], answers: number[]) => ids.map((id, i) => { const item = byId.get(id); if (!item) return null; const chosen = answers[i]; return { id, correct: item.answerIndex === chosen, chosen: chosen ?? -1, answerIndex: item.answerIndex, explanation: item.explanation }; }).filter((r): r is NonNullable<typeof r> => r !== null);
  if (body.finalize !== true) return NextResponse.json({ results: grade(body.itemIds, body.answers ?? []) });
  const state = await attemptState(user.id, code);
  if (state.attemptsLeft <= 0) return NextResponse.json({ error: "no-attempts-left" }, { status: 403 });
  if (state.cooldownUntil) return NextResponse.json({ error: "cooldown", cooldownUntil: state.cooldownUntil }, { status: 429 });
  const results = grade(body.itemIds, body.answers ?? []); const score = results.length ? Math.round(results.filter((r) => r.correct).length / results.length * 100) : 0; const passed = score >= quiz.config.passPct;
  await run("INSERT INTO quiz_attempts (id, user_id, quiz_code, score_pct, passed, answers_json) VALUES ($1, $2, $3, $4, $5, $6)", "q-" + randomBytes(8).toString("hex"), user.id, code, score, passed ? 1 : 0, JSON.stringify({ itemIds: body.itemIds, answers: body.answers ?? [] }));
  const after = await attemptState(user.id, code);
  return NextResponse.json({ score, passed, passPct: quiz.config.passPct, results, attemptsLeft: after.attemptsLeft, bestScore: after.bestScore });
}
