# RELEASE_CRITERIA — Release Criteria

> **Document ID:** DOC-37 · **Status:** Active · **Owner:** Project Manager (role)

| Field | Value |
|-------|-------|
| **Title** | Release Criteria |
| **Purpose** | Defines the explicit, checkable criteria for declaring (a) the **foundation phase complete** and (b) the project **eligible to begin Phase 1**. It is the criteria catalog executed by the phase gate [DOC-31](PHASE_GATE.md) and the evidence record of the sign-off. |
| **Owner** | Project Manager (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-31 (gate), DOC-30 (lock), DOC-16 (quality gates), DOC-09 (roadmap), DOC-19 (state) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | At every phase gate; criteria changes via CCR/ADR |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. Criteria Model](#2-criteria-model)
- [3. Scope of This Document](#3-scope-of-this-document)
- [4. Foundation-Complete Criteria (F-01…F-12)](#4-foundation-complete-criteria-f-01f-12)
- [5. Phase-1-Eligible Criteria (P1-01…P1-08)](#5-phase-1-eligible-criteria-p1-01p1-08)
- [6. Sign-Off Record](#6-sign-off-record)
- [7. Criteria Update Rules](#7-criteria-update-rules)
- [8. Update Rules (Mandatory)](#8-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

"Complete" and "eligible" are not feelings — they are checklists. This document is the authoritative list of what must be true to (1) close the foundation and (2) open Phase 1. It is executed verbatim by the phase gate (DOC-31 §5) and its results are signed off in §6.

## 2. Criteria Model

| Element | Definition |
|---------|-----------|
| Criterion ID | `F-NN` (foundation) or `P1-NN` (Phase 1 eligibility) |
| Verdict | `Pass` / `Fail` / `N/A` |
| Evidence | The artifact that proves the criterion (file, task, record, count) |
| Verifier | The role that checks it |
| Blocking | A Fail on any blocking criterion stops the gate |

All criteria are blocking unless marked "informational". A `Pass with notes` is not allowed — notes belong in the sign-off record but the verdict must be binary.

## 3. Scope of This Document

- **Foundation-complete criteria (§4)** — the foundation's Definition of Done. Passed means: *the documentation foundation is finished, locked, and truthful*.
- **Phase-1-eligible criteria (§5)** — the readiness conditions to start content production. Passed means: *Phase 1 may begin within DOC-32 scope*.
- Future phase criteria (Phase 2 etc.) will be added here as their gates are defined.

## 4. Foundation-Complete Criteria (F-01…F-12)

| ID | Criterion | Evidence | Verifier |
|----|-----------|----------|----------|
| F-01 | All 38 foundation documents exist, are header-compliant, and are cross-referenced | File inventory (DOC-17 §5); link check | Governance Lead |
| F-02 | Every document's header version matches its Revision History newest-first row | Scripted check (DOC-25) | Governance Lead |
| F-03 | All internal links resolve; no orphan files | Link-check run | Governance Lead |
| F-04 | Changelog current: every committed change has a CHG entry through CHG-003 | DOC-13 | Governance Lead |
| F-05 | Task board current: 74 tasks; 41 completed; statuses truthful | DOC-11 | Project Manager |
| F-06 | Decision log current: ADR-001…009 accepted; OPD states accurate | DOC-14/28 | Lead Architect |
| F-07 | Risk register current; top risks have owners and mitigations | DOC-15 | Risk Owner |
| F-08 | Registry integrity: LESSONS_INDEX 156/156 matches DOC-03; all statuses `Not started` | DOC-22 | Curriculum Director |
| F-09 | Policy lock in force: locked items unambiguously identified; no locked item changed without CCR/ADR | DOC-30 | Governance Lead |
| F-10 | Review model adopted (ADR-009) and OPD-006 marked Resolved | DOC-14 | Governance Lead |
| F-11 | Phase contract complete: gate, scope, change control, release criteria, Phase-1 entry exist (DOC-31/32/36/37/38) | Files exist + header-compliant | Governance Lead |
| F-12 | Baseline final summary written and handoff note issued (DOC-33) | DOC-33 | Governance Lead |

## 5. Phase-1-Eligible Criteria (P1-01…P1-08)

| ID | Criterion | Evidence | Verifier |
|----|-----------|----------|----------|
| P1-01 | GATE-F1 recorded as PASS with approver (user) | DOC-31 §6 | Project Manager |
| P1-02 | Phase fields updated: DOC-19 shows Phase 1 as current/next with no false blockers | DOC-19 §3 | Project Manager |
| P1-03 | Phase-1 scope defined with explicit in/out boundaries (P1-A: 28 lessons) | DOC-32 | Project Manager |
| P1-04 | Content standards + assessment standard are Active and unambiguous (DOC-07/08); `[TBD]` items flagged, none blocking pilot | DOC-07/08 | Content Director + Assessment Lead |
| P1-05 | Lesson registry ready: 28 P1-A lessons present with status `Not started` | DOC-22 | Curriculum Director |
| P1-06 | Review protocol in force (producer ≠ reviewer) and reviewer roles assigned for content | DOC-35 | Quality Lead |
| P1-07 | First tasks queued: TASK-102 → TASK-101 → TASK-103 with dependencies recorded | DOC-11 | Project Manager |
| P1-08 | Change-control path active for scope deviations (CCR-001 implemented) | DOC-36 §6 | Governance Lead |

## 6. Sign-Off Record

### Gate GATE-F1 — Foundation Complete & Phase 1 Eligible — 2026-07-31

| Criterion | Verdict | Evidence (link/file/record) |
|-----------|---------|------------------------------|
| F-01 | ✅ Pass | DOC-17 §5 inventory; verification run |
| F-02 | ✅ Pass | Version-consistency check (all 38 docs) |
| F-03 | ✅ Pass | Link check (all links resolve) |
| F-04 | ✅ Pass | DOC-13 through CHG-003 |
| F-05 | ✅ Pass | DOC-11 (74 tasks; 41 completed) |
| F-06 | ✅ Pass | DOC-14/28 (ADR-009 accepted; OPD-006 resolved) |
| F-07 | ✅ Pass | DOC-15 (29 risks, owners assigned) |
| F-08 | ✅ Pass | DOC-22 (156/156; all Not started) |
| F-09 | ✅ Pass | DOC-30 (17 locked items; no unapproved changes) |
| F-10 | ✅ Pass | DOC-14 ADR-009 |
| F-11 | ✅ Pass | DOC-31/32/36/37/38 exist, header-compliant |
| F-12 | ✅ Pass | DOC-33 issued |
| P1-01 | ✅ Pass | DOC-31 §6 (GATE-F1 PASS, user approver) |
| P1-02 | ✅ Pass | DOC-19 §3 |
| P1-03 | ✅ Pass | DOC-32 P1-A (28 lessons) |
| P1-04 | ✅ Pass | DOC-07/08 Active; TBDs flagged non-blocking |
| P1-05 | ✅ Pass | DOC-22 P1-A rows |
| P1-06 | ✅ Pass | DOC-35 + ADR-009 |
| P1-07 | ✅ Pass | DOC-11 (TASK-102/101/103) |
| P1-08 | ✅ Pass | DOC-36 CCR-001 |

**Sign-off:**

| Role | Name/Role | Verdict | Date |
|------|-----------|---------|------|
| Verifier | Governance Lead (AGT-001 baseline) | ✅ Pass | 2026-07-31 |
| Verifier | Quality Lead (AGT-001 baseline) | ✅ Pass | 2026-07-31 |
| Gate owner | Project Manager | ✅ Pass | 2026-07-31 |
| Final approver | Project Owner (user) | ✅ Pass | 2026-07-31 |

> **Result: Foundation COMPLETE. Phase 1 ELIGIBLE.** Independent baseline review (TASK-102) remains scheduled as the first Phase 1 task per DOC-31 §7 / DOC-38.

## 7. Criteria Update Rules

1. Criteria are added/removed/reworded only via CCR (L6 lock, DOC-30 LCK-15); ADR required if architectural.
2. Adding a criterion is MINOR; relaxing a criterion is MAJOR and requires PM + Governance Lead + user approval.
3. Sign-off records are append-only; a re-run of a gate adds a new record.

## 8. Update Rules (Mandatory)

1. Keep the criteria executable: every criterion must be verifiable from the repository alone.
2. After any gate run, update DOC-19/29/13 in the same change.
3. Version bump per DOC-25 on any criteria change.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-37): F-01…F-12, P1-01…P1-08, GATE-F1 sign-off (PASS). |

## Notes

- The GATE-F1 PASS is the formal record that Phase 1 may begin; it does not authorize platform work (that needs MS-07 + OPD-001…005).
- "N/A" verdicts are allowed only for criteria that do not apply to the gate being run — none applied to GATE-F1.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-31 PHASE_GATE](PHASE_GATE.md) | Executes this criteria catalog |
| [DOC-30 POLICY_LOCK](POLICY_LOCK.md) | Lock compliance (F-09) |
| [DOC-32 PHASE_1_SCOPE](PHASE_1_SCOPE.md) | Scope criteria (P1-03/05) |
| [DOC-35 REVIEW_PROTOCOL](REVIEW_PROTOCOL.md) | Review readiness (P1-06) |
| [DOC-33 BASELINE_FINAL_SUMMARY](BASELINE_FINAL_SUMMARY.md) | Foundation summary + handoff |
| [DOC-29 CHECKPOINTS](CHECKPOINTS.md) | CHKPT-003 evidence |
