/**
 * CI-only PostgreSQL runtime verification. It validates the existing schema and
 * deterministic curriculum seed without changing application data.
 */
import { all, closeDb, get } from "../src/lib/db";

const TABLES = [
  "users", "sessions", "stages", "modules", "lessons", "enrollments",
  "progress", "certificates", "submissions", "exam_attempts", "quiz_attempts", "grades",
] as const;

const INDEXES = [
  "idx_sessions_user", "idx_sessions_token", "idx_modules_stage", "idx_lessons_module",
  "idx_enroll_user", "idx_progress_user", "idx_certs_user", "idx_submissions_user",
  "idx_exam_attempts_user", "idx_quiz_attempts_user", "idx_grades_submission",
] as const;

async function main() {
  const tables = await all<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = ANY($1::text[])",
    TABLES
  );
  const actualTables = new Set(tables.map((row) => row.table_name));
  const missingTables = TABLES.filter((table) => !actualTables.has(table));
  if (missingTables.length) throw new Error(`Missing tables: ${missingTables.join(", ")}`);

  const indexes = await all<{ indexname: string }>(
    "SELECT indexname FROM pg_indexes WHERE schemaname = current_schema() AND indexname = ANY($1::text[])",
    INDEXES
  );
  const actualIndexes = new Set(indexes.map((row) => row.indexname));
  const missingIndexes = INDEXES.filter((index) => !actualIndexes.has(index));
  if (missingIndexes.length) throw new Error(`Missing indexes: ${missingIndexes.join(", ")}`);

  const foreignKeys = await get<{ c: number }>(
    "SELECT COUNT(*)::int AS c FROM information_schema.table_constraints WHERE table_schema = current_schema() AND constraint_type = 'FOREIGN KEY'"
  );
  if ((foreignKeys?.c ?? 0) !== 11) throw new Error(`Expected 11 foreign keys, found ${foreignKeys?.c ?? 0}`);

  const [stages, modules, lessons, demoUsers] = await Promise.all([
    get<{ c: number }>("SELECT COUNT(*)::int AS c FROM stages"),
    get<{ c: number }>("SELECT COUNT(*)::int AS c FROM modules"),
    get<{ c: number }>("SELECT COUNT(*)::int AS c FROM lessons"),
    get<{ c: number }>("SELECT COUNT(*)::int AS c FROM users WHERE email IN ($1, $2)", "admin@academy.ar", "student@academy.ar"),
  ]);
  const expected = { stages: 8, modules: 33, lessons: 156, demoUsers: 2 };
  const actual = { stages: stages?.c ?? 0, modules: modules?.c ?? 0, lessons: lessons?.c ?? 0, demoUsers: demoUsers?.c ?? 0 };
  for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
    if (actual[key] !== expected[key]) throw new Error(`Expected ${key}=${expected[key]}, found ${actual[key]}`);
  }
  console.log(`Verified PostgreSQL schema: ${TABLES.length} tables, ${INDEXES.length} indexes, 11 foreign keys; seed: 8 stages, 33 modules, 156 lessons, 2 demo users.`);
}

main()
  .catch((error: unknown) => { console.error("PostgreSQL verification failed:", error); process.exitCode = 1; })
  .finally(async () => { await closeDb(); });
