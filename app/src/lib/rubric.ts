/**
 * Project rubric loader (AT-05, DOC-08 §6) — parses the rubric table from
 * `content/` STG-*-PROJECT.md files. Format: "سُلَّم التقييم (Rubric)" table
 * with 4 criteria (columns: المعيار | 4 | 3 | 2 | 1).
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR } from "./content";

export type RubricCriterion = { name: string; d4: string; d3: string; d2: string; d1: string };
export type RubricDoc = { code: string; title: string; criteria: RubricCriterion[] };

export function buildProjectPathMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(CONTENT_DIR)) return map;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/^STG-\d{2}-PROJECT\.md$/.test(entry.name)) {
        map.set(entry.name.replace(/\.md$/, ""), full);
      }
    }
  };
  walk(CONTENT_DIR);
  return map;
}

export function loadProjectRubric(code: string): RubricDoc | null {
  const file = buildProjectPathMap().get(code);
  if (!file) return null;
  const md = fs.readFileSync(file, "utf-8");
  return parseRubric(md, code);
}

export function parseRubric(md: string, code: string): RubricDoc {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? code;
  const criteria: RubricCriterion[] = [];
  let inTable = false;
  for (const line of md.split("\n")) {
    if (/^\|\s*المعيار\s*\|/.test(line)) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!line.trim().startsWith("|")) {
        inTable = false;
        continue;
      }
      const cells = line.split("|").map((c) => c.trim());
      // [ '', name, d4, d3, d2, d1, '' ] — skip the separator row (|----|)
      if (cells.length >= 6 && cells[1] && !/^[-:]+$/.test(cells[1])) {
        criteria.push({
          name: cells[1].replace(/\*\*/g, ""),
          d4: cells[2],
          d3: cells[3],
          d2: cells[4],
          d1: cells[5],
        });
      }
    }
  }
  return { code, title, criteria };
}

/** "STG-01-PROJECT" -> "STG-01" */
export function stageFromProjectCode(code: string): string | null {
  const m = code.match(/^(STG-\d{2})-PROJECT$/);
  return m ? m[1] : null;
}

/** DOC-08 §6.3: pass = avg >= 3.0 AND no criterion scored 1. */
export function rubricVerdict(scores: number[]): { passed: boolean; avg: number } {
  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const passed = avg >= 3.0 && !scores.includes(1);
  return { passed, avg: Math.round(avg * 100) / 100 };
}
