# 12 — Agent Handover

> **Document ID:** DOC-12 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Agent Handover System |
| **Purpose** | Defines the mandatory handover system: when handovers are required, what they must contain, where they are stored, how they are named, and how they are reviewed. A fillable template lives at [`templates/HANDOVER_TEMPLATE.md`](templates/HANDOVER_TEMPLATE.md). |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.3 |
| **Status** | Active — completing a handover is part of every agent's Definition of Done (DOC-10 R-10) |
| **Dependencies** | DOC-10 (rules), DOC-11 (tasks), DOC-13 (changelog), DOC-14 (decisions) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Continuous; quarterly sampling for quality |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. When a Handover Is Mandatory](#2-when-a-handover-is-mandatory)
- [3. Handover Contents (Ten Sections)](#3-handover-contents-ten-sections)
- [4. Naming & Storage Conventions](#4-naming--storage-conventions)
- [5. Quality Rules for Handovers](#5-quality-rules-for-handovers)
- [6. Handover Review](#6-handover-review)
- [7. Example Handover (HDO-001)](#7-example-handover-hdo-001)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

AI agents work asynchronously and do not share memory. The **handover is the transfer of working memory** from one agent session to the next. A good handover lets a fresh agent resume work in minutes; a missing handover can destroy days of context. Therefore the handover is **mandatory** and its quality is part of task verification (DOC-11 §4).

## 2. When a Handover Is Mandatory

| Situation | Requirement |
|-----------|-------------|
| End of any agent session that changed the repository | Mandatory — always |
| Task completed and marked `Completed` in DOC-11 | Mandatory |
| Task paused mid-way (status remains `In Progress`) | Mandatory — "interim handover" so no work is lost |
| Abrupt session end / context limit | Mandatory — write it before any final output; if truly impossible, leave state in task Notes and flag `URGENT: handover needed` |
| Task `Blocked` | Recommended — record blocker + investigation results |

A handover is written from the perspective of the **next agent** (what does the next agent need to know?).

## 3. Handover Contents (Ten Sections)

Every handover **must** contain the following ten sections, in order (see template):

| # | Section | Content requirements |
|---|---------|----------------------|
| 1 | **Summary** | 3–5 sentences: what was done, current state, what happens next |
| 2 | **Files Modified** | Complete list of files created/changed/deleted, with one-line reason each (paths relative to repo root) |
| 3 | **Work Completed** | Deliverables against the task description; links to task ID and changelog entries |
| 4 | **Remaining Work** | Precise next steps, ordered; what is unfinished and why |
| 5 | **Known Problems** | Open defects, risky areas, unfinished corners — with severity and where they manifest |
| 6 | **Recommendations** | Concrete suggestions for the next agent/reviewer |
| 7 | **Architecture Decisions** | Decisions made during the task; ADR IDs if recorded (DOC-14) |
| 8 | **Risks** | New or changed risks; reference RISK IDs (DOC-15) |
| 9 | **Future Improvements** | Ideas deliberately not done now (avoid scope creep); parked as task suggestions |
| 10 | **Lessons Learned** | What this session learned that future agents should know (process, tools, content, collaboration) |

**Metadata header (required):** HDO ID, Task ID(s), Agent, Date, Milestone, Status of work (complete/interim), Prerequisites for the next agent (what to read first).

## 4. Naming & Storage Conventions

- **Location:** `docs/handovers/`
- **Filename:** `HDO-NNN_<TASK-ID>_<YYYY-MM-DD>.md` — e.g., `HDO-002_TASK-207_2026-09-14.md`
- **HDO numbering:** next free sequential `HDO-NNN` (see the index in `docs/handovers/README.md`)
- **Registration:** after saving, add a one-line entry to `docs/handovers/README.md` index and link the HDO ID in the task's Notes (DOC-11).
- Handovers are immutable once written; corrections add a new version section (never edit history).

## 5. Quality Rules for Handovers

1. **Specific over general.** "Fixed the RTL mirror bug in SCR-10 progress bar" beats "fixed bugs".
2. **Path-accurate.** Every file path must exist or be clearly marked as intended.
3. **Decision-linked.** Claims about decisions cite ADR IDs or the DOC-14 Open Decision list.
4. **No secrets.** No credentials, tokens, or personal data in handovers.
5. **Length discipline.** Aim 200–600 words for typical tasks; longer allowed for complex ones. Density over length.
6. **Fresh-agent test.** Before finishing: "Can an agent with zero prior context continue from this document alone?" If not, expand.

## 6. Handover Review

- Handover quality is checked by the task reviewer (DOC-11 §4) as part of verification; missing/inadequate handovers fail the task's verification.
- Quarterly, the Governance Lead samples 3 handovers for quality trends (feed into DOC-15 R-G-01 risk of knowledge loss).

## 7. Example Handover (HDO-001)

The documentation baseline session produced the first handover as a reference example:

| Field | Value |
|-------|-------|
| HDO ID | HDO-001 |
| Task IDs | TASK-001…018 |
| Agent | Project Foundation Architect (session `arena/019fb8fa-photoshop-course`) |
| Date | 2026-07-31 |
| Milestone | MS-01 |
| Status | Complete (baseline) |

**Summary:** Created the complete documentation and governance baseline for the Adobe Creative Academy: 16 documents (DOC-01…16), root entry points (README.md, AGENTS.md), handover template, and handover folder. The repository now has a Single Source of Truth from which all future agents work. No source code, content, or lessons were created by design (project is in foundation phase).

**Files Modified:** All files in this repository (see git history); 20 new files total.

**Work Completed:** TASK-001…018 (see DOC-11 §5). All documents versioned 1.0.0, dated 2026-07-31, cross-referenced.

**Remaining Work:** MS-02 (governance tooling + independent review + pilot content) — first tasks to claim: TASK-101…103.

**Known Problems:** None blocking. Open `[TBD]` values are intentional (brand tokens, final exam retake cap, AI-disclosure details) and tracked in DOC-06/DOC-08 with clear gates.

**Recommendations:** 1) Begin with TASK-102 (independent baseline review) to validate this foundation. 2) Resolve OPD-001/002 before any coding. 3) Use the pilot content (TASK-103) to pressure-test DOC-07/08.

**Architecture Decisions:** ADR-001…008 (see DOC-14).

**Risks:** See DOC-15 baseline; highest: doc drift (R-G-01) and content production velocity (R-E-02).

**Future Improvements:** Consider automated doc-link/ID validation in MS-02; consider a docs lint pipeline.

**Lessons Learned:** (1) Fixed ID schemes (DOC-XX, TASK-NNN, ADR-NNN, RISK-NNN, HDO-NNN) made cross-referencing tractable; (2) append-only changelog/decision/risk logs keep history trustworthy; (3) keeping blueprints logical/technology-agnostic preserved decision space for later ADRs.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.3 | 2026-07-31 | AGT-002 | HDO-004 registered for the P1-A pilot content (TASK-103); index updated (CHG-004). |
| 1.0.2 | 2026-07-31 | Project Foundation Architect | HDO-003 registered for the foundation closure (TASK-033…041); index updated (CHG-003). |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | HDO-002 registered for the operating-documents extension (TASK-019…032); index updated (CHG-002). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-12): policy, ten-section contents, conventions, example HDO-001. |

## Notes

- The fillable blank template is at [`templates/HANDOVER_TEMPLATE.md`](templates/HANDOVER_TEMPLATE.md) — copy it, never edit it in place (keep the master blank).
- Completed handovers live in [`docs/handovers/`](handovers/).

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-10 Agent Rules](10_AGENT_RULES.md) | R-10 makes handovers mandatory |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Task Notes link HDO IDs; verification checks handovers |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Changelog records what; handover records how/why |
| [DOC-14 Decision Log](14_DECISION_LOG.md) | ADRs cited in handover §7 |
| [Templates](templates/HANDOVER_TEMPLATE.md) | Blank template |
