/**
 * Content loader — reads lesson packages from the repo's `content/` directory
 * (ADR-006 content-as-data; DOC-07 §8 packages). Content is the SSOT; the DB
 * only indexes it (derived data).
 */
import fs from "node:fs";
import path from "node:path";

export const REPO_ROOT = path.resolve(process.cwd(), "..");
export const CONTENT_DIR = path.join(REPO_ROOT, "content");

export type LessonDoc = {
  id: string;
  titleAr: string;
  titleEn: string;
  markdown: string; // body after frontmatter (from first '## ' heading)
  frontmatter: Record<string, string>;
};

function parseFrontmatterTable(md: string): Record<string, string> {
  const out: Record<string, string> = {};
  // Our lesson files carry frontmatter as a markdown table under "## Frontmatter".
  const m = md.match(/## Frontmatter([\s\S]*?)\n---/);
  if (!m) return out;
  const rows = m[1].split("\n");
  for (const row of rows) {
    const cells = row.split("|").map((c) => c.trim());
    if (cells.length >= 3 && cells[1] && cells[2]) {
      out[cells[1]] = cells[2];
    }
  }
  return out;
}

/** Extract the body (from the first numbered section onward), dropping title + frontmatter. */
export function lessonBody(md: string): string {
  const idx = md.indexOf("## 1.");
  if (idx === -1) return md;
  return md.slice(idx).trim();
}

export function loadLessonFile(relPath: string): LessonDoc | null {
  const abs = path.isAbsolute(relPath) ? relPath : path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  const md = fs.readFileSync(abs, "utf-8");
  const fm = parseFrontmatterTable(md);
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const titleAr = titleMatch ? titleMatch[1].trim() : fm.id ?? "درس";
  const id = fm.id ?? path.basename(relPath, ".md");
  return {
    id,
    titleAr,
    titleEn: fm.code ?? id,
    markdown: lessonBody(md),
    frontmatter: fm,
  };
}

/** Map lesson id -> repo-relative content path (from the content/ tree). */
export function buildLessonPathMap(): Map<string, string> {
  const map = new Map<string, string>();
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.startsWith("LES-") && entry.name.endsWith(".md")) {
        const id = entry.name.replace(/\.md$/, "");
        const rel = path.relative(REPO_ROOT, full).split(path.sep).join("/");
        map.set(id, rel);
      }
    }
  };
  if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR);
  return map;
}
