/**
 * Quiz content loader — parses the module quiz packages in `content/`
 * (QUIZ-MOD-*.md, format defined at production time; DOC-07 §5 / DOC-08).
 * The parser reads the documented item format:
 *   ### س-NN: <question>
 *   - (أ) opt · (ب) opt · (ج) opt · (د) opt
 *   - **الإجابة:** (ب) — explanation
 *   - **الصعوبة:** B1
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

export function buildQuizPathMap(): Map<string, string> {
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
  return map;
}

export function loadQuiz(code: string): QuizDoc | null {
  const map = buildQuizPathMap();
  const file = map.get(code);
  if (!file) return null;
  const md = fs.readFileSync(file, "utf-8");
  return parseQuiz(md, code);
}

export function parseQuiz(md: string, code: string): QuizDoc {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const passMatch = md.match(/النجاح:\s*≥\s*(\d+)%/);
  const passPct = passMatch ? Number(passMatch[1]) : 70;

  const items: QuizItem[] = [];
  const blocks = md.split(/^###\s+س-/m).slice(1);
  for (const block of blocks) {
    const firstLine = block.split("\n")[0].trim();
    const idMatch = firstLine.match(/^(\d+)[:：]\s*(.+)$/);
    if (!idMatch) continue;
    const question = idMatch[2].trim();

    const optLine = block.split("\n").find((l) => l.startsWith("- (") && l.includes("·"));
    const answerLine = block.split("\n").find((l) => l.includes("**الإجابة:**") || l.includes("**الإجابة :**"));
    const diffLine = block.split("\n").find((l) => l.includes("**الصعوبة:**"));

    let options: string[] = [];
    if (optLine) {
      options = optLine
        .slice(optLine.indexOf(")") + 1)
        .split("·")
        .map((o) => o.trim())
        .filter(Boolean);
    }

    let answerIndex = -1;
    let explanation = "";
    if (answerLine) {
      const am = answerLine.match(/\(([أ-ي])\)/);
      if (am) answerIndex = AR_LETTERS.indexOf(am[1]);
      const em = answerLine.match(/\)\s*—\s*(.+)$/) ?? answerLine.match(/\)\s*[-–]\s*(.+)$/);
      if (em) explanation = em[1].trim();
    }

    const difficulty = diffLine?.match(/\*\*الصعوبة:\*\*\s*(\S+)/)?.[1] ?? "B1";

    items.push({
      id: Number(idMatch[1]),
      question,
      options,
      answerIndex,
      explanation,
      difficulty,
    });
  }

  return { code, title: titleMatch?.[1].trim() ?? code, config: { passPct, attempts: 3 }, items };
}
