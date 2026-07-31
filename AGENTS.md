# Agent Instructions — READ THIS FIRST

> **Audience:** Every AI agent (and human collaborator) that will work in this repository.
> **Last verified:** 2026-07-31

You are entering the **Adobe Creative Academy (ACA)** repository — the Single Source of Truth for a premium, Arabic-first Adobe Creative Cloud learning platform that will grow into a professional LMS. The project is built **collaboratively by multiple AI agents**. Your work only counts if it fits the system.

## Mandatory rules (abbreviated — full rules in `docs/10_AGENT_RULES.md`)

1. **Read before you act.** Read the documents below in order before making any change. Skipping this step is a governance violation.
2. **Claim a task first.** Find or create a task on the master board (`docs/11_TASK_MANAGEMENT.md`) and set it to **In Progress** with you as the assigned agent before touching anything.
3. **Never duplicate, never overwrite.** Check existing work. If something exists, extend it — do not recreate it.
4. **Respect the architecture.** DOC-02 (architecture), DOC-03 (curriculum), DOC-04 (UI), DOC-05 (database), DOC-06 (design), DOC-07 (content), DOC-08 (assessment) are binding blueprints.
5. **Update the documentation.** Every change must be reflected in the affected documents and appended to the changelog (`docs/13_PROJECT_CHANGELOG.md`).
6. **Explain decisions.** New architectural decisions go into the Decision Log (`docs/14_DECISION_LOG.md`) as ADRs.
7. **Handover before you finish.** Complete the handover template (`docs/templates/HANDOVER_TEMPLATE.md`) and store it in `docs/handovers/` per DOC-12.
8. **Pass the quality gates.** Every deliverable must satisfy `docs/16_QUALITY_CHECKLIST.md`.

## Mandatory reading order

| Step | Document |
|------|----------|
| 1 | `docs/MASTER_INDEX.md` — navigation map (where everything is) |
| 2 | `docs/POLICY_LOCK.md` — what is **frozen** (do not reinterpret) |
| 3 | `docs/AGENT_STARTUP_CHECKLIST.md` — **mandatory startup checklist** (complete it) |
| 4 | `docs/10_AGENT_RULES.md` — operating rules |
| 5 | `docs/11_TASK_MANAGEMENT.md` — task board |
| 6 | `docs/PROJECT_STATE.md` — current state & next actions |
| 7 | `docs/REVIEW_PROTOCOL.md` + `docs/CHANGE_CONTROL.md` — review & change paths |
| 8 | `docs/01_PROJECT_VISION.md` — mission |
| 9 | `docs/02_SYSTEM_ARCHITECTURE.md` — architecture |
| 10 | Blueprints relevant to your task (DOC-03 … DOC-08) |
| 11 | Registries relevant to your task (DOC-18, 21–23, 26–29) |
| 12 | `docs/12_AGENT_HANDOVER.md` — handover requirements |

> **Phase 1 agents (content production) additionally must read** `docs/PHASE_1_README.md` (DOC-38), `docs/PHASE_1_SCOPE.md` (DOC-32), and `docs/RELEASE_CRITERIA.md` (DOC-37) before any content work.
>
> **Full mandatory reading order (with reasons):** [README.md](README.md) → `docs/MASTER_INDEX.md` (DOC-17) → [DOC-19 PROJECT_STATE](docs/PROJECT_STATE.md) → DOC-30 POLICY_LOCK → DOC-34 AGENT_STARTUP_CHECKLIST → DOC-10 → DOC-11 → task-relevant blueprints and registries.

## What is allowed in this repository right now

- **Foundation closed (GATE-F1 PASS, 2026-07-31).** Phase 1 (content production) is **eligible to begin** per `docs/PHASE_GATE.md` (DOC-31) and `docs/RELEASE_CRITERIA.md` (DOC-37).
- **Phase 1 scope:** Arabic lesson content for the P1-A scope only (STG-01 + MOD-0201/0202 = 28 lessons) — see `docs/PHASE_1_SCOPE.md` (DOC-32). Everything else stays prohibited until its own milestone (platform/MS-08, media pipeline/MS-07, etc.).
- **Locked items** (DOC-30) are not editable without an explicit CCR (`docs/CHANGE_CONTROL.md`) or ADR (`docs/14_DECISION_LOG.md`).
- Documentation edits are always allowed — and often required (DOC-13 changelog, DOC-19 state).

## If you are unsure

Ask the user or leave a clear note on the task board. Do **not** improvise across boundaries that are already defined. When in doubt, document your assumption (see `docs/14_DECISION_LOG.md` and DOC-10).
