/**
 * Certificate revocation (SCR-25 / DOC-08 §7.3): admin-only, requires a reason,
 * sets status=revoked with timestamp + reason (audited trail).
 */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { get, run } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const form = await req.formData();
  const certId = String(form.get("cert_id") ?? "");
  const reason = String(form.get("reason") ?? "").trim().slice(0, 500);
  if (!certId || !reason) return NextResponse.json({ error: "missing" }, { status: 400 });

  const cert = get<{ id: string; status: string }>("SELECT id, status FROM certificates WHERE id = ?", certId);
  if (!cert) return NextResponse.json({ error: "no-cert" }, { status: 404 });
  if (cert.status !== "active") return NextResponse.json({ error: "not-active" }, { status: 409 });

  run(
    "UPDATE certificates SET status = 'revoked', revoked_at = datetime('now'), revoked_reason = ? WHERE id = ?",
    reason,
    certId
  );

  const back = new URL("/admin/certificates?revoked=1", req.url);
  return NextResponse.redirect(back);
}
