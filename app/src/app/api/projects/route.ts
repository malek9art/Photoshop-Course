import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { all, run } from "@/lib/db";
import { buildProjectPathMap, stageFromProjectCode } from "@/lib/rubric";

export const runtime = "nodejs";

// DOC-08 §5 (AT-05): 2 submissions, 3 days between submissions.
const MAX_SUBMISSIONS = 2;
const COOLDOWN_DAYS = 3;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const projectCode = String(form.get("project_code") ?? "");
  const title = String(form.get("title") ?? "").trim().slice(0, 120);
  const note = String(form.get("note") ?? "").trim().slice(0, 1000);

  if (!projectCode || !title) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }

  // Only real stage projects (present in content/) may receive submissions.
  if (!stageFromProjectCode(projectCode) || !buildProjectPathMap().has(projectCode)) {
    return NextResponse.json({ error: "unknown-project" }, { status: 400 });
  }

  // DOC-08 §5: enforce 2 submissions max + 3-day cooldown per (user, project).
  const subs = all<{ created_at: string }>(
    "SELECT created_at FROM submissions WHERE user_id = ? AND project_code = ? ORDER BY created_at DESC",
    user.id,
    projectCode
  );
  if (subs.length >= MAX_SUBMISSIONS) {
    const back = new URL("/projects?error=max-submissions", req.url);
    return NextResponse.redirect(back);
  }
  if (subs.length > 0) {
    const last = new Date(subs[0].created_at + "Z").getTime();
    if (Date.now() < last + COOLDOWN_MS) {
      const back = new URL("/projects?error=cooldown", req.url);
      return NextResponse.redirect(back);
    }
  }

  run(
    "INSERT INTO submissions (id, user_id, project_code, title, note, status) VALUES (?, ?, ?, ?, ?, 'submitted')",
    "s-" + randomBytes(8).toString("hex"),
    user.id,
    projectCode,
    title,
    note || null
  );

  const back = new URL("/projects?submitted=1", req.url);
  return NextResponse.redirect(back);
}
