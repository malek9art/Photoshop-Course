# NAMING_CONVENTION — Naming & ID Convention

> **Document ID:** DOC-24 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Naming Convention |
| **Purpose** | The single authoritative source for all naming and ID formats in the repository: ID families, files, directories, branches, commits, content, and media. It consolidates and extends the conventions scattered in DOC-03 §2, DOC-05 §2, DOC-07 §6, and DOC-12 §4 so there is exactly one authority. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.1 |
| **Status** | Active |
| **Dependencies** | All documents that define identifiers (DOC-03, DOC-05, DOC-07, DOC-12, DOC-13, DOC-14, DOC-15, DOC-21, DOC-22, DOC-26, DOC-27, DOC-28, DOC-29) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | When a new ID family is introduced; otherwise yearly |

## Table of Contents

- [1. Purpose & Authority](#1-purpose--authority)
- [2. ID Families](#2-id-families)
- [3. File & Directory Naming](#3-file--directory-naming)
- [4. Branch & Commit Naming](#4-branch--commit-naming)
- [5. Content & Media Naming](#5-content--media-naming)
- [6. Arabic Naming Rules](#6-arabic-naming-rules)
- [7. Reserved & Prohibited Patterns](#7-reserved--prohibited-patterns)
- [8. Update Rules (Mandatory)](#8-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose & Authority

Consistent identifiers are what make a multi-agent repository tractable: agents reference `TASK-207` or `LES-020305` and everyone knows exactly what is meant. **This document is the authority.** If a convention stated in another document conflicts with this one, this document wins and the conflicting document must be corrected (recorded in DOC-13).

**Usage rule:** before creating any new identifier, file, branch, or commit, consult this document (§2–§5). If no format exists, follow §8 (propose a new family).

## 2. ID Families

| Family | Format (regex) | Example | Sequence | Owner | Source/status authority |
|--------|----------------|---------|----------|-------|-------------------------|
| Documents | `DOC-\d{2}` | DOC-38 | 01…38 assigned; next = 39 | Governance Lead | MASTER_INDEX §5 |
| Change requests | `CCR-\d{3}` | CCR-001 | next = 002 | Governance Lead | DOC-36 |
| Milestones | `MS-\d{2}` | MS-07 | 01…14 | Project Manager | DOC-09 |
| Tasks | `TASK-\d{3}` | TASK-207 | next = 308 | Project Manager | DOC-11 |
| Accepted decisions | `ADR-\d{3}` | ADR-008 | next = 009 | Lead Architect | DOC-14 |
| Open decisions | `OPD-\d{3}` | OPD-002 | next = 009 | Lead Architect | DOC-28 / DOC-14 |
| Risks | `R-[A-Z]-\d{2}` | R-T-01 | per category: T/E/U/P/F/G | Risk Owner | DOC-15 |
| Changelog entries | `CHG-\d{3}` | CHG-002 | next = 003 | Governance Lead | DOC-13 |
| Handovers | `HDO-\d{3}` | HDO-002 | next = 003 | Governance Lead | DOC-12 |
| Agents | `AGT-\d{3}` | AGT-001 | next = 002 | Governance Lead | DOC-26 |
| Prompts | `PRMPT-\d{3}` | PRMPT-002 | next = 003 | Governance Lead | DOC-27 |
| Checkpoints | `CHKPT-\d{3}` | CHKPT-002 | next = 003 | Quality Lead | DOC-29 |
| Knowledge entries | `KBE-\d{3}` | KBE-007 | next = 008 | Content Director | DOC-21 |
| Dependencies | `DEP-\d{3}` | DEP-021 | next = 029 | Lead Architect | DOC-23 |
| External references | `EXT-\d{3}` | EXT-005 | next = 006 | Content Director | DOC-21 §5 |
| Stages | `STG-\d{2}` | STG-02 | fixed 01…08 | Curriculum Director | DOC-03 |
| Modules | `MOD-\d{4}` | MOD-0203 | stage + seq | Curriculum Director | DOC-03 |
| Lessons | `LES-\d{6}` | LES-020305 | stage+module+seq | Curriculum Director | DOC-22 |
| Learning paths | `PATH-\d{2}` | PATH-01 | fixed 01…05 | Curriculum Director | DOC-03 |
| Certificates | `CERT-\d{2}` | CERT-08 | fixed 01…08 | Curriculum Director | DOC-03/08 |
| Badges | `BDG-\d{2}` | BDG-01 | next free | Product owner | DOC-03 |
| Assessments | `AT-\d{2}` | AT-04 | fixed 01…08 | Assessment Lead | DOC-08 |
| Screens | `SCR-\d{2}` | SCR-13 | 01…29 | UX Lead | DOC-04 |
| Components | `C-\d{2}` | C-07 | 01…15 | Lead Architect | DOC-18 |
| Subsystems | `(name)` | Learner Experience | fixed 5 | Lead Architect | DOC-02 §5 |
| Entities | `ENT-[A-Z]+` | ENT-CONTENTPKG | per catalog | Data Architect | DOC-05 |
| Relationships | `R-\d{2}` (data model) | R-14 | per DOC-05 §5 | Data Architect | DOC-05 |
| Certificate serials | `ACA-\d{4}-\d{5}` | ACA-2026-00042 | yearly sequence | Assessment Lead | DOC-08 |
| Goals (vision) | `G-\d{2}` | G-03 | fixed | Product owner | DOC-01 |
| Metrics (vision) | `M-\d{2}` | M-14 | fixed | Product owner | DOC-01 |
| Personas | `P-\d{2}` | P-01 | fixed 01…06 | Product owner | DOC-01 |

**Universal rules:**
- IDs are **immutable** — never reused, never renumbered after creation.
- ID assignment happens at the **authority** listed in the rightmost column, at the moment of creation.
- Zero-padded widths are fixed; `TASK-207` is correct, `TASK-0207` is not.

## 3. File & Directory Naming

| Artifact | Pattern | Example | Notes |
|----------|---------|---------|-------|
| Core/blueprint docs | `NN_NAME.md` (zero-padded 2-digit) | `03_CURRICULUM_BLUEPRINT.md` | DOC-01…16 keep their numbered names permanently |
| Operating docs | `NAME.md` (UPPER_SNAKE) | `PROJECT_STATE.md` | DOC-17…29 (as created by this foundation) |
| Templates | `NAME_TEMPLATE.md` | `HANDOVER_TEMPLATE.md` | in `docs/templates/` |
| Handovers | `HDO-NNN_<TASK-ID>_<YYYY-MM-DD>.md` | `HDO-002_TASK-019-031_2026-07-31.md` | in `docs/handovers/` (DOC-12 §4) |
| Future source dirs | lowercase singular | `app/`, `content/`, `admin/` | Created only at their milestones (DOC-10 P-12) |
| Scratch files | outside repo | — | Never committed |
| Future code files | `kebab-case` | `lesson-player.tsx` | Platform decision deferred (OPD-001) but pattern fixed |

## 4. Branch & Commit Naming

| Item | Pattern | Example | Notes |
|------|---------|---------|-------|
| Session branches | `arena/<session-id>` | `arena/019fb8fa-photoshop-course` | Fixed per session; do not rename |
| Feature branches (future) | `feature/<milestone>-<topic>` | `feature/ms08-lesson-player` | For work that must not touch the session branch |
| Fix branches (future) | `fix/<topic>` | `fix/rtl-mirror-icons` | |
| Release branches (future) | `release/v<major>.<minor>` | `release/v1.0` | At MS-13 |
| Commits | `type(scope): summary` (Conventional Commits) | `docs: create DOC-17 MASTER_INDEX` | Types: `docs`, `feat`, `fix`, `chore`, `refactor`, `test`, `style`; scope = DOC/component |
| Merge policy | PRs only, `main` protected | — | Never push directly to `main` (DOC-10 P-12 spirit; confirmed in DOC-26) |

## 5. Content & Media Naming

| Artifact | Pattern | Example | Source |
|----------|---------|---------|--------|
| Content packages | `{type}-{stage}-{module}-{lesson}-v{ver}` | `lesson-STG02-MOD0203-LES020305-v1.0.0` | DOC-07 §8 |
| Media files | `{lesson-code}-{asset-role}-{version}.{ext}` | `LES-020305-demo-v1.mp4` | DOC-07 §6 |
| Media roles | `demo / brief / solution / reference / thumbnail / caption` | — | DOC-07 §6 |
| Rubrics | `RUBRIC-{code}` | `RUBRIC-STG02-PROJECT` | DOC-08 §6 |
| Quiz codes | `QUIZ-{kind}-{code}` | `QUIZ-MODQUIZ-MOD0203` | DOC-08 |

## 6. Arabic Naming Rules

1. Canonical titles (stages/modules/lessons/certificates) are stored in **Arabic (MSA)**; English is a working title only (DOC-03 §2).
2. File names, IDs, codes, and commit messages are **always Latin/ASCII** — Arabic never appears in identifiers or filenames.
3. Arabic titles are validated for consistency by the glossary (DOC-07 §2.3, ENT-GLOSSARY).
4. Mixed Arabic/English strings in documents use bidi-safe markdown and `lang` attributes where needed (DOC-06 §9).

## 7. Reserved & Prohibited Patterns

| # | Prohibited | Reason |
|---|------------|--------|
| 7.1 | Reusing/renumbering any ID | Immutability rule (§2) |
| 7.2 | `TASK-000`, `ADR-000`, `CHG-000` etc. | Reserved for templates/examples |
| 7.3 | Spaces or Arabic script in filenames/IDs | Tooling safety (git, CI, cross-platform) |
| 7.4 | Generic names like `final.md`, `new-doc.md`, `draft2.md` | Untraceable (Gate D) |
| 7.5 | Same ID in two families (e.g., `DOC-07` vs `TASK-07`) | Ambiguity; widths differ per family, keep it that way |
| 7.6 | Prefixing private agent scratch with official prefixes (`TASK-`, `HDO-`…) | Would pollute the registries |
| 7.7 | Renaming existing numbered docs (01_…16) | Breaks all cross-references; renaming requires ADR + full link migration |

## 8. Update Rules (Mandatory)

1. New ID families are proposed on the task board, approved by the Governance Lead, added to §2, and recorded in DOC-13.
2. Format changes to an existing family require the family owner's approval + DOC-13 entry + version bump per DOC-25 (MAJOR).
3. Every registry document (DOC-13/14/15/21/22/26/27/28/29) references this document for its ID format; when this document changes, the referencing registries are checked.
4. All naming decisions are final once IDs are in use; corrections are additive.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.1 | 2026-07-31 | Project Foundation Architect | Documents family extended to DOC-38 (next = 39); CCR ID family added (CHG-003). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-24): 31 ID families, file/branch/commit/content naming, Arabic rules, prohibitions. |

## Notes

- This document consolidates conventions that were previously scattered; where the old text disagreed, this document is authoritative (recorded via CHG-002).
- Future ID families (e.g., `MIG-*` for migrations, `REL-*` for releases) will be added here before first use.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | STG/MOD/LES/PATH/CERT/BDG formats |
| [DOC-05 Database Blueprint](05_DATABASE_BLUEPRINT.md) | ENT/relationship formats |
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Media/package naming |
| [DOC-12 Agent Handover](12_AGENT_HANDOVER.md) | HDO filename format |
| [DOC-17 MASTER_INDEX](MASTER_INDEX.md) | ID family quick reference |
| [DOC-25 VERSIONING_POLICY](VERSIONING_POLICY.md) | Version formats |
