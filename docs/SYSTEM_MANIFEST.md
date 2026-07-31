# SYSTEM_MANIFEST — System State Manifest

> **Document ID:** DOC-18 · **Status:** Active · **Owner:** Lead Architect (role)

| Field | Value |
|-------|-------|
| **Title** | System Manifest |
| **Purpose** | The authoritative, live registry of the implementation state of every system component, subsystem, and repository artifact. DOC-02 describes the *designed* system; this manifest records *what actually exists* and its maturity. It is the first place a platform agent checks before touching any subsystem. |
| **Owner** | Lead Architect (role) |
| **Version** | 1.0.2 |
| **Status** | Active |
| **Dependencies** | DOC-02 (component/subsystem definitions), DOC-05 (entities), DOC-09 (roadmap), DOC-11 (tasks), DOC-25 (versioning) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Every task completion that touches a component; full sweep at each milestone |

## Table of Contents

- [1. Purpose & Design-vs-State Principle](#1-purpose--design-vs-state-principle)
- [2. How Agents Must Use This Document](#2-how-agents-must-use-this-document)
- [3. Status Values](#3-status-values)
- [4. Component Status Registry](#4-component-status-registry)
- [5. Subsystem Status Registry](#5-subsystem-status-registry)
- [6. Artifact & Repository Manifest](#6-artifact--repository-manifest)
- [7. Completion & Status Field](#7-completion--status-field)
- [8. Update Rules (Mandatory)](#8-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose & Design-vs-State Principle

**Core principle:** [DOC-02](02_SYSTEM_ARCHITECTURE.md) is the *design* — it defines what the system must be and must not change casually. This manifest is the *state* — it records maturity and may change with every task. Agents must **never edit DOC-02 to reflect status** (that is doc drift, risk R-G-01); status edits belong here.

This document therefore answers the questions: *"Has component C-07 been built?"*, *"Which subsystems exist?"*, *"What is the current maturity of the platform?"*

## 2. How Agents Must Use This Document

1. **Before platform work:** read this manifest to learn the current maturity of every component you will touch (DOC-18) — not just the design (DOC-02).
2. **Before claiming platform tasks:** confirm the task's target components are still at the expected status; a mismatch is a blocker to record (DOC-11).
3. **After completing any task that creates/changes system artifacts:** update the affected rows here (§8) in the same change.
4. **At milestone boundaries:** verify the manifest matches reality as part of DOC-29 checkpoints and DOC-16 Gate A/F reviews.

## 3. Status Values

| Status | Meaning |
|--------|---------|
| 🟦 **Planned** | Defined in DOC-02 but not started; no artifacts exist |
| 🟨 **In progress** | Artifacts exist in development; not production-ready |
| 🟩 **Implemented** | Meets its DOC-16 gates; usable in the current environment (MVP/GA) |
| 🟧 **Blocked** | Cannot progress until an OPD/ADR or dependency resolves |
| 🟥 **Deferred/Retired** | Removed from active scope; retained for history |

Maturity levels are recorded per row in the **Maturity** column: `Design → Spec → Prototype → Implemented → Verified`.

## 4. Component Status Registry

| ID | Component (DOC-02 §4) | Status | Maturity | Implemented by (task/milestone) | Manifest notes |
|----|-----------------------|--------|----------|-------------------------------|----------------|
| C-01 | Web App (PWA) | 🟦 Planned | Design | MS-08 (TASK-205…210) | None built — documentation only |
| C-02 | Admin Console | 🟦 Planned | Design | MS-10 (TASK-213…215) | None built |
| C-03 | Public Verification Page | 🟦 Planned | Design | MS-09 (TASK-212) | None built |
| C-04 | API Gateway / BFF | 🟦 Planned | Design | MS-07/08 (TASK-201, 205) | Requires OPD-001 |
| C-05 | Auth & Session Service | 🟦 Planned | Design | MS-08 (TASK-205) | Requires OPD-001 |
| C-06 | Catalog & Curriculum Module | 🟦 Planned | Design | MS-08 (TASK-206) | Requires OPD-001/002 |
| C-07 | Learning Engine | 🟦 Planned | Design | MS-08 (TASK-207) | Requires OPD-001/002/003 |
| C-08 | Assessment Module | 🟦 Planned | Design | MS-08/09 (TASK-208, 211) | Requires OPD-001/002 |
| C-09 | Certification Module | 🟦 Planned | Design | MS-09 (TASK-212) | Requires C-08 |
| C-10 | Progress & Analytics Module | 🟦 Planned | Design | MS-08/10 (TASK-209, 215) | Requires OPD-002 |
| C-11 | User & Access Module | 🟦 Planned | Design | MS-08 (TASK-205) | Requires OPD-001 |
| C-12 | Content Management Module | 🟦 Planned | Design | MS-10 (TASK-214) | Requires OPD-002 |
| C-13 | Notification Module | 🟦 Planned | Design | MS-08 (TASK-209) | Requires OPD-003 |
| C-14 | Search Module | 🟦 Planned | Design | MS-08 (TASK-210) | Arabic tokenization requirement (DOC-04 SCR-18) |
| C-15 | Community & Engagement Module | 🟦 Planned (future) | Design | MS-14 (TASK-305) | Out of v1 scope; ADR-gated |

## 5. Subsystem Status Registry

| Subsystem (DOC-02 §5) | Components | Status | Maturity |
|-----------------------|------------|--------|----------|
| Learner Experience | C-01, C-04, C-05, C-06, C-07, C-08, C-09, C-10, C-13, C-14 | 🟦 Planned | Design |
| Content Production | C-02, C-12 + media pipeline | 🟦 Planned | Design |
| Assessment & Certification | C-08, C-09, C-10, C-03 | 🟦 Planned | Design |
| Operations & Administration | C-02, C-11, C-10 | 🟦 Planned | Design |
| Platform Foundation | C-04, C-05, C-13 + data/observability | 🟦 Planned | Design |

## 6. Artifact & Repository Manifest

| Artifact group | Location | Status | Notes |
|----------------|----------|--------|-------|
| Governance & blueprint docs | `docs/` (DOC-01…16) | 🟩 Implemented | Baseline 1.0.0 |
| Operating docs | `docs/` (DOC-17…29) | 🟩 Implemented | Baseline 1.0.0 (extension) |
| Closure & phase-contract docs | `docs/` (DOC-30…38) | 🟩 Implemented | Baseline 1.0.0 (closure batch, CHG-003) |
| Handover template | `docs/templates/HANDOVER_TEMPLATE.md` | 🟩 Implemented | 1.0.0 |
| Completed handovers | `docs/handovers/` | 🟩 Implemented | HDO-001 (baseline), HDO-002 (extension), HDO-003 (closure) |
| Platform source code | `app/` | — (absent) | Do not create before MS-08 (DOC-10 P-12) |
| Curriculum content packages | `content/` | 🟨 In progress | P1-A pilot created (TASK-103, AGT-002): 28 lessons + 6 quizzes + STG-01 exam/placement/project — lessons `In review` (DOC-22); `content/README.md` manifest |
| Admin tooling | `admin/` | — (absent) | Do not create before its milestone |
| Media assets | (to be defined) | — (absent) | Pipeline decision OPD-004 |

## 7. Completion & Status Field

| Field | Value |
|-------|-------|
| **Overall platform status** | 🟦 Planned — no implementation artifacts exist (documentation-only phase, MS-01 complete) |
| **Documentation system status** | 🟩 Complete (DOC-01…29 baseline) |
| **Manifest version** | 1.0.0 |
| **Last reconciled with filesystem** | 2026-07-31 |
| **Next reconciliation** | MS-07 (before first code), then at every milestone |

## 8. Update Rules (Mandatory)

1. **Component/sub-system status:** update the row's Status and Maturity in the same change that delivers the task (never later).
2. **Blocked components:** set Status = 🟧 and record the blocking OPD/ADR in the row and in DOC-28/DOC-14.
3. **New components:** new C-NN IDs are assigned only through an ADR (DOC-14); then registered here and in DOC-02 §4.
4. **Artifact manifest:** add/remove rows when directories or artifact groups appear or are retired; keep the Planned-directory rows until the milestone starts.
5. **Version bump:** any status change bumps MINOR per DOC-25; the revision history records the change.
6. **Verification:** DOC-16 Gate A (architecture) and Gate F (scalability) reviews must reconcile this manifest with reality; discrepancies are raised as task-board blockers.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.2 | 2026-07-31 | AGT-002 | Artifact manifest: `content/` created with P1-A pilot (28 lessons In review); completed handovers include HDO-004 (CHG-004). |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | Artifact manifest extended: closure docs DOC-30…38, HDO-003; overall status updated (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-18): 15 components, 5 subsystems, artifact manifest — all Planned/Implemented-docs state. |

## Notes

- "Implemented" in this manifest means *meets its DOC-16 gates*, not merely "code exists".
- The manifest is state, not design; design changes belong in DOC-02 via ADR (DOC-14) first.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | Design authority for components C-01…15 |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | Milestones that move statuses |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Tasks that change statuses |
| [DOC-28 OPEN_DECISIONS](OPEN_DECISIONS.md) | Blocking OPDs for components |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Gates that define Implemented |
