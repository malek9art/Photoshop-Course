/**
 * Data layer — SQLite via Node built-in `node:sqlite` (ADR-010).
 * Local-first, zero native deps. Logical model per DOC-05 (subset for batches B-01..B-03).
 * Migration path to Postgres at OPD-003.
 */
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.ACA_DB_PATH || path.join(DATA_DIR, "academy.db");

let db: DatabaseSync | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student',
  locale        TEXT NOT NULL DEFAULT 'ar',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

CREATE TABLE IF NOT EXISTS stages (
  id           TEXT PRIMARY KEY,          -- STG-01
  title_ar     TEXT NOT NULL,
  title_en     TEXT NOT NULL,
  difficulty   TEXT NOT NULL DEFAULT 'B1',
  effort_hours INTEGER,
  position     INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS modules (
  id         TEXT PRIMARY KEY,            -- MOD-0101
  stage_id   TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  title_ar   TEXT NOT NULL,
  title_en   TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'B1',
  position   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_modules_stage ON modules(stage_id);

CREATE TABLE IF NOT EXISTS lessons (
  id            TEXT PRIMARY KEY,         -- LES-010101
  module_id     TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title_ar      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  position      INTEGER NOT NULL,
  content_path  TEXT,                     -- relative to repo root (content/...)
  duration_min  INTEGER,
  status        TEXT NOT NULL DEFAULT 'not_started'  -- not_started|in_review|published|retired
);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

CREATE TABLE IF NOT EXISTS enrollments (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_id   TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, stage_id)
);
CREATE INDEX IF NOT EXISTS idx_enroll_user ON enrollments(user_id);

CREATE TABLE IF NOT EXISTS progress (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,              -- stage | module | lesson
  target_id  TEXT NOT NULL,
  state      TEXT NOT NULL DEFAULT 'not_started',  -- not_started|in_progress|completed
  percent    INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, target_type, target_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);

CREATE TABLE IF NOT EXISTS certificates (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cert_code  TEXT NOT NULL,               -- CERT-01..08 (DOC-03 §16)
  title_ar   TEXT NOT NULL,
  serial     TEXT NOT NULL UNIQUE,        -- ACA-YYYY-NNNNN (DOC-08 §7.2)
  status     TEXT NOT NULL DEFAULT 'active',   -- active | revoked
  issued_by  TEXT NOT NULL DEFAULT 'auto',
  issued_at  TEXT NOT NULL DEFAULT (datetime('now')),
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_certs_user ON certificates(user_id);

CREATE TABLE IF NOT EXISTS submissions (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_code TEXT NOT NULL,             -- STG-01-PROJECT (DOC-03 §16/AT-05)
  title        TEXT NOT NULL,
  note         TEXT,
  status       TEXT NOT NULL DEFAULT 'submitted',  -- submitted | in_review | passed | returned
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);

CREATE TABLE IF NOT EXISTS exam_attempts (     -- ENT-ATTEMPT (DOC-05) for AT-06
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_code    TEXT NOT NULL,                  -- STG-01-EXAM
  score_pct    INTEGER NOT NULL,
  passed       INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id);

CREATE TABLE IF NOT EXISTS quiz_attempts (     -- ENT-ATTEMPT (DOC-05) for AT-04 module quizzes
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_code    TEXT NOT NULL,                      -- QUIZ-MOD-0101
  score_pct    INTEGER NOT NULL,
  passed       INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS grades (            -- ENT-GRADE (DOC-05) for AT-05 rubric grading
  id             TEXT PRIMARY KEY,
  submission_id  TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  rubric_version TEXT NOT NULL DEFAULT '1.0.0',
  per_criterion  TEXT NOT NULL,                -- JSON: [{criterion, score}]
  score_avg      REAL NOT NULL,
  passed         INTEGER NOT NULL,
  feedback       TEXT,
  graded_by      TEXT NOT NULL,
  graded_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_grades_submission ON grades(submission_id);
`;

// Lightweight additive migration (idempotent) for columns added after first creation.
const ADD_COLUMNS: Array<[string, string, string]> = [
  ["certificates", "revoked_reason", "TEXT"], // DOC-08 §7.3: revocation with reason (audited)
];

export function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  for (const [table, col, type] of ADD_COLUMNS) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
    if (!cols.some((c) => c.name === col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
    }
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/** Repository-style helpers (typed). */
export type Row = Record<string, unknown>;

export function all<T = Row>(sql: string, ...params: SQLInputValue[]): T[] {
  const stmt = getDb().prepare(sql);
  return stmt.all(...params) as T[];
}

export function get<T = Row>(sql: string, ...params: SQLInputValue[]): T | undefined {
  const stmt = getDb().prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function run(sql: string, ...params: SQLInputValue[]): { lastInsertRowid: number | bigint; changes: number | bigint } {
  const stmt = getDb().prepare(sql);
  return stmt.run(...params);
}

/** Simple transaction helper (node:sqlite has no .transaction like better-sqlite3). */
export function transaction<T>(fn: () => T): T {
  const d = getDb();
  d.exec("BEGIN");
  try {
    const result = fn();
    d.exec("COMMIT");
    return result;
  } catch (err) {
    d.exec("ROLLBACK");
    throw err;
  }
}

export const dbPath = DB_PATH;
