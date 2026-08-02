# 13 — Project Changelog

> **Document ID:** DOC-13 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Project Changelog |
| **Purpose** | Records **every modification** to the project: date, agent, description, reason, affected documents, and version. The changelog is append-only and is the audit trail of the entire project. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.29 |
| **Status** | Active — append-only (see §2) |
| **Dependencies** | DOC-10 (R-05 requires entries), DOC-11 (tasks), DOC-14 (decisions) |
| **Last Updated** | 2026-08-02 |
| **Review Cadence** | Continuous; verified at milestone boundaries |

## Table of Contents

- [1. Purpose & Principles](#1-purpose--principles)
- [2. Append-Only Rules](#2-append-only-rules)
- [3. Entry Format](#3-entry-format)
- [4. Versioning Scheme](#4-versioning-scheme)
- [5. Changelog Entries](#5-changelog-entries)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose & Principles

1. **Every modification is recorded.** If a file changed, there is a changelog entry. Exceptions: pure scratch/transient files (deleted before session end), whitespace-only cleanups (still recommended to log).
2. **Entries explain why.** "What" is visible in the diff; the changelog records the *reason*, the *agent*, and the *impact*.
3. **Entries are chronological** — newest last.
4. **Entry IDs** are `CHG-NNN`, sequential, never reused.

## 2. Append-Only Rules

- **Never** edit, reorder, or delete an existing entry (including this document's own history).
- Corrections are added as **new entries** describing the correction.
- If an entry is wrong, add `CHG-NNN` noting the error and the correct facts.
- The changelog itself is versioned (§4) but its *content history* is preserved by git history and the append-only rule.

## 3. Entry Format

Each entry uses this exact structure:

```markdown
### CHG-NNN — YYYY-MM-DD
- **Agent:** <agent identity>
- **Task(s):** TASK-XXX (link to DOC-11)
- **Description:** What changed (files, content, behavior)
- **Reason:** Why it changed
- **Affected Documents:** DOC-XX, DOC-YY (and file paths)
- **Version:** version(s) before → after (per §4)
```

## 4. Versioning Scheme

- **Documents:** semantic versioning `MAJOR.MINOR.PATCH`:
  - `MAJOR` — structural change (new section, changed rule/threshold/architecture; requires owner approval).
  - `MINOR` — content addition/clarification without rule change.
  - `PATCH` — typo, formatting, link fixes.
- **Baseline:** all documents at `1.0.0` (2026-07-31).
- **Content packages** (DOC-07 §8) have their own semver within the content pipeline.
- Version bumps are recorded in the changed document's Revision History **and** in this changelog.

## 5. Changelog Entries

### CHG-001 — 2026-07-31
- **Agent:** Project Foundation Architect (session `arena/019fb8fa-photoshop-course`)
- **Task(s):** TASK-001…TASK-018
- **Description:** Created the complete documentation and governance baseline: DOC-01 Project Vision, DOC-02 System Architecture, DOC-03 Curriculum Blueprint (8 stages / 33 modules / 156 lesson titles), DOC-04 UI Blueprint (29 screens), DOC-05 Database Blueprint (logical, 40+ entities), DOC-06 Design System, DOC-07 Content Standards, DOC-08 Assessment Standard, DOC-09 Project Roadmap (14 milestones), DOC-10 Agent Rules, DOC-11 Task Management (51 tasks), DOC-12 Agent Handover + template + HDO-001, DOC-13 (this file), DOC-14 Decision Log (8 ADRs, 8 open decisions), DOC-15 Risk Register (29 risks), DOC-16 Quality Checklist (7 gates / 52 items); root entry points README.md and AGENTS.md.
- **Reason:** The project's foundation phase (MS-01) requires a permanent Single Source of Truth before any agent work (content or code) begins.
- **Affected Documents:** All (DOC-01…DOC-16), README.md, AGENTS.md, docs/templates/HANDOVER_TEMPLATE.md, docs/handovers/README.md
- **Version:** n/a → 1.0.0 (baseline)

### CHG-002 — 2026-07-31
- **Agent:** Project Foundation Architect (session `arena/019fb8fa-photoshop-course`)
- **Task(s):** TASK-019…TASK-032
- **Description:** Extended the foundation with 13 operating documents: DOC-17 MASTER_INDEX, DOC-18 SYSTEM_MANIFEST, DOC-19 PROJECT_STATE, DOC-20 AI_MEMORY, DOC-21 KNOWLEDGE_BASE, DOC-22 LESSONS_INDEX (all 156 lessons registered), DOC-23 DEPENDENCIES, DOC-24 NAMING_CONVENTION, DOC-25 VERSIONING_POLICY, DOC-26 AGENT_REGISTRY, DOC-27 PROMPTS, DOC-28 OPEN_DECISIONS, DOC-29 CHECKPOINTS. Updated integration layer: README.md (hub + operating-docs table + reading order), AGENTS.md (reading order), DOC-09 (MS-01 scope), DOC-11 (tasks TASK-019…032), DOC-12 (HDO-002), this changelog, and created handover HDO-002. Next-agent notes recorded in DOC-19 §8 and HDO-002 §4.
- **Reason:** The foundation required project-operating documents (navigation, state, memory, registries, naming, versioning, prompts, checkpoints) so the repository is a complete single source of truth before Phase 1 (content production) begins.
- **Affected Documents:** New: DOC-17…DOC-29. Updated: README.md, AGENTS.md, DOC-09 (v1.0.1), DOC-11 (v1.0.1), DOC-12 (v1.0.1), DOC-25 (v1.0.1), this document (v1.0.1), docs/handovers/README.md. New handovers: docs/handovers/HDO-001_TASK-001-018_2026-07-31.md (materialized from DOC-12 §7 example), docs/handovers/HDO-002_TASK-019-032_2026-07-31.md.
- **Version:** DOC-17…29 n/a → 1.0.0 (baseline); DOC-09/11/12/13/25 1.0.0 → 1.0.1; README 1.0.0 → 1.1.0.

### CHG-003 — 2026-07-31
- **Agent:** Project Foundation Architect (session `arena/019fb8fa-photoshop-course`)
- **Task(s):** TASK-033…TASK-041
- **Description:** Closed the foundation phase with the final governance layer: DOC-30 POLICY_LOCK (lock layers L1…L6, LCK-01…17), DOC-31 PHASE_GATE (GATE-F1), DOC-32 PHASE_1_SCOPE (P1-A: STG-01 + MOD-0201/0202, 28 lessons), DOC-33 BASELINE_FINAL_SUMMARY, DOC-34 AGENT_STARTUP_CHECKLIST, DOC-35 REVIEW_PROTOCOL, DOC-36 CHANGE_CONTROL (CCR-001), DOC-37 RELEASE_CRITERIA (GATE-F1 sign-off PASS), DOC-38 PHASE_1_README. Recorded ADR-009 (role-based review model) resolving OPD-006; CHKPT-003 (CHK-PHASE). Updated integration layer: README (v1.2.0), AGENTS.md (closure-first reading order), MASTER_INDEX (v1.1.0, DOC-30…38 + Tier 0.5), PROJECT_STATE (v1.1.0, Phase 1 eligible, OPD-006 resolved), DOC-09 (v1.0.2), DOC-11 (v1.0.2, TASK-033…041, board = 74), DOC-12 (v1.0.2), DOC-14 (v1.0.1, ADR-009), DOC-18 (v1.0.1), DOC-21 (v1.0.1, KBE-008), DOC-23 (v1.0.1, DEP-013 resolved), DOC-24 (v1.0.1, DOC-38 + CCR family), DOC-27 (v1.0.1, PRMPT-003), DOC-28 (v1.0.1, OPD-006 resolved), DOC-29 (v1.0.1, CHKPT-003), this changelog (v1.0.2), docs/handovers/README.md, and new handover HDO-003.
- **Reason:** Close the foundation phase properly and create the final governance layer so Phase 1 (content production) can begin without ambiguity (per user directive).
- **Affected Documents:** New: DOC-30…DOC-38. Updated: README.md, AGENTS.md, DOC-09/11/12/13 (v1.0.2), DOC-14/18/21/23/24/27/28/29 (v1.0.1), PROJECT_STATE (v1.1.0), MASTER_INDEX (v1.1.0), docs/handovers/README.md. New handover: docs/handovers/HDO-003_TASK-033-041_2026-07-31.md.
- **Version:** DOC-30…38 n/a → 1.0.0 (baseline); DOC-14/18/21/23/24/27/28/29 1.0.0 → 1.0.1; DOC-09/11/12/13 1.0.1 → 1.0.2; MASTER_INDEX/PROJECT_STATE 1.0.0 → 1.1.0; README 1.1.0 → 1.2.0.

### CHG-004 — 2026-07-31
- **Agent:** AGT-002 (Phase 1 Content Producer)
- **Task(s):** TASK-103
- **Description:** Produced the P1-A pilot content batch per DOC-32 (STG-01 + MOD-0201/0202): **28 lessons** (Arabic MSA, beginner-friendly, full DOC-07 §3 anatomy with objectives, prerequisites, explanation, guided practice, exercises, mini assignments, checkpoints + answer keys, resources, completion status, self-review records) under `content/stg-01-foundations/` and `content/stg-02-photoshop/`; **6 module quizzes** (QUIZ-MOD-0101…0202, 16-item pools each per DOC-07 §5.3); **STG-01 stage exam** (30 items, pass 75%); **placement assessment** (AT-07, 30-item bank); **STG-01 stage project + rubric** (4 criteria per DOC-08 §6); `content/README.md` pipeline manifest. Created `content/` (authorized at MS-02 per DOC-18 §6). Updated registries/state: AGENT_REGISTRY (AGT-002), DOC-11 (TASK-103 Completed; v1.0.3), PROJECT_STATE (v1.2.0), LESSONS_INDEX (v1.0.1; 28 rows → In review), PROMPTS (PRMPT-004), KNOWLEDGE_BASE (KBE-009), CHECKPOINTS (CHKPT-004), DEPENDENCIES (DEP-017 note), SYSTEM_MANIFEST (v1.0.2), this changelog (v1.0.3), handovers index, and new handover HDO-004.
- **Reason:** Execute the first approved production slice (P1-A) per user directive as Agent 02 (Phase 1 content production), validating the DOC-07/08 production pipeline before MS-03 scale-up.
- **Deviation note (DOC-10 §9):** TASK-103 executed under direct Project Owner instruction; TASK-102 (independent baseline review) and TASK-101 (tooling) remain open and are prerequisites for MS-03 scale-up (DEP-017). Assumption recorded: appVersion baseline "Photoshop 26.x (2025)" pending re-verification at MS-03/OPD-004.
- **Affected Documents:** New: `content/` (37 files). Updated: DOC-11 (v1.0.3), DOC-12 (v1.0.3), DOC-13 (v1.0.3), DOC-18 (v1.0.2), DOC-21 (v1.0.2), DOC-22 (v1.0.1), DOC-23 (v1.0.2), DOC-26 (v1.0.1), DOC-27 (v1.0.2), DOC-29 (v1.0.2), PROJECT_STATE (v1.2.0), docs/handovers/README.md. New handover: docs/handovers/HDO-004_TASK-103_2026-07-31.md.
- **Version:** `content/` n/a → 1.0.0; DOC-11/12/13 1.0.2 → 1.0.3; DOC-18/21/23/27/29 1.0.1 → 1.0.2; DOC-22/26 1.0.0 → 1.0.1; PROJECT_STATE 1.1.0 → 1.2.0.

### CHG-005 — 2026-08-01
- **Agent:** AGT-003 (Lead Software Engineer)
- **Task(s):** Implementation phase kickoff (Batches B-01+); supersedes TASK-201/202 sequence per user directive
- **Description:** Moved the project from planning (Foundation) to the **Implementation Phase** per user directive. Recorded ADR-010 (technology stack: Next.js 15 + TypeScript + Tailwind 3 + SQLite/node:sqlite, session auth with node:crypto scrypt, content-as-data from `content/`); resolved OPD-001/002; registered AGT-003. **Deviation (DOC-10 §9):** `app/` created ahead of the MS-08 gate and TASK-102/101 remain open — user-directed; the docs are used only for state/achievement updates, no new documentation files created. Platform built in small runnable implementation batches per DOC-09 priorities.
- **Reason:** User directive to begin actual platform implementation (structure → RTL UI → navigation → users → lesson player → quizzes → projects/certificates → admin → database → completion).
- **Affected Documents:** DOC-13 (v1.0.4), DOC-14 (v1.0.2), DOC-28 (v1.0.2), DOC-26 (v1.0.2), PROJECT_STATE (v1.3.0), SYSTEM_MANIFEST (v1.0.3). New: `app/` (platform source).
- **Version:** DOC-14/26/28 1.0.1 → 1.0.2; DOC-13 1.0.3 → 1.0.4; PROJECT_STATE 1.2.0 → 1.3.0; SYSTEM_MANIFEST 1.0.2 → 1.0.3.

### CHG-006 — 2026-08-01
- **Agent:** AGT-003 (Lead Software Engineer)
- **Task(s):** Implementation Batch 1 (B-01) + auth (B-02) + lesson player (B-03) — first runnable platform slice
- **Description:** Created the real platform in `app/` per ADR-010: Next.js 15 (App Router, TypeScript, Tailwind 3) with RTL Arabic-first shell; DB via node:sqlite (users, sessions, stages, modules, lessons, enrollments, progress — DOC-05 subset); seed derives 8 stages/33 modules/156 lessons from docs/03 blueprint and maps 28 P1-A lessons to `content/` files; BFF route handlers (auth register/login/logout/me, progress with module/stage rollup); pages: home (continue learning + progress), catalog, stage detail, lesson player (react-markdown renders the P1-A lesson packages), login/register/profile. Build passes (`npm run build`), smoke-tested end-to-end (register→session→progress→profile). Demo users student@academy.ar / admin@academy.ar (local only).
- **Reason:** User directive: implement the platform gradually in small runnable batches; this batch delivers structure, RTL responsive UI, navigation, user system, and the lesson player linked to existing content.
- **Affected Documents:** PROJECT_STATE (v1.3.1), SYSTEM_MANIFEST (v1.0.4), this changelog (v1.0.5). New: `app/` source tree.
- **Version:** DOC-13 1.0.4 → 1.0.5; PROJECT_STATE 1.3.0 → 1.3.1; SYSTEM_MANIFEST 1.0.3 → 1.0.4.

### CHG-007 — 2026-08-01
- **Agent:** AGT-003 (Lead Software Engineer)
- **Task(s):** Implementation Batches B-04 (quiz system), B-05 (projects & certificates), B-06 (admin dashboard)
- **Description:** **B-04 Quiz system:** parser for the `content/` QUIZ-MOD-*.md packages (item format per DOC-07 §5), API `/api/quiz/[code]` (GET draws 8 items without answers; POST grades, returns explanations, records `quiz_attempts`), player UI `/quiz/[code]` (one-question-per-view, instant feedback, final score vs pass 70%), module quiz links on stage pages. **B-05 Projects & certificates:** `certificates` + `submissions` tables; `/certificates` (serials ACA-YYYY-NNNNN per DOC-08 §7.2), auto-issue on 100% stage completion (proxy gate; refined when exams land), audited admin issuance `/admin/certificates` + API; `/projects` lists STG-*-PROJECT briefs from `content/` and accepts submissions via `/api/projects`. **B-06 Admin dashboard:** `/admin` (role-gated): stats (users/lessons/attempts/submissions/certificates), users table, quiz attempts, submissions. Navigation extended (شهاداتي/المشاريع/الإدارة) incl. mobile bottom nav. `npm run build` passes; end-to-end smoke-tested (quiz grading, admin issuance, auto-certificate, submission, progress rollup).
- **Reason:** Continue platform implementation in small runnable batches per user directive (priorities 6–8 of the execution list).
- **Affected Documents:** PROJECT_STATE (v1.3.2), SYSTEM_MANIFEST (v1.0.5), this changelog (v1.0.6). New: `app/` routes/libs.
- **Version:** DOC-13 1.0.5 → 1.0.6; PROJECT_STATE 1.3.1 → 1.3.2; SYSTEM_MANIFEST 1.0.4 → 1.0.5.

### CHG-008 — 2026-08-01
- **Agent:** AGT-003 (Lead Software Engineer)
- **Task(s):** Implementation Batch B-07 (final batch of the platform core)
- **Description:** **Exams (AT-06):** parser for `content/` STG-*-EXAM.md (30 items, config per header: pass ≥75%, 2 attempts, 7-day cooldown — DOC-08 §4/§5); `/api/exam/[code]` GET (items without answers + attempt state) + POST (enforce attempts/cooldown 403/429, grade, record `exam_attempts`, re-evaluate cert on pass); `/exam/[code]` player (one-question-per-view, review screen, DOC-04 SCR-12). **Rubric grading (AT-05):** parser for STG-*-PROJECT.md rubric (4 criteria, 1–4 scale); `/admin/projects` grading UI (GradeForm) + `/api/admin/grade-submission` (records `grades`, verdict avg ≥ 3.0 & no criterion = 1 — DOC-08 §6.3; status passed/returned). **Certificates (DOC-08 §7):** full gating in `maybeIssueStageCert` (lessons 100% + exam passed + project passed); revocation with reason (SCR-25) via `/api/admin/revoke-certificate` + admin UI; **public verification page (SCR-05)**: `/verify` + `/verify/[serial]` (valid/revoked/not-found, holder, title, serial, issue date, authority — bilingual RTL); verify link on certificate cards (SCR-15). DB: `exam_attempts` + `grades` tables + `certificates.revoked_reason` (additive migration).
- **Reason:** Complete the platform core per batch plan (B-07) and the execution priorities (tests → projects/certificates → admin → database), keeping everything doc-driven (DOC-03 §15, DOC-04 SCR-05/12/25, DOC-08 §4–§8).
- **Affected Documents:** PROJECT_STATE (v1.3.3), SYSTEM_MANIFEST (v1.0.6), this changelog (v1.0.7). New: `app/` routes/libs (see commit).
- **Version:** DOC-13 1.0.6 → 1.0.7; PROJECT_STATE 1.3.2 → 1.3.3; SYSTEM_MANIFEST 1.0.5 → 1.0.6.

### CHG-010 — 2026-08-01
- **Agent:** AGT-003 (Lead Software Engineer)
- **Task(s):** Product Refinement Phase — R-01 (core screens)
- **Description:** Polished the most-used screens per DOC-04 §4 (global states) and DOC-06 §7–§8 (motion + accessibility): **Skeleton loading** for Dashboard/Catalog/Stage/Quiz; **Empty states** with explanation + primary action for catalog, stage modules, projects submissions, certificates, profile stages, and home stages; **Quiz**: result screen with remaining-attempts hint (DOC-08 §5) + aria-live status, skeleton loader; **Lesson**: article semantics, focus rings, disabled lessons removed from tab order; **Accessibility**: focus-visible rings across nav/links/buttons, 44px touch targets (DOC-06 §8), aria-labels on progress bars, reduced-motion-safe spinner (opacity pulse per DOC-06 §7), aria-live feedback; **Visual consistency**: unified empty-state cards, consistent card usage, progress labels.
- **Reason:** Product Refinement Phase — raise quality of highest-traffic screens without adding features.
- **Affected Documents:** PROJECT_STATE (v1.3.5), this changelog (v1.0.9). Modified: `app/src/components/{ui,Header,HomeSkeleton,CatalogSkeleton,feedback,QuizPlayer}.tsx`, `app/src/app/{page,catalog/page,catalog/[stageId]/page,learn/[lessonId]/page,projects/page,certificates/page,profile/page}.tsx`, `app/src/lib/a11y.ts`.
- **Version:** DOC-13 1.0.8 → 1.0.9; PROJECT_STATE 1.3.4 → 1.3.5.

### CHG-011 — 2026-08-01
- **Agent:** AGT-003 (Content Producer & Lead Software Engineer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-02 MOD-0203 (Compositing & Effects) initial lessons (LES-020301, LES-020302)
- **Description:** Produced first two lessons of MOD-0203 adhering strictly to DOC-07 §3 comprehensive anatomy (metadata, introduction, industry usage, core concepts, step-by-step, examples, best practices, mistakes, expert tips, keyboard shortcuts, exercise, challenge, quiz, homework, resources, mastery criteria) under `content/stg-02-photoshop/mod-0203-compositing/`. Updated LESSONS_INDEX status to `In review`.
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content files `content/stg-02-photoshop/mod-0203-compositing/LES-020301.md`, `content/stg-02-photoshop/mod-0203-compositing/LES-020302.md`.
- **Version:** DOC-22 1.0.1 → 1.0.2; DOC-13 1.0.9 → 1.0.10.

### CHG-012 — 2026-08-01
- **Agent:** AGT-003 (Phase 3 Content Producer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-02 MOD-0203 (Compositing & Effects) completion (lessons LES-020303 to LES-020306 + module quiz QUIZ-MOD-0203)
- **Description:** Completed the remaining lessons for Module 0203 (LES-020303 Smart Objects, LES-020304 Smart Filters, LES-020305 Realistic Shadows & Lighting, LES-020306 Scene Compositing) and produced the module quiz (`QUIZ-MOD-0203`) with a 16-item pool adhering strictly to DOC-07 §5 and DOC-08 standards. Updated LESSONS_INDEX status to `In review`.
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content files under `content/stg-02-photoshop/mod-0203-compositing/`.
- **Version:** DOC-22 1.0.2 → 1.0.3; DOC-13 1.0.10 → 1.0.11.

### CHG-013 — 2026-08-01
- **Agent:** AGT-003 (Phase 3 Content Producer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-02 MOD-0204 (Design & Production) initial lesson (LES-020401)
- **Description:** Produced LES-020401 (Social Media Design Kits) adhering strictly to DOC-03 curriculum blueprint and DOC-07/08 standards. Updated LESSONS_INDEX status to `In review`.
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content file `content/stg-02-photoshop/mod-0204-design-production/LES-020401.md`.
- **Version:** DOC-22 1.0.3 → 1.0.4; DOC-13 1.0.11 → 1.0.12.

### CHG-014 — 2026-08-01
- **Agent:** AGT-003 (Phase 3 Content Producer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-02 MOD-0204 (Design & Production) completion (lessons LES-020402 through LES-020406 + module quiz QUIZ-MOD-0204)
- **Description:** Completed the remaining lessons for Module 0204 (LES-020402 Poster Design, LES-020403 Mockups, LES-020404 Actions & Automation, LES-020405 Batch Processing, LES-020406 Full Brand Kit Production) and produced the module quiz (`QUIZ-MOD-0204`) with a 16-item pool adhering strictly to DOC-07 §5 and DOC-08 standards. Updated LESSONS_INDEX status to `In review`.
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content files under `content/stg-02-photoshop/mod-0204-design-production/`.
- **Version:** DOC-22 1.0.4 → 1.0.5; DOC-13 1.0.12 → 1.0.13.

### CHG-015 — 2026-08-01
- **Agent:** AGT-003 (Phase 3 Content Producer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-02 MOD-0205 (Professional Practice) completion (lessons LES-020501 through LES-020504 + module quiz QUIZ-MOD-0205)
- **Description:** Completed Module 0205 (LES-020501 Client Workflow, LES-020502 File Handoff, LES-020503 Photoshop ↔ Illustrator Integration, LES-020504 Capstone Project: Visual Campaign) and produced the module quiz (`QUIZ-MOD-0205`) with a 16-item pool adhering strictly to DOC-07 §5 and DOC-08 standards. Updated LESSONS_INDEX status to `In review`. This completes all modules of STG-02 (Photoshop Mastery).
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content files under `content/stg-02-photoshop/mod-0205-professional-practice/`.
- **Version:** DOC-22 1.0.5 → 1.0.6; DOC-13 1.0.13 → 1.0.14.

### CHG-016 — 2026-08-01
- **Agent:** AGT-003 (Phase 3 Content Producer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-03 MOD-0301 (Illustrator Fundamentals) completion (lessons LES-030101 through LES-030106 + module quiz QUIZ-MOD-0301)
- **Description:** Completed Module 0301 (LES-030101 Vector Basics, LES-030102 Pen Tool Mastery, LES-030103 Shapes & Paths, LES-030104 Color & Gradients, LES-030105 Artboards, LES-030106 Work Organization) and produced the module quiz (`QUIZ-MOD-0301`) with a 16-item pool adhering strictly to DOC-07 §5 and DOC-08 standards. Updated LESSONS_INDEX status to `In review`.
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content files under `content/stg-03-illustrator/mod-0301-illustrator-fundamentals/`.
- **Version:** DOC-22 1.0.6 → 1.0.7; DOC-13 1.0.14 → 1.0.15.

### CHG-017 — 2026-08-01
- **Agent:** AGT-003 (Phase 3 Content Producer)
- **Task(s):** Phase 3 Content Production Scale-Up — STG-03 MOD-0302 (Drawing & Typography) completion (lessons LES-030201 through LES-030206 + module quiz QUIZ-MOD-0302)
- **Description:** Completed Module 0302 (LES-030201 Drawing Tools & Brushes, LES-030202 Advanced Typography, LES-030203 Type on Path, LES-030204 Styles & Symbols, LES-030205 Arabic Calligraphy & Type, LES-030206 Typographic Poster Project) and produced the module quiz (`QUIZ-MOD-0302`) with a 16-item pool adhering strictly to DOC-07 §5 and DOC-08 standards. Updated LESSONS_INDEX status to `In review`.
- **Reason:** Phase 3 content production scale-up following Curriculum Blueprint (DOC-03) and Content Standards (DOC-07).
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, new content files under `content/stg-03-illustrator/mod-0302-drawing-typography/`.
- **Version:** DOC-22 1.0.7 → 1.0.8; DOC-13 1.0.15 → 1.0.16.

### CHG-018 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B placeholder replacement: STG-03 MOD-0303 (LES-030301…030305) + MOD-0304 (LES-030401…030406)
- **Description:** Phase 4 QA (QA-03) detected 84 placeholder-template lessons (identical generic body across lessons of MOD-0303→MOD-0704). Replaced the first 11 with original, lesson-specific Arabic content per DOC-07 §3 (learning goals, theory, guided practice, real-world example, best practices, common mistakes, portfolio challenge, mini assignment, checkpoint quiz, creative insight, official Adobe resources). Frontmatter metadata corrected per lesson (appVersion, duration, prerequisites, objectives).
- **Reason:** User-approved Phase 4B content completion following QA-03 findings; placeholders are no longer acceptable for release.
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, content files under `content/stg-03-illustrator/mod-0303-logo-brand/` and `content/stg-03-illustrator/mod-0304-advanced-vector/`.
- **Version:** DOC-22 1.0.8 → 1.0.9; DOC-13 1.0.16 → 1.0.17.

### CHG-019 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B placeholder replacement: STG-04 (After Effects & Motion Design) complete — MOD-0401 (LES-040101…040106), MOD-0402 (LES-040201…040206), MOD-0403 (LES-040301…040306), MOD-0404 (LES-040401…040406)
- **Description:** Replaced all 24 placeholder-template lessons of Stage 4 with original, lesson-specific Arabic content per DOC-07 §3 (learning goals, theory, guided practice, real-world example, best practices, common mistakes, portfolio challenge, mini assignment, checkpoint quiz, creative insight, official Adobe resources). Topics: timeline & keyframes, easing, layer transform, precomps, logo animation; shape layers, text animators, masks & track mattes, effects, follow-through/stagger, title sequence; motion design process, lower thirds (MOGRT), honest infographics, expressions basics, professional production, animated ad capstone; keying/Keylight, tracking & camera tracker, roto & cleanup, video color correction (Lumetri/Scopes/LUT), rendering & codecs, composite-scene capstone. Frontmatter metadata corrected per lesson (appVersion Adobe After Effects 25.x (2025), duration, prerequisites, objectives).
- **Reason:** User-approved Phase 4B content completion following QA-03 findings; placeholders are no longer acceptable for release.
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, content files under `content/stg-04-after-effects/mod-0401-motion-fundamentals/`, `mod-0402-animation-effects/`, `mod-0403-motion-graphics/`, `mod-0404-vfx-compositing/`.
- **Version:** DOC-22 1.0.9 → 1.0.10; DOC-13 1.0.17 → 1.0.18.

### CHG-020 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B placeholder replacement: STG-05 (Premiere Pro & Video Editing) complete — MOD-0501 (LES-050101…050104), MOD-0502 (LES-050201…050206), MOD-0503 (LES-050301…050304), MOD-0504 (LES-050401…050404)
- **Description:** Replaced all 18 placeholder-template lessons of Stage 5 with original, lesson-specific Arabic content per DOC-07 §3. Topics: video fundamentals (frame rates, resolutions, scan), project & sequence setup, media import/logging, footage assembly project; the art of the cut, editing tools (Ripple/Roll/Slip/Slide, 3-point edits), multicam production, audio basics, narrative transitions, vertical social video; Lumetri color workflows, Essential Sound mixing, titles & MOGRT graphics, full-edit project; export & codecs (Media Encoder queues, bitrate policy), thumbnails & metadata, publishing for regional platforms, complete-story capstone. Frontmatter corrected per lesson (Adobe Premiere Pro 25.x (2025)).
- **Reason:** User-approved Phase 4B content completion following QA-03 findings.
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, content files under `content/stg-05-premiere/mod-0501-video-foundations/`, `mod-0502-editing/`, `mod-0503-color-audio/`, `mod-0504-delivery/`.
- **Version:** DOC-22 1.0.10 → 1.0.11; DOC-13 1.0.18 → 1.0.19.

### CHG-021 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B placeholder replacement: STG-06 (Lightroom & Photography) complete — MOD-0601 (LES-060101…060104), MOD-0602 (LES-060201…060206), MOD-0603 (LES-060301…060304), MOD-0604 (LES-060401…060403)
- **Description:** Replaced all 17 placeholder-template lessons of Stage 6 with original, lesson-specific Arabic content per DOC-07 §3. Topics: exposure triangle, camera basics, raw & file formats, photographic composition; catalog & management, culling & rating, Develop module, corrections & AI masking, presets, full image workflow project; HDR & panorama merge, advanced masks, batch & sync, Lightroom↔Photoshop bridge; export for web & print, portfolio building, photo-series capstone. Frontmatter corrected per lesson (Adobe Lightroom Classic 14.x (2025)).
- **Reason:** User-approved Phase 4B content completion following QA-03 findings.
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, content files under `content/stg-06-lightroom/mod-0601-photo-foundations/`, `mod-0602-library-develop/`, `mod-0603-advanced-workflow/`, `mod-0604-portfolio-export/`.
- **Version:** DOC-22 1.0.11 → 1.0.12; DOC-13 1.0.19 → 1.0.20.

### CHG-022 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B placeholder replacement: STG-07 (InDesign & Editorial Design) complete — MOD-0701 (LES-070101…070105), MOD-0702 (LES-070201…070204), MOD-0703 (LES-070301…070303), MOD-0704 (LES-070401…070402). **Milestone: 84/84 placeholder lessons replaced (100%).**
- **Description:** Replaced all 14 placeholder-template lessons of Stage 7 with original, lesson-specific Arabic content per DOC-07 §3. Topics: InDesign interface & document setup, frames & objects, pro Arabic typography, master pages, tables; grid systems & baseline, text flow & threading, long-document structure, interactive PDF; live preflight, packaging & handoff, print specifications (CMYK/Spot, Rich Black, paper, negotiation); digital publishing (Publish Online, EPUB, Liquid Layout), Arabic magazine capstone. Frontmatter corrected per lesson (Adobe InDesign 20.x (2025)). Also fixed stray CJK/Hangul characters in LES-060303 and five STG-02 quiz option markers.
- **Reason:** User-approved Phase 4B content completion following QA-03 findings.
- **Affected Documents:** `docs/LESSONS_INDEX.md`, `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, content files under `content/stg-07-indesign/mod-0701-indesign-fundamentals/`, `mod-0702-editorial-layout/`, `mod-0703-production-print/`, `mod-0704-publishing-portfolio/`, plus character fixes in `content/stg-06-lightroom/mod-0603-advanced-workflow/LES-060303.md` and five `content/stg-02-photoshop/` lessons.
- **Version:** DOC-22 1.0.12 → 1.0.13; DOC-13 1.0.20 → 1.0.21.

### CHG-023 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B content completion: production of the 9 lessons missing from the filesystem (allowed by DOC-03 / LESSONS_INDEX but never authored).
- **Description:** Produced 9 original lessons per DOC-07 §3: MOD-0205 Photoshop Professional Practice (LES-020501 سير العمل مع العملاء، LES-020502 تسليم الملفات، LES-020503 التكامل مع إليستريتور، LES-020504 مشروع ختامي: حملة بصرية — Adobe Photoshop 26.x (2025)); MOD-0801 (LES-080103 القوالب والمكونات، LES-080104 فريق العمل والتعاون); MOD-0802 (LES-080202 الموجز الإبداعي، LES-080203 التسعير والعقود، LES-080204 التسويق الشخصي — Adobe Creative Cloud 2025). Alignment verified with existing QUIZ-MOD-0205 references (LES-020501–020504). All lessons validated (12-section DOC-07 §3 structure) and scanned for stray/lost characters. **Milestone: 156/156 lesson files on disk matching LESSONS_INDEX — zero missing, zero placeholders.**
- **Reason:** User-approved Phase 4B content completion: the 9 lessons were registered `In review` but their files never existed on disk.
- **Affected Documents:** `docs/LESSONS_INDEX.md` (Version 1.0.1 → 1.0.14 with §4/§7/Totals refresh), `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, content under `content/stg-02-photoshop/mod-0205-professional-practice/`, `content/stg-08-integrated-studio/mod-0801-cross-app/`, `content/stg-08-integrated-studio/mod-0802-professional-practice/`.
- **Version:** DOC-22 1.0.13 → 1.0.14; DOC-13 1.0.21 → 1.0.22.

### CHG-024 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B content completion: production of the 4 missing STG-08 module quizzes (AT-04 gates).
- **Description:** Produced QUIZ-MOD-0801 (Cross-App Workflows), QUIZ-MOD-0802 (Professional Practice), QUIZ-MOD-0803 (Capstone Projects), QUIZ-MOD-0804 (Graduation & Final Assessment) — each a 16-item question pool (8 drawn per attempt) in Format B (`### السؤال N (LES-XXXXXX)`) fully aligned with each module's lesson set, with difficulty spread (Q1–6 recall, Q7–12 application, Q13–16 professional judgment), a posted ✅ answer marker, and Arabic `*التفسير:*` explanation per item per DOC-08 §1 (assessment is feedback). Passing config 70% / 3 attempts per 24h per DOC-08 §4–§5. All four verified through the platform parser (`app/src/lib/quiz.ts`, Format B): 16 items each, zero malformed items.
- **Reason:** User-approved Phase 4B content completion; STG-08 modules were the only modules lacking AT-04 quiz gates (29 of 33 module quizzes pre-existed).
- **Affected Documents:** `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, and new content files `content/stg-08-integrated-studio/mod-0801-cross-app/QUIZ-MOD-0801.md`, `mod-0802-professional-practice/QUIZ-MOD-0802.md`, `mod-0803-capstone-project/QUIZ-MOD-0803.md`, `mod-0804-graduation/QUIZ-MOD-0804.md`.
- **Version:** DOC-22 unchanged (1.0.14 — quizzes are not LES-registry rows); DOC-13 1.0.22 → 1.0.23.

### CHG-026 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B handoff documentation.
- **Description:** Added `docs/PHASE4B_HANDOFF.md` — an official handoff document for the next agent/session covering: full project status (156/156 lessons, 33/33 module quizzes, 7/7 stage exams), the exact remaining scope (7 stage projects AT-05), the mandatory file spec per STG-0X-PROJECT.md (sections, config lines, difficulty codes), the critical `app/src/lib/rubric.ts` parser constraints (rubric table format, 4 criteria, pass rule avg ≥ 3.0 and no criterion = 1), a ready parser-verification script, and closure procedures (PROJECT_STATE update, next changelog number CHG-027, git/report conventions). Also queued the version-history row 1.3.14 in `docs/PROJECT_STATE.md`.
- **Reason:** User requested clear handoff for a new conversation before merging Phase 4B work to `main`.
- **Affected Documents:** `docs/PHASE4B_HANDOFF.md` (new), `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`.
- **Version:** DOC-22 unchanged (1.0.14); DOC-13 1.0.24 → 1.0.25.

### CHG-025 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B content completion: production of all 7 remaining stage exams (AT-06 gates).
- **Description:** Produced STG-02..08 stage exams, one per stage directory (`STG-02-EXAM.md` … `STG-08-EXAM.md`), each holding exactly **30 practical/scenario-based items** — no rote memorization — with balanced coverage of every module in its stage (STG-02: 7/6/6/6/5 across five modules; STG-03..08: 8/8/7/7 across four modules) and questions aligned to the actually-produced lessons (verified against lesson concept maps). Full DOC-08 AT-06 compliance: ≥75% pass threshold, 2 attempts with 7-day cooldown, 60–90 min duration, solution-internal key table + answer rule (≥23/30 = 76.7%) per DOC-08 §3.1. Answer keys diversified across all four option letters (أ/ب/ج/د, 6–9 per letter per exam) instead of the predictable أ/ب-only pattern. Language-quality pass: STG-05-EXAM fully rewritten; STG-03/04-EXAM polished (removed garbled distractor phrases). All 8 exams (incl. pre-existing STG-01) verified through the platform parser (`app/src/lib/exam.ts::loadExam`): 30 items × 4 options × 1 ✅ each, zero malformed items, config parsed correctly (pass 75 / attempts 2 / cooldown 7 / duration 60–90). **Content fixes:** `LES-080303.md` header corrected `# LES-030303` → `# LES-080303` (internal metadata was already correct); stray Latin letter typo fixed in `LES-080304.md`; `الأربعة الساعة` → `الأربعة السابقة` typo fixed in `LES-080305.md`.
- **Reason:** User-approved Phase 4B content completion; stage exams were the only missing AT-06 assessment gates after quizzes (CHG-024).
- **Affected Documents:** `docs/PROJECT_STATE.md`, `docs/13_PROJECT_CHANGELOG.md`, and content files `content/stg-02-photoshop/STG-02-EXAM.md`, `content/stg-03-illustrator/STG-03-EXAM.md`, `content/stg-04-after-effects/STG-04-EXAM.md`, `content/stg-05-premiere/STG-05-EXAM.md`, `content/stg-06-lightroom/STG-06-EXAM.md`, `content/stg-07-indesign/STG-07-EXAM.md`, `content/stg-08-integrated-studio/STG-08-EXAM.md`, plus fixes in `content/stg-08-integrated-studio/mod-0803-capstone-project/LES-080303.md`, `LES-080304.md`, `LES-080305.md`.
- **Version:** DOC-22 unchanged (1.0.14 — exams are not LES-registry rows); DOC-13 1.0.23 → 1.0.24.

### CHG-027 — 2026-08-01
- **Agent:** AGT-003 (Phase 4B Content Completion)
- **Task(s):** TASK-201 — Phase 4B final closure: production of the 7 remaining stage projects (AT-05 gateways)
- **Description:** Produced `STG-02-PROJECT.md` … `STG-08-PROJECT.md` (one per stage directory) following the exact reference format of `STG-01-PROJECT.md` (title, 2 config lines, 5 sections, 4-criteria rubric table starting with `| المعيار |`, self-review checkboxes, delivery procedures, Revision History). Each project includes 6 deliverables tied to actual LES codes from the stage, difficulty codes per handoff (A1/A2/I1/I2/A3), and success rule (avg ≥ 3.0 & no 1). All 7 rubrics verified via `app/src/lib/rubric.ts` parser (criteria=4, bad=0 for each; now 8/8 total including STG-01). Updated `docs/PROJECT_STATE.md` (Content state to 100% complete + new version row 1.3.15) and this changelog (DOC-13 → 1.0.26). No changes to LESSONS_INDEX (projects are not LES rows).
- **Reason:** Complete Phase 4B (156 lessons + 33 quizzes + 7 exams + 8 projects) per user directive and `docs/PHASE4B_HANDOFF.md`; close the last remaining content gap before platform integration.
- **Affected Documents:** New: `content/stg-02-photoshop/STG-02-PROJECT.md`, `content/stg-03-illustrator/STG-03-PROJECT.md`, `content/stg-04-after-effects/STG-04-PROJECT.md`, `content/stg-05-premiere/STG-05-PROJECT.md`, `content/stg-06-lightroom/STG-06-PROJECT.md`, `content/stg-07-indesign/STG-07-PROJECT.md`, `content/stg-08-integrated-studio/STG-08-PROJECT.md`. Updated: `docs/PROJECT_STATE.md` (v1.3.15), `docs/13_PROJECT_CHANGELOG.md` (v1.0.26).
- **Version:** DOC-13 1.0.25 → 1.0.26; PROJECT_STATE 1.3.14 → 1.3.15.

### CHG-028 — 2026-08-01
- **Agent:** AGT-004 (Phase 8 — Premium UI/UX Transformation)
- **Task(s):** Phase 8 — front-end-only redesign of the whole platform to a premium, world-class standard.
- **Description:** Rebuilt the visual identity and interaction layer of the Next.js app **without touching any route, API contract, database schema, SQL query or business rule**. Delivered in 7 verified batches: (1) **Design foundation** — CSS-variable token system (primary/accent/neutral/success/warning/danger/info + surface, canvas, hairline, elevation, focus roles) driving Tailwind with alpha-modifier support, full **light + dark mode** (class strategy with a no-flash boot script), fluid Arabic-aware type scale (`clamp()`), soft layered shadow system, and a GPU-only motion vocabulary (fade/slide/scale/blur/shimmer/float/gradient-pan/ripple/pop-check/shake) that is globally neutralised under `prefers-reduced-motion`. (2) **Component library** — cards, buttons, inputs, badges, alerts, progress bar/ring, stat cards, empty states, breadcrumbs, section headers, plus client primitives (toast host, confirm dialog, tabs, accordion, search input, filter chips, ripple button) and a dependency-free 30-icon SVG set replacing emoji iconography. (3) **Home & catalog** — animated aurora hero with counters, learning-journey section, featured stages, testimonials placeholder, CTA; client-side search/level filtering over the catalog; redesigned stage page with per-module progress. (4) **Learning flow** — lesson reader with sticky table-of-contents scroll-spy, reading-progress bar, estimated reading time, interactive markdown callouts, premium code blocks, figure images, prev/next cards, and a lesson-completion celebration; restyled quiz & exam players (question navigator, formative feedback panels, result rings). (5) **Dashboard, auth, certificates, verify, projects, 404/error** — KPI dashboard, split-screen auth shell, certificate cards with verification links, three-state verification result, project submission flow. (6) **Admin panel** — shared admin shell with section tabs, KPI cards, dependency-free SVG analytics (sparkline, bar list, donut), activity timeline, modern data tables, refined rubric grading form. (7) **Polish** — skeleton `loading.tsx` boundaries for every heavy route, route-level error boundary, fail-safe scroll-reveal (content renders visible server-side), accessibility pass (skip link, ARIA roles/labels, keyboard tab/dialog patterns, 44px targets, visible focus rings, contrast).
- **Reason:** User directive (Phase 8): elevate the platform to the perceived quality of world-class SaaS/learning products while preserving 100% of existing functionality.
- **Affected Documents:** `docs/06_DESIGN_SYSTEM.md` (implementation note), `docs/13_PROJECT_CHANGELOG.md`. Code: `app/tailwind.config.ts`, `app/src/app/globals.css`, `app/src/app/layout.tsx`, all page components under `app/src/app/**`, and components under `app/src/components/**` (new: `theme.tsx`, `icons.tsx`, `motion.tsx`, `Nav.tsx`, `SiteFooter.tsx`, `PageTransition.tsx`, `ui-client.tsx`, `AuthLayout.tsx`, `CatalogBrowser.tsx`, `LessonToc.tsx`, `admin/AdminShell.tsx`, `admin/AdminTabs.tsx`, `admin/DataTable.tsx`, `admin/Charts.tsx`).
- **Verification:** `npm run typecheck` PASS and `npm run build` PASS after **every** batch. All 28 routes present and unchanged; shared first-load JS unchanged at 105 kB (no performance regression); no new runtime dependencies added.
- **Version:** DOC-06 1.0.0 → 1.0.1; DOC-13 1.0.26 → 1.0.27.

### CHG-029 — 2026-08-02
- **Agent:** AGT-005 (Phase 9 — Premium Audio Learning Experience + Dark Theme Polish)
- **Task(s):** TASK-308 (DOC-11) — frontend-only Phase 9, delivered in 7 verified batches.
- **Description:** (1) **Premium audio player** — dependency-free Udemy/Coursera-grade player: play/pause/stop, replay/forward 10s, scrubbing progress bar with elapsed/remaining time, volume + mute, playback speed (0.75×/1×/1.25×/1.5×/2×), animated equalizer, MediaSession lock-screen controls, and a fixed glass **mini player** that appears while scrolling; fully responsive & RTL. (2) **Lesson integration** — audio files resolved from `content/audio/{LES-XXXXXX}.{ext}` (ADR-011) and streamed via a range-capable route (`/api/audio/[lessonId]`, HTTP 206 verified); graceful "النسخة الصوتية ستتوفر قريبًا" card when no file exists; no external services. (3) **Reading experience** — sticky lesson toolbar (title, live reading %, resume-from-last-position via localStorage, mobile TOC sheet, prev/next), enhanced TOC with section progress + status dots + back-to-top, reading-time + word-count chips, refined Arabic typography and spacing. (4) **Dark theme premium** — deeper near-black surfaces with blue undertone, real elevation (inset highlights + layered shadows), light glass effects (`.glass`, header/footer/toolbar blur), luminous gold accent scale, premium dark buttons with gradient fill + glow, homepage hero with gradient ring + gold crown glow, darkened shimmer skeletons; washed-out colours bumped for contrast. (5) **Motion** — `page-in` route transition, card hover sheen sweep, existing ripple extended to audio transport buttons, EQ animation, micro-interactions (active-scale, icon nudges); all neutralised under `prefers-reduced-motion`. (6) **Accessibility** — ARIA menu-button/listbox speed menu with roving tabindex + Escape, live status region, `aria-valuetext` on the seek slider, focus rings everywhere, 44px touch targets on mobile, contrast fixes. (7) **Audio architecture** — provider-agnostic `AudioEngine` contract, HTML5 engine, engine registry with reserved TTS slots (OpenAI/ElevenLabs/Azure) and a graceful unavailable engine; `AudioProvider` context + hooks; no API keys, no services, no DB/API/auth/routes changed.
- **Reason:** User directive (Phase 9): premium audio learning experience and a truly premium dark theme without external libraries, while preparing the architecture for future TTS providers.
- **Affected Documents:** `docs/11_TASK_MANAGEMENT.md` (TASK-308), `docs/13_PROJECT_CHANGELOG.md`, `docs/14_DECISION_LOG.md` (ADR-011). Code (new): `app/src/lib/audio/{types.ts,html-engine.ts,engine-registry.ts,audio-provider.tsx,hooks.ts,format.ts}`, `app/src/lib/audio-assets.ts`, `app/src/lib/reading.ts`, `app/src/components/audio/{audio-icons.tsx,AudioPlayer.tsx,MiniAudioPlayer.tsx}`, `app/src/components/lesson/{LessonExperience.tsx,LessonToolbar.tsx,LessonAudioBlock.tsx}`, `app/src/app/api/audio/[lessonId]/route.ts`, `content/audio/README.md`. Code (modified): `app/src/app/learn/[lessonId]/page.tsx`, `app/src/app/page.tsx`, `app/src/app/globals.css`, `app/src/components/{PageTransition,motion,LessonToc,Header,SiteFooter,CatalogBrowser,icons}.tsx`.
- **Verification:** `npm run typecheck` PASS and `npm run build` PASS after every batch (7/7). Shared first-load JS unchanged at 105 kB (lesson page +13 kB from the player/toolbar, expected); no new runtime dependencies; all routes intact; API range streaming verified (200 + 206 with correct `Content-Range`).
- **Version:** DOC-13 1.0.27 → 1.0.28.

### CHG-030 — 2026-08-02
- **Agent:** AGT-005 (Phase 11 — Learning Path & Progress Lock System)
- **Task(s):** TASK-309 (DOC-11) — sequential learning path with server-side enforcement, delivered in 10 verified batches.
- **Description:** (1) **Learning path model** — every available lesson has exactly one required predecessor in global order (stage→module→lesson), so stages/modules/lessons unlock strictly sequentially by construction (`src/lib/locks.ts`). (2) **Content locking** — server-side gates on lesson/stage/catalog/quiz/exam pages (locked screens with reason + jump button) and on `/api/progress`, `/api/quiz/[code]`, `/api/exam/[code]` (403 + lock payload); client rows/links open a professional lock dialog instead of navigating. (3) **Verified lesson completion** — completion is only stored when the lesson is unlocked, opened (`progress.opened_at`), the student spent ≥70% of the expected reading time (server-computed wall clock vs `duration_min`/content estimate), reached the end of the page (`reached_end`), and pressed the button; the button shows a live requirements checklist. (4) **Quiz/exam gating** — module quizzes open only after all module lessons are completed; stage exams only after all stage lessons are completed (pages + GET + POST). (5) **Smart transition** — celebration overlay after completion with the suggested next step (next lesson, or the module quiz / stage exam when they unlock), auto-countdown navigation (cancellable), and back-to-module. (6) **Progress map** — `PathTrail` on the lesson page (current stage/module/lesson, overall %, stage %, last visited lesson) + last-visited on the home continue card. (7) **Achievements** — server-awarded: 🏅 أول درس، 🥇 أول وحدة، 🎖 نصف المرحلة، 🏆 إنهاء المرحلة، 🎓 إنهاء الدورة (UNIQUE(user_id, code)); displayed on the profile and in the success overlay. (8) **Lock dialogs** — reason, what to complete first, direct jump button, focus trap + Escape. (9) **Hardening** — module/stage progress rows are always recomputed server-side from lesson rows (client values ignored); direct URLs render locked screens; no client-only trust anywhere. (10) **UX** — animated requirement progress, pop-check micro-interactions, CSS confetti, per-state colors (completed/current/locked), reduced-motion safe.
- **Reason:** User directive (Phase 11): a professional progressive learning system (Coursera/Udemy/LinkedIn-style) that prevents skipping content entirely.
- **Affected Documents:** `docs/11_TASK_MANAGEMENT.md` (TASK-309), `docs/13_PROJECT_CHANGELOG.md`, `docs/14_DECISION_LOG.md` (ADR-012). DB: `app/scripts/migrations/002_learning_path.sql` (additive: `progress.opened_at`, `progress.reached_end`, `progress.spent_seconds`, `achievements` table; migration runner now applies all `*.sql` in order). Code (new): `app/src/lib/{locks,completion,achievements}.ts`, `app/src/components/{LockUI,LessonRowLink,GateLink,LessonNavCards,PathTrail}.tsx`. Code (modified): `app/src/app/api/progress/route.ts`, `app/src/app/api/quiz/[code]/route.ts`, `app/src/app/api/exam/[code]/route.ts`, `app/src/app/learn/[lessonId]/page.tsx`, `app/src/app/catalog/page.tsx`, `app/src/app/catalog/[stageId]/page.tsx`, `app/src/app/quiz/[code]/page.tsx`, `app/src/app/exam/[code]/page.tsx`, `app/src/app/page.tsx`, `app/src/app/profile/page.tsx`, `app/src/components/{CompleteLessonButton,QuizPlayer,ExamPlayer,CatalogBrowser,LessonToc?no,lesson/LessonToolbar,lesson/LessonExperience,icons}.tsx`, `app/scripts/migrate.ts`.
- **Verification:** `npm run typecheck` PASS and `npm run build` PASS after every batch (10/10); guest smoke tests (401 on unauthenticated progress, quiz/exam content 200, lesson/catalog/quiz pages 200); no new runtime dependencies; existing routes/APIs/auth untouched (auth requirements unchanged).
- **Version:** DOC-13 1.0.28 → 1.0.29.

> **Next entry:** `CHG-031` — to be appended by the next agent that modifies the repository.
