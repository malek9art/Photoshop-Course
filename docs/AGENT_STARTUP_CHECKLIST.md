# AGENT_STARTUP_CHECKLIST — Mandatory Agent Startup Checklist

> **Document ID:** DOC-34 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Agent Startup Checklist |
| **Purpose** | The mandatory, checkable sequence every agent must complete **before modifying anything** in the repository, and the closure sequence before finishing. It operationalizes DOC-10 R-01 (read the documentation) into a concrete list with verification hooks. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.0 |
| **Status** | Active — mandatory for every agent, every session |
| **Dependencies** | DOC-10 (rules), DOC-17 (navigation), DOC-19 (state), DOC-26 (registry), DOC-11 (tasks), DOC-12 (handovers), DOC-13 (changelog) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Yearly, or when the reading order changes |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. When This Checklist Applies](#2-when-this-checklist-applies)
- [3. Startup Checklist (Before Any Change)](#3-startup-checklist-before-any-change)
- [4. Work-Period Checklist (During Work)](#4-work-period-checklist-during-work)
- [5. Closure Checklist (Before Ending the Session)](#5-closure-checklist-before-ending-the-session)
- [6. How to Prove Compliance](#6-how-to-prove-compliance)
- [7. Exceptions](#7-exceptions)
- [8. Update Rules (Mandatory)](#8-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

The startup checklist removes all ambiguity about "did I read enough before acting?". It converts DOC-10 R-01…R-10 from principles into a **binary checklist**. Compliance is provable: every item produces a trace (a note, a registration, a record).

**Core promise:** an agent that completes §3 before acting and §5 before leaving will never (a) act on stale state, (b) duplicate work, (c) break a locked decision, or (d) leave the next agent without context.

## 2. When This Checklist Applies

| Scenario | Required? |
|----------|-----------|
| Any session that will modify the repository | ✅ Always (§3 + §4 + §5) |
| Read-only session (inspection, review only) | ✅ §3 (read steps); §5 shortened (no writes) |
| Trivial fix (< 5 lines, documentation typo) | ✅ Still required; §3 can be completed in minutes |
| Emergency/hotfix | ✅ Required, with abbreviated evidence noted in DOC-13 |
| Platform implementation sessions (MS-08+) | ✅ Plus the platform-specific checklist defined at MS-07 |

## 3. Startup Checklist (Before Any Change)

> Order matters. Complete top-to-bottom before the first modification.

| # | Item | Where to verify/record | Done |
|---|------|------------------------|------|
| S-01 | Confirm you are on the correct session branch (`arena/…`) and nothing is uncommitted from another agent | `git status`, `git branch` | ☐ |
| S-02 | Read `AGENTS.md` (entry instructions) | — | ☐ |
| S-03 | Read [MASTER_INDEX](MASTER_INDEX.md) (DOC-17) — locate every document you will touch | DOC-17 §5 | ☐ |
| S-04 | Read [PROJECT_STATE](PROJECT_STATE.md) (DOC-19) — current phase, tasks, blockers | DOC-19 §3–§8 | ☐ |
| S-05 | Read [POLICY_LOCK](POLICY_LOCK.md) (DOC-30) — confirm your task touches nothing locked | DOC-30 §3 | ☐ |
| S-06 | Read [DOC-10 Agent Rules](10_AGENT_RULES.md) — binding rules | — | ☐ |
| S-07 | Read [DOC-11 Task Management](11_TASK_MANAGEMENT.md) — claim your task (set In Progress + assign) | DOC-11 | ☐ |
| S-08 | Read the task-relevant blueprints (DOC-01…08 per task type) and standards (DOC-07/08 for content) | — | ☐ |
| S-09 | Read [CHANGE_CONTROL](CHANGE_CONTROL.md) (DOC-36) + [REVIEW_PROTOCOL](REVIEW_PROTOCOL.md) (DOC-35) — confirm your change type and review path | — | ☐ |
| S-10 | Register/confirm your identity in [AGENT_REGISTRY](AGENT_REGISTRY.md) (AGT-NNN) | DOC-26 §3 | ☐ |
| S-11 | Read the latest CHG entries (DOC-13) and the most recent HDO handover — check for prior/related work | DOC-13, `docs/handovers/` | ☐ |
| S-12 | If Phase 1 work: read [PHASE_1_SCOPE](PHASE_1_SCOPE.md) (DOC-32) + [PHASE_1_README](PHASE_1_README.md) (DOC-38) and confirm your task is in scope | DOC-32 §3/§5 | ☐ |
| S-13 | Record in your task Notes: date, assumptions, intended approach, and the checklist completion | DOC-11 Notes | ☐ |

**Gate:** if S-01…S-13 are not complete, do not modify anything.

## 4. Work-Period Checklist (During Work)

| # | Item | Where |
|---|------|-------|
| W-01 | Make small, reviewable changes; one logical unit per commit (DOC-10 §5) | git |
| W-02 | Follow naming/ID formats (DOC-24) and version discipline (DOC-25) | — |
| W-03 | Respect the scope boundary (DOC-32 for Phase 1); no scope creep | DOC-32 §5 |
| W-04 | Record decisions as they happen (ADR) and assumptions in task notes (DOC-10 R-06/R-07) | DOC-14, DOC-11 |
| W-05 | Register produced artifacts immediately: lessons (DOC-22), knowledge (DOC-21), prompts (DOC-27) | registries |
| W-06 | Run self-review against applicable DOC-16 gates before requesting review | DOC-16 §10 |
| W-07 | Update DOC-19 snapshots per its §9 protocol as state changes | DOC-19 |

## 5. Closure Checklist (Before Ending the Session)

| # | Item | Where | Done |
|---|------|------|------|
| C-01 | Task status → `Completed` (or `Blocked` with reason); completion date + notes written | DOC-11 | ☐ |
| C-02 | Changelog entry appended (CHG-NNN) with versions before → after | DOC-13 | ☐ |
| C-03 | Affected documents updated with version bumps + revision history (newest-first) | docs | ☐ |
| C-04 | Registries updated (LESSONS_INDEX, KNOWLEDGE_BASE, PROMPTS, OPEN_DECISIONS, DEPENDENCIES, SYSTEM_MANIFEST as applicable) | DOC-18, 21–23, 27–28 | ☐ |
| C-05 | Handover completed and stored (`HDO-NNN_<TASK>_<date>.md`) + linked from task Notes | DOC-12, `docs/handovers/` | ☐ |
| C-06 | Checkpoint recorded if a checkpoint type was triggered (CHKPT-NNN) | DOC-29 | ☐ |
| C-07 | No scratch files left in the repository; no uncommitted work | git status | ☐ |
| C-08 | No merge to `main` performed; work pushed only to the session branch | git | ☐ |

**Gate:** the session is not finished until C-01…C-08 are complete (DOC-10 §7 Definition of Done).

## 6. How to Prove Compliance

1. **Evidence per item:** task Notes record the checklist date + IDs; the changelog entry lists affected docs; the handover links everything.
2. **Reviewers check startup/closure compliance** as part of DOC-16 Gate G (Documentation Review) and DOC-35 review protocol.
3. **Audits (TASK-102, quarterly):** sample sessions verify that the checklist was followed; violations are recorded in DOC-15/13.

## 7. Exceptions

- **Read-only sessions:** §3 required (no claim needed — mark "inspection"), §4/§5 not applicable.
- **User-directed work outside the checklist:** the user's explicit instruction wins, but the deviation and its reason are recorded in DOC-13 and task notes (DOC-10 §9).
- Everything else is non-negotiable; a request to "skip the checklist" is escalated to the Governance Lead.

## 8. Update Rules (Mandatory)

1. This checklist changes only via CCR/ADR (locked at L6 via DOC-30 LCK-15).
2. Additions to the checklist (new items) are MINOR bumps; removals/relaxations are MAJOR and require Governance Lead + user approval.
3. Every change recorded in DOC-13.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-34): 13 startup items, 7 work items, 8 closure items, compliance & exception rules. |

## Notes

- The checklist is designed to take minutes, not hours — most items are "open and skim", not deep study. The one genuinely time-consuming step (reading task-relevant blueprints) is the step that prevents rework.
- If you find yourself skipping items because they are "obviously fine", record that you checked them anyway — that is the point.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-10 Agent Rules](10_AGENT_RULES.md) | Rules this checklist operationalizes |
| [DOC-17 MASTER_INDEX](MASTER_INDEX.md) | Reading-order authority |
| [DOC-19 PROJECT_STATE](PROJECT_STATE.md) | State to read at startup |
| [DOC-30 POLICY_LOCK](POLICY_LOCK.md) | Lock check (S-05) |
| [DOC-35 REVIEW_PROTOCOL](REVIEW_PROTOCOL.md) | Review path (S-09) |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Self-review (W-06) |
| [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) | Closure (C-05) |
