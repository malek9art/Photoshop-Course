/**
 * Stage exam loader (AT-06) — parses the `content/` STG-*-EXAM.md packages.
 * Format produced at P1-A (DOC-07 §5 / DOC-08 §4-§5):
 *   - header config: نسبة النجاح ≥ 75% · المحاولات: 2 بفاصل 7 أيام
 *   - numbered questions "N. text" + options line "   - (أ) opt ✅ (ب) opt ..."
 *   - the ✅ marker identifies the correct option; key table is a fallback.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR } from "./content";

const AR = ["أ", "ب", "ج", "د", "ه", "و"];

export type ExamItem = { id: number; question: string; options: string[]; answerIndex: number };
export type ExamConfig = { passPct: number; attempts: number; cooldownDays: number; durationMin: number };
export type ExamDoc = { code: string; title: string; config: ExamConfig; items: ExamItem[] };

export function buildExamPathMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(CONTENT_DIR)) return map;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/^STG-\d{2}-EXAM\.md$/.test(entry.name)) {
        map.set(entry.name.replace(/\.md$/, ""), full);
      }
    }
  };
  walk(CONTENT_DIR);
  return map;
}

export function loadExam(code: string): ExamDoc | null {
  const file = buildExamPathMap().get(code);
  if (!file) return null;
  return parseExam(fs.readFileSync(file, "utf-8"), code);
}

export function parseExam(md: string, code: string): ExamDoc {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? code;
  const passPct = Number(md.match(/نسبة النجاح:\s*≥\s*(\d+)%/)?.[1] ?? 75);
  const attempts = Number(md.match(/المحاولات:\s*(\d+)/)?.[1] ?? 2);
  const cooldownDays = Number(md.match(/بفاصل\s*(\d+)\s*أيام/)?.[1] ?? 7);
  const durationMatch = md.match(/المدة:\s*(\d+)\s*[-–]\s*(\d+)/);
  const durationMin = durationMatch ? Number(durationMatch[1]) : 60;

  // Fallback answer key: | # | إجابة | # | إجابة | # | إجابة |
  const key = new Map<number, number>();
  for (const m of md.matchAll(/^\|\s*(\d+)\s*\|\s*([أ-ي])\s*\|/gm)) {
    key.set(Number(m[1]), AR.indexOf(m[2]));
  }

  const items: ExamItem[] = [];
  const lines = md.split("\n");
  let current: { num: number; text: string; block: string[] } | null = null;
  const blocks: Array<{ num: number; text: string; block: string[] }> = [];
  for (const line of lines) {
    const start = line.match(/^(\d+)\.\s+(.+)$/);
    if (start) {
      if (current) blocks.push(current);
      current = { num: Number(start[1]), text: start[2].trim(), block: [] };
    } else if (current) {
      if (/^#{2,3}\s/.test(line) || /^\s*---+\s*$/.test(line) || /^\s*```/.test(line)) {
        blocks.push(current);
        current = null;
      } else {
        current.block.push(line);
      }
    }
  }
  if (current) blocks.push(current);

  for (const b of blocks) {
    // Options may be on the question line itself (inline) or on the following lines.
    const joined = `${b.text} ${b.block.join(" ")}`;
    // Strip inline options from the question text (up to the first "(أ)" marker).
    const question = b.text.split(/\s*\(أ\)/)[0].replace(/[:：]\s*$/, "").trim();
    const segments: string[] = [];
    const optRe = /\(([أ-ي])\)\s*([^()]*?)(?=\s*\([أ-ي]\)|$)/g;
    let m: RegExpExecArray | null;
    while ((m = optRe.exec(joined)) !== null) {
      segments.push(m[0]);
    }
    const options = segments.map((s) => s.replace(/^\([أ-ي]\)\s*/, "").replace(/✅\s*/g, "").replace(/[-\s]+$/, "").trim());
    let answerIndex = segments.findIndex((s) => s.includes("✅"));
    if (answerIndex === -1 && key.has(b.num)) answerIndex = key.get(b.num)!;

    if (options.length >= 2 && answerIndex >= 0) {
      items.push({ id: b.num, question, options, answerIndex });
    }
  }

  return { code, title, config: { passPct, attempts, cooldownDays, durationMin }, items };
}

export function gradeExam(items: ExamItem[], itemIds: number[], answers: number[]) {
  const byId = new Map(items.map((it) => [it.id, it]));
  const results = itemIds.map((id, i) => {
    const item = byId.get(id);
    if (!item) return null;
    const chosen = answers[i] ?? -1;
    return { id, correct: item.answerIndex === chosen, chosen, answerIndex: item.answerIndex };
  }).filter((r): r is NonNullable<typeof r> => r !== null);
  const score = results.length > 0 ? Math.round((results.filter((r) => r.correct).length / results.length) * 100) : 0;
  return { results, score };
}

/** Stage id from exam code: "STG-01-EXAM" -> "STG-01". */
export function stageFromExamCode(code: string): string | null {
  const m = code.match(/^(STG-\d{2})-EXAM$/);
  return m ? m[1] : null;
}
