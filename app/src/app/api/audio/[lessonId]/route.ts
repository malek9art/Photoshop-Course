import { NextRequest } from "next/server";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { resolveLessonAudio } from "@/lib/audio-assets";

/**
 * Streams lesson audio files from `content/audio/` with HTTP Range support
 * (seek/scrub in the player). Local-first: no external service involved.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CHUNK = 1024 * 1024; // 1 MB stream chunks

export async function GET(req: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await ctx.params;
  const asset = resolveLessonAudio(lessonId);
  if (!asset) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  let total: number;
  try {
    total = (await stat(asset.absPath)).size;
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  const range = req.headers.get("range");
  let start = 0;
  let end = total - 1;
  let partial = false;

  const match = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
  if (match) {
    partial = true;
    const from = match[1] === "" ? undefined : Number(match[1]);
    const to = match[2] === "" ? undefined : Number(match[2]);

    if (from !== undefined && from >= total) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${total}` },
      });
    }
    if (from !== undefined) start = from;
    if (to !== undefined) end = Math.min(to, total - 1);
    if (start > end) start = end;
  }

  const nodeStream = createReadStream(asset.absPath, { start, end, highWaterMark: CHUNK });
  const body = Readable.toWeb(nodeStream) as unknown as ReadableStream;

  const headers: Record<string, string> = {
    "Content-Type": asset.mimeType,
    "Accept-Ranges": "bytes",
    "Content-Length": String(end - start + 1),
    "Cache-Control": "public, max-age=3600, immutable",
    "X-Content-Type-Options": "nosniff",
  };
  if (partial) headers["Content-Range"] = `bytes ${start}-${end}/${total}`;

  return new Response(body, { status: partial ? 206 : 200, headers });
}
