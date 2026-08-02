# 14 — Decision Log

> **Document ID:** DOC-14 · **Status:** Active · **Owner:** Lead Architect (role)

| Field | Value |
|-------|-------|
| **Title** | Decision Log (Architecture Decision Records) |
| **Purpose** | Documents every architectural and policy decision: decision ID, problem, alternatives, chosen solution, reason, and impact. Also tracks **open decisions** that must be resolved before specific work can proceed. New decisions are appended — history is immutable (DOC-10 R-06). |
| **Owner** | Lead Architect (role) for ADRs; Governance Lead for policy ADRs |
| **Version** | 1.0.2 |
| **Status** | Active |
| **Dependencies** | DOC-02 (architecture), DOC-05 (data), DOC-09 (roadmap gates), DOC-13 (changelog) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | At every decision; quarterly review of open decisions |

## Table of Contents

- [1. ADR Format & Policy](#1-adr-format--policy)
- [2. Accepted Decisions (ADRs)](#2-accepted-decisions-adrs)
- [3. Open Decisions (OPD)](#3-open-decisions-opd)
- [4. Decision Change Policy](#4-decision-change-policy)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. ADR Format & Policy

Every decision record uses this structure:

| Field | Required | Description |
|-------|----------|-------------|
| **Decision ID** | ✓ | `ADR-NNN` (or `OPD-NNN` while open) |
| **Date** | ✓ | ISO date of decision |
| **Status** | ✓ | Accepted / Superseded (ADRs); Open / Resolved (OPDs) |
| **Problem** | ✓ | What needed deciding and why it mattered |
| **Alternatives** | ✓ | Genuine options considered (at least 2) |
| **Chosen Solution** | ✓ | The decision, stated precisely |
| **Reason** | ✓ | Justification (principles AP-x/CP-x where relevant) |
| **Impact** | ✓ | What changes as a result: architecture, docs, tasks, risks |

**Policy:**
1. Any decision with lasting impact is an ADR — architecture, policy, thresholds, process.
2. ADRs are written **at the moment of decision** (DOC-10 R-06), not retroactively.
3. ADRs are append-only; superseding creates a new ADR that references the old one.
4. Open decisions are tracked in §3 until resolved; resolving an OPD converts it into an ADR entry (with the OPD marked Resolved).

## 2. Accepted Decisions (ADRs)

### ADR-001 — Documentation as the Single Source of Truth
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Multiple asynchronous AI agents share no memory; without a single source of truth, work will conflict and degrade. |
| **Alternatives** | (a) Wiki/external knowledge base, (b) code-comments-only convention, (c) this repository's documentation as SSOT |
| **Chosen Solution** | The repository itself (docs/DOC-01…16 + AGENTS.md/README) is the SSOT; every change updates docs (DOC-10 R-05). |
| **Reason** | The repo is the only artifact all agents provably share; keeping SSOT in-repo guarantees freshness and reviewability (AP-1). |
| **Impact** | All agents must read/write documentation as part of every task; DOC-13 changelog is mandatory; doc drift is a risk (R-G-01) with detection in DOC-16. |

### ADR-002 — English documentation, Arabic product
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Need one language for agent-to-agent documentation and a native language for learners. |
| **Alternatives** | (a) Arabic documentation, (b) bilingual everything, (c) English docs + Arabic content/UI |
| **Chosen Solution** | English for internal documentation/tooling; Arabic (MSA) for all learner-facing content and UI; English terms glossed in parentheses. |
| **Reason** | Agent documentation is tooling (consistency, searchability); learner experience is Arabic-first per mission (DOC-01). Content authored in Arabic as the source language (DOC-07 §7). |
| **Impact** | Terminology governance (DOC-07 §2.3); translation pipeline future (TASK-306); all UI strings Arabic-primary (DOC-04/06). |

### ADR-003 — Arabic-first RTL product
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Directionality decisions affect every screen and asset; must be decided once. |
| **Alternatives** | (a) LTR-first with RTL patch, (b) RTL-first with logical properties, (c) separate codebases per direction |
| **Chosen Solution** | RTL-first development using logical CSS properties; LTR is a future secondary mode. |
| **Reason** | Arabic is the primary market (DOC-01 §4); retrofitting RTL is costly; logical properties make LTR a config later (AP-2, DOC-06 §9). |
| **Impact** | All UI specs and QA include RTL checks (DOC-04 §11, DOC-16 R-01); mirroring rules in DOC-06 §6/§9. |

### ADR-004 — Logical-first blueprints (technology-agnostic)
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Blueprints written too early in concrete tech (SQL, framework names) would bind the project before evaluation. |
| **Alternatives** | (a) Concrete tech specs now, (b) logical specs with deferred tech decisions, (c) no specs until coding |
| **Chosen Solution** | DOC-03/04/05 are logical/functional blueprints; technology is deferred to OPD-001…005 (MS-07). |
| **Reason** | Preserves decision space; blueprints are durable regardless of stack (AP-7; DOC-02 §11). |
| **Impact** | No SQL/schema before OPD-002 (prohibition P-05); implementation milestones must map to logical entities. |

### ADR-005 — Modular monolith architecture
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Team of many agents needs clear boundaries but no premature distributed-system complexity. |
| **Alternatives** | (a) Microservices from day one, (b) modular monolith, (c) single unlayered app |
| **Chosen Solution** | Modular monolith (DOC-02 AP-4): strict internal modules with public interfaces; extraction only when metrics justify. |
| **Reason** | Highest velocity for small teams; microservices' operational burden not justified at startup scale; extraction path preserved. |
| **Impact** | DOC-02 §4/§6 module boundaries are binding; event-driven integration; scalability strategy in DOC-02 §10. |

### ADR-006 — Curriculum as structured, versioned data
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Content must evolve independently of the platform and be reproducible. |
| **Alternatives** | (a) Hard-coded lessons, (b) database-only content without versioning, (c) versioned content packages as data |
| **Chosen Solution** | Content lives in versioned packages (DOC-05 ENT-CONTENTPKG) with schema, publishing workflow (DOC-02 §8.1). |
| **Reason** | Enables parallel agent content production, rollback, and multi-language (AP-3; DOC-02 §7.2). |
| **Impact** | DOC-07 §8 metadata; CMS (C-12) milestone TASK-214; content releases decoupled from platform releases. |

### ADR-007 — Copyright & licensing compliance
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | Educational content is high-risk for copyright/asset-license violations; "Adobe" marks are trademarked. |
| **Alternatives** | (a) Use found internet assets, (b) original/licensed assets only with records |
| **Chosen Solution** | All assets original or properly licensed with license records (ENT-ASSET.licenseRef); trademark use governed by Adobe guidelines; no unlicensed fonts/music/stock; no distribution of Adobe software. |
| **Reason** | Legal safety is non-negotiable (DOC-01 §9); quality and reproducibility improve with controlled assets. |
| **Impact** | Prohibition P-09; DOC-07 §6 licensing rules; brand legal review `[TBD]` at MS-13. |

### ADR-008 — AI-assistance transparency for learners
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted (framework; details `[TBD]` at beta) |
| **Problem** | AI tools change how learners produce work; certificates must stay meaningful. |
| **Alternatives** | (a) Ban AI entirely, (b) allow silently, (c) allow with disclosure + policy |
| **Chosen Solution** | AI as learning aid allowed; AI-generated graded deliverables require disclosure in project documentation; undisclosed use is a policy violation (DOC-08 §9). |
| **Reason** | Aligns with modern practice while preserving certificate integrity (DOC-01 G-03). |
| **Impact** | Honor-code wording, integrity checks, and enforcement details refined at MS-12 per DOC-08 `[TBD]`. |

### ADR-009 — Review model (independent, role-based)
| Field | Value |
|-------|-------|
| **Date** | 2026-07-31 |
| **Status** | Accepted |
| **Problem** | OPD-006: who reviews agents' work? Without an adopted review model, content production cannot scale safely (R-E-01/R-G-01). |
| **Alternatives** | (a) No review (producers self-certify), (b) single human reviewer for everything, (c) role-based peer review with producer/reviewer separation + sampling + escalation |
| **Chosen Solution** | Role-based review per DOC-35: every change class has a reviewer role distinct from the producer; reviews execute DOC-16 gates; quality sampling by the Quality Lead; disputes escalate to Quality Lead then Governance Lead; phase gates additionally require user approval as final approver. |
| **Reason** | Independence (producer ≠ reviewer) makes DOC-16 gates trustworthy; role-based assignment keeps production flowing with many agents; user approval at phase gates preserves human authority (DOC-01/10). |
| **Impact** | OPD-006 resolved. DOC-35 (REVIEW_PROTOCOL) is the operating detail; DOC-16 gates remain the review instrument; TASK-102 (independent baseline review) proceeds under this model; all Phase 1 content is subject to it. |

### ADR-010 — Implementation phase kickoff: technology stack & local-first platform
| Field | Value |
|-------|-------|
| **Date** | 2026-08-01 |
| **Status** | Accepted (user-directed implementation; DOC-10 §9 deviation documented in CHG-005) |
| **Problem** | OPD-001/002 deferred the stack to MS-07; the user directed the project to move from planning to implementation now, requiring a concrete, runnable technology baseline for the platform. |
| **Alternatives** | (a) Wait for MS-07 ADRs, (b) static HTML/CSS/JS prototype without backend, (c) Next.js + SQLite + TypeScript modular monolith (chosen), (d) separate SPA + API server |
| **Chosen Solution** | **Next.js 15 (App Router) + TypeScript + Tailwind CSS 3** single modular-monolith application in `app/` (DOC-02 AP-4/AP-5); **SQLite via built-in `node:sqlite`** (zero native deps, local-first, Postgres-migration path at OPD-003); **session-based auth with `node:crypto` scrypt** + DB-backed sessions (ENT-SESSION); content served from the existing `content/` Markdown packages (ADR-006 content-as-data); API via route handlers (BFF, DOC-02 C-04). RTL-first (`dir="rtl"`), Arabic-first UI strings (ADR-002/003). |
| **Reason** | User directive (implementation phase); single codebase maximizes multi-agent velocity; SQLite/node:sqlite requires no external services so every batch is runnable in this environment; Markdown content reuse links the platform to the produced P1-A lessons immediately. |
| **Impact** | OPD-001, OPD-002 resolved (stack chosen); OPD-003/004/005 remain open (hosting/media/payment — non-blocking for local implementation); `app/` created (previously planned for MS-08 — deviation documented in CHG-005); SYSTEM_MANIFEST components C-01…C-14 move to In progress as batches land; lesson content remains the SSOT (DOC-03/07/22), the DB is derived data. |

### ADR-011 — Audio architecture: provider-agnostic engine + local-first lesson audio
| Field | Value |
|-------|-------|
| **Date** | 2026-08-02 |
| **Status** | Accepted (user-directed Phase 9; frontend-only, no DB/API/auth changes) |
| **Problem** | Lessons need a premium audio listening experience (Udemy/Coursera-like) without third-party dependencies, while the platform will later need TTS narration (OpenAI / ElevenLabs / Azure) without a UI rewrite. |
| **Alternatives** | (a) Hard-code an `<audio>` element per page (fast, but every future provider requires UI surgery), (b) adopt a media library (rejected — no new dependencies allowed), (c) provider-agnostic engine contract + registry (chosen). |
| **Chosen Solution** | A small **AudioEngine contract** (`src/lib/audio/types.ts`) implemented by an **HTML5 `<audio>` engine** today, created through a **registry** (`engine-registry.ts`) that already reserves TTS provider slots (openai/elevenlabs/azure) — registering a factory is the only step a future provider needs. UI consumes a single `AudioProvider` context + hooks (`useAudio`, `useAudioPosition`, `usePlaybackRate`, `useAudioVolume`, `useAudioMediaSession`). Audio files live in `content/audio/{LES-XXXXXX}.{ext}` (ADR-006 content-as-data) and are streamed by a range-capable route handler (`/api/audio/[lessonId]`) — no external service, no API keys, no DB columns. |
| **Reason** | Zero dependencies; the player works offline/local-first; a future TTS integration touches only the registry + a new engine file; graceful "unavailable" engine renders the standard error UI instead of breaking pages. |
| **Impact** | New `app/src/lib/audio/`, `app/src/components/audio/`, `app/src/components/lesson/`, `app/src/lib/audio-assets.ts`, `app/src/app/api/audio/[lessonId]/route.ts`, `content/audio/` (empty convention dir + README). OPD-004 (media pipeline) remains open — this ADR deliberately does not decide hosting/transcoding. |

## 3. Open Decisions (OPD)

| ID | Decision | Needed by | Blocking | Notes |
|----|----------|-----------|----------|-------|
| OPD-001 | Application language & framework | MS-07 (TASK-201) | All platform coding | **Resolved** 2026-08-01 by ADR-010: Next.js 15 + TypeScript (App Router) |
| OPD-002 | Primary database product | MS-07 (TASK-202) | All SQL/physical schema | **Resolved** 2026-08-01 by ADR-010: SQLite (node:sqlite) local-first; Postgres migration path at OPD-003 |
| OPD-003 | Hosting / CDN / media delivery | MS-07 (TASK-203) | Media pipeline, deployment | Includes data residency for MENA users (risk R-T-06) |
| OPD-004 | Media transcoding pipeline | MS-07 (TASK-203) | Lesson video production | Captions/transcripts requirements (DOC-07 §6) |
| OPD-005 | Payment provider & billing | MS-09/13 (TASK-204) | Premium monetization (DOC-01 §4.3) | Regional payment methods critical for MENA |
| OPD-006 | Independent governance/verification model | MS-02 (TASK-102) | Baseline review | **Resolved** by ADR-009 (2026-07-31): role-based review per DOC-35 |
| OPD-007 | Brand identity values (colors, fonts, logo) | MS-11 (TASK-216) | Design-system implementation | DOC-06 `[TBD]` tokens; legal review of name |
| OPD-008 | Learner AI-assistance enforcement details | MS-12 (TASK-302) | Integrity tooling | Completes ADR-008 |

### ADR-012 — Learning Path: strict sequential gating + verified completion
| Field | Value |
|-------|-------|
| **Date** | 2026-08-02 |
| **Status** | Accepted (user-directed Phase 11; additive schema only) |
| **Problem** | Learners could skip stages/modules/lessons and complete content arbitrarily; completion was a client-trusted POST; quizzes/exams were open before their prerequisites. |
| **Alternatives** | (a) Enforce layered rules per level (stage→module→lesson each with its own predecessor check — more SQL, same outcome), (b) client-only UI gating (rejected: trivially bypassable), (c) **single-chain sequential gate + server-verified completion (chosen)**. |
| **Chosen Solution** | The path collapses to one rule: every available lesson has exactly one required predecessor — the previous available lesson in global order (stage position → module position → lesson position). All unlock checks (`getLessonLock`, `getModuleLock`, `getStageLock`, `getQuizLock`, `getExamLock`) derive from that chain in `src/lib/locks.ts` and run server-side in every page and every API (progress/quiz/exam). Completion of a lesson is verified server-side (`src/lib/completion.ts`): lesson unlocked + opened (`progress.opened_at`) + ≥70% of expected reading time (wall-clock since first open vs `duration_min`/content estimate) + reached page end (`reached_end`) + explicit completion POST. Module/stage progress rows are always recomputed server-side from lesson rows (client writes are ignored). Achievements (first lesson / first module / half stage / stage complete / course complete) are awarded server-side in `src/lib/achievements.ts` with `UNIQUE(user_id, code)`. Guests keep read-only preview (nothing to track); all progress features require auth. |
| **Reason** | Prevents skipping by construction; a single chain is simpler to verify than per-level rules; all checks live on the server so direct URLs, API calls and manual navigation cannot bypass; migration 002 is additive (3 new columns + achievements table) and preserves all existing data. |
| **Impact** | New `src/lib/{locks,completion,achievements}.ts`, `scripts/migrations/002_learning_path.sql`, lock UI (`LockUI.tsx`, `LessonRowLink.tsx`, `GateLink.tsx`, `LessonNavCards.tsx`, `PathTrail.tsx`), reworked `/api/progress` + quiz/exam gates, lesson/stage/catalog/quiz/exam page gates, profile achievements section, home continue-card lock awareness. OPD-008 remains open (AI-assistance policy is orthogonal). |

## 4. Decision Change Policy

1. An ADR is **superseded** only by a new ADR that explicitly references it; the old ADR keeps its Status = Superseded (never deleted).
2. OPDs are resolved by an ADR; the OPD row is marked Resolved with the ADR ID.
3. Reversal of a policy ADR (e.g., ADR-001) requires the user/project owner's explicit approval, recorded in DOC-13.
4. Every ADR/OPD change is mirrored in DOC-13 and in any affected blueprint (DOC-02/05/06/08…).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.2 | 2026-08-01 | AGT-003 (Lead Software Engineer) | ADR-010 added (implementation kickoff / tech stack); OPD-001/002 resolved (CHG-005). |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | ADR-009 added (review model); OPD-006 marked Resolved (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-14): 8 accepted ADRs, 8 open decisions. |

## Notes

- OPD numbering continues from OPD-009 for new open decisions; ADR numbering from ADR-009.
- This log is a primary input to MS-07 (technology stack ADRs).

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | ADRs realize architecture principles |
| [DOC-05 Database Blueprint](05_DATABASE_BLUEPRINT.md) | OPD-002 gates physical design |
| [DOC-06 Design System](06_DESIGN_SYSTEM.md) | OPD-007 gates token values |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | MS-07 resolves OPD-001…005 |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | ADR/OPD changes recorded |
| [DOC-15 Risk Register](15_RISK_REGISTER.md) | Decision gaps tracked as risks |
