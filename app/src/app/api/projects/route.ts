import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { run } from "@/lib/db";

export const runtime = "nodejs";

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
