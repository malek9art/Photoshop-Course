# DEPENDENCIES — Dependency Registry

> **Document ID:** DOC-23 · **Status:** Active · **Owner:** Lead Architect (role)

| Field | Value |
|-------|-------|
| **Title** | Dependency Registry |
| **Purpose** | The master registry of internal and external dependencies: documents, milestones, tasks, decisions, content, tools, services, and licenses — with resolution status. It is where agents declare, verify, and resolve dependencies before starting work. |
| **Owner** | Lead Architect (role) |
| **Version** | 1.0.2 |
| **Status** | Active |
| **Dependencies** | DOC-02 (component dependencies), DOC-09 (milestone dependencies), DOC-14/28 (decision dependencies), DOC-11 (tasks), DOC-13 (changelog) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | At every milestone boundary and whenever an OPD resolves |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. Dependency Types](#2-dependency-types)
- [3. Entry Format](#3-entry-format)
- [4. Internal Dependency Registry](#4-internal-dependency-registry)
- [5. External Dependency Registry](#5-external-dependency-registry)
- [6. Dependency Resolution Rules](#6-dependency-resolution-rules)
- [7. Update Rules (Mandatory)](#7-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

Dependencies are the main source of blocked work (DOC-11 status `Blocked`). This registry makes every dependency **visible, owned, and resolvable**: it aggregates the dependency declarations that currently live in DOC-02 §7, DOC-09, document headers, and DOC-14, into one operational tracker with resolution status.

**Boundary rule:** this registry does not redefine dependencies — it tracks them. The authoritative *definition* of each dependency remains in the source documents listed per row.

## 2. Dependency Types

| Type | Description | Examples |
|------|-------------|----------|
| `doc` | A document that must exist/be read before work | DOC-03 before content work |
| `milestone` | A milestone that must complete first | MS-07 before MS-08 |
| `task` | A task that must complete first | TASK-103 before MS-03 batches |
| `decision` | An OPD/ADR that must resolve | OPD-001 before platform code |
| `content` | Content that must exist first | STG-01 content before learner path completion |
| `external` | Outside-the-repo dependency (service, tool, license) | CDN provider, font licenses |
| `data` | Data/schema that must exist first | ENT-CONTENTPKG schema before CMS |

## 3. Entry Format

```markdown
### DEP-NNN — <Short Title>
- **Date:** YYYY-MM-DD
- **Type:** doc / milestone / task / decision / content / external / data
- **Source:** <DOC-XX §, TASK-NNN, OPD-NNN, ADR-NNN>
- **Depends-on:** <what must exist/resolve first>
- **Depends-for:** <what cannot start without it>
- **Nature:** hard (blocking) / soft (recommended)
- **Status:** Open / In discussion / Resolved / Retired
- **Owner:** <role>
- **Notes:** <resolution path, linked decisions>
```

## 4. Internal Dependency Registry

### 4.1 Document & milestone dependencies (grouped)

| DEP | Type | Source | Depends-on | Depends-for | Nature | Status |
|-----|------|--------|------------|-------------|--------|--------|
| DEP-001 | doc | DOC-10 R-01 | DOC-01…29 exist and are current | Any work | hard | Resolved (2026-07-31) |
| DEP-002 | milestone | DOC-09 | MS-01 (foundation) | MS-02…MS-14 | hard | Resolved (MS-01 completed) |
| DEP-003 | milestone | DOC-09 | MS-02 (governance + pilot) | MS-03…06 content batches | hard | Open |
| DEP-004 | milestone | DOC-09 | MS-07 (stack ADRs) | MS-08 platform MVP | hard | Open |
| DEP-005 | milestone | DOC-09 | MS-09 (assessment engine) | MS-12 beta | hard | Open |
| DEP-006 | milestone | DOC-09 | MS-12 (beta) | MS-13 launch | hard | Open |
| DEP-007 | content | DOC-03 §15 | STG-01 content (MS-03) | Certificate CERT-01 flow validation | hard | Open |
| DEP-008 | data | DOC-02 §8.1 | Content package schema (ENT-CONTENTPKG) | CMS (C-12) and Learning Engine (C-07) | hard | Open (design exists; schema deferred to OPD-002/004) |

### 4.2 Decision dependencies (tracked in DOC-28)

| DEP | Type | Source | Depends-on | Depends-for | Nature | Status |
|-----|------|--------|------------|-------------|--------|--------|
| DEP-009 | decision | OPD-001 | none | All platform code (C-04…C-14) | hard | Open |
| DEP-010 | decision | OPD-002 | none | SQL/physical schema (DOC-05 implementation) | hard | Open |
| DEP-011 | decision | OPD-003/004 | none | Media pipeline, hosting, deployment | hard | Open |
| DEP-012 | decision | OPD-005 | none | Billing/monetization (MS-13) | hard | Open |
| DEP-013 | decision | OPD-006 | none | Independent review of agent work (TASK-102) | hard | Resolved (ADR-009, 2026-07-31) |
| DEP-014 | decision | OPD-007 | none | Design tokens implementation (MS-11) | hard | Open |
| DEP-015 | decision | OPD-008 | ADR-008 | Integrity tooling (MS-12) | soft | Open |

### 4.3 Task dependencies (key chains)

| DEP | Type | Source | Depends-on | Depends-for | Nature | Status |
|-----|------|--------|------------|-------------|--------|--------|
| DEP-016 | task | DOC-11 | TASK-018 (baseline verification) | TASK-102 (independent review) | hard | Resolved |
| DEP-017 | task | DOC-11 | TASK-102 (review) | TASK-103 (pilot content) | hard | Open — TASK-103 executed under direct user waiver (DOC-10 §9, CHG-004); TASK-102/101 remain prerequisites for MS-03 scale-up |
| DEP-018 | task | DOC-11 | TASK-201/202 (stack ADRs) | TASK-205…210 (MVP) | hard | Open |
| DEP-019 | task | DOC-11 | TASK-208 (quiz screens) | TASK-211 (assessment engine) | hard | Open |
| DEP-020 | task | DOC-11 | TASK-211 | TASK-212 (certification) | hard | Open |

## 5. External Dependency Registry

| DEP | Type | Source | Dependency | Status | Owner | Notes |
|-----|------|--------|------------|--------|-------|-------|
| DEP-021 | external | OPD-003 | Hosting/cloud provider | Open | Lead Architect | Data residency for MENA (R-T-06) |
| DEP-022 | external | OPD-003 | Media CDN / streaming provider | Open | Lead Architect | Adaptive bitrate for mobile (R-P-01) |
| DEP-023 | external | OPD-004 | Transcoding pipeline | Open | Lead Architect | Captions/transcripts (DOC-07 §6) |
| DEP-024 | external | OPD-005 | Payment provider | Open | Project Manager | Regional payment methods |
| DEP-025 | external | OPD-002 | Database product | Open | Data Architect | Must honor DOC-05 |
| DEP-026 | external | ADR-007 | Adobe trademark guidelines | Resolved (policy) | Governance Lead | Re-verify at MS-13 |
| DEP-027 | external | DOC-06 §4 | Arabic web fonts (licensing) | Open | Design Lead | Self-hosted/licensed only (ADR-007) |
| DEP-028 | external | DOC-07 §6 | Asset licenses (media, music, stock) | Open (per-asset) | Content Director | License record per asset (ENT-ASSET) |

## 6. Dependency Resolution Rules

| # | Rule |
|---|------|
| 6.1 | **Declare first:** before starting work, confirm every dependency of the task (and its milestone) is `Resolved`; otherwise the task is `Blocked` with the DEP/OPD ID in Notes (DOC-11). |
| 6.2 | **Verify, don't assume:** a dependency is Resolved only when its row says so and the source document confirms it. |
| 6.3 | **No crossing:** work that depends on an open `decision` dependency may not begin (DOC-10 P-03/P-05). |
| 6.4 | **Resolve at source:** resolving a dependency means updating its *source* (ADR in DOC-14, milestone in DOC-09, task in DOC-11) and then this registry — in that order. |
| 6.5 | **Record the resolution:** every transition to Resolved gets a DOC-13 entry and, for decisions, an ADR. |
| 6.6 | **Re-verify quarterly:** the registry is reconciled at each milestone; stale Resolved rows are re-opened with notes. |

## 7. Update Rules (Mandatory)

1. New dependencies are registered here **before** the work that depends on them is claimed (register-then-claim order).
2. Status changes are made in the same change as the resolution action; the DOC-13 entry is mandatory.
3. Rows are append-only in the sense that status history is preserved via DOC-13; a corrected row notes the correction.
4. Registry structure changes require Lead Architect approval + version bump per DOC-25.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.2 | 2026-07-31 | AGT-002 | DEP-017 note added: TASK-103 executed under user waiver; TASK-102/101 remain open for MS-03 (CHG-004). |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | DEP-013 (OPD-006) marked Resolved via ADR-009 (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-23): 28 dependency entries across doc/milestone/task/decision/external types. |

## Notes

- DEP numbers are stable; a row that becomes irrelevant is marked `Retired`, never deleted.
- The registry deliberately mirrors OPDs — DOC-28 is the tracker for decision lifecycle; this file tracks what those decisions block.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | Component dependency rules (§7) |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | Milestone dependencies |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Task dependencies & Blocked status |
| [DOC-14 Decision Log](14_DECISION_LOG.md) / [DOC-28 OPEN_DECISIONS](OPEN_DECISIONS.md) | Decision dependencies |
| [DOC-15 Risk Register](15_RISK_REGISTER.md) | Risks caused by open dependencies |
