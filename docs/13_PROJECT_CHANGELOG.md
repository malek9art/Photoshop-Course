# 13 — Project Changelog

> **Document ID:** DOC-13 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Project Changelog |
| **Purpose** | Records **every modification** to the project: date, agent, description, reason, affected documents, and version. The changelog is append-only and is the audit trail of the entire project. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.5 |
| **Status** | Active — append-only (see §2) |
| **Dependencies** | DOC-10 (R-05 requires entries), DOC-11 (tasks), DOC-14 (decisions) |
| **Last Updated** | 2026-07-31 |
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

> **Next entry:** `CHG-007` — to be appended by the next agent that modifies the repository.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.5 | 2026-08-01 | AGT-003 | Batch B-01/B-02/B-03 recorded (CHG-006): first runnable platform slice (structure, RTL UI, navigation, auth, lesson player). |
| 1.0.4 | 2026-08-01 | AGT-003 | Implementation phase kickoff recorded (CHG-005): ADR-010, OPD-001/002 resolved, `app/` created. |
| 1.0.3 | 2026-07-31 | AGT-002 | P1-A pilot content recorded (CHG-004): 28 lessons + assessments; registries/state updated. |
| 1.0.2 | 2026-07-31 | Project Foundation Architect | Foundation closure recorded (CHG-003): DOC-30…38, ADR-009, GATE-F1 PASS. |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | Operating-docs extension recorded (CHG-002). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-13): policy + first entry CHG-001. |

## Notes

- This document is the *policy* and the *log*; entries accumulate at the end of §5.
- The changelog is checked as part of every verification (DOC-16 §Documentation Review): "is there a CHG entry for every changed file?"

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-10 Agent Rules](10_AGENT_RULES.md) | R-05 documentation duty |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Task ↔ changelog linkage |
| [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) | Handovers reference CHG entries |
| [DOC-14 Decision Log](14_DECISION_LOG.md) | ADRs recorded alongside CHG entries |
