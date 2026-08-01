-- Adobe Creative Academy: PostgreSQL initial schema
-- The table/column names, foreign keys, unique constraints, and indexes preserve
-- the application's existing data model. All timestamps remain TEXT to preserve
-- the current serialization contract.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student',
  locale        TEXT NOT NULL DEFAULT 'ar',
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
  updated_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

CREATE TABLE IF NOT EXISTS stages (
  id           TEXT PRIMARY KEY,
  title_ar     TEXT NOT NULL,
  title_en     TEXT NOT NULL,
  difficulty   TEXT NOT NULL DEFAULT 'B1',
  effort_hours INTEGER,
  position     INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS modules (
  id         TEXT PRIMARY KEY,
  stage_id   TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  title_ar   TEXT NOT NULL,
  title_en   TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'B1',
  position   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_modules_stage ON modules(stage_id);

CREATE TABLE IF NOT EXISTS lessons (
  id            TEXT PRIMARY KEY,
  module_id     TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title_ar      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  position      INTEGER NOT NULL,
  content_path  TEXT,
  duration_min  INTEGER,
  status        TEXT NOT NULL DEFAULT 'not_started'
);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

CREATE TABLE IF NOT EXISTS enrollments (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stage_id   TEXT NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
  UNIQUE(user_id, stage_id)
);
CREATE INDEX IF NOT EXISTS idx_enroll_user ON enrollments(user_id);

CREATE TABLE IF NOT EXISTS progress (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  state       TEXT NOT NULL DEFAULT 'not_started',
  percent     INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
  UNIQUE(user_id, target_type, target_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);

CREATE TABLE IF NOT EXISTS certificates (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cert_code      TEXT NOT NULL,
  title_ar       TEXT NOT NULL,
  serial         TEXT NOT NULL UNIQUE,
  status         TEXT NOT NULL DEFAULT 'active',
  issued_by      TEXT NOT NULL DEFAULT 'auto',
  issued_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
  revoked_at     TEXT,
  revoked_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_certs_user ON certificates(user_id);

CREATE TABLE IF NOT EXISTS submissions (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_code TEXT NOT NULL,
  title        TEXT NOT NULL,
  note         TEXT,
  status       TEXT NOT NULL DEFAULT 'submitted',
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_code    TEXT NOT NULL,
  score_pct    INTEGER NOT NULL,
  passed       INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_code    TEXT NOT NULL,
  score_pct    INTEGER NOT NULL,
  passed       INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS grades (
  id             TEXT PRIMARY KEY,
  submission_id  TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  rubric_version TEXT NOT NULL DEFAULT '1.0.0',
  per_criterion  TEXT NOT NULL,
  score_avg      REAL NOT NULL,
  passed         INTEGER NOT NULL,
  feedback       TEXT,
  graded_by      TEXT NOT NULL,
  graded_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
);
CREATE INDEX IF NOT EXISTS idx_grades_submission ON grades(submission_id);
