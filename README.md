# Adobe Creative Academy (ACA)

**Premium, Arabic-first Adobe Creative Cloud Learning Platform — documentation repository.**

> **Status:** Foundation Phase **closed** (GATE-F1 PASS) · Phase 1 (content production) **eligible to begin** · **Baseline date:** 2026-07-31
> **This repository currently contains documentation only.** No source code, lessons, or content exist yet (Phase 1 scope defined in `docs/PHASE_1_SCOPE.md`).

This repository is the **Single Source of Truth (SSOT)** for the entire Adobe Creative Academy project. Every future AI agent — and every human collaborator — **must** read the documentation before making any change, and **must** update the documentation after completing any task.

---

## What is this project?

Adobe Creative Academy is a premium learning academy that teaches the Adobe Creative Cloud suite (Photoshop, Illustrator, After Effects, Premiere Pro, Lightroom, InDesign) to Arabic-speaking students, delivered as a professional **Learning Management System (LMS)**.

The academy is built **collaboratively by multiple AI agents**. This documentation exists to guarantee:

- **Consistency** — every agent works from the same blueprint.
- **Continuity** — no knowledge is lost when an agent finishes its session.
- **Quality** — every deliverable passes a defined review gate.
- **Durability** — the documentation outlives any single implementation decision.

See [`docs/01_PROJECT_VISION.md`](docs/01_PROJECT_VISION.md) for the full vision.

---

## Documentation Hub (the Single Source of Truth)

| Doc ID | Document | Purpose | Status |
|--------|----------|---------|--------|
| DOC-01 | [Project Vision](docs/01_PROJECT_VISION.md) | Mission, vision, goals, audience, personas, philosophy, success metrics, expansion | Active |
| DOC-02 | [System Architecture](docs/02_SYSTEM_ARCHITECTURE.md) | Overall architecture, components, subsystems, boundaries, dependencies, scalability | Active |
| DOC-03 | [Curriculum Blueprint](docs/03_CURRICULUM_BLUEPRINT.md) | Curriculum skeleton: stages, modules, lesson titles, paths, durations, completion flow | Active |
| DOC-04 | [UI Blueprint](docs/04_UI_BLUEPRINT.md) | All application screens, Arabic RTL, responsive behavior (functional only — no design) | Active |
| DOC-05 | [Database Blueprint](docs/05_DATABASE_BLUEPRINT.md) | Logical entities, relationships, ownership — no SQL | Active |
| DOC-06 | [Design System](docs/06_DESIGN_SYSTEM.md) | Visual principles, brand, spacing, typography, color, icons, accessibility, responsiveness | Active |
| DOC-07 | [Content Standards](docs/07_CONTENT_STANDARDS.md) | Writing, lesson, exercise, quiz, translation, media, and accessibility standards | Active |
| DOC-08 | [Assessment Standard](docs/08_ASSESSMENT_STANDARD.md) | Assessment policy, scoring, passing rules, certificates, retakes, rubrics | Active |
| DOC-09 | [Project Roadmap](docs/09_PROJECT_ROADMAP.md) | Milestones, dependencies, priorities, effort, completion status | Active |
| DOC-10 | [Agent Rules](docs/10_AGENT_RULES.md) | Strict operating rules for every future AI agent | Active |
| DOC-11 | [Task Management](docs/11_TASK_MANAGEMENT.md) | Master task board, statuses, verification workflow | Active |
| DOC-12 | [Agent Handover](docs/12_AGENT_HANDOVER.md) | Mandatory handover system + template | Active |
| DOC-13 | [Project Changelog](docs/13_PROJECT_CHANGELOG.md) | Every modification, recorded with version and reason | Active |
| DOC-14 | [Decision Log](docs/14_DECISION_LOG.md) | Architecture Decision Records (ADRs) and open decisions | Active |
| DOC-15 | [Risk Register](docs/15_RISK_REGISTER.md) | Technical, educational, UX, performance, and future risks + mitigations | Active |
| DOC-16 | [Quality Checklist](docs/16_QUALITY_CHECKLIST.md) | Mandatory review gates for every deliverable | Active |

### Operating documents (DOC-17 … DOC-29)

