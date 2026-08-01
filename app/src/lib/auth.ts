/**
 * Auth — session-based authentication (ADR-010).
 * - Password hashing: node:crypto scrypt (no external deps).
 * - Sessions: random token stored hashed (sha256) in DB; HttpOnly cookie.
 * Mirrors DOC-05 ENT-USER / ENT-SESSION (subset).
 */
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { get, run } from "./db";

const SESSION_COOKIE = "aca_session";
const SESSION_DAYS = 30;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  locale: string;
  created_at: string;
};

// ---------- passwords ----------
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

// ---------- sessions ----------
function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function createSession(userId: string): string {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_MS).toISOString();
  run(
    "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
    randomBytes(16).toString("hex"),
    userId,
    sha256(token),
    expiresAt
  );
  return token;
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = get<{ user_id: string; expires_at: string }>(
    "SELECT user_id, expires_at FROM sessions WHERE token_hash = ?",
    sha256(token)
  );
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  const user = get<User>(
    "SELECT id, email, name, role, locale, created_at FROM users WHERE id = ?",
    row.user_id
  );
  return user ?? null;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    run("DELETE FROM sessions WHERE token_hash = ?", sha256(token));
  }
  store.delete(SESSION_COOKIE);
}

export function publicUser(u: User) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, locale: u.locale };
}

/**
 * Validate a post-auth redirect target: same-site relative paths only
 * (blocks open redirects like `next=https://evil.tld` or `//evil.tld`).
 */
export function safeNextPath(value: string | null | undefined, fallback = "/profile"): string {
  const v = (value ?? "").trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.includes("://") || v.includes("\\")) return fallback;
  return v.slice(0, 200);
}
