/**
 * Quiz content loader — parses the module quiz packages in `content/`
 * (QUIZ-MOD-*.md, format defined at production time; DOC-07 §5 / DOC-08).
 *
 * Two content formats exist in the repo (both are supported):
 *
 * Format A (STG-01 / STG-02 early modules):
 *   ### س-NN: <question>            (or "### س-NN (صح/خطأ): <statement>")
 *   - (أ) opt · (ب) opt · (ج) opt · (د) opt
 *   - **الإجابة:** (ب) — explanation     (or "صحيح"/"خطأ" for T/F items)
 *   - **الصعوبة:** B1
 *
 * Format B (MOD-0203 onward):
 *   ### السؤال N (LES-XXXXXX)
 *   <question>
 *   - (أ) opt
 *   - (ب) opt ✅
 *   ...
 *   *التفسير:* explanation
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR } from "./content";

export type QuizItem = {
  id: number;
  question: string;
  options: string[]; // ["opt a", "opt b", ...] (letters stripped)
  answerIndex: number;
  explanation: string;
  difficulty: string;
};

export type QuizDoc = {
  code: string;
  title: string;
  config: { passPct: number; attempts: number };
  items: QuizItem[];
};

const AR_LETTERS = ["أ", "ب", "ج", "د", "ه", "و"];

// Cache: content tree is static per process (SSOT files change on deploy, not runtime).
let quizPathMapCache: Map<string, string> | null = null;

export function buildQuizPathMap(): Map<string, string> {
  if (quizPathMapCache) return quizPathMapCache;
  const map = new Map<string, string>();
  if (!fs.existsSync(CONTENT_DIR)) return map;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.startsWith("QUIZ-") && entry.name.endsWith(".md")) {
        map.set(entry.name.replace(/\.md$/, ""), full);
      }
    }
  };
  walk(CONTENT_DIR);
  quizPathMapCache = map;
  return map;
}

export function loadQuiz(code: string): QuizDoc | null {
  const map = buildQuizPathMap();
  const file = map.get(code);
  if (!file) return null;
  const md = fs.readFileSync(file, "utf-8");
  return parseQuiz(md, code);
}

/** Strip a leading Arabic option marker like "(ب) " from an option segment. */
function stripLetterMarker(text: string): string {
  return text.replace(/^\s*\(([أ-ي])\)\s*/, "").replace(/\s*✅\s*$/, "").trim();
}

function parsePassPct(md: string): number {
  const ar = md.match(/النجاح:\s*≥\s*(\d+)%/);
  if (ar) return Number(ar[1]);
  const en = md.match(/Passing Threshold\D{0,12}(\d+)\s*%/);
  if (en) return Number(en[1]);
  return 70; // DOC-08 §4 default
}

/** Format A: "### س-NN: ..." blocks. */
function parseFormatA(md: string): QuizItem[] {
  const items: QuizItem[] = [];
  const blocks = md.split(/^###\s+س-/m).slice(1);
  for (const block of blocks) {
    const firstLine = block.split("\n")[0].trim();
    // "01: question" or "13 (صح/خطأ): statement"
    const idMatch = firstLine.match(/^(\d+)(?:\s*\((صح\/خطأ)\))?\s*[:：]\s*(.+)$/);
    if (!idMatch) continue;
    const question = idMatch[3].trim();
    const isTrueFalse = Boolean(idMatch[2]);

    const optLine = block.split("\n").find((l) => l.startsWith("- (") && l.includes("·"));
    const answerLine = block.split("\n").find((l) => l.includes("**الإجابة:**") || l.includes("**الإجابة :**"));
    const diffLine = block.split("\n").find((l) => l.includes("**الصعوبة:**"));

    let options: string[] = [];
    if (optLine) {
      options = optLine
        .slice(optLine.indexOf(")") + 1)
        .split("·")
        .map(stripLetterMarker)
        .filter(Boolean);
    }

    let answerIndex = -1;
    let explanation = "";
    if (answerLine) {
      if (isTrueFalse || !/\(([أ-ي])\)/.test(answerLine)) {
        // صح/خطأ item: answer is written as "صحيح" or "خطأ".
        const tf = answerLine.match(/\*\*الإجابة\s*:\*\*\s*(صحيح|خطأ)/);
        if (tf) {
          options = ["صحيح", "خطأ"];
          answerIndex = tf[1] === "صحيح" ? 0 : 1;
        }
      } else {
        const am = answerLine.match(/\(([أ-ي])\)/);
        if (am) answerIndex = AR_LETTERS.indexOf(am[1]);
      }
      const em = answerLine.match(/\)\s*—\s*(.+)$/) ?? answerLine.match(/(?:صحيح|خطأ)\s*—\s*(.+)$/) ?? answerLine.match(/\)\s*[-–]\s*(.+)$/);
      if (em) explanation = em[1].trim();
    }

    if (options.length === 0 || answerIndex === -1) continue;
    const difficulty = diffLine?.match(/\*\*الصعوبة:\*\*\s*(\S+)/)?.[1] ?? "B1";

    items.push({ id: Number(idMatch[1]), question, options, answerIndex, explanation, difficulty });
  }
  return items;
}

/** Format B: "### السؤال N (LES-…)" blocks, one option per line, ✅ marks the answer. */
function parseFormatB(md: string): QuizItem[] {
  const items: QuizItem[] = [];
  const chunks = md.split(/^###\s+السؤال\s+/m).slice(1);
  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const header = lines[0].trim();
    const idMatch = header.match(/^(\d+)/);
    if (!idMatch) continue;

    // Question = first non-empty line after the header that is not an option/explanation.
    const question = lines
      .slice(1)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("- (") && !/^[*]*التفسير/.test(l) && !l.startsWith("|") && !/^-{3,}$/.test(l));
    if (!question) continue;

    const optionLines = lines.filter((l) => l.trim().startsWith("- ("));
    if (optionLines.length < 2) continue;
    const options = optionLines.map(stripLetterMarker).filter(Boolean);
    const answerIndex = optionLines.findIndex((l) => l.includes("✅"));
    if (answerIndex === -1 || options.length < 2) continue;

    const explLine = lines.find((l) => /^[*]*التفسير[*]*\s*:/.test(l.trim()));
    const explanation = explLine ? explLine.trim().replace(/^[*]*التفسير[*]*\s*:\s*/, "").trim() : "";

    items.push({ id: Number(idMatch[1]), question, options, answerIndex, explanation, difficulty: "B1" });
  }
  return items;
}

export function parseQuiz(md: string, code: string): QuizDoc {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const passPct = parsePassPct(md);

  const items = /^###\s+س-/m.test(md) ? parseFormatA(md) : parseFormatB(md);

  // Guard: drop options that still carry a duplicated letter marker (legacy parse artifacts).
  for (const it of items) {
    it.options = it.options.map(stripLetterMarker);
  }

  return { code, title: titleMatch?.[1].trim() ?? code, config: { passPct, attempts: 3 }, items };
}
