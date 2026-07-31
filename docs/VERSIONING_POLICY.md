# VERSIONING_POLICY — Versioning Policy

> **Document ID:** DOC-25 · **Status:** Active · **Owner:** Governance Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Versioning Policy |
| **Purpose** | The single authority for how every artifact in the project is versioned: documents, templates, content packages, schemas, decisions, prompts, checkpoints, and releases. It extends DOC-13 §4 (document semver) into a complete, uniform policy. |
| **Owner** | Governance Lead (role) |
| **Version** | 1.0.1 |
| **Status** | Active |
| **Dependencies** | DOC-13 (changelog — version records), DOC-07 (content packages), DOC-05 (schemas), DOC-24 (naming) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Yearly, or when a new artifact type introduces a new version scheme |

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. Versioning Principles](#2-versioning-principles)
- [3. Version Schemes by Artifact Type](#3-version-schemes-by-artifact-type)
- [4. Document Versioning Rules](#4-document-versioning-rules)
- [5. Content Package Versioning](#5-content-package-versioning)
- [6. Data & Schema Versioning](#6-data--schema-versioning)
- [7. Version ↔ Changelog Coupling](#7-version--changelog-coupling)
- [8. Update Rules (Mandatory)](#8-update-rules-mandatory)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Purpose

Every artifact in this project evolves, and **who changed what version** must always be recoverable. This policy defines:

- the version scheme per artifact type (§3),
- when each level of a version bumps (§4–§6),
- how versions couple to the changelog (§7).

**Boundary rule:** DOC-13 records *changes*; this document defines *how versions behave*. Both must be updated together on every change.

## 2. Versioning Principles

| # | Principle |
|---|-----------|
| 2.1 | **Every mutable artifact has a version.** If it can change, it has a version field. |
| 2.2 | **Semantic versions everywhere.** `MAJOR.MINOR.PATCH` is the universal scheme; specialized artifacts add qualifiers (e.g., `+build`). |
| 2.3 | **Version changes are explicit.** A version bump without a changelog entry is invalid; a changelog entry without a version bump is a defect (Gate G). |
| 2.4 | **Versions are immutable once published.** A published version is never overwritten; the next version is created (content pipeline, DOC-02 §8.1). |
| 2.5 | **Historical reproducibility.** At any time, the exact state of any artifact at any past version must be reconstructable from git history + the changelog. |

## 3. Version Schemes by Artifact Type

| Artifact | Scheme | Example | Version field location |
|----------|--------|---------|------------------------|
| Documents (DOC-01…29) | `X.Y.Z` semver | `1.0.1` | Header table + Revision History |
| Templates | `X.Y.Z` | `1.0.0` | Template header |
| Content packages | `X.Y.Z` | `1.2.0` | Package metadata (DOC-07 §8) |
| Media assets | `{code}-v{X.Y.Z}` (filename) | `LES-020305-demo-v1.0.1.mp4` | Filename + ENT-ASSET |
| Data schemas | `schemaVersion X.Y.Z` | `schemaVersion 1.0.0` | Package frontmatter |
| ADRs / OPDs / Risks / KBEs / PRMPTs / CHKPTs / DEPs | No version — **immutable records** | — | Revision via DOC-13 entries only |
| Tasks / Milestones | No version — status-based | — | DOC-11 / DOC-09 status fields |
| Certificate templates | `X.Y.Z` | `2.1.0` | ENT-CERTTEMPLATE |
| Platform releases (future) | `vX.Y.Z` + SemVer | `v1.0.0` | Git tags (at MS-13) |
| API contracts (future) | `X.Y.Z` per contract | `1.3.0` | Contract registry (MS-08) |
| This policy | `X.Y.Z` | `1.0.0` | This header |

## 4. Document Versioning Rules

Per DOC-13 §4, extended:

| Change type | Bump | Examples | Approval |
|-------------|------|----------|----------|
| Typo, formatting, link fix | PATCH (`1.0.0 → 1.0.1`) | Fixed broken link, corrected date | None (self-review) |
| Content addition/clarification, no rule change | MINOR (`1.0.0 → 1.1.0`) | New section, new example, registry row added | Document owner |
| Structural change or rule/threshold/architecture change | MAJOR (`1.0.0 → 2.0.0`) | Changed passing threshold, changed architecture, new binding rule | Document owner + Governance Lead |

**Rules:**
- The `Version` field in the header and the Revision History table are updated in the **same change** as the content.
- **Revision History tables list versions newest-first** (the newest version row is the first row under the table header).
- Registry documents (DOC-11/13/14/15/21/22/23/26/27/28/29) bump MINOR for additions (new rows), MAJOR for structure changes.
- A document's `1.0.0` baseline is the first committed state; the baseline changelog entry records `n/a → 1.0.0`.

## 5. Content Package Versioning

- Content packages follow SemVer: MAJOR = structural/curriculum change (requires CCP, DOC-03 §17), MINOR = content addition or improvement, PATCH = fix (typo, asset swap, minor correction).
- `appVersion` (Adobe app version) is tracked **alongside** package version — a PATCH to lesson content due to an Adobe update still bumps the package version (DOC-03 §17).
- Published versions are immutable; a change always produces a new version (DOC-02 §8.1).
- Package versions are referenced from DOC-22 (LESSONS_INDEX) rows.

## 6. Data & Schema Versioning

- Every content package carries `schemaVersion`; producers never mix schema versions in one package.
- Schema changes are additive by default (new optional fields → MINOR); breaking changes (MAJOR) require an ADR (DOC-14) and a migration plan (DOC-05).
- No physical schema exists yet; when it does (OPD-002 resolved), database migrations follow the same SemVer discipline with `MIG-*` records (family to be added to DOC-24 §8).

## 7. Version ↔ Changelog Coupling

| # | Rule |
|---|------|
| 7.1 | Every version bump creates a CHG entry; every CHG entry lists the versions before → after (DOC-13 §3). |
| 7.2 | A changelog entry that changes a document without a version bump is a Gate G failure. |
| 7.3 | Version bumps without a changelog entry are likewise a Gate G failure. |
| 7.4 | Rollbacks (reverting a version) create a new entry with reason — never edit history. |

## 8. Update Rules (Mandatory)

1. Apply §4 before editing any document; apply §5–§6 before content/schema work.
2. When this policy changes (new artifact type, scheme change), bump MAJOR and record in DOC-13.
3. New artifact types with version needs are added to §3 before first use (with DOC-24 ID family if needed).
4. The policy is verified during DOC-16 Gate G (versions + changelog consistency).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.1 | 2026-07-31 | Project Foundation Architect | Added rule: Revision History tables list versions newest-first (CHG-002). |
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-25): unified versioning policy for all artifact types. |

## Notes

- Immutable records (ADRs, risks, changelog entries, handovers, KBEs) intentionally have no version — their evolution is their history.
- This policy is the authority; DOC-13 §4 remains the changelog's operational detail and is consistent with it.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-13 Project Changelog](13_PROJECT_CHANGELOG.md) | Version records + bump workflow |
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Package metadata/versioning |
| [DOC-05 Database Blueprint](05_DATABASE_BLUEPRINT.md) | Schema versioning targets |
| [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Content/curriculum change control (CCP) |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Gate G checks version coupling |
| [DOC-24 NAMING_CONVENTION](NAMING_CONVENTION.md) | Version/artifact naming |
