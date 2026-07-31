# CHECKPOINTS — Checkpoint System

> **Document ID:** DOC-29 · **Status:** Active · **Owner:** Quality Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Checkpoint System |
| **Purpose** | Defines the project's checkpoint system: pre-defined moments in the workflow where state must be verified and recorded. Quality gates (DOC-16) review *deliverables*; checkpoints verify *process and state continuity* — that the repository's memory is coherent at key moments. |
| **Owner** | Quality Lead (role) |
| **Version** | 1.0.2 |
| **Status** | Active |
| **Dependencies** | DOC-16 (quality gates), DOC-19 (project state), DOC-13 (changelog), DOC-11 (tasks), DOC-09 (milestones) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Checkpoints run per §2 triggers; this document reviewed quarterly |

## Table of Contents

- [1. Purpose & Distinction](#1-purpose--distinction)
- [2. Checkpoint Types & Triggers](#2-checkpoint-types--triggers)
- [3. Checkpoint Record Format](#3-checkpoint-record-format)
- [4. Checkpoint Checklists](#4-checkpoint-checklists)
- [5. Checkpoint Log](#5-checkpoint-log)
- [6. Update Rules (Mandatory)](#6-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose & Distinction

| Aspect | Quality gates (DOC-16) | Checkpoints (this document) |
|--------|------------------------|------------------------------|
| Reviews | The **deliverable** (content, code, doc) | The **process/state** around the work |
| When | At task verification | At defined workflow moments (§2) |
| Fails when | Deliverable fails a gate | State is incoherent (drift, missed updates, stale snapshots) |
| Recorded in | Task verification (DOC-11) | Checkpoint log (CHKPT-NNN, §5) |

Checkpoints catch the failure mode gates cannot: *everything looks fine, but the repository's memory no longer matches reality* (risk R-G-01 doc drift).

## 2. Checkpoint Types & Triggers

| Type | Trigger | Who runs | Mandatory |
|------|---------|----------|-----------|
| **CHK-SESSION-START** | Beginning of any work session | Task owner | Yes |
| **CHK-TASK-START** | Claiming a task | Task owner | Yes |
| **CHK-TASK-END** | Marking a task Completed | Task owner | Yes |
| **CHK-MILESTONE** | Milestone start and completion | Project Manager + Quality Lead | Yes (at MS boundaries) |
| **CHK-PHASE** | Phase transition (e.g., before Phase 1) | Project Manager + Governance Lead | Yes |
| **CHK-PRE-PUSH** | Before pushing to the shared branch/PR | Task owner | Recommended |
| **CHK-REVIEW** | At independent review (TASK-102) | Reviewer | Yes (scheduled) |

## 3. Checkpoint Record Format

```markdown
### CHKPT-NNN — <Type> — <Date>
- **Type:** CHK-SESSION-START / CHK-TASK-START / CHK-TASK-END / CHK-MILESTONE / CHK-PHASE / CHK-PRE-PUSH / CHK-REVIEW
- **Agent / Reviewer:** AGT-NNN
- **Context:** task(s) / milestone / phase
- **Checks performed:** <items from §4 that apply>
- **Result:** Passed / Failed (items) / Passed with warnings
- **Actions taken:** <fixes or follow-up task IDs>
- **Evidence:** links (task board, changelog, state doc)
```

Records are append-only; a failed checkpoint spawns corrective tasks, never a rewrite of history.

## 4. Checkpoint Checklists

### 4.1 State coherence (all types)
- [ ] Task board (DOC-11): claimed tasks show correct status; completed tasks have dates + notes.
- [ ] Changelog (DOC-13): a CHG entry exists for every change made in the session/period.
- [ ] Project state (DOC-19): snapshots current; `Last Updated` matches today; no orphan facts.
- [ ] Registries (DOC-18/22/23/26/27/28): rows consistent with DOC-11/13 and the filesystem.
- [ ] No unrecorded assumptions in task notes (DOC-10 R-07).
- [ ] No broken internal links introduced (Gate D).

### 4.2 Milestone/phase checkpoints (additional)
- [ ] All milestone tasks Completed and verified (DOC-11).
- [ ] DOC-16 gates recorded for each deliverable.
- [ ] Roadmap (DOC-09) status updated; SYSTEM_MANIFEST (DOC-18) reconciled with reality.
- [ ] Risks reviewed (DOC-15); open decisions reviewed (DOC-28).
- [ ] Exit criteria of the milestone/phase documented (DOC-09 §5).
- [ ] Handovers for all agent-boundary work registered (DOC-12).

### 4.3 Pre-push checkpoint (additional)
- [ ] All new files registered in MASTER_INDEX (DOC-17).
- [ ] Naming/versioning conform to DOC-24/DOC-25.
- [ ] Changelog entry present for the pushed change.
- [ ] No merge to `main` performed (PR stays draft/open until review).

## 5. Checkpoint Log

### CHKPT-001 — CHK-MILESTONE — 2026-07-31
- **Type:** CHK-MILESTONE (MS-01 completion)
- **Agent:** AGT-001
- **Context:** MS-01 documentation baseline (TASK-001…018)
- **Checks performed:** 4.1/4.2 — links verified (124), header compliance (16 docs), counts verified programmatically, table integrity OK
- **Result:** Passed (baseline self-check; independent review scheduled as TASK-102)
- **Actions taken:** — (recorded as TASK-102)
- **Evidence:** DOC-11 (TASK-001…018), DOC-13 (CHG-001), DOC-09 (MS-01 Completed)

### CHKPT-002 — CHK-PHASE — 2026-07-31
- **Type:** CHK-PHASE (foundation extension — before Phase 1)
- **Agent:** AGT-001
- **Context:** Operating-documents extension (TASK-019…031)
- **Checks performed:** 4.1–4.3 — all 29 documents header-compliant; links re-verified; LESSONS_INDEX 156/156 vs DOC-03; registries consistent; no merge performed
- **Result:** Passed with warnings — items for Phase 1: TASK-102 (independent review), OPD-006 resolution, TASK-101 tooling (see PROJECT_STATE §8)
- **Actions taken:** recorded as next-agent tasks in DOC-19 §8 and HDO-002
- **Evidence:** DOC-19 §8, DOC-13 (CHG-002), HDO-002

### CHKPT-003 — CHK-PHASE — 2026-07-31
- **Type:** CHK-PHASE (foundation closure — GATE-F1)
- **Agent:** AGT-001
- **Context:** Foundation closure layer (DOC-30…38, TASK-033…041)
- **Checks performed:** 4.1–4.3 — 38 documents header-compliant; version consistency; link check; LESSONS_INDEX 156/156; registries (tasks 74, ADR-009, OPD-006 resolved, CHG-003) consistent; no merge performed; GATE-F1 criteria (DOC-37) all Pass
- **Result:** Passed — foundation complete; Phase 1 eligible per DOC-31/37
- **Actions taken:** Phase fields updated in DOC-19 §3; Phase-1 entry point issued (DOC-38)
- **Evidence:** DOC-37 §6 sign-off, DOC-13 (CHG-003), HDO-003

### CHKPT-004 — CHK-MILESTONE / CHK-SESSION-START — 2026-07-31
- **Type:** CHK-MILESTONE (MS-02 start — pilot) + CHK-SESSION-START (AGT-002)
- **Agent:** AGT-002 (Phase 1 Content Producer)
- **Context:** TASK-103 (P1-A pilot content production); startup checklist DOC-34 §3 completed (S-01…S-13)
- **Checks performed:** 4.1 — branch clean (S-01), mandatory reading done (S-02…S-09, S-12), AGT-002 registered (S-10), changelog/handovers reviewed (S-11), task claimed with notes (S-13); scope confirmed vs DOC-32 §3/§5
- **Result:** Passed — P1-A scope confirmed; production authorized
- **Actions taken:** produced 28 lessons + assessments; content registered in DOC-22 (In review)
- **Evidence:** DOC-11 (TASK-103), DOC-13 (CHG-004), HDO-004

> Next checkpoints: CHKPT-005 at MS-02 completion / Content Director review of P1-A (CHK-REVIEW), CHK-SESSION-START records by each future agent session, and GATE-F1's successor gates when defined.

## 6. Update Rules (Mandatory)

1. Run the applicable checklists (§4) at every trigger (§2); record the result in §5 before ending the session/task.
2. Checkpoint records are append-only (CHKPT-\d{3} per DOC-24).
3. Failed checkpoints create corrective tasks on the board (DOC-11) — never silent fixes.
4. This document's structure changes require Quality Lead approval + DOC-13 entry + version bump per DOC-25.
5. The Phase-1 transition (MS-02 start) requires a CHK-MILESTONE record before TASK-102/103 begin.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.2 | 2026-07-31 | AGT-002 | CHKPT-004 added (MS-02 start / AGT-002 session); next-checkpoint note updated (CHG-004). |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | CHKPT-003 added (foundation closure, GATE-F1); next-checkpoint note updated (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-29): types/triggers, record format, checklists, CHKPT-001/002. |

## Notes

- Checkpoints are lightweight by design — minutes, not hours; their value is in *timing* (before drift compounds).
- Automation of §4 items (link lint, header checks) is planned in MS-02 (TASK-101).

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Deliverable gates (complement) |
| [DOC-19 PROJECT_STATE](PROJECT_STATE.md) | State verified at checkpoints |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Corrective tasks from failures |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Evidence for checkpoints |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | Milestone boundaries |
| [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | CHKPT ID format |
