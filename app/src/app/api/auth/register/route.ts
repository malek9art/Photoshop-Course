import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { get, run } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

function clean(value: string | null | undefined): string {
  return (value ?? "").trim().slice(0, 120);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = clean(form.get("email") as string).toLowerCase();
  const password = clean(form.get("password") as string);
  const name = clean(form.get("name") as string);
  const next = (form.get("next") as string) || "/profile";

  if (!email || !password || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.redirect(new URL("/register?error=invalid", req.url));
  }
  if (password.length < 8) {
    return NextResponse.redirect(new URL("/register?error=short", req.url));
  }
  if (get("SELECT id FROM users WHERE email = ?", email)) {
    return NextResponse.redirect(new URL("/register?error=taken", req.url));
  }

  const userId = "u-" + randomBytes(8).toString("hex");
  run(
    "INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, 'student')",
    userId,
    email,
    name || email.split("@")[0],
    hashPassword(password)
  );

  const token = createSession(userId);
  await setSessionCookie(token);
  return NextResponse.redirect(new URL(next, req.url));
}
