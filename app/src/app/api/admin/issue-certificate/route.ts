import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb, get, run } from "@/lib/db";
import { nextSerial, certTitle } from "@/lib/certs";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const form = await req.formData();
  const userId = String(form.get("user_id") ?? "");
  const certCode = String(form.get("cert_code") ?? "");
  if (!userId || !certCode) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }
  const user = get<{ name: string }>("SELECT name FROM users WHERE id = ?", userId);
  if (!user) return NextResponse.json({ error: "no-user" }, { status: 404 });
  if (get("SELECT id FROM certificates WHERE user_id = ? AND cert_code = ?", userId, certCode)) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }

  getDb();
  run(
    "INSERT INTO certificates (id, user_id, cert_code, title_ar, serial, status, issued_by) VALUES (?, ?, ?, ?, ?, 'active', ?)",
    "c-" + randomBytes(8).toString("hex"),
    userId,
    certCode,
    certTitle(certCode),
    nextSerial(),
    admin.id
  );

  const back = new URL("/admin/certificates", req.url);
  return NextResponse.redirect(back);
}
