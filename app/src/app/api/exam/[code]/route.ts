import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { loadExam, gradeExam, stageFromExamCode } from "@/lib/exam";
import { getCurrentUser } from "@/lib/auth";
import { all, run } from "@/lib/db";
import { maybeIssueStageCert } from "@/lib/certs";
export const runtime = "nodejs";
const DAY_MS = 24 * 60 * 60 * 1000;

async function attemptState(userId: string, code: string, config: { attempts: number; cooldownDays: number }) {
  const rows = await all<{ score_pct: number; passed: number; created_at: string }>("SELECT score_pct, passed, created_at FROM exam_attempts WHERE user_id = $1 AND exam_code = $2 ORDER BY created_at DESC", userId, code);
  const attemptsLeft = Math.max(0, config.attempts - rows.length);
  let cooldownUntil: string | null = null;
  if (rows.length) { const until = new Date(rows[0].created_at + "Z").getTime() + config.cooldownDays * DAY_MS; if (Date.now() < until) cooldownUntil = new Date(until).toISOString(); }
  return { attemptsLeft, cooldownUntil, lastScore: rows[0]?.score_pct ?? null, lastPassed: rows[0]?.passed === 1 };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const exam = loadExam(code);
  if (!exam || !exam.items.length) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const user = await getCurrentUser();
  return NextResponse.json({ code: exam.code, title: exam.title, config: exam.config, items: exam.items.map((it) => ({ id: it.id, question: it.question, options: it.options })), ...(user ? await attemptState(user.id, code, exam.config) : {}) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const exam = loadExam(code);
  if (!exam || !exam.items.length) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const state = await attemptState(user.id, code, exam.config);
  if (state.attemptsLeft <= 0) return NextResponse.json({ error: "no-attempts-left" }, { status: 403 });
  if (state.cooldownUntil) return NextResponse.json({ error: "cooldown", cooldownUntil: state.cooldownUntil }, { status: 429 });
  let body: { itemIds?: number[]; answers?: number[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad-json" }, { status: 400 }); }
  const { results, score } = gradeExam(exam.items, body.itemIds ?? [], body.answers ?? []);
  const passed = score >= exam.config.passPct;
  await run("INSERT INTO exam_attempts (id, user_id, exam_code, score_pct, passed, answers_json) VALUES ($1, $2, $3, $4, $5, $6)", "e-" + randomBytes(8).toString("hex"), user.id, code, score, passed ? 1 : 0, JSON.stringify({ itemIds: body.itemIds ?? [], answers: body.answers ?? [] }));
  const stageId = stageFromExamCode(code);
  if (passed && stageId) await maybeIssueStageCert(user.id, stageId);
  return NextResponse.json({ score, passed, passPct: exam.config.passPct, results });
}
