# AI_MEMORY — Agent Memory Model

> **Document ID:** DOC-20 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | AI Memory Model |
| **Purpose** | Defines how the repository functions as the shared memory of all AI agents: the memory types, where each lives, the mandatory read/write protocols, hygiene rules, and verification. It operationalizes DOC-10 R-08 (leave notes) and R-05 (update documentation). |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-10 (rules), DOC-11 (tasks), DOC-12 (handovers), DOC-13 (changelog), DOC-17 (navigation), DOC-19 (state) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Quarterly; immediately after any memory-model incident (lost context, stale state) |

## Table of Contents

- [1. Purpose & Model Overview](#1-purpose--model-overview)
- [2. Memory Types & Locations](#2-memory-types--locations)
- [3. Read Protocol (Mandatory)](#3-read-protocol-mandatory)
- [4. Write Protocol (Mandatory)](#4-write-protocol-mandatory)
- [5. Memory Hygiene Rules](#5-memory-hygiene-rules)
- [6. Memory Verification](#6-memory-verification)
- [7. Update Rules (Mandatory)](#7-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose & Model Overview

AI agents have no shared working memory. **This repository is the memory.** The model has five memory classes, each with a defined home:

| Class | Function | Home |
|-------|----------|------|
| **Permanent** | Durable truth: design, rules, standards | DOC-01…16 (blueprints & governance) |
| **Operating** | Navigation, state, registries | DOC-17…29 (operating documents) |
| **Transactional** | What happened, in order | DOC-13 (changelog), DOC-11 (task notes) |
| **Transitional** | Context transfer between sessions | DOC-12 + `docs/handovers/` |
| **Ephemeral** | Scratch, discarded | Outside repo or deleted before session end |

The memory is **write-through**: every task writes its trace to the transactional and state layers at completion, never only in the agent's private context.

## 2. Memory Types & Locations

| # | Memory type | Recorded as | Where | Written by | Retention |
|---|-------------|-------------|-------|-----------|-----------|
| 2.1 | Rules & standards | Documents DOC-01…16 | `docs/` | Task owner + owner role | Permanent (append-only changes) |
| 2.2 | Operating state | Documents DOC-17…29 | `docs/` | Task owner + owner role | Permanent |
| 2.3 | Task trace | Task record + Notes | DOC-11 | Task owner | Permanent |
| 2.4 | Change trace | CHG-NNN entries | DOC-13 | Task owner | Permanent (append-only) |
| 2.5 | Session transfer | HDO-NNN handover | `docs/handovers/` | Task owner | Permanent |
| 2.6 | Decisions | ADR-NNN / OPD-NNN | DOC-14 / DOC-28 | Lead Architect / Governance | Permanent |
| 2.7 | Risks | RISK-R-XX | DOC-15 | Task owner | Permanent |
| 2.8 | Knowledge & lessons | KBE-NNN entries | DOC-21 | Task owner | Permanent |
| 2.9 | Prompts | PRMPT-NNN entries | DOC-27 | Requester/owner | Permanent |
| 2.10 | Checkpoints | CHKPT-NNN entries | DOC-29 | Task owner | Permanent |
| 2.11 | Ephemeral scratch | Scratch files | Outside `docs/`; deleted | Task owner | Until session end |

## 3. Read Protocol (Mandatory)

Before **any** change, in order:

| Step | Read | Applies to |
|------|------|-----------|
| 3.1 | `AGENTS.md`, [MASTER_INDEX](MASTER_INDEX.md) | Every agent |
| 3.2 | [DOC-10](10_AGENT_RULES.md), [DOC-11](11_TASK_MANAGEMENT.md), [PROJECT_STATE](PROJECT_STATE.md) | Every agent |
| 3.3 | Latest CHG entries (DOC-13) + relevant HDO handovers | Every agent (state awareness) |
| 3.4 | Task-relevant blueprints (DOC-01…08) | Per task type |
| 3.5 | Registries relevant to the task (DOC-22/23/26/27/28/29) | Per task type |

**Rule:** if an agent changes something and cannot point to the memory entry that defined the prior state, it must stop and investigate before proceeding (this is the anti-drift rule, R-G-01).

## 4. Write Protocol (Mandatory)

After completing any task, the agent **must** write, in this order:

1. **Task trace** — DOC-11: status → Completed, notes (assumptions, problems, decisions), completion date.
2. **Change trace** — DOC-13: new CHG-NNN entry (what/why/affected docs/versions).
3. **State mirrors** — DOC-19 snapshots + `Last Updated` (per DOC-19 §9).
4. **Domain registries** — DOC-18 (components), DOC-22 (lessons), DOC-21 (knowledge), DOC-27 (prompts), DOC-28 (decisions), DOC-15 (risks) as applicable.
5. **Session transfer** — DOC-12: HDO-NNN handover in `docs/handovers/` (interim or final), linked from task Notes.

**Rule:** steps 1–3 are mandatory for every task; steps 4–5 apply when the task touches those domains. Writing memory after the session ends is **not** permitted — the handover is written before finishing.

## 5. Memory Hygiene Rules

| # | Rule | Detail |
|---|------|--------|
| 5.1 | **No secrets** | Never write credentials, tokens, or personal data into any memory layer (DOC-12 §5) |
| 5.2 | **Facts over opinion** | Notes state observations with dates and IDs, not vague impressions |
| 5.3 | **No duplication** | If a fact exists, reference it — never copy it into a second location (R-02) |
| 5.4 | **Timestamps on every entry** | Every note/entry carries an ISO date; "today" is never implied |
| 5.5 | **One truth per fact** | Ambiguity is resolved by the authority listed in MASTER_INDEX §6 |
| 5.6 | **No speculation** | Unverified claims go to task notes marked `[unverified]`, never into permanent docs |
| 5.7 | **Append-only for logs** | CHG, ADR, RISK, HDO, CHKPT, PRMPT, KBE records are append-only; corrections add new entries |
| 5.8 | **Freshness** | Stale memories are flagged and corrected, never silently ignored |

## 6. Memory Verification

- **Every task verification (DOC-16 Gate G)** checks: changelog entry exists (G-01), docs updated (G-02), task record complete (G-04), handover done (G-05), assumptions recorded (G-06).
- **Quarterly memory audit (Governance Lead):** sample 3 tasks + 3 handovers + 3 registries; check consistency between DOC-13/11/19 and reality.
- **Automated checks (MS-02, TASK-101):** link lint, ID-format lint, header compliance — operationalizing §3/§4.
- **Drift handling:** any mismatch between memory and reality is recorded as a task (R-G-01) and fixed, with the fix logged in DOC-13.

## 7. Update Rules (Mandatory)

1. Memory is updated in the **same change** that produces the work (never in a later "catch-up" session).
2. New memory types require a change to this document (DOC-20) + DOC-13 entry + Governance Lead approval.
3. Version bump per DOC-25; this document follows semver.
4. If a memory entry is found wrong, correct it with a new entry referencing the old one (append-only rule §5.7).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-20): memory classes, read/write protocols, hygiene, verification. |

## Notes

- This document does not store memory; it defines how memory is stored. Content belongs in the referenced locations.
- The model deliberately over-specifies the write path — under-specification is what causes agent-to-agent context loss.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-10 Agent Rules](10_AGENT_RULES.md) | R-05/R-07/R-08 operationalized here |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Task trace location |
| [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) | Session transfer location |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Change trace location |
| [DOC-17 MASTER_INDEX](MASTER_INDEX.md) | Memory map / navigation |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Gate G checks memory writes |
