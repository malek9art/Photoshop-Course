import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { all, run } from "@/lib/db";
import { buildProjectPathMap, stageFromProjectCode } from "@/lib/rubric";
export const runtime = "nodejs";
const MAX_SUBMISSIONS = 2, COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await req.formData(); const projectCode = String(form.get("project_code") ?? ""); const title = String(form.get("title") ?? "").trim().slice(0, 120); const note = String(form.get("note") ?? "").trim().slice(0, 1000);
  if (!projectCode || !title) return NextResponse.json({ error: "missing" }, { status: 400 });
  if (!stageFromProjectCode(projectCode) || !buildProjectPathMap().has(projectCode)) return NextResponse.json({ error: "unknown-project" }, { status: 400 });
  const subs = await all<{ created_at: string }>("SELECT created_at FROM submissions WHERE user_id = $1 AND project_code = $2 ORDER BY created_at DESC", user.id, projectCode);
  if (subs.length >= MAX_SUBMISSIONS) return NextResponse.redirect(new URL("/projects?error=max-submissions", req.url));
  if (subs.length && Date.now() < new Date(subs[0].created_at + "Z").getTime() + COOLDOWN_MS) return NextResponse.redirect(new URL("/projects?error=cooldown", req.url));
  await run("INSERT INTO submissions (id, user_id, project_code, title, note, status) VALUES ($1, $2, $3, $4, $5, 'submitted')", "s-" + randomBytes(8).toString("hex"), user.id, projectCode, title, note || null);
  return NextResponse.redirect(new URL("/projects?submitted=1", req.url));
}
