# LESSONS_INDEX — Lesson Registry

> **Document ID:** DOC-22 · **Status:** Active · **Owner:** Curriculum Director (role)

| Field | Value |
|-------|-------|
| **Title** | Lessons Index |
| **Purpose** | The canonical registry of every lesson in the curriculum: lesson code, owning module, and production status. It is the uniqueness authority for `LES-*` codes and the status tracker for content production. DOC-03 defines *what* the lessons are; this registry tracks *their production state*. |
| **Owner** | Curriculum Director (role) |
| **Version** | 1.0.14 |
| **Status** | Active |
| **Dependencies** | DOC-03 (curriculum skeleton — titles and structure), DOC-07 (content standards), DOC-11 (tasks), DOC-13 (changelog) |
| **Last Updated** | 2026-08-01 |
| **Review Cadence** | Updated continuously during content production (MS-02…06); reviewed at every milestone boundary |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. How Agents Must Use This Document](#2-how-agents-must-use-this-document)
- [3. Status Values & Transitions](#3-status-values--transitions)
- [4. Master Lesson Index](#4-master-lesson-index)
- [5. Uniqueness & Registration Rules](#5-uniqueness--registration-rules)
- [6. Relationship to Other Registries](#6-relationship-to-other-registries)
- [7. Completion & Status Field](#7-completion--status-field)
- [8. Update Rules (Mandatory)](#8-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

The LESSONS_INDEX serves three functions:

1. **Uniqueness authority** — no two lessons may share a `LES-*` code; this registry is where collisions are detected (DOC-10 R-02).
2. **Status tracker** — the authoritative record of each lesson's production status (Not started → … → Published), so parallel content agents never produce the same lesson twice.
3. **Content-package linkage** — each row gains a content-package reference when the lesson is authored (DOC-07 §8), tying curriculum structure to the content pipeline.

Lesson **titles** intentionally live only in [DOC-03](03_CURRICULUM_BLUEPRINT.md) — they are not duplicated here.

## 2. How Agents Must Use This Document

1. **Before authoring any lesson:** check its row here. If Status ≠ `Not started`, the lesson is claimed — do not duplicate (R-02/R-03).
2. **When claiming a lesson for production:** set Status = `In production`, assign the task ID and agent in the row's notes column, and record it in DOC-11 (task) and DOC-13 (changelog entry at completion).
3. **After producing a lesson:** move the row through §3 transitions; each transition is part of the task's Done criteria (DOC-10 §7).
4. **Before creating a new lesson code:** verify the code against DOC-03 and §5 rules — new codes require a Curriculum Change Proposal (DOC-03 §17).

## 3. Status Values & Transitions

| Status | Meaning | Transition rule |
|--------|---------|-----------------|
| `Not started` | Defined in DOC-03, no content produced | → `In production` when claimed |
| `In production` | Content being authored by a claimed task | → `In review` when self-review passed (DOC-16 Gate B) |
| `In review` | Content in the DOC-16 review workflow | → `Published` or `In production` (rework) |
| `Published` | Content passed all gates; live in the content pipeline | → `Retired` only via CCP |
| `Retired` | Removed from active curriculum; never deleted or renumbered | Terminal (or `Published` via reactivation CCP) |

Each transition records: date, task ID, agent, reviewer (for review states).

## 4. Master Lesson Index

*All 156 lessons from DOC-03 are now `In review`. Phase 4B (2026-08-01, TASK-201, AGT-003): all 84 placeholder lessons (MOD-0303→MOD-0704) replaced with original content, and the 9 missing lessons produced (MOD-0205 ×4, MOD-0801 ×2, MOD-0802 ×3). No lesson remains Not started or In production.*

| Lesson | Module | Status | Production task / notes |
|--------|--------|--------|-------------------------|
| LES-010101 | MOD-0101 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010102 | MOD-0101 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010103 | MOD-0101 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010104 | MOD-0101 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010201 | MOD-0102 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010202 | MOD-0102 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010203 | MOD-0102 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010204 | MOD-0102 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010205 | MOD-0102 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010301 | MOD-0103 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010302 | MOD-0103 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010303 | MOD-0103 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010304 | MOD-0103 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010401 | MOD-0104 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010402 | MOD-0104 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-010403 | MOD-0104 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020101 | MOD-0201 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020102 | MOD-0201 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020103 | MOD-0201 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020104 | MOD-0201 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020105 | MOD-0201 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020106 | MOD-0201 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020201 | MOD-0202 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020202 | MOD-0202 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020203 | MOD-0202 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020204 | MOD-0202 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020205 | MOD-0202 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020206 | MOD-0202 | In review | TASK-103 · AGT-002 · In review (Content Director pending) |
| LES-020301 | MOD-0203 | In review | AGT-003 · MOD-0203 production |
| LES-020302 | MOD-0203 | In review | AGT-003 · MOD-0203 production |
| LES-020303 | MOD-0203 | In review | AGT-003 · MOD-0203 production |
| LES-020304 | MOD-0203 | In review | AGT-003 · MOD-0203 production |
| LES-020305 | MOD-0203 | In review | AGT-003 · MOD-0203 production |
| LES-020306 | MOD-0203 | In review | AGT-003 · MOD-0203 production |
| LES-020401 | MOD-0204 | In review | AGT-003 · MOD-0204 production |
| LES-020402 | MOD-0204 | In review | AGT-003 · MOD-0204 production |
| LES-020403 | MOD-0204 | In review | AGT-003 · MOD-0204 production |
| LES-020404 | MOD-0204 | In review | AGT-003 · MOD-0204 production |
| LES-020405 | MOD-0204 | In review | AGT-003 · MOD-0204 production |
| LES-020406 | MOD-0204 | In review | AGT-003 · MOD-0204 production |
| LES-020501 | MOD-0205 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-020502 | MOD-0205 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-020503 | MOD-0205 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-020504 | MOD-0205 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-030101 | MOD-0301 | In review | AGT-003 · MOD-0301 production |
| LES-030102 | MOD-0301 | In review | AGT-003 · MOD-0301 production |
| LES-030103 | MOD-0301 | In review | AGT-003 · MOD-0301 production |
| LES-030104 | MOD-0301 | In review | AGT-003 · MOD-0301 production |
| LES-030105 | MOD-0301 | In review | AGT-003 · MOD-0301 production |
| LES-030106 | MOD-0301 | In review | AGT-003 · MOD-0301 production |
| LES-030201 | MOD-0302 | In review | AGT-003 · MOD-0302 production |
| LES-030202 | MOD-0302 | In review | AGT-003 · MOD-0302 production |
| LES-030203 | MOD-0302 | In review | AGT-003 · MOD-0302 production |
| LES-030204 | MOD-0302 | In review | AGT-003 · MOD-0302 production |
| LES-030205 | MOD-0302 | In review | AGT-003 · MOD-0302 production |
| LES-030206 | MOD-0302 | In review | AGT-003 · MOD-0302 production |
| LES-030301 | MOD-0303 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030302 | MOD-0303 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030303 | MOD-0303 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030304 | MOD-0303 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030305 | MOD-0303 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030401 | MOD-0304 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030402 | MOD-0304 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030403 | MOD-0304 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030404 | MOD-0304 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030405 | MOD-0304 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-030406 | MOD-0304 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040101 | MOD-0401 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040102 | MOD-0401 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040103 | MOD-0401 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040104 | MOD-0401 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040105 | MOD-0401 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040106 | MOD-0401 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040201 | MOD-0402 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040202 | MOD-0402 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040203 | MOD-0402 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040204 | MOD-0402 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040205 | MOD-0402 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040206 | MOD-0402 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040301 | MOD-0403 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040302 | MOD-0403 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040303 | MOD-0403 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040304 | MOD-0403 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040305 | MOD-0403 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040306 | MOD-0403 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040401 | MOD-0404 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040402 | MOD-0404 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040403 | MOD-0404 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040404 | MOD-0404 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040405 | MOD-0404 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-040406 | MOD-0404 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050101 | MOD-0501 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050102 | MOD-0501 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050103 | MOD-0501 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050104 | MOD-0501 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050201 | MOD-0502 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050202 | MOD-0502 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050203 | MOD-0502 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050204 | MOD-0502 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050205 | MOD-0502 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050206 | MOD-0502 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050301 | MOD-0503 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050302 | MOD-0503 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050303 | MOD-0503 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050304 | MOD-0503 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050401 | MOD-0504 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050402 | MOD-0504 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050403 | MOD-0504 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-050404 | MOD-0504 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060101 | MOD-0601 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060102 | MOD-0601 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060103 | MOD-0601 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060104 | MOD-0601 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060201 | MOD-0602 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060202 | MOD-0602 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060203 | MOD-0602 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060204 | MOD-0602 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060205 | MOD-0602 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060206 | MOD-0602 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060301 | MOD-0603 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060302 | MOD-0603 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060303 | MOD-0603 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060304 | MOD-0603 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060401 | MOD-0604 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060402 | MOD-0604 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-060403 | MOD-0604 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070101 | MOD-0701 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070102 | MOD-0701 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070103 | MOD-0701 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070104 | MOD-0701 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070105 | MOD-0701 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070201 | MOD-0702 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070202 | MOD-0702 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070203 | MOD-0702 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070204 | MOD-0702 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070301 | MOD-0703 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070302 | MOD-0703 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070303 | MOD-0703 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070401 | MOD-0704 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-070402 | MOD-0704 | In review | TASK-201 · AGT-003 · In review (Phase 4B: placeholder replaced with original content) |
| LES-080101 | MOD-0801 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080102 | MOD-0801 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080103 | MOD-0801 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-080104 | MOD-0801 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-080201 | MOD-0802 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080202 | MOD-0802 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-080203 | MOD-0802 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-080204 | MOD-0802 | In review | TASK-201 · AGT-003 · In review (Phase 4B: missing lesson produced with original content) |
| LES-080301 | MOD-0803 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080302 | MOD-0803 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080303 | MOD-0803 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080304 | MOD-0803 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080305 | MOD-0803 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080401 | MOD-0804 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080402 | MOD-0804 | In review | AGT-003 · STG-03 to STG-08 production |
| LES-080403 | MOD-0804 | In review | AGT-003 · STG-03 to STG-08 production |
**Totals:** 156 lessons · 33 modules · Status distribution: Not started = 0 · In production = 0 · In review = 156 · Published = 0 · Retired = 0.

## 5. Uniqueness & Registration Rules

| # | Rule |
|---|------|
| 5.1 | `LES-0XYYZZ` is the permanent code (format per DOC-24); never reused after retirement. |
| 5.2 | A lesson code may appear in exactly one row here and exactly one module row in DOC-03. |
| 5.3 | New lessons require: (a) DOC-03 entry via CCP, (b) row added here, (c) DOC-13 entry — in that order, same change. |
| 5.4 | Splitting a lesson creates a new code (e.g., `LES-020305A/B` is **not** allowed; use new `LES-*` codes via CCP). |
| 5.5 | Registry edits are append-only for status history; the row's history is recorded via DOC-13 entries per transition. |

## 6. Relationship to Other Registries

| Registry | Relationship |
|----------|--------------|
| [DOC-03](03_CURRICULUM_BLUEPRINT.md) | Source of structure: stages, modules, titles, prerequisites |
| [DOC-07](07_CONTENT_STANDARDS.md) | Production rules for each lesson's content |
| [DOC-08](08_ASSESSMENT_STANDARD.md) | Lesson checkpoint/quiz rules (AT-01/02/04) |
| DOC-11 | Production tasks reference lesson codes in their descriptions |
| DOC-13 | Changelog records every lesson status transition |
| DOC-21 (KBE) | Findings about lessons (e.g., KBE-002) link back here |

## 7. Completion & Status Field

| Field | Value |
|-------|-------|
| **Total lessons registered** | 156 |
| **Lessons published** | 0 |
| **Lessons in production** | 0 |
| **Lessons in review** | 156 (all stages — TASK-103 P1-A, Phase 3 mass production, TASK-201 Phase 4B) |
| **Lessons not started** | 0 |
| **Registry verified against DOC-03** | 2026-08-01 (156/156 match) |
| **Next production trigger** | Content Director review (DOC-16 Gate C) of the full 156-lesson corpus |

## 8. Update Rules (Mandatory)

1. Status changes are made **in the same change** that delivers the underlying content work.
2. Every status transition requires a DOC-13 entry (CHG-NNN) and the task record update in DOC-11.
3. The completion field (§7) is recomputed on every edit.
4. Registry structure changes (columns, statuses) require Curriculum Director approval + DOC-13 entry + version bump per DOC-25.
5. If a lesson in DOC-03 is missing from this registry (or vice versa), raise a task immediately — this is a data-integrity defect (Gate D).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.14 | 2026-08-01 | AGT-003 | Phase 4B completion (TASK-201): 9 missing lessons produced (MOD-0205, MOD-0801, MOD-0802) — registry now 156/156 `In review` (CHG-023). |
| 1.0.13 | 2026-08-01 | AGT-003 | Phase 4B (TASK-201): all 84 placeholder lessons (MOD-0303→MOD-0704) replaced with original content and set `In review` (CHG-018…CHG-022). |
| 1.0.1 | 2026-07-31 | AGT-002 | P1-A batch produced (TASK-103): 28 lessons set to `In review` with production notes (CHG-004). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-22): all 156 lessons registered from DOC-03, status Not started. |

## Notes

- Titles are intentionally omitted — always resolve titles via DOC-03 to avoid duplication.
- This registry becomes the heartbeat of content production (MS-02…06): expect frequent, small updates.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Structure and titles source |
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | How lessons are produced |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Production tasks |
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Transition records |
| [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | LES code format |
| [DOC-25 VERSIONING_POLICY](VERSIONING_POLICY.md) | Registry versioning |
