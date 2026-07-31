/**
 * Seed — derives curriculum rows from the Single Source of Truth:
 *  - stages/modules/lessons parsed from docs/03_CURRICULUM_BLUEPRINT.md
 *  - lesson content_path from the content/ tree (28 P1-A lessons exist)
 *  - Arabic titles: lessons come from DOC-03 (canonical); stage/module Arabic
 *    titles are working UI translations (to be validated by Curriculum Director)
 *  - demo users (student/admin) for local testing
 * Idempotent (INSERT ... ON CONFLICT DO UPDATE).
 */
import fs from "node:fs";
import path from "node:path";
import { getDb, run, get, transaction } from "./db";
import { hashPassword } from "./auth";
import { REPO_ROOT, buildLessonPathMap } from "./content";

// Working Arabic titles for the 8 stages (DOC-03 §3; UI-facing, validate at MS-03).
const STAGE_AR: Record<string, string> = {
  "STG-01": "أساسيات الحوسبة الإبداعية",
  "STG-02": "إتقان فوتوشوب",
  "STG-03": "إليستريتور",
  "STG-04": "أفتر إفكتس وتصميم الحركة",
  "STG-05": "بريمير برو ومونتاج الفيديو",
  "STG-06": "لايت روم والتصوير",
  "STG-07": "إن ديزاين والتصميم التحريري",
  "STG-08": "الاستوديو المتكامل والمشروع الختامي",
};

// Working Arabic titles for the 33 modules (DOC-03 §4-§11; UI-facing).
const MODULE_AR: Record<string, string> = {
  "MOD-0101": "الترحيب والتوجيه على المنصة",
  "MOD-0102": "أسس التصميم",
  "MOD-0103": "الألوان الرقمية ومعايير الملفات",
  "MOD-0104": "التقييم التوجيهي واختيار المسار",
  "MOD-0201": "أساسيات فوتوشوب",
  "MOD-0202": "التنقيح وتحرير الصور",
  "MOD-0203": "التركيب والمؤثرات",
  "MOD-0204": "التصميم والإنتاج",
  "MOD-0205": "الممارسة الاحترافية في فوتوشوب",
  "MOD-0301": "أساسيات إليستريتور",
  "MOD-0302": "الرسم والطباعة",
  "MOD-0303": "تصميم الشعارات والهوية",
  "MOD-0304": "الإنتاج المتجهي المتقدم",
  "MOD-0401": "أساسيات الحركة",
  "MOD-0402": "التحريك والمؤثرات",
  "MOD-0403": "تصميم الموشن جرافيك",
  "MOD-0404": "المؤثرات البصرية والتركيب",
  "MOD-0501": "أساسيات الفيديو",
  "MOD-0502": "المونتاج",
  "MOD-0503": "الألوان والصوت",
  "MOD-0504": "التسليم والنشر",
  "MOD-0601": "أساسيات التصوير",
  "MOD-0602": "لايت روم: المكتبة والتطوير",
  "MOD-0603": "سير العمل المتقدم للصور",
  "MOD-0604": "المعرض والتصدير",
  "MOD-0701": "أساسيات إن ديزاين",
  "MOD-0702": "التخطيط التحريري",
  "MOD-0703": "الإنتاج والطباعة",
  "MOD-0704": "محفظة النشر",
  "MOD-0801": "سير العمل بين التطبيقات",
  "MOD-0802": "الممارسة المهنية",
  "MOD-0803": "المشروع الختامي",
  "MOD-0804": "التخرج والاعتماد",
};

type ModRow = {
  mod: string;
  titleEn: string;
  difficulty: string;
  lessons: { code: string; titleAr: string; titleEn: string }[];
};

function parseBlueprint(): { stages: any[]; modules: ModRow[] } {
  const blueprintPath = path.join(REPO_ROOT, "docs", "03_CURRICULUM_BLUEPRINT.md");
  const md = fs.readFileSync(blueprintPath, "utf-8");
  const lines = md.split("\n");
  const stages: any[] = [];
  const modules: ModRow[] = [];

  for (const line of lines) {
    const m = line.match(/^\|\s*(STG-\d{2})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([\d.]+)\s*h\s*\|/);
    if (m) {
      stages.push({ id: m[1], titleEn: m[2].trim(), difficulty: m[3].trim(), effortHours: Number(m[4]) });
    }
  }
  for (const line of lines) {
    const m = line.match(/^\|\s*(MOD-\d{4})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([\d.]+)\s*h\s*\|([^|]*)\|/);
    if (!m) continue;
    const lessons: ModRow["lessons"] = [];
    for (const seg of m[5].split("·")) {
      const sm = seg.match(/^\s*(LES-\d{6})\s+([^(]+?)\s*(?:\(([^)]*)\))?\s*$/);
      if (sm) {
        lessons.push({ code: sm[1], titleAr: sm[2].trim(), titleEn: (sm[3] ?? "").trim() });
      }
    }
    modules.push({ mod: m[1], titleEn: m[2].trim(), difficulty: m[3].trim(), lessons });
  }
  return { stages, modules };
}

export function seed(): { stages: number; modules: number; lessons: number } {
  const db = getDb();
  const { stages, modules } = parseBlueprint();
  const lessonPaths = buildLessonPathMap();

  transaction(() => {
    for (const [i, s] of stages.entries()) {
      run(
        `INSERT INTO stages (id, title_ar, title_en, difficulty, effort_hours, position)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar, difficulty=excluded.difficulty, effort_hours=excluded.effort_hours`,
        s.id,
        STAGE_AR[s.id] ?? s.titleEn,
        s.titleEn,
        s.difficulty,
        s.effortHours,
        i + 1
      );
    }
    for (const mod of modules) {
      const stageId = mod.mod.slice(0, 6).replace("MOD", "STG"); // MOD-0101 -> STG-01
      run(
        `INSERT INTO modules (id, stage_id, title_ar, title_en, difficulty, position)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar, title_en=excluded.title_en, difficulty=excluded.difficulty`,
        mod.mod,
        stageId,
        MODULE_AR[mod.mod] ?? mod.titleEn,
        mod.titleEn,
        mod.difficulty,
        Number(mod.mod.slice(5))
      );
      for (const [j, l] of mod.lessons.entries()) {
        const contentPath = lessonPaths.get(l.code) ?? null;
        const status = contentPath ? "in_review" : "not_started";
        run(
          `INSERT INTO lessons (id, module_id, title_ar, title_en, position, content_path, duration_min, status)
           VALUES (?, ?, ?, ?, ?, ?, NULL, ?)
           ON CONFLICT(id) DO UPDATE SET content_path=excluded.content_path, status=excluded.status, title_ar=excluded.title_ar`,
          l.code,
          mod.mod,
          l.titleAr,
          l.titleEn || l.titleAr,
          j + 1,
          contentPath,
          status
        );
      }
    }
  }); // end transaction

  // demo users (local testing only)
  if (!get("SELECT id FROM users WHERE email = ?", "admin@academy.ar")) {
    run(
      "INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      "u-admin",
      "admin@academy.ar",
      "مدير الأكاديمية",
      hashPassword("admin123"),
      "admin"
    );
  }
  if (!get("SELECT id FROM users WHERE email = ?", "student@academy.ar")) {
    run(
      "INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      "u-student",
      "student@academy.ar",
      "طالب تجريبي",
      hashPassword("student123"),
      "student"
    );
  }

  const count = (t: string) => (get(`SELECT COUNT(*) AS c FROM ${t}`) as any).c as number;
  return { stages: count("stages"), modules: count("modules"), lessons: count("lessons") };
}
