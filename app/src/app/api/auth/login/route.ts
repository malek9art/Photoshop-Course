import { NextRequest, NextResponse } from "next/server";
import { get } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie, safeNextPath, type User } from "@/lib/auth";

export const runtime = "nodejs";

function clean(value: string | null | undefined): string {
  return (value ?? "").trim().slice(0, 120);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = clean(form.get("email") as string).toLowerCase();
  const password = clean(form.get("password") as string);
  const next = safeNextPath(form.get("next") as string);

  const user = await get<User>(
    "SELECT id, email, name, role, locale, created_at FROM users WHERE email = $1",
    email
  );
  if (!user || !verifyPassword(password, (await get("SELECT password_hash AS h FROM users WHERE id = $1", user.id) as any)?.h ?? "")) {
    return NextResponse.redirect(new URL("/login?error=bad", req.url));
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);
  return NextResponse.redirect(new URL(next, req.url));
}
