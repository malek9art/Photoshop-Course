# 07 — Content Standards

> **Document ID:** DOC-07 · **Status:** Active · **Owner:** Content Director (role)

| Field | Value |
|-------|-------|
| **Title** | Content Standards |
| **Purpose** | Defines mandatory standards for all educational content produced for the academy: writing standards, lesson standards, exercise standards, quiz standards, translation rules, media rules, accessibility requirements, and content packaging/versioning. Every content deliverable — by human or AI agent — must conform. |
| **Owner** | Content Director (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-03 (curriculum skeleton), DOC-08 (assessment rules for quizzes), DOC-06 (media/visual), DOC-01 (tone/personas) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Quarterly; updated when a new content type is introduced |

## Table of Contents

- [1. Content Principles](#1-content-principles)
- [2. Writing Standards (Arabic)](#2-writing-standards-arabic)
- [3. Lesson Standards](#3-lesson-standards)
- [4. Exercise Standards](#4-exercise-standards)
- [5. Quiz Standards](#5-quiz-standards)
- [6. Media Rules](#6-media-rules)
- [7. Translation Rules](#7-translation-rules)
- [8. Content Metadata & Packaging](#8-content-metadata--packaging)
- [9. Accessibility in Content](#9-accessibility-in-content)
- [10. Review Workflow](#10-review-workflow)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Content Principles

| # | Principle | Meaning |
|---|-----------|---------|
| CP-1 | **Arabic-native** | Content is authored in Modern Standard Arabic (MSA) by default; English appears only as industry terms, code/UI strings, or approved bilingual glosses. |
| CP-2 | **Outcome-driven** | Every lesson states measurable objectives (DOC-03 CP-8) and every lesson's content maps to them. |
| CP-3 | **Production-credible** | All examples mirror real client deliverables; tutorials must be reproducible with the declared Adobe app version. |
| CP-4 | **Non-destructive teaching** | Lessons teach non-destructive workflows; destructive shortcuts appear only with explicit warnings. |
| CP-5 | **Fresh & versioned** | Content records the Adobe version it targets and is updated per DOC-03 §17. |
| CP-6 | **Original & licensed** | All assets are original or properly licensed (ADR-007). No copyrighted third-party material, no unlicensed fonts/stock. |
| CP-7 | **Consistent anatomy** | All lessons/exercises/quizzes follow the templates in this document exactly. |
| CP-8 | **Accessible** | Content accessibility (§9) is a requirement, not an afterthought. |

## 2. Writing Standards (Arabic)

### 2.1 Language and register

- **Register:** Modern Standard Arabic (العربية الفصحى المعاصرة), clear and warm-professional. No heavy classical flourishes, no colloquial dialect, no machine-translation artifacts.
- **Technical terminology:** Arabic term first with the English industry term in parentheses on first use per lesson, e.g., «الطبقات (Layers)». A shared glossary (ENT-GLOSSARY) is the single source for term mapping — content must use glossary-approved terms.
- **Second person:** address the learner as «أنت» (singular you) consistently. Avoid gendered ambiguity by using forms that read naturally for both; where the verb form forces gender, prefer neutral constructions or alternate consistent usage per module (decision `[TBD]` — must be uniform within a module).
- **Numbers/dates:** Arabic-Indic digits in prose; Western digits for exact tool values (e.g., «سحب نسبة العتامة إلى 40%»).

### 2.2 Grammar and style rules

| Rule | Example |
|------|---------|
| Sentence length ≤ 25 words average; one idea per sentence | — |
| Active voice preferred | «اضغط»، «حدد»، «اسحب» |
| Commands are gentle imperatives with rationale | «اسحب الطبقة إلى الأعلى لتظهر أمام الخلفية» |
| Explain *why* before *what* for key concepts | Why non-destructive → then the workflow |
| No fluff/openers | Start with the objective, not history |
| Consistent punctuation and Arabic quotation marks «» | — |
| Proofread for hamza forms, taa marbuta, and diacritics on foreign names | — |

### 2.3 Terminology governance

- New term mappings are added to the glossary (ENT-GLOSSARY) before use; conflicts resolved by Content Director.
- English never substitutes for a defined Arabic term in body text.

## 3. Lesson Standards

### 3.1 Lesson anatomy (binding template)

Every lesson (`LES-…`) contains exactly these sections in order:

| Section | Required | Notes |
|---------|----------|-------|
| 1. Header/metadata | Yes | Per §8 frontmatter |
| 2. الأهداف (Objectives) | Yes | 2–4 measurable objectives, learner-verb oriented («ستتمكن بحلول نهاية الدرس من…») |
| 3. المتطلبات (Prerequisites) | Yes | Explicit skill/path dependencies or «لا توجد» |
| 4. مقدمة (Introduction) | Yes | ≤ 90 seconds: what & why, real-world hook |
| 5. الشرح (Instruction) | Yes | Video/reading chunks per §6; each chunk ≤ 5 min |
| 6. تطبيق موجه (Guided practice) | Yes | Follow-along steps with expected intermediate results |
| 7. تمارين (Exercises) | Yes | ≥ 1 exercise per lesson per §4 |
| 8. نقطة تحقق (Checkpoint) | Yes | 1–3 quick self-check questions (formative, not graded as quizzes per DOC-08) |
| 9. الخلاصة (Summary) | Yes | Recap + what's next + common pitfalls |
| 10. موارد (Resources) | Optional | Downloadables, shortcuts sheet, glossary links |

### 3.2 Lesson length rules

- Instruction (video+reading) 5–20 min total; hard cap 20 min (DOC-03 CP-4).
- Guided practice adds 10–20 min; total lesson effort ≤ 45 min.
- Lessons that must exceed 45 min are split into two lessons via a CCP (DOC-03 §17).

### 3.3 Quality bar per lesson

- Reproducible: every step validated against the declared Adobe version by the producer.
- Screenshots/recordings show the Arabic UI locale (if the learner-facing app allows) or clearly-labeled English UI with Arabic explanation.
- No dead links, no references to non-existent assets; asset checklist per lesson.

## 4. Exercise Standards

### 4.1 Exercise types

| Type | Purpose | Assessment |
|------|---------|-----------|
| Guided (step-follow) | Skill practice | Self-check |
| Production (deliverable file) | Apply skills | Rubric-graded (DOC-08) |
| Fix-it (broken file) | Diagnosis | Auto/rubric |
| Variation (remake a result differently) | Transfer | Self-check + optional peer review |
| Challenge (open-ended) | Extend | Rubric (advanced modules) |

### 4.2 Exercise template

| Field | Required | Notes |
|-------|----------|-------|
| Brief (المطلوب) | Yes | Concrete deliverable, stated in ≤ 3 sentences |
| Given assets | Yes | Starter files, reference images, declared versions |
| Steps/checklist | Yes | For guided/fix-it types |
| Success criteria | Yes | Observable checks (mirror rubric criteria where applicable) |
| Time estimate | Yes | 15–30 min typical (DOC-03 §14) |
| Solution/discussion | Yes (internal) | Marked `solution-internal`, never shipped to learners in preview |

### 4.3 Rules

- Exercises never require paid assets beyond the Adobe subscription the learner already has.
- File-size submission limits per DOC-04 SCR-11 are documented in the brief.
- Exercise difficulty must match the module's declared difficulty (DOC-03 §14.2).

## 5. Quiz Standards

### 5.1 Question types

| Type | Use | Grading |
|------|-----|---------|
| MCQ (اختيار من متعدد) | Concept checks, most common | Auto |
| Multiple-select | Multi-condition understanding | Auto |
| True/False | Quick checks | Auto |
| Matching | Terminology/UI mapping | Auto |
| Ordering | Workflow steps | Auto |
| Short answer (Arabic) | Terminology/explanation | Auto (exact/keyword, Arabic-normalized) or manual |
| File-based (upload) | Applied skills | Rubric (DOC-08) |

### 5.2 Question writing rules

- Stem tests one concept; unambiguous; negative stems («أيٌّ مما يلي **ليس** صحيحًا؟») used sparingly and emphasized.
- 3–4 distractors for MCQ; distractors plausible, based on real learner misconceptions; no «كل ما سبق» / «لا شيء مما سبق» (guideline: avoid; exceptions approved by Content Director).
- Each question has an explanation (التفسير) shown after submission (DOC-04 SCR-13).
- Difficulty tagged B1…A2 per DOC-03 §14.2; quiz composition per DOC-08 §3.
- Questions are versioned; retired questions stay in bank history (DOC-05 ENT-QUESTION).

### 5.3 Quiz composition rules

| Quiz kind | # Questions | Time budget | Passing (DOC-08) |
|-----------|-------------|-------------|------------------|
| Module quiz | 8–12 | 15–25 min | ≥ 70% |
| Stage exam | 30–40 | 60–90 min | ≥ 75% |
| Final exam (STG-08) | 40–50 | 90–120 min | ≥ 80% |
| Placement (MOD-0104) | 20–30 | 30–45 min | informational |

- Item pools: module quizzes draw from a pool of ≥ 2× the quiz size so retakes differ (DOC-08 retake policy).

## 6. Media Rules

| Rule | Value |
|------|-------|
| Video resolution | 1080p master; 720p/480p transcodes; screen recordings ≤ 1080p |
| Video length | Each video segment ≤ 15 min; per-chunk ≤ 5 min (DOC-03 CP-4) |
| Aspect ratio | 16:9 for lessons; 9:16 vertical optional only for express-path shorts |
| Captions | Arabic SRT mandatory; English optional; verbatim or lightly edited, synced |
| Transcripts | Full Arabic transcript per video (HTML, searchable) |
| Audio | Clean VO in clear MSA; no music over speech; background music ≤ -20 LUFS relative |
| Thumbnails | 1280×720, Arabic text if any, consistent template (DOC-06 §7) |
| File naming | `{lesson-code}-{asset-role}-{version}.{ext}` e.g., `LES-020305-demo-v1.mp4` |
| Storage | Assets in media repository (ENT-ASSET), never in docs/ or code |
| Accessibility | All videos have captions + transcript; audio-described variants for key visual concepts `[priority: MS-11+]` |
| Licensing | Every asset carries a license record (ADR-007); no third-party music without license |

## 7. Translation Rules

1. **Authoring language:** Arabic (MSA) is the *source* language for all content. English working titles in DOC-03 are documentation-only.
2. **Translation order:** future English/French editions are translations **from** Arabic (reverse localization); never author in English and auto-translate to Arabic.
3. **UI strings:** Arabic primary from day one; English string catalog maintained in parallel (DOC-02 §9).
4. **Terminology:** translations must use the shared glossary (ENT-GLOSSARY); automated MT output is never published without human/agent review per DOC-16.
5. **Locale variants:** Arabic UI in MSA; dialect content (e.g., Gulf/North African examples) appears only as cultural examples inside lessons, never as interface copy.
6. **Cultural adaptation:** localization includes adaptation of examples, names, currency, and platform references — not literal translation.
7. **Placeholders:** translate punctuation and bidi-safe formatting for mixed strings; test all translated strings in RTL (DOC-16 R-01).

## 8. Content Metadata & Packaging

- **Frontmatter (every content item):** `id`, `code`, `type`, `language`, `appVersion` (Adobe app version targeted), `adobeVersion`, `difficulty`, `durationMin`, `prerequisites[]`, `objectives[]`, `assets[]`, `status`, `ownerRole`, `reviewedBy`, `contentVersion` (semver).
- **Packages:** content ships as `ContentPackage` versions (DOC-05 ENT-CONTENTPKG) with schema version; publishing flow per DOC-02 §8.1.
- **Changelog:** every content change records an entry in DOC-13 with content package version.
- **Consistency:** metadata must match DOC-03 IDs exactly; mismatch = review failure (DOC-16).

## 9. Accessibility in Content

| Requirement | Detail |
|-------------|--------|
| Language | `lang="ar"` declared on all content; English segments isolated with `lang="en"` |
| Headings | Semantic hierarchy; one h1 per page |
| Images | Meaningful alt text in Arabic; decorative images empty-alt |
| Diagrams | SVG with accessible labels or text alternative summary |
| Tables | Real headers; captions; no tables used for layout |
| Links | Descriptive link text (never «اضغط هنا») |
| Color | No color-only meaning (DOC-06 §5.2); contrast AA in all content graphics |
| Video/audio | Captions + transcripts (§6); player keyboard operable |
| Quiz content | Question text readable by screen readers; no image-only questions without text alt; timers announced with warnings (DOC-06 §8) |
| Files | PDFs published from accessible source docs; downloadable exercises include accessible instructions |

## 10. Review Workflow

1. **Self-review** by producer agent (authoring checklist in DOC-16 §Educational Review).
2. **Peer/technical review:** reproducibility against the declared Adobe version, asset integrity, metadata.
3. **Educational review:** alignment with DOC-03 objectives, DOC-07 templates, DOC-08 standards.
4. **Accessibility review:** §9 checklist + automated scan (DOC-16).
5. **Publish** per DOC-02 §8.1 after all gates pass; every publication recorded in DOC-13.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-07). |

## Notes

- Standards here are binding for content produced by both humans and AI agents; a producer agent's output that violates these standards fails DOC-16 review and is returned.
- Template field names are English for tooling; learner-visible content is Arabic.
- The first content milestone (MS-03) will produce pilot modules; pilot learnings may refine this document via DOC-13 entries (no structural change without review).

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Lesson IDs and structure this document fills |
| [DOC-06 Design System](06_DESIGN_SYSTEM.md) | Visual/typographic/color constraints on content |
| [DOC-08 Assessment Standard](08_ASSESSMENT_STANDARD.md) | Quiz/exercise assessment rules |
| [DOC-11 Task Management](11_TASK_MANAGEMENT.md) | Content production tasks |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Content review gates |
