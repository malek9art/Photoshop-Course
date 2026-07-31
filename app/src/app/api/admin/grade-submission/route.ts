/**
 * Admin rubric grading (AT-05, DOC-08 §6/§8): records per-criterion scores,
 * computes verdict (avg >= 3.0, no criterion = 1), updates submission status,
 * and re-evaluates the stage certificate on pass (DOC-08 §7.1).
 */
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { loadProjectRubric, rubricVerdict, stageFromProjectCode } from "@/lib/rubric";
import { maybeIssueStageCert } from "@/lib/certs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const submissionId = String(form.get("submission_id") ?? "");
  const feedback = String(form.get("feedback") ?? "").trim().slice(0, 2000);
  if (!submissionId) return NextResponse.json({ error: "missing" }, { status: 400 });

  const submission = get<{ id: string; user_id: string; project_code: string }>(
    "SELECT id, user_id, project_code FROM submissions WHERE id = ?",
    submissionId
  );
  if (!submission) return NextResponse.json({ error: "no-submission" }, { status: 404 });

  const rubric = loadProjectRubric(submission.project_code);
  if (!rubric || rubric.criteria.length === 0) {
    return NextResponse.json({ error: "no-rubric" }, { status: 404 });
  }

  const scores = rubric.criteria.map((c, i) => {
    const v = Number(form.get(`criterion_${i}`) ?? 0);
    return v >= 1 && v <= 4 ? v : 0;
  });
  if (scores.some((s) => s === 0)) {
    return NextResponse.json({ error: "invalid-scores" }, { status: 400 });
  }

  const { passed, avg } = rubricVerdict(scores);

  run(
    "INSERT INTO grades (id, submission_id, rubric_version, per_criterion, score_avg, passed, feedback, graded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    "g-" + randomBytes(8).toString("hex"),
    submissionId,
    "1.0.0",
    JSON.stringify(rubric.criteria.map((c, i) => ({ criterion: c.name, score: scores[i] }))),
    avg,
    passed ? 1 : 0,
    feedback || null,
    admin.id
  );
  run(
    "UPDATE submissions SET status = ?, updated_at = datetime('now') WHERE id = ?",
    passed ? "passed" : "returned",
    submissionId
  );

  // DOC-08 §7.1: certificate requires lessons 100% + exam pass + project pass.
  const stageId = stageFromProjectCode(submission.project_code);
  if (passed && stageId) {
    maybeIssueStageCert(submission.user_id, stageId);
  }

  const back = new URL("/admin/projects?graded=1", req.url);
  return NextResponse.redirect(back);
}
