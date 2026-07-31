# 08 — Assessment Standard

> **Document ID:** DOC-08 · **Status:** Active · **Owner:** Assessment Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Assessment Standard |
| **Purpose** | Defines the academy's complete assessment policy: assessment types, scoring model, passing rules, retake policy, rubric standards, certificate rules, and integrity requirements. All assessment behavior in the platform (DOC-02 C-08/C-09) and all assessment content (DOC-07 §5) must implement this document. |
| **Owner** | Assessment Lead (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-03 (curriculum gates), DOC-07 (question/exercise standards), DOC-05 (assessment entities), DOC-06 (certificate presentation) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Quarterly, or when pass-rate data (DOC-01 M-02/M-03) signals calibration issues |

## Table of Contents

- [1. Assessment Philosophy](#1-assessment-philosophy)
- [2. Assessment Types](#2-assessment-types)
- [3. Scoring Model](#3-scoring-model)
- [4. Passing Rules](#4-passing-rules)
- [5. Retake Policy](#5-retake-policy)
- [6. Rubric Standards](#6-rubric-standards)
- [7. Certificates](#7-certificates)
- [8. Grading Workflow](#8-grading-workflow)
- [9. Academic Integrity](#9-academic-integrity)
- [10. Assessment Data & Calibration](#10-assessment-data--calibration)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Assessment Philosophy

1. **Assessment is feedback, not punishment.** Every result is followed by explanation and a concrete next step (DOC-04 SCR-13).
2. **Certificates must mean something.** Thresholds are public, rubrics are transparent, results are verifiable (DOC-01 G-03).
3. **Practice is free; credentials are earned.** Formative assessments are unlimited; graded summatives are bounded and clear (DOC-03 §15).
4. **Consistency across attempts and learners.** Rules are versioned (DOC-05 ENT-ASSESSRULE); a learner's results are always computed against the rules that applied at attempt time.
5. **Data-driven calibration.** Pass rates and item statistics are reviewed quarterly to tune difficulty — never to make certificates easier (DOC-01 M-02/M-03).

## 2. Assessment Types

| ID | Type | Kind | Purpose | Where |
|----|------|------|---------|-------|
| AT-01 | Checkpoint (نقطة تحقق) | Formative, ungraded | Immediate self-check inside lessons | LES (DOC-07 §3) |
| AT-02 | Guided exercise | Formative | Practice with self-check/solution review | Lesson |
| AT-03 | Production exercise | Summative (low stakes) | Deliverable graded by rubric or checklist | Module |
| AT-04 | Module quiz | Summative (gate) | Proves module competency | End of module |
| AT-05 | Stage project | Summative (gate) | Applied, rubric-graded deliverable | End of stage |
| AT-06 | Stage exam | Summative (gate) | Theory + applied knowledge | End of stage |
| AT-07 | Placement assessment | Diagnostic | Path selection & test-out (MOD-0104) | STG-01 |
| AT-08 | Capstone project + final exam | Summative (graduation) | Portfolio-quality work + comprehensive exam | STG-08 |

**Gates:** AT-04, AT-05, AT-06, AT-08 are progress gates per DOC-03 §15.

## 3. Scoring Model

### 3.1 Percentage scoring (auto-graded: AT-01, AT-04, AT-06, AT-07, AT-08-exam)

- Score = (points earned / points possible) × 100, rounded to 1 decimal.
- Per-question weights: default equal; quizzes may weight applied questions up to 2× with justification recorded in content metadata (DOC-07 §5).
- Partial credit: multiple-select questions award partial credit (correct selection ratio) — never negative credit.

### 3.2 Rubric scoring (AT-03, AT-05, AT-08-project)

- Each criterion scored on the **1–4 scale** (see §6).
- Score average = mean of criterion scores; the average is the deliverable score (out of 4 → converted to % for records: `avg / 4 × 100`).
- A failing criterion (score 1) in *any* required criterion blocks passing regardless of average (see §6.3).

### 3.3 Weighted stage composite (informational only)

Stages display a composite (module quizzes 40%, stage project 35%, stage exam 25%) for the learner's dashboard — **composites never override gate rules** (§4).

## 4. Passing Rules

| Gate | Passing threshold | Notes |
|------|-------------------|-------|
| Module quiz (AT-04) | **≥ 70%** | Required to complete module (DOC-03 §15) |
| Stage project (AT-05) | **avg ≥ 3.0/4** and no criterion score of 1 | Both conditions mandatory |
| Stage exam (AT-06) | **≥ 75%** | Required for stage certificate |
| Capstone project (AT-08) | **avg ≥ 3.5/4** and no criterion score of 1 | |
| Final exam (AT-08) | **≥ 80%** | Required for CERT-08 |
| Placement (AT-07) | informational | Advises path; no pass/fail |

**Rule versioning:** thresholds live in ENT-ASSESSRULE (versioned, effectiveFrom). Threshold changes apply to new attempts; in-flight and completed attempts keep their original rule version. Threshold changes are documented in DOC-13 and require Assessment Lead approval.

## 5. Retake Policy

| Assessment | Attempts (graded) | Cooldown | Rules |
|------------|-------------------|----------|-------|
| Module quiz (AT-04) | 3 graded attempts | 24 h between attempts | Practice/self-check mode unlimited *before* the first graded attempt; best graded score recorded; question pools refresh per attempt (DOC-07 §5.3) |
| Stage exam (AT-06) | 2 graded attempts | 7 days between attempts | Higher score recorded; second attempt requires module-level remediation path (auto-suggested study plan) |
| Stage project (AT-05) | 2 submissions | 3 days between submissions | Second submission graded by same rubric; feedback from first submission must be addressed (checked by rubric criterion "responsiveness to feedback" on capstone only) |
| Capstone (AT-08) | 2 submissions | 7 days | As above |
| Final exam | 1 attempt; 1 retake after 14-day review plan | 14 days | Passing retake caps at 85% if first attempt < 80% (motivates first-attempt mastery) — `[TBD: confirm with Assessment Lead at MS-09]` |
| Checkpoints (AT-01) / guided exercises (AT-02) | unlimited | none | Formative; never recorded as failures |

**Administrative exceptions:** documented technical failures (session crash mid-exam, server error) grant a free attempt reset — logged with reason (ENT-ATTEMPT integrityFlags). Human-granted exceptions require Assessment Lead approval + audit.

## 6. Rubric Standards

### 6.1 Rubric anatomy

Every rubric contains 3–6 criteria. For stage projects: exactly 4 criteria (unless a CCP says otherwise):

| Criterion (example set) | Weights | Descriptor 1 (ضعيف) | Descriptor 4 (ممتاز) |
|-------------------------|---------|----------------------|----------------------|
| الالتزام بالموجز (Brief compliance) | equal | Misses core requirements | Fully meets brief + exceeds thoughtfully |
| التقنية والمهارة (Technical execution) | equal | Major tool errors | Masterful, efficient workflow |
| الجودة البصرية (Visual quality) | equal | Unpolished | Professional-grade polish |
| التقديم والتوثيق (Presentation & documentation) | equal | Missing explanation | Clear, professional documentation |

Each criterion must have **published 1–4 descriptor text** (Arabic) in the rubric metadata (DOC-05 ENT-RUBRIC) so learners see the standard before submitting (DOC-04 SCR-09/SCR-13).

### 6.2 Scoring scale

| Score | Meaning (AR) | Meaning (EN) |
|-------|--------------|--------------|
| 4 | ممتاز | Excellent — exceeds expectations |
| 3 | جيد جدًا | Good — meets expectations with minor gaps |
| 2 | مقبول | Acceptable — meets minimum with significant gaps |
| 1 | غير مكتمل | Insufficient — below minimum |

### 6.3 Pass/fail per criterion

- Pass = avg ≥ 3.0 (3.5 capstone) **and** no criterion = 1.
- Rubric versions are immutable once used in grading; revisions create a new version (DOC-05 ENT-RUBRIC).

## 7. Certificates

### 7.1 Eligibility

| Certificate (DOC-03 §16) | Requires |
|---------------------------|----------|
| CERT-01 Foundations | STG-01 project pass + exam ≥ 75% |
| CERT-02…07 | Stage project pass (rubric ≥ 3.0) + stage exam ≥ 75% |
| CERT-08 Academy Graduate | Capstone (≥ 3.5, no criterion 1) + final exam ≥ 80% + any two specialist stage certificates |

### 7.2 Issuance & form

- Issued automatically upon eligibility (never manual, except audited exceptions via SCR-25).
- Serial: `ACA-YYYY-NNNNN` (unique, sequential per year).
- Content (bilingual, Arabic primary): holder name, certificate title, stage(s), issue date, serial, verification URL + QR, issuing authority «أكاديمية أدوبي الإبداعية», template version.
- Format: secure PDF (A4 landscape) + verifiable web page (SCR-05). PDF embedding of verification link; QR points to the public verification page.
- Template versions are archived; reissue after template change uses the current template but preserves original issue metadata.

### 7.3 Verification & revocation

- Public verification (SCR-05) returns: valid / revoked / not found, with issue date and holder name.
- Revocation reasons (audited, ENT-CERT): academic-integrity violation (with due process), administrative error, or lawful request.
- Verification log append-only (ENT-VERIFICATION).

### 7.4 Validity & updates

- Certificates are lifetime credentials. When major curriculum updates occur, an optional "update path" (refresher badge) may be offered; existing certificates remain valid and are never silently downgraded.

## 8. Grading Workflow

| Step | Actor | Detail |
|------|-------|--------|
| Auto-grading | System (C-08) | MCQ/multiple/true-false/matching/ordering/short-answer (Arabic-normalized) |
| Rubric grading | Reviewer (human or agent with rubric adherence) | Projects/capstone/production exercises; each grade records rubric version + per-criterion scores (ENT-GRADE) |
| Moderation | Assessment Lead | Sample audits: ≥ 10% of rubric grades per reviewer per month; disputes re-graded by second reviewer |
| Disputes | Learner → support | Formal dispute window 14 days; re-grade by different reviewer; result final |
| Feedback | System | Auto explanations + rubric feedback published to SCR-13; turn-around target: auto ≤ 1 min, rubric ≤ 72 h |

**Grading consistency:** rubric graders must calibrate against anchor examples (produced per stage during MS-03…MS-06) before grading.

## 9. Academic Integrity

1. **Honor code:** visible at first enrollment and before each graded attempt (SCR-12); acceptance recorded.
2. **Permitted:** using Adobe help/docs, official Adobe tutorials as references, notes taken in the platform, the platform's own lesson materials.
3. **Prohibited:** submitting others' work, plagiarized assets, sharing answers to graded items publicly, exam impersonation, automated exam-solving.
4. **AI assistance policy for learners:** AI tools may be used as *learning aids* (explaining concepts, generating practice variants); AI-generated deliverables must be disclosed in the project documentation section. Undisclosed AI-only work in graded projects is a violation (`[TBD: refine with beta]`).
5. **Detection & process:** technical telemetry (answer timing anomalies, copy-paste flags), random file-integrity checks; any allegation triggers review by Assessment Lead with the learner notified; outcome options: warning, grade invalidation, certificate revocation (due process recorded).
6. **Staff integrity:** all grading/moderation actions audited (ENT-AUDIT); reviewers may not grade submissions they authored content for without disclosure.

## 10. Assessment Data & Calibration

- **Tracked per item:** pass rate, discrimination index, average time, retake improvement (DOC-01 M-02/M-03 feed).
- **Calibration triggers:** item pass rate < 40% or > 95% → item review; stage exam pass rate < 60% → exam review + threshold review (never automatic threshold change).
- **Reporting:** quarterly assessment report to the Assessment Lead with item statistics; stored in DOC-13 notes or the analytics store (DOC-02 C-10).
- **Transparency:** aggregate statistics published to learners where meaningful (e.g., "اجتاز 82% من المتعلمين هذا الاختبار") — never individual peer data.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-08). |

## Notes

- Items marked `[TBD]` (final-exam retake cap, AI-disclosure details) are intentionally deferred to beta (MS-12) and require Assessment Lead sign-off before activation.
- Thresholds are initial values grounded in DOC-01 metric baselines; they change only via the §4 versioning process.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Gates and certificate catalog |
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Question/exercise production rules |
| [DOC-05 Database Blueprint](05_DATABASE_BLUEPRINT.md) | Assessment & certification entities |
| [DOC-04 UI Blueprint](04_UI_BLUEPRINT.md) | SCR-11/12/13/05 behavior |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Educational review gate |