| Doc ID | Document | Purpose | Status |
|--------|----------|---------|--------|
| DOC-17 | [Master Index](docs/MASTER_INDEX.md) | Navigation map + master reading order for the whole repository | Active |
| DOC-18 | [System Manifest](docs/SYSTEM_MANIFEST.md) | Live implementation state of components, subsystems, artifacts | Active |
| DOC-19 | [Project State](docs/PROJECT_STATE.md) | Where the project stands now; state-update protocol; next actions | Active |
| DOC-20 | [AI Memory](docs/AI_MEMORY.md) | Shared-memory model: memory types, read/write protocols, hygiene | Active |
| DOC-21 | [Knowledge Base](docs/KNOWLEDGE_BASE.md) | Knowledge entries (KBE), external references, lessons-learned index | Active |
| DOC-22 | [Lessons Index](docs/LESSONS_INDEX.md) | Registry of all 156 lessons + production status | Active |
| DOC-23 | [Dependencies](docs/DEPENDENCIES.md) | Internal/external dependency registry (DEP) with resolution status | Active |
| DOC-24 | [Naming Convention](docs/NAMING_CONVENTION.md) | Single authority for all IDs, files, branches, commits, content names | Active |
| DOC-25 | [Versioning Policy](docs/VERSIONING_POLICY.md) | Version schemes and bump rules for every artifact type | Active |
| DOC-26 | [Agent Registry](docs/AGENT_REGISTRY.md) | Agent identities (AGT), human roles, onboarding/claiming rules | Active |
| DOC-27 | [Prompts](docs/PROMPTS.md) | Prompt records (PRMPT), lifecycle, review rules | Active |
| DOC-28 | [Open Decisions](docs/OPEN_DECISIONS.md) | Operational tracker for OPD-001…008 and resolution protocol | Active |
| DOC-29 | [Checkpoints](docs/CHECKPOINTS.md) | Checkpoint types, checklists, and log (CHKPT) | Active |

### Foundation closure & phase contract (DOC-30 … DOC-38)

| Doc ID | Document | Purpose | Status |
|--------|----------|---------|--------|
| DOC-30 | [Policy Lock](docs/POLICY_LOCK.md) | What is frozen and how locked items may change | Active |
| DOC-31 | [Phase Gate](docs/PHASE_GATE.md) | GATE-F1: foundation → Phase 1 (PASS recorded) | Active |
| DOC-32 | [Phase 1 Scope](docs/PHASE_1_SCOPE.md) | First production scope (P1-A: 28 lessons) | Active |
| DOC-33 | [Baseline Final Summary](docs/BASELINE_FINAL_SUMMARY.md) | Foundation summary + official handoff | Active |
| DOC-34 | [Agent Startup Checklist](docs/AGENT_STARTUP_CHECKLIST.md) | Mandatory startup/closure checklists | Active |
| DOC-35 | [Review Protocol](docs/REVIEW_PROTOCOL.md) | Review flow, roles, producer ≠ reviewer | Active |
| DOC-36 | [Change Control](docs/CHANGE_CONTROL.md) | CCR lifecycle, approval matrix, register | Active |
| DOC-37 | [Release Criteria](docs/RELEASE_CRITERIA.md) | F/P1 criteria + GATE-F1 sign-off | Active |
| DOC-38 | [Phase 1 Readme](docs/PHASE_1_README.md) | Phase 1 entry point & reading order | Active |

**Supporting artifacts**

- [Handover template](docs/templates/HANDOVER_TEMPLATE.md) — copy this for every handover.
- [Completed handovers](docs/handovers/) — all handovers are stored here.
- [Agent entry instructions](AGENTS.md) — the first file every agent must read.

---

## Mandatory Reading Order for AI Agents

> **Failure to read these documents before working is a governance violation.** See [`docs/10_AGENT_RULES.md`](docs/10_AGENT_RULES.md).

