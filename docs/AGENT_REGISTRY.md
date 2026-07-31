# AGENT_REGISTRY — Agent Registry

> **Document ID:** DOC-26 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Agent Registry |
| **Purpose** | The registry of every AI agent and human role working on the project. It assigns stable agent IDs (AGT-NNN), records roles, scopes, and session history, and makes accountability explicit: who claimed which task, who wrote which handover, who verified what. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.2 |
| **Status** | Active |
| **Dependencies** | DOC-10 (rules), DOC-11 (task assignments), DOC-12 (handovers), DOC-24 (ID formats) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Updated on every agent onboarding/offboarding; reviewed at milestone boundaries |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. Agent ID Scheme](#2-agent-id-scheme)
- [3. Agent Registry](#3-agent-registry)
- [4. Human Roles Registry](#4-human-roles-registry)
- [5. Onboarding, Claiming & Offboarding Rules](#5-onboarding-claiming--offboarding-rules)
- [6. Update Rules (Mandatory)](#6-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

Multiple independent AI agents collaborate on this project without meeting. The AGENT_REGISTRY provides:

1. **Identity** — a stable `AGT-NNN` per agent so DOC-11 assignments, DOC-12 handovers, and DOC-13 entries always reference a traceable actor.
2. **Accountability** — an audit trail of which agent performed which work (complements DOC-13).
3. **Scope control** — declared roles/scope so agents stay within their authority (DOC-10 R-04).
4. **Continuity** — future agents can see who did what and who knows what (session history → handovers).

## 2. Agent ID Scheme

| Field | Rule |
|-------|------|
| Format | `AGT-\d{3}` (AGT-001, AGT-002, …) |
| Assignment | At first work session; assigned by Governance Lead (or the agent itself registering, per §5) |
| Stability | An ID follows the agent across sessions; a new agent never reuses an old ID |
| Reference usage | `Assigned Agent` in DOC-11, `Agent` in DOC-12/13/29 entries |

**Note on identity:** AI agent identities are session-scoped in this environment. The registry records the *role-based identity* an agent operates under (e.g., "Content Producer") plus the session identifier, so traceability survives context resets.

## 3. Agent Registry

| AGT | Role identity | Session(s) | Scope (allowed areas) | Status | Session history (handovers/tasks) | Notes |
|-----|---------------|------------|------------------------|--------|-----------------------------------|-------|
| AGT-001 | Project Foundation Architect | `arena/019fb8fa-photoshop-course` (2026-07-31, sessions 1–2) | Documentation & governance; foundation phase | Active | HDO-001 (baseline), HDO-002 (extension); TASK-001…032 | Registered as originator of the foundation |
| AGT-002 | Phase 1 Content Producer (Agent 02) | `arena/019fb8fa-photoshop-course` (2026-07-31, Phase-1 content session) | P1-A content production only: STG-01 + MOD-0201/0202 (28 lessons) | Active | HDO-004 (P1-A pilot); TASK-103 Completed (28 lessons + assessments delivered, In review) | Registered per DOC-26 §5.1; session record per §5.4 |
| AGT-003 | Lead Software Engineer (Agent 03) | `arena/019fb8fa-photoshop-course` (2026-08-01, implementation sessions) | Platform implementation (app/), batches per DOC-09 priority; no content/doc expansion unless required to unblock | Active | ADR-010; CHG-005; implementation batches (see PROJECT_STATE) | Registered per DOC-26 §5.1 before implementation work |

> New agents append a row with `AGT-NNN`, their role, session ID, scope, and Status = Active **before** claiming tasks (register-then-claim, DOC-10 R-01/R-09).

## 4. Human Roles Registry

Human roles are durable function names used as document owners and reviewers. They are not persons; assignment of a person to a role is tracked by the Project Manager outside this registry.

| Role | Responsibilities | Owns documents |
|------|------------------|----------------|
| Project Owner (user) | Final authority, approvals, conflict resolution | — |
| Project Manager | Roadmap, tasks, milestones, state | DOC-09, DOC-11, DOC-19 |
| Governance Lead | Rules, naming, versioning, memory, handovers, changelog | DOC-10, DOC-12, DOC-13, DOC-17, DOC-20, DOC-24, DOC-25, DOC-26, DOC-27 |
| Lead Architect | Architecture, components, dependencies, decisions | DOC-02, DOC-18, DOC-23, DOC-28 (+ DOC-14 co-owner) |
| Data Architect | Logical data model | DOC-05 |
| Curriculum Director | Curriculum structure, lesson registry | DOC-03, DOC-22 |
| Content Director | Content standards, knowledge base | DOC-07, DOC-21 |
| Assessment Lead | Assessment policy, certificates | DOC-08 |
| Design Lead | Design system | DOC-06 |
| UX Lead | UI blueprint, RTL/responsive | DOC-04 |
| A11y Lead | Accessibility | (DOC-06 §8 enforcement) |
| Quality Lead | Quality gates, checkpoints | DOC-16, DOC-29 |
| Risk Owner | Risk register | DOC-15 |
| Security Lead | Security/privacy | (DOC-02 §9 enforcement) |

**Rule:** document header `Owner` fields must match a role in this table; new roles are added here first (DOC-13 entry).

## 5. Onboarding, Claiming & Offboarding Rules

| # | Rule |
|---|------|
| 5.1 | **Register-then-claim:** an agent registers its AGT row (§3) before its first task claim; unregistered agents must not appear as `Assigned Agent` in DOC-11. |
| 5.2 | **Claim with ID:** task claims in DOC-11 use the AGT ID plus session ID (e.g., `AGT-002 (session …)`). |
| 5.3 | **Scope respect:** an agent operates only within its declared scope; expanding scope requires a Governance Lead note in DOC-26 + DOC-13. |
| 5.4 | **Session record:** at session end, the agent appends its session to its row (handover ID, tasks, outcomes). |
| 5.5 | **Offboarding:** Status → Inactive with reason and date; the row is never deleted (history). |
| 5.6 | **Verification rights:** only roles with review authority (DOC-16 §2 reviewer roles) may mark tasks `Verified`. |
| 5.7 | **Identity honesty:** an agent must not claim another agent's ID or a human role it does not hold. |

## 6. Update Rules (Mandatory)

1. Register new agents before first work (§5.1); update the row's session history at every session end.
2. Role changes require Governance Lead approval + DOC-13 entry + version bump (MINOR).
3. The registry is append-only for history; corrections are new rows or Notes with references.
4. Any mismatch between this registry and DOC-11 assignments is a defect — raise a task (Gate D).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.1 | 2026-07-31 | AGT-002 | AGT-002 registered (Phase 1 Content Producer), scope P1-A, TASK-103 claimed and completed (28 lessons + assessments, In review) (CHG-004). |
| 1.0.2 | 2026-08-01 | AGT-003 | AGT-003 registered (Lead Software Engineer), scope platform implementation (CHG-005). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-26): ID scheme, AGT-001 registration, human roles registry, onboarding rules. |

## Notes

- The registry intentionally contains no credentials or personal data — identity only (DOC-20 hygiene 5.1).
- AGT-002 is reserved for the next agent; the independent reviewer of TASK-102 should register as AGT-002 or higher.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-10 Agent Rules](10_AGENT_RULES.md) | Rules agents are bound by |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Assigned Agent field |
| [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) | Session history linkage |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Agent attribution |
| [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | AGT ID format |
