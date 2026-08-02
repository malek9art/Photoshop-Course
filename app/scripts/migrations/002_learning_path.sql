-- Phase 11 — Learning Path & Progress Lock System
-- Additive, idempotent migration: adds per-lesson activity tracking on
-- `progress` (required for verified completion) and the `achievements` table.
-- No existing table/column is altered or dropped — existing data is preserved.

-- Lesson activity tracking (verified completion: opened + time + reached end)
ALTER TABLE progress ADD COLUMN IF NOT EXISTS opened_at      TEXT;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS reached_end    INTEGER NOT NULL DEFAULT 0;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS spent_seconds  INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_progress_opened ON progress(user_id, target_type, opened_at);

-- Achievements (Phase 11 Batch 7)
CREATE TABLE IF NOT EXISTS achievements (
  id        TEXT PRIMARY KEY,
  user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code      TEXT NOT NULL,
  title_ar  TEXT NOT NULL,
  icon      TEXT NOT NULL DEFAULT '🎖',
  earned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
  UNIQUE(user_id, code)
);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
