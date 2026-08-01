import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { nextSerial, certTitle } from "@/lib/certs";
import { randomBytes } from "node:crypto";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const form = await req.formData();
  const userId = String(form.get("user_id") ?? "");
  const certCode = String(form.get("cert_code") ?? "");
  if (!userId || !certCode) return NextResponse.json({ error: "missing" }, { status: 400 });
  if (!await get<{ name: string }>("SELECT name FROM users WHERE id = $1", userId)) return NextResponse.json({ error: "no-user" }, { status: 404 });
  if (await get("SELECT id FROM certificates WHERE user_id = $1 AND cert_code = $2", userId, certCode)) return NextResponse.json({ error: "exists" }, { status: 409 });
  await run("INSERT INTO certificates (id, user_id, cert_code, title_ar, serial, status, issued_by) VALUES ($1, $2, $3, $4, $5, 'active', $6)", "c-" + randomBytes(8).toString("hex"), userId, certCode, certTitle(certCode), await nextSerial(), admin.id);
  return NextResponse.redirect(new URL("/admin/certificates", req.url));
}
