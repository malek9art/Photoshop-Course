# MASTER_INDEX — Master Navigation Index

> **Document ID:** DOC-17 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Master Index (Master Navigation Order) |
| **Purpose** | The canonical navigation map of the entire repository: every document, directory, and artifact, plus the **master navigation order** every agent must follow. If an agent does not know where to start, it starts here. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.1.0 |
| **Status** | Active |
| **Dependencies** | README.md, AGENTS.md, all documents DOC-01…DOC-38 (this index covers them all) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Every time a document is added/removed/renamed; otherwise quarterly |

## Table of Contents

- [1. Purpose & Authority](#1-purpose--authority)
- [2. How Agents Must Use This Document](#2-how-agents-must-use-this-document)
- [3. Repository Map](#3-repository-map)
- [4. Master Navigation Order](#4-master-navigation-order)
- [5. Complete Document Inventory](#5-complete-document-inventory)
- [6. ID Family Quick Reference](#6-id-family-quick-reference)
- [7. Navigation Rules](#7-navigation-rules)
- [8. Completion & Status Field](#8-completion--status-field)
- [9. Update Rules (Mandatory)](#9-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose & Authority

This document is the **navigation authority** for the repository. README.md explains *what the project is*; this index explains *where everything is and in what order it must be read*. Together with [`AGENTS.md`](../AGENTS.md) and [DOC-10 Agent Rules](10_AGENT_RULES.md), it guarantees that no agent ever works from an incomplete picture.

**Relationship with README.md:** README.md is the human-facing entry point; this document is the exhaustive machine-and-agent-facing map. When they conflict, this document is authoritative for navigation, README for summary content.

## 2. How Agents Must Use This Document

1. Read this document **immediately after** `AGENTS.md` and before any other document.
2. Use [§4 Master Navigation Order](#4-master-navigation-order) to decide your reading sequence for the task type you claimed (DOC-11).
3. Use [§5 Complete Document Inventory](#5-complete-document-inventory) to locate the authoritative document for any topic — never rely on memory or hearsay.
4. When you create or retire any file, apply [§9 Update Rules](#9-update-rules-mandatory) and update this index in the same change.

## 3. Repository Map

```
/
├── README.md                      ← Project hub (summary + entry)
├── AGENTS.md                      ← Mandatory first read (entry instructions)
├── docs/
│   ├── 01_PROJECT_VISION.md        … 16_QUALITY_CHECKLIST.md   (blueprints & governance, DOC-01…16)
│   ├── MASTER_INDEX.md             (this file, DOC-17)
│   ├── SYSTEM_MANIFEST.md          (DOC-18)
│   ├── PROJECT_STATE.md            (DOC-19)
│   ├── AI_MEMORY.md                (DOC-20)
│   ├── KNOWLEDGE_BASE.md           (DOC-21)
│   ├── LESSONS_INDEX.md            (DOC-22)
│   ├── DEPENDENCIES.md             (DOC-23)
│   ├── NAMING_CONVENTION.md        (DOC-24)
│   ├── VERSIONING_POLICY.md        (DOC-25)
│   ├── AGENT_REGISTRY.md           (DOC-26)
│   ├── PROMPTS.md                  (DOC-27)
│   ├── OPEN_DECISIONS.md           (DOC-28)
│   ├── CHECKPOINTS.md              (DOC-29)
│   ├── POLICY_LOCK.md              (DOC-30 — policy lock)
│   ├── PHASE_GATE.md               (DOC-31 — phase gate)
│   ├── PHASE_1_SCOPE.md            (DOC-32 — Phase 1 scope)
│   ├── BASELINE_FINAL_SUMMARY.md   (DOC-33 — foundation summary/handoff)
│   ├── AGENT_STARTUP_CHECKLIST.md  (DOC-34 — startup checklist)
│   ├── REVIEW_PROTOCOL.md          (DOC-35 — review protocol)
│   ├── CHANGE_CONTROL.md           (DOC-36 — change control)
│   ├── RELEASE_CRITERIA.md         (DOC-37 — release criteria)
│   ├── PHASE_1_README.md           (DOC-38 — Phase 1 entry point)
│   ├── templates/
│   │   └── HANDOVER_TEMPLATE.md    ← blank handover template
│   └── handovers/                  ← completed handovers HDO-NNN + index
├── app/                            ← [PLANNED] platform source code — do not create before MS-08
├── content/                        ← [PLANNED] curriculum content packages — do not create before MS-02/03
└── admin/                          ← [PLANNED] operational tooling — do not create before its milestone
```

Planned directories must **not** be created early (DOC-09, DOC-10 P-12).

## 4. Master Navigation Order

### Tier 0 — Entry (every agent, every session)

| Step | Document | Purpose |
|------|----------|---------|
| 0.1 | [`AGENTS.md`](../AGENTS.md) | Entry instructions |
| 0.2 | **this document (DOC-17)** | Navigation map |
| 0.3 | [DOC-19 PROJECT_STATE](PROJECT_STATE.md) | Where the project stands right now |

### Tier 0.5 — Foundation closure & phase contract (every agent, before any change)

| Step | Document | Purpose |
|------|----------|---------|
| 0.4 | [DOC-30 POLICY_LOCK](POLICY_LOCK.md) | What is frozen; what needs CCR/ADR |
| 0.5 | [DOC-34 AGENT_STARTUP_CHECKLIST](AGENT_STARTUP_CHECKLIST.md) | Mandatory startup checklist |
| 0.6 | [DOC-36 CHANGE_CONTROL](CHANGE_CONTROL.md) | How deliberate changes are approved |
| 0.7 | [DOC-35 REVIEW_PROTOCOL](REVIEW_PROTOCOL.md) | How changes are reviewed |
| 0.8 | [DOC-33 BASELINE_FINAL_SUMMARY](BASELINE_FINAL_SUMMARY.md) | Foundation summary & handoff |

> **Phase 1 agents additionally read:** [DOC-38 PHASE_1_README](PHASE_1_README.md) (entry), [DOC-32 PHASE_1_SCOPE](PHASE_1_SCOPE.md) (scope), [DOC-37 RELEASE_CRITERIA](RELEASE_CRITERIA.md) + [DOC-31 PHASE_GATE](PHASE_GATE.md) (gate/eligibility).

### Tier 1 — Operating rules (before any change)

| Step | Document | Purpose |
|------|----------|---------|
| 1.1 | [DOC-10 Agent Rules](10_AGENT_RULES.md) | Binding operating rules |
| 1.2 | [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Claim your task |
| 1.3 | [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | What already happened (read latest entries) |
| 1.4 | [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | ID/file naming authority |
| 1.5 | [DOC-25 VERSIONING_POLICY](VERSIONING_POLICY.md) | Version bump rules |

### Tier 2 — Blueprints (before content/code work, per task type)

| Step | Document | Apply when |
|------|----------|-----------|
| 2.1 | [DOC-01 Project Vision](01_PROJECT_VISION.md) | Always (mission) |
| 2.2 | [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | Any platform/architecture work |
| 2.3 | [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Curriculum/content work |
| 2.4 | [DOC-04 UI Blueprint](04_UI_BLUEPRINT.md) | UI work |
| 2.5 | [DOC-05 Database Blueprint](05_DATABASE_BLUEPRINT.md) | Data/schema work |
| 2.6 | [DOC-06 Design System](06_DESIGN_SYSTEM.md) | Visual/UX work |
| 2.7 | [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Content production |
| 2.8 | [DOC-08 Assessment Standard](08_ASSESSMENT_STANDARD.md) | Assessments/certificates |

### Tier 3 — State & tracking (during and after work)

| Step | Document | Purpose |
|------|----------|---------|
| 3.1 | [DOC-22 LESSONS_INDEX](LESSONS_INDEX.md) | Register lessons as they are produced |
| 3.2 | [DOC-23 DEPENDENCIES](DEPENDENCIES.md) | Declare/check dependencies |
| 3.3 | [DOC-28 OPEN_DECISIONS](OPEN_DECISIONS.md) | Track open decisions |
| 3.4 | [DOC-27 PROMPTS](PROMPTS.md) | Record prompts |
| 3.5 | [DOC-29 CHECKPOINTS](CHECKPOINTS.md) | Run checkpoints |
| 3.6 | [DOC-14 Decision Log](14_DECISION_LOG.md) / [DOC-15 Risk Register](15_RISK_REGISTER.md) | Record decisions/risks |
| 3.7 | [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) + [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Finish: verify + hand over |
| 3.8 | [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) / [DOC-18 SYSTEM_MANIFEST](SYSTEM_MANIFEST.md) | Update milestone/component state |

## 5. Complete Document Inventory

### 5.1 Blueprints & governance core (DOC-01…DOC-16)

| ID | File | Purpose | Status |
|----|------|---------|--------|
| DOC-01 | [01_PROJECT_VISION.md](01_PROJECT_VISION.md) | Mission, goals, personas, metrics | Active |
| DOC-02 | [02_SYSTEM_ARCHITECTURE.md](02_SYSTEM_ARCHITECTURE.md) | Architecture design (components C-01…15) | Active |
| DOC-03 | [03_CURRICULUM_BLUEPRINT.md](03_CURRICULUM_BLUEPRINT.md) | Curriculum skeleton (8 stages / 33 modules / 156 lessons) | Active |
| DOC-04 | [04_UI_BLUEPRINT.md](04_UI_BLUEPRINT.md) | All screens SCR-01…29 | Active |
| DOC-05 | [05_DATABASE_BLUEPRINT.md](05_DATABASE_BLUEPRINT.md) | Logical entities ENT-* | Active |
| DOC-06 | [06_DESIGN_SYSTEM.md](06_DESIGN_SYSTEM.md) | Visual/brand/typography/a11y | Active |
| DOC-07 | [07_CONTENT_STANDARDS.md](07_CONTENT_STANDARDS.md) | Content production standards | Active |
| DOC-08 | [08_ASSESSMENT_STANDARD.md](08_ASSESSMENT_STANDARD.md) | Assessment & certification | Active |
| DOC-09 | [09_PROJECT_ROADMAP.md](09_PROJECT_ROADMAP.md) | Milestones MS-01…14 | Active |
| DOC-10 | [10_AGENT_RULES.md](10_AGENT_RULES.md) | Binding agent rules | Active |
| DOC-11 | [11_TASK_MANAGEMENT.md](11_TASK_MANAGEMENT.md) | Task board | Active |
| DOC-12 | [12_AGENT_HANDOVER.md](12_AGENT_HANDOVER.md) | Handover system | Active |
| DOC-13 | [13_PROJECT_CHANGELOG.md](13_PROJECT_CHANGELOG.md) | Append-only changelog | Active |
| DOC-14 | [14_DECISION_LOG.md](14_DECISION_LOG.md) | ADRs + OPDs (authority) | Active |
| DOC-15 | [15_RISK_REGISTER.md](15_RISK_REGISTER.md) | Risk register | Active |
| DOC-16 | [16_QUALITY_CHECKLIST.md](16_QUALITY_CHECKLIST.md) | Quality gates A…G | Active |

### 5.2 Operating documents (DOC-17…DOC-29)

| ID | File | Purpose | Status |
|----|------|---------|--------|
| DOC-17 | [MASTER_INDEX.md](MASTER_INDEX.md) | Navigation map (this file) | Active |
| DOC-18 | [SYSTEM_MANIFEST.md](SYSTEM_MANIFEST.md) | Component/system implementation state | Active |
| DOC-19 | [PROJECT_STATE.md](PROJECT_STATE.md) | Current project state & next actions | Active |
| DOC-20 | [AI_MEMORY.md](AI_MEMORY.md) | Memory model for agents | Active |
| DOC-21 | [KNOWLEDGE_BASE.md](KNOWLEDGE_BASE.md) | Knowledge entries KBE-* | Active |
| DOC-22 | [LESSONS_INDEX.md](LESSONS_INDEX.md) | Lesson registry LES-* | Active |
| DOC-23 | [DEPENDENCIES.md](DEPENDENCIES.md) | Dependency registry DEP-* | Active |
| DOC-24 | [NAMING_CONVENTION.md](NAMING_CONVENTION.md) | Naming/ID authority | Active |
| DOC-25 | [VERSIONING_POLICY.md](VERSIONING_POLICY.md) | Versioning authority | Active |
| DOC-26 | [AGENT_REGISTRY.md](AGENT_REGISTRY.md) | Agent identities AGT-* | Active |
| DOC-27 | [PROMPTS.md](PROMPTS.md) | Prompt records PRMPT-* | Active |
| DOC-28 | [OPEN_DECISIONS.md](OPEN_DECISIONS.md) | Open decision tracker | Active |
| DOC-29 | [CHECKPOINTS.md](CHECKPOINTS.md) | Checkpoint records CHKPT-* | Active |

### 5.3 Closure & phase-contract documents (DOC-30…DOC-38)

| ID | File | Purpose | Status |
|----|------|---------|--------|
| DOC-30 | [POLICY_LOCK.md](POLICY_LOCK.md) | What is frozen (lock layers L1…L6, LCK-01…17) | Active |
| DOC-31 | [PHASE_GATE.md](PHASE_GATE.md) | GATE-F1 definition + gate log | Active |
| DOC-32 | [PHASE_1_SCOPE.md](PHASE_1_SCOPE.md) | First production scope (P1-A: 28 lessons) | Active |
| DOC-33 | [BASELINE_FINAL_SUMMARY.md](BASELINE_FINAL_SUMMARY.md) | Foundation summary + official handoff | Active |
| DOC-34 | [AGENT_STARTUP_CHECKLIST.md](AGENT_STARTUP_CHECKLIST.md) | Mandatory startup/closure checklists | Active |
| DOC-35 | [REVIEW_PROTOCOL.md](REVIEW_PROTOCOL.md) | Review flow & roles (ADR-009) | Active |
| DOC-36 | [CHANGE_CONTROL.md](CHANGE_CONTROL.md) | CCR lifecycle + approval matrix | Active |
| DOC-37 | [RELEASE_CRITERIA.md](RELEASE_CRITERIA.md) | F/P1 criteria + GATE-F1 sign-off | Active |
| DOC-38 | [PHASE_1_README.md](PHASE_1_README.md) | Phase 1 entry point & reading order | Active |

## 6. ID Family Quick Reference

| Family | Format | Authoritative source |
|--------|--------|----------------------|
| Documents | `DOC-NN` (01…38) | This document (inventory) |
| Change requests | `CCR-NNN` | DOC-36 |
| Lock items | `LCK-NN` | DOC-30 |
| Tasks | `TASK-NNN` | DOC-11 |
| Milestones | `MS-NN` | DOC-09 |
| Decisions (accepted) | `ADR-NNN` | DOC-14 |
| Decisions (open) | `OPD-NNN` | DOC-28 (tracker) / DOC-14 (authority) |
| Risks | `RISK-R-XX` (`R-T-01`…) | DOC-15 |
| Changelog | `CHG-NNN` | DOC-13 |
| Handovers | `HDO-NNN` | DOC-12 |
| Agents | `AGT-NNN` | DOC-26 |
| Prompts | `PRMPT-NNN` | DOC-27 |
| Checkpoints | `CHKPT-NNN` | DOC-29 |
| Knowledge entries | `KBE-NNN` | DOC-21 |
| Dependencies | `DEP-NNN` | DOC-23 |
| Stages/Modules/Lessons | `STG-NN` / `MOD-NNNN` / `LES-NNNNNN` | DOC-03 + DOC-22 |
| Screens | `SCR-NN` | DOC-04 |
| Components | `C-NN` | DOC-02 + DOC-18 |
| Entities | `ENT-NAME` | DOC-05 |

Exact formats, regexes, and rules: [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md).

## 7. Navigation Rules

1. **One hop to any document.** Every document is reachable from this index; do not invent deep custom paths.
2. **No dead ends.** Every cross-reference in the repo must resolve to an existing file (verified by DOC-16 Gate D / Gate G).
3. **Read order is task-dependent.** Tier 0 + Tier 1 are mandatory for everyone; Tier 2 applies per task type; Tier 3 applies during/after work.
4. **Index before create.** Before creating any file/ID, check this index and DOC-24 to confirm the name and family are correct and unused.

## 8. Completion & Status Field

| Field | Value |
|-------|-------|
| **Index completeness** | Complete — covers all documents DOC-01…DOC-38 present in `docs/` |
| **Last verified against filesystem** | 2026-07-31 (38/38 docs) |
| **Known gaps** | None (future documents must be added here when created) |
| **Next scheduled verification** | At MS-02 (TASK-102 independent review), then quarterly |

## 9. Update Rules (Mandatory)

1. **Add:** when a new document/artifact is created, add its row(s) to §5 and §3 (repository map) in the same change that creates the file.
2. **Rename/remove:** update this index first, then fix all cross-references (DOC-16 Gate D), then apply DOC-13 changelog entry.
3. **Status change:** when a document's Status changes (Active → Retired…), update its row here.
4. **Verification:** after any index update, run the repository-wide link check (DOC-16 Gate G) to confirm no broken references.
5. **Changelog:** every modification to this document is recorded in DOC-13.
6. **Version bump:** per DOC-25 (MAJOR on structural change, MINOR on additions, PATCH on fixes).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.1.0 | 2026-07-31 | Project Foundation Architect | Closure layer added: DOC-30…38 inventory (§5.3), Tier 0.5 navigation, ID families (CCR/LCK), completion field (38/38) (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-17): repository map, master navigation order, full inventory DOC-01…29. |

## Notes

- This document is the single map; it deliberately summarizes rather than duplicates content of the documents it indexes.
- Future documents added by any agent must be assigned the next `DOC-NN` number here and in DOC-13.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [README.md](../README.md) | Human entry point (summary) |
| [AGENTS.md](../AGENTS.md) | Entry instructions (reading order) |
| [DOC-10 Agent Rules](10_AGENT_RULES.md) | Rules this index operationalizes |
| [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | ID families authority |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Records index changes |
