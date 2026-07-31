import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/", _req.url));
}
