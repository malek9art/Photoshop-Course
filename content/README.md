# Content Pipeline — P1-A Pilot Content

> **Purpose:** Root of the curriculum content packages for the Adobe Creative Academy.
> **Scope:** P1-A only (DOC-32): STG-01 complete + MOD-0201 + MOD-0202 = **28 lessons**.
> **Created by:** AGT-002 (Phase 1 Content Producer) · 2026-07-31 · **Status:** Content in review (DOC-22)
> **Authorized:** GATE-F1 PASS (DOC-31/37) → Phase 1 (DOC-38); `content/` creation authorized at MS-02 per DOC-18 §6.

---

## 1. Structure

```
content/
├── README.md                        ← this manifest
├── stg-01-foundations/
│   ├── mod-0101-welcome/            ← 4 lessons + module quiz
│   ├── mod-0102-design-fundamentals/← 5 lessons + module quiz
│   ├── mod-0103-digital-color/      ← 4 lessons + module quiz
│   ├── mod-0104-orientation/        ← 3 lessons + quiz + placement (AT-07)
│   ├── STG-01-EXAM.md               ← stage exam (AT-06), 30 items
│   └── STG-01-PROJECT.md            ← stage project (AT-05) + rubric
└── stg-02-photoshop/
    ├── mod-0201-photoshop-fundamentals/ ← 6 lessons + module quiz
    └── mod-0202-retouching/             ← 6 lessons + module quiz
```

## 2. Naming (per DOC-24 / DOC-07 §8)

| Artifact | Pattern | Example |
|----------|---------|---------|
| Lesson file | `LES-NNNNNN.md` | `LES-010101.md` |
| Module quiz | `QUIZ-MOD-NNNN.md` | `QUIZ-MOD-0101.md` |
| Stage exam | `STG-NN-EXAM.md` | `STG-01-EXAM.md` |
| Stage project | `STG-NN-PROJECT.md` | `STG-01-PROJECT.md` |
| Placement | `PLACEMENT-AT07-STG-NN.md` | `PLACEMENT-AT07-STG-01.md` |
| Future media | `{lesson-code}-{asset-role}-v{ver}.{ext}` | `LES-020101-demo-v1.mp4` |

## 3. Lesson anatomy (binding — DOC-07 §3.1)

Every lesson file contains, in order: frontmatter (§8 metadata) → الأهداف → المتطلبات → مقدمة → الشرح → تطبيق موجه → تمارين (incl. مهمة مصغرة) → نقطة تحقق (with answers marked solution-internal) → الخلاصة → موارد → حالة الإنجاز + self-review record.

## 4. Status convention

| Registry value (DOC-22) | Meaning |
|--------------------------|---------|
| `In production` | Being authored by a claimed task |
| `In review` | Producer self-review (DOC-16 Gates B/D/E) passed; awaiting Content Director review (DOC-35 C-1) |
| `Published` | Reviewed and passed; content live |

All 28 P1-A lessons are currently `In review` (producer AGT-002), pending reviewer = Content Director.

## 5. App-version baseline (assumption — DOC-10 R-07)

- Photoshop lessons target **Adobe Photoshop 26.x (2025 release)** as the production baseline.
- **Assumption:** exact version baseline must be re-verified at media production (OPD-004 / MS-03) per DOC-03 §17 and recorded in DOC-13 if changed.
- STG-01 lessons: no Adobe application required (platform/design foundations).

## 6. Media note (ADR-007)

No media assets are shipped in this batch. All lesson files reference asset roles by name (e.g., `LES-020101-demo-v1.mp4`) for future production. Every asset must carry a license record (ENT-ASSET.licenseRef) before publication; no unlicensed third-party material (DOC-07 §6).

## 7. Update rules

1. Add new files here only within the approved scope (DOC-32); scope changes need a CCR (DOC-36).
2. Every status change in DOC-22 is mirrored by a changelog entry (DOC-13).
3. Structure changes to this manifest require Content Director approval + DOC-13 entry.

## Revision History

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| 1.0.0 | 2026-07-31 | AGT-002 | Initial P1-A content batch created (28 lessons + 6 module quizzes + exam + project + placement). |