| Step | Document | Why |
|------|----------|-----|
| 1 | [`AGENTS.md`](AGENTS.md) | Entry instructions, first hook |
| 2 | [`docs/MASTER_INDEX.md`](docs/MASTER_INDEX.md) | Navigation map of the entire repository |
| 3 | [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) | Where the project stands and what is next |
| 4 | [`docs/POLICY_LOCK.md`](docs/POLICY_LOCK.md) | What is frozen — never reinterpret |
| 5 | [`docs/AGENT_STARTUP_CHECKLIST.md`](docs/AGENT_STARTUP_CHECKLIST.md) | Mandatory startup checklist (complete it) |
| 6 | [`docs/10_AGENT_RULES.md`](docs/10_AGENT_RULES.md) | Non-negotiable operating rules |
| 7 | [`docs/11_TASK_MANAGEMENT.md`](docs/11_TASK_MANAGEMENT.md) | Claim a task before doing anything |
| 8 | [`docs/01_PROJECT_VISION.md`](docs/01_PROJECT_VISION.md) | Understand the mission |
| 9 | [`docs/02_SYSTEM_ARCHITECTURE.md`](docs/02_SYSTEM_ARCHITECTURE.md) | Respect the architecture |
| 10 | [`docs/REVIEW_PROTOCOL.md`](docs/REVIEW_PROTOCOL.md) + [`docs/CHANGE_CONTROL.md`](docs/CHANGE_CONTROL.md) | How work is reviewed and changed |
| 11 | Any blueprint relevant to the task (DOC-03 … DOC-08) | Domain-specific standards |
| 12 | Registries relevant to the task (DOC-18, 21–23, 26–29) | Register/track your work |
| 13 | [`docs/12_AGENT_HANDOVER.md`](docs/12_AGENT_HANDOVER.md) | Complete a handover before finishing |

> **Phase 1 agents additionally read:** [`docs/PHASE_1_README.md`](docs/PHASE_1_README.md) (entry), [`docs/PHASE_1_SCOPE.md`](docs/PHASE_1_SCOPE.md) (scope), [`docs/RELEASE_CRITERIA.md`](docs/RELEASE_CRITERIA.md) (eligibility).

---

## Repository Layout

```
/
├── README.md                 ← Documentation hub (this file)
├── AGENTS.md                 ← Mandatory first read for AI agents
├── docs/
│   ├── 01_PROJECT_VISION.md   … 16_QUALITY_CHECKLIST.md   (blueprints & governance, DOC-01…16)
│   ├── MASTER_INDEX.md        (DOC-17 — navigation map)
│   ├── SYSTEM_MANIFEST.md     (DOC-18)
│   ├── PROJECT_STATE.md       (DOC-19)
│   ├── AI_MEMORY.md           (DOC-20)
│   ├── KNOWLEDGE_BASE.md      (DOC-21)
│   ├── LESSONS_INDEX.md       (DOC-22)
│   ├── DEPENDENCIES.md        (DOC-23)
│   ├── NAMING_CONVENTION.md   (DOC-24)
│   ├── VERSIONING_POLICY.md   (DOC-25)
│   ├── AGENT_REGISTRY.md      (DOC-26)
│   ├── PROMPTS.md             (DOC-27)
│   ├── OPEN_DECISIONS.md      (DOC-28)
│   ├── CHECKPOINTS.md         (DOC-29)
│   ├── templates/
│   │   └── HANDOVER_TEMPLATE.md
│   └── handovers/            ← Completed handovers (HDO-XXX)
├── app/                      ← [PLANNED] Platform source code (not yet created)
├── content/                  ← [PLANNED] Curriculum content (not yet created)
└── admin/                    ← [PLANNED] Operational tooling (not yet created)
```

Future directories (`app/`, `content/`, `admin/`) are **planned only** — do not create them until a roadmap milestone requires it.

---

## Quick Governance Summary

| Topic | Rule | Reference |
|-------|------|-----------|
| Before any change | Read the mandatory documentation | DOC-10 |
| Task claiming | Claim a task on the board first | DOC-11 |
| Status reporting | Update task status + leave notes | DOC-11 |
| After any change | Update affected docs + append changelog | DOC-13 |
| State & registries | Update project state + relevant registries | DOC-19, DOC-18/21–23/27–29 |
| Architecture decision | Record an ADR | DOC-14 |
| Handover | Mandatory before ending a session | DOC-12 |
| Deliverable | Must pass quality gates | DOC-16 |

---

## Revision History

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| 1.2.0 | 2026-07-31 | Project Foundation Architect | Foundation closure layer added: DOC-30…38 (policy lock, phase gate, scope, summary, checklists, review, change control, criteria, Phase-1 entry); GATE-F1 PASS. |
| 1.1.0 | 2026-07-31 | Project Foundation Architect | Operating-document extension added: DOC-17…29 (navigation, state, memory, registries, naming, versioning, prompts, checkpoints). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Baseline documentation created (16 documents + governance artifacts). |

> The authoritative changelog for this repository is [`docs/13_PROJECT_CHANGELOG.md`](docs/13_PROJECT_CHANGELOG.md).
