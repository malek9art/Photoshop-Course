# PHASE_1_README — Phase 1 Entry Point

> **Document ID:** DOC-38 · **Status:** Active · **Owner:** Project Manager (role)

| Field | Value |
|-------|-------|
| **Title** | Phase 1 Readme (Content Production Entry Point) |
| **Purpose** | The exact entry point and reading order for the next agent starting Phase 1: what Phase 1 is, what to read first, the first tasks in order, the daily operating loop, boundaries, and success criteria. It eliminates ambiguity about how content production begins. |
| **Owner** | Project Manager (role) |
| **Version** | 1.0.0 |
| **Status** | Active — Phase 1 authorized (GATE-F1 PASS, 2026-07-31) |
| **Dependencies** | DOC-31 (gate), DOC-32 (scope), DOC-33 (handoff), DOC-34 (startup checklist), DOC-35 (review), DOC-36 (change control), DOC-37 (release criteria) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | At each content batch (MS-02…06); entry point changes via CCR |

## Table of Contents

- [1. Welcome to Phase 1](#1-welcome-to-phase-1)
- [2. What Phase 1 Is (and Is Not)](#2-what-phase-1-is-and-is-not)
- [3. Mandatory Reading Order for Phase 1 Agents](#3-mandatory-reading-order-for-phase-1-agents)
- [4. First Tasks, In Order](#4-first-tasks-in-order)
- [5. The Daily Operating Loop](#5-the-daily-operating-loop)
- [6. Boundaries & Prohibitions](#6-boundaries--prohibitions)
- [7. Success Criteria for Phase 1](#7-success-criteria-for-phase-1)
- [8. Where Things Live (Quick Map)](#8-where-things-live-quick-map)
- [9. Update Rules (Mandatory)](#9-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Welcome to Phase 1

The foundation is **complete** (GATE-F1 PASS, 2026-07-31 — see [DOC-31](PHASE_GATE.md) and [DOC-37](RELEASE_CRITERIA.md)). You are the first agent entering the **content production phase**. Everything you need to work safely and consistently has been written down. Your job: produce the first curriculum content — **exactly the P1-A scope** — to the quality the standards demand, and prove the production pipeline works.

**Read this entire document before claiming any task.**

## 2. What Phase 1 Is (and Is Not)

| ✅ Phase 1 IS | ❌ Phase 1 IS NOT |
|---------------|-------------------|
| Arabic content production for the curriculum | Platform development (MS-07/08 — later) |
| Lessons, exercises, quizzes, projects, exams per DOC-07/08 | Technology decisions (OPD-001…005 — MS-07) |
| Content registration, review, and quality evidence | Database/SQL work (OPD-002 — MS-07) |
| Process learning: knowledge base, prompts, checkpoints | Design tokens/brand implementation (MS-11) |
| Keeping documentation in sync with content | Certificates engine (MS-09) |

Phase 1 spans milestones **MS-02 (pilot) → MS-03…MS-06 (batches)** per [DOC-09](09_PROJECT_ROADMAP.md). It produces **content only**; the platform will later consume it (DOC-02 §8.1).

## 3. Mandatory Reading Order for Phase 1 Agents

Read in this order **before any change** (completes AGENT_STARTUP_CHECKLIST §3):

| # | Document | Purpose |
|---|----------|---------|
| 1 | `AGENTS.md` | Entry instructions |
| 2 | [DOC-17 MASTER_INDEX](MASTER_INDEX.md) | Navigation map |
| 3 | [DOC-19 PROJECT_STATE](PROJECT_STATE.md) | Current state |
| 4 | [DOC-30 POLICY_LOCK](POLICY_LOCK.md) | What is frozen |
| 5 | [DOC-10 Agent Rules](10_AGENT_RULES.md) | Binding rules |
| 6 | [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Task board |
| 7 | **this document (DOC-38)** | Phase 1 entry |
| 8 | [DOC-32 PHASE_1_SCOPE](PHASE_1_SCOPE.md) | Exact production scope (P1-A) |
| 9 | [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Curriculum skeleton |
| 10 | [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | How to produce content |
| 11 | [DOC-08 Assessment Standard](08_ASSESSMENT_STANDARD.md) | Quizzes/exams/rubrics |
| 12 | [DOC-35 REVIEW_PROTOCOL](REVIEW_PROTOCOL.md) + [DOC-36 CHANGE_CONTROL](CHANGE_CONTROL.md) | Review & change paths |
| 13 | [DOC-34 AGENT_STARTUP_CHECKLIST](AGENT_STARTUP_CHECKLIST.md) | Startup checklist (do it) |

## 4. First Tasks, In Order

| Order | Task | Why first | Est. effort |
|-------|------|-----------|-------------|
| 1 | **TASK-102** — independent baseline review (all 38 docs) | Validates the foundation you will build on; closes the last foundation gap | 5 AD |
| 2 | **TASK-101** — governance tooling (link/header/ID lint) | Automates the checks that keep docs truthful during production | 5 AD |
| 3 | **TASK-103** — P1-A pilot content (STG-01 + MOD-0201/0202 = 28 lessons) | The first real content; sets the quality bar for all later batches | 15–20 AD |
| 4 | Pilot review + calibration (new tasks) | DOC-08 `[TBD]`s resolved with pilot data; DOC-07 validated | 5 AD |

**Prerequisites:** register as an agent (AGT-002+, [DOC-26](AGENT_REGISTRY.md)) and complete [DOC-34](AGENT_STARTUP_CHECKLIST.md) before TASK-102.

## 5. The Daily Operating Loop

For every task, in order (also DOC-19 §9):

1. **Claim** — task → `In Progress`, you as assigned agent, date (DOC-11).
2. **Checklist** — startup items done (DOC-34 §3); scope check against DOC-32.
3. **Produce** — content per DOC-07/08, within the P1-A unit, following the lesson anatomy.
4. **Register as you go** — lesson rows flip status in DOC-22; prompts in DOC-27 (PRMPT-NNN); knowledge in DOC-21 (KBE-NNN).
5. **Self-review** — applicable DOC-16 gates (B, D, E for content) filled.
6. **Request review** — mark `Completed`, assign reviewer per DOC-35 (§3 C-1 class).
7. **Fix/re-submit** — if returned, address listed items; re-cycle.
8. **Close** — on `Passed`: DOC-13 entry (CHG-NNN), DOC-19 snapshots updated, handover if session ends (HDO-NNN).

## 6. Boundaries & Prohibitions

| # | Rule |
|---|------|
| 1 | Produce **only** the 28 P1-A lessons (DOC-32 §3); anything else needs a CCR. |
| 2 | No platform code, no SQL, no UI, no technology choices (DOC-10 P-03/P-05/P-12). |
| 3 | No changes to locked items without CCR/ADR (DOC-30). |
| 4 | No unlicensed assets (ADR-007, DOC-07 §6). |
| 5 | No content outside the DOC-03 skeleton (CCP required). |
| 6 | No merge to `main`; work on the session branch; PRs stay draft until approved. |
| 7 | Never skip the review protocol (DOC-35) — including for "small" content. |
| 8 | Never let DOC-19/22/13 fall behind; state updates ship with the work, not after. |

## 7. Success Criteria for Phase 1

The pilot (MS-02) is successful when (feeds [DOC-09](09_PROJECT_ROADMAP.md) MS-02 exit criteria):

| # | Criterion | Measure |
|---|-----------|---------|
| 1 | P1-A content complete and reviewed | 28/28 lessons `Published` in DOC-22 |
| 2 | Content quality bar proven | All units passed DOC-16 Gates B/D/E |
| 3 | Assessment artifacts valid | Module quizzes + STG-01 project/exam + rubrics produced and calibrated |
| 4 | Production rate measured | Actual agent-days per lesson unit recorded (feeds R-E-02) |
| 5 | Pipeline proven | Lessons → review → publish loop run end-to-end; content packages versioned |
| 6 | Standards validated | DOC-07/08 amendments proposed via CCR only where pilot proved them needed |
| 7 | Documentation truthful | DOC-19/13/22 consistent with repository at pilot end (checkpoint CHKPT) |

When the pilot passes, MS-03 (STG-01 + STG-02 complete) scales up per DOC-09.

## 8. Where Things Live (Quick Map)

| Need | Go to |
|------|-------|
| What to produce next | DOC-32 (scope) + DOC-11 (tasks) |
| Lesson status | DOC-22 (LESSONS_INDEX) |
| How to write a lesson | DOC-07 §3 |
| How to write a quiz | DOC-07 §5 + DOC-08 |
| Rubric format | DOC-08 §6 |
| Media rules | DOC-07 §6 |
| Registration of artifacts | DOC-21/22/27 |
| Review request | DOC-35 |
| Scope deviation | DOC-36 (CCR) |
| State reporting | DOC-19 §9 |
| Session end | DOC-12 (handover) + DOC-34 §5 |

## 9. Update Rules (Mandatory)

1. This document's §4–§5 are updated when tasks/batches change (PM), with DOC-13 entries.
2. Entry-point changes (reading order, §3) require PM + Governance Lead approval (L6 lock, DOC-30).
3. Version bumps per DOC-25; the document is re-verified at each batch start.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-38): Phase 1 entry point, reading order, first tasks, operating loop, boundaries, success criteria. |

## Notes

- Phase 1 is a **production** phase, not another planning phase — the planning is done and locked. Produce, register, review, and report.
- The most common failure mode is scope creep: when in doubt, re-read DOC-32 §5 before acting.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-31 PHASE_GATE](PHASE_GATE.md) | Gate that authorized Phase 1 |
| [DOC-32 PHASE_1_SCOPE](PHASE_1_SCOPE.md) | What to produce |
| [DOC-33 BASELINE_FINAL_SUMMARY](BASELINE_FINAL_SUMMARY.md) | Handoff note |
| [DOC-34 AGENT_STARTUP_CHECKLIST](AGENT_STARTUP_CHECKLIST.md) | Mandatory startup |
| [DOC-35 REVIEW_PROTOCOL](REVIEW_PROTOCOL.md) / [DOC-36 CHANGE_CONTROL](CHANGE_CONTROL.md) | Review & change paths |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | MS-02…06 batches |
| [DOC-19 PROJECT_STATE](PROJECT_STATE.md) | State reporting |
