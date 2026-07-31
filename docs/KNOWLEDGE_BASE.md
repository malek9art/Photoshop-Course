# KNOWLEDGE_BASE — Knowledge Base

> **Document ID:** DOC-21 · **Status:** Active · **Owner:** Content Director (role)

| Field | Value |
|-------|-------|
| **Title** | Knowledge Base |
| **Purpose** | The registry of accumulated project knowledge: durable lessons, technical findings, references, and links that future agents should not have to rediscover. It is an index of knowledge entries (KBE-NNN) and external references — not a place to duplicate content that belongs in DOC-01…29. |
| **Owner** | Content Director (role) |
| **Version** | 1.0.2 |
| **Status** | Active |
| **Dependencies** | DOC-07 (content standards), DOC-12 (handovers → lessons), DOC-14 (decisions), DOC-24 (naming) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Monthly during production phases; quarterly otherwise |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. How Agents Must Use This Document](#2-how-agents-must-use-this-document)
- [3. Knowledge Entry Format](#3-knowledge-entry-format)
- [4. Knowledge Base Index](#4-knowledge-base-index)
- [5. External Reference Registry](#5-external-reference-registry)
- [6. Lessons-Learned Index](#6-lessons-learned-index)
- [7. Update Rules (Mandatory)](#7-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

The KNOWLEDGE_BASE answers: *"Has anyone already solved this problem?"* It captures durable knowledge that does not belong in a blueprint (which describes *how things must be*) nor in the changelog (which records *what happened*), but which future agents need: technical findings, tool quirks, cultural/typographic insights, evaluation results, and pointers to authoritative external material.

**Boundary rule:** if a fact belongs in an existing document (DOC-01…29), it lives there and this file only links to it. This file holds *new* knowledge only.

## 2. How Agents Must Use This Document

1. **Search before you start:** when beginning any non-trivial task, scan the index (§4) for existing knowledge on the topic. If it exists, read it and cite it in your task notes.
2. **Record after you learn:** any durable finding made during a task becomes a KBE entry (§3) in the same change, with a DOC-13 changelog entry.
3. **Point, don't copy:** knowledge that duplicates a document's content is reduced to a pointer row.
4. **Review cadence:** entries are reviewed by the Content Director monthly; obsolete entries are marked `Superseded` (never deleted).

## 3. Knowledge Entry Format

```markdown
### KBE-NNN — <Short Title>
- **Date:** YYYY-MM-DD
- **Category:** technical / educational / ux / cultural / tooling / process / media
- **Source:** <task ID, handover ID, ADR ID, or external URL>
- **Finding:** <what was learned, 1–4 sentences, factual>
- **Applies to:** <components, stages, docs affected>
- **Status:** Draft / Accepted / Superseded
- **Related:** <KBE-XXX, DOC-XX, TASK-XXX>
```

Rules: one entry per finding; append-only (corrections add a new entry referencing the old); entries must be verifiable (cite the source).

## 4. Knowledge Base Index

| KBE | Title | Category | Status | Notes |
|-----|-------|----------|--------|-------|
| KBE-001 | Curriculum effort model (210 h total) | educational | Accepted | Derived from DOC-03 §14; used for learner-effort claims and path durations |
| KBE-002 | Lesson-count registry procedure | process | Accepted | 156 lesson codes enumerated from DOC-03; registry of record is DOC-22 |
| KBE-003 | RTL mirroring catalog | ux | Accepted | Mirroring rules defined in DOC-06 §6/§9; implementation notes to be added during MS-11 |
| KBE-004 | Arabic typography constraints | cultural | Accepted | Line-height, letter-spacing, numerals per DOC-06 §4; rendering findings pending MS-11 |
| KBE-005 | Content-licensing compliance baseline | process | Accepted | ADR-007; asset license records required (DOC-07 §6) |
| KBE-006 | Cross-app workflow versions | technical | Draft | Adobe app version tracking policy per DOC-03 §17; version matrix to be populated during MS-03…06 |
| KBE-007 | Agent-session memory model | process | Accepted | Memory classes and write protocol per DOC-20 |
| KBE-008 | Phase-transition kit | process | Accepted | Gate + criteria + scope + entry-point quartet (DOC-31/37/32/38); ADR-009 review model; foundation closed 2026-07-31 |

| KBE-009 | P1-A lesson template (12 elements) | process | Accepted | Lesson anatomy per DOC-07 §3 + user-required fields (goals/explanation/exercise/mini-assignment/quiz/answers/resources/time/prereqs/status) validated on 28 lessons; reuse for MS-03+ batches |
| KBE-010 | Quiz pool sizing per module | educational | Accepted | 16-item pools per module quiz (2× of 8 drawn) proven feasible; reuse for all future modules (DOC-07 §5.3) |
| KBE-011 | appVersion declaration pattern | technical | Draft | Photoshop 26.x (2025) declared per lesson; must be re-verified at media production (OPD-004/MS-03) per DOC-03 §17 |

> New entries (KBE-012+) will be added during continued content production (MS-03+): e.g., per-app pitfalls, Arabic UI term resolutions, media encoding findings.

## 5. External Reference Registry

| Ref ID | External resource | Purpose | Verified | Notes |
|--------|-------------------|---------|----------|-------|
| EXT-001 | Adobe Help Center (`helpx.adobe.com`) | Official app documentation for content accuracy | 2026-07-31 | Content must cite app versions from here (DOC-03 §17) |
| EXT-002 | Adobe Creative Cloud tutorials | Supplementary reference for producers | 2026-07-31 | Never copy verbatim (DOC-07 CP-6) |
| EXT-003 | Adobe trademark guidelines | Brand/legal compliance | 2026-07-31 | ADR-007; recheck at MS-13 |
| EXT-004 | WCAG 2.2 specification | Accessibility standard source | 2026-07-31 | Binding per DOC-06 §8 |
| EXT-005 | Arabic localization guidance (W3C i18n) | RTL/bidi/typography reference | 2026-07-31 | Supports DOC-06 §9 |

**Rule:** external references are added only with a URL, purpose, and verification date; broken or outdated references are flagged and replaced (recorded in DOC-13).

## 6. Lessons-Learned Index

Lessons learned live in their original source; this index points to them:

| Source | Location | Summary |
|--------|----------|---------|
| Foundation baseline session | [HDO-001](handovers/HDO-001_TASK-001-018_2026-07-31.md), DOC-12 §7 | ID schemes made cross-referencing tractable; append-only logs keep trust |
| Operating-docs extension session | HDO-002 (this extension) | Registry documents (index/manifest/state) require strict mirror-update discipline |

## 7. Update Rules (Mandatory)

1. New knowledge → append KBE entry here (§4) + record in DOC-13; do not edit existing entries (append-only).
2. Knowledge that duplicates DOC-01…29 → replace with a pointer row and delete the duplicated text.
3. External references → add via §5 format; verify the URL works; record verification date.
4. Obsolete entries → mark `Superseded` with a pointer to the replacement; never delete.
5. Version bump per DOC-25 on structural changes (new categories, format changes).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.2 | 2026-07-31 | AGT-002 | KBE-009…011 added (P1-A lesson template, quiz pool sizing, appVersion pattern) (CHG-004). |
| 1.0.1 | 2026-07-31 | Project Foundation Architect | KBE-008 added (phase-transition kit; foundation closure) (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-21): entry format, 7 seed entries, external reference registry, lessons-learned index. |

## Notes

- The knowledge base starts lean by design; it grows through production phases. Quality over volume.
- Every KBE entry must be *usable by a future agent without asking the author* — apply the fresh-agent test (DOC-12 §5.6).

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Standards knowledge supports |
| [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) | Lessons-learned source |
| [DOC-14 Decision Log](14_DECISION_LOG.md) | Decisions referenced by KBEs |
| [DOC-22 LESSONS_INDEX](LESSONS_INDEX.md) | Lesson registry (KBE-002) |
| [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | KBE-NNN ID format authority |
