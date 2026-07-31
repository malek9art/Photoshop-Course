# 01 — Project Vision

> **Document ID:** DOC-01 · **Status:** Active · **Owner:** Project Foundation Architect

| Field | Value |
|-------|-------|
| **Title** | Project Vision |
| **Purpose** | Defines the mission, vision, long-term goals, target audience, student personas, educational philosophy, success metrics, and expansion strategy of the academy. This is the "why" behind every technical decision. |
| **Owner** | Project Foundation Architect (role). Maintained by the Product/Gov owner after foundation phase. |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | None (foundation document; no other document may contradict it) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Quarterly, or when a major expansion milestone begins |

## Table of Contents

- [1. Mission](#1-mission)
- [2. Vision](#2-vision)
- [3. Long-Term Goals](#3-long-term-goals)
- [4. Target Audience](#4-target-audience)
- [5. Student Personas](#5-student-personas)
- [6. Educational Philosophy](#6-educational-philosophy)
- [7. Success Metrics](#7-success-metrics)
- [8. Future Expansion Strategy](#8-future-expansion-strategy)
- [9. Scope Boundaries](#9-scope-boundaries)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Mission

**To make world-class Adobe Creative Cloud education accessible, professional, and culturally native for Arabic-speaking learners** — delivered through a premium learning platform that turns beginners into certified creative professionals.

Every decision in this project must serve three commitments:

1. **Quality first** — premium content, premium experience, professional outcomes.
2. **Arabic-first** — the product, interface, and content are natively Arabic (Modern Standard Arabic) with full RTL support. English is a supporting language, never the default experience.
3. **Outcome-based** — learners do not just watch; they practice, produce, get assessed, and earn verifiable certificates.

## 2. Vision

**Five-year vision:** Adobe Creative Academy becomes the reference destination for Adobe Creative Cloud education in the Arab world — recognized by employers and educational institutions as the standard for professional creative certification, growing from a curated course platform into a full **Learning Management System (LMS)** with an international footprint.

The academy will be known for:

- A complete, structured curriculum covering the entire Adobe Creative Cloud suite.
- Rigorous, transparent assessment and verifiable certificates.
- A premium, delightful, mobile-first, RTL-native learning experience.
- A sustainable content production engine that continuously updates with every Adobe release.

## 3. Long-Term Goals

| Goal ID | Goal | Horizon | Primary Measure |
|---------|------|---------|-----------------|
| G-01 | Deliver the full ACA curriculum (8 stages, all core Adobe apps) in Arabic | 18–24 months | All stages released (see DOC-09) |
| G-02 | Launch the production LMS platform (v1.0) | 12–18 months | GA launch milestone MS-13 completed |
| G-03 | Establish a verifiable certification system trusted by employers | 24 months | Certificate verification usage + employer partnerships |
| G-04 | Reach sustainable paid learner base | 24 months | 10,000 active premium learners |
| G-05 | Achieve measurable learning outcomes | continuous | Completion rate ≥ 45%, assessment pass rate ≥ 70% |
| G-06 | Build a repeatable AI-agent content production pipeline | 12 months | Content velocity: full stage produced in ≤ 8 agent-weeks |
| G-07 | Expand internationally (English, French, other Arabic dialects as support) | 36+ months | Second language launched |
| G-08 | Become a professional LMS (enterprise/education licensing, API, SCORM/LTI readiness) | 36+ months | Enterprise contracts |

## 4. Target Audience

### 4.1 Primary audience

| Segment | Description | Priority |
|---------|-------------|----------|
| Arabic-speaking creative beginners | Students (university/high-school), career switchers, hobbyists who want to become professional designers/editors | **P0** |
| Working professionals | Marketers, social-media managers, photographers, small-business owners needing Adobe skills | **P0** |
| University & institute students | Learners seeking structured, certified training to complement or replace academic courses | P1 |
| Employers & institutions (future) | Organizations licensing the academy for team upskilling (enterprise LMS) | P2 |

### 4.2 Geography and language

- **Primary:** Arab world (Gulf, Levant, North Africa). Dialect-neutral Modern Standard Arabic (MSA) for content; interface in MSA with clear, modern register.
- **Secondary (future):** English, then French. See [Expansion Strategy](#8-future-expansion-strategy).
- **Cultural note:** Examples, case studies, names, and imagery must reflect Arab culture and regional workflows (e.g., regional social-media platforms, local client scenarios, Arabic typography and calligraphy as first-class design subjects).

### 4.3 Access model

- **Premium subscription academy** (freemium path: limited free orientation stage, full curriculum behind subscription). Exact pricing and packaging are **open decisions** — see DOC-14 (Open Decisions).

## 5. Student Personas

Personas are used by content, UX, and assessment work to keep decisions human-centered. Every agent must be able to answer: *"Who is this for?"*

| ID | Persona | Profile | Goals | Pain Points | Design Implications |
|----|---------|---------|-------|-------------|---------------------|
| P-01 | **Noura — The Ambitious Beginner** | 22, recent graphic-design graduate, Riyadh. Speaks Arabic natively, studied English but prefers Arabic. Works on a phone and a mid-range laptop. | Land a first design job; build a portfolio; get certified. | Overwhelmed by English tutorials; scattered YouTube knowledge; no structured path. | Clear paths, mobile-first lessons, Arabic-first UI, portfolio milestones. |
| P-02 | **Omar — The Busy Professional** | 31, social-media manager at a Doha agency. Needs Photoshop/Illustrator/Premiere for daily deliverables. | Learn fast, on the job, in short sessions. | Little time; needs to skip theory; needs templates and practical shortcuts. | Short lessons (≤ 15 min), "express" paths, downloadable resources, on-the-go mobile playback. |
| P-03 | **Layla — The Creative Career-Switcher** | 28, ex-accountant in Cairo, self-taught hobbyist. | Professional certification to prove her skills. | Impostor syndrome; wants fair, transparent assessment. | Rubrics, constructive feedback, verifiable certificates, encouraging tone. |
| P-04 | **Yusuf — The University Student** | 19, visual-communication student in Amman. | Pass/outperform university projects; learn After Effects. | Budget constraints; needs student pricing; needs academic alignment. | Student discounts (open decision), university-style structured curriculum, citations of Adobe official docs. |
| P-05 | **Hind — The Photographer** | 35, professional wedding photographer, Casablanca. | Master Lightroom + Photoshop retouching; grow her business. | Wants efficiency, presets, and client-ready results. | Photography path, preset packs, business/soft-skills modules, Arabic client scenarios. |
| P-06 | **Khalid — The Aspiring Motion Designer** | 26, freelancer in Dubai. | Build a motion-graphics portfolio to raise rates. | Too many disconnected tutorials; needs a coherent motion curriculum. | Motion path, capstone portfolio project, peer critique community. |

## 6. Educational Philosophy

1. **Learning by producing.** Every module ends with a production task. Learners build a real portfolio as they progress, not just a certificate.
2. **Spaced, structured practice.** Concepts are introduced in small chunks and reinforced through exercises and spaced revision (see DOC-07 and DOC-08).
3. **Show, explain, practice, assess.** Every lesson follows the four-part loop: demonstration → explanation → guided practice → assessment.
4. **Industry reality.** Content mirrors real client work, real deliverables, real deadlines — not abstract tool tours.
5. **Arabic-native pedagogy.** Learning happens in the learner's mother tongue with culturally relevant examples. Technical terminology is Arabic-first with the English industry term shown alongside (e.g., "طبقات (Layers)").
6. **Accessibility is not optional.** WCAG 2.2 AA is a hard requirement for both content and interface (see DOC-06, DOC-07).
7. **Honest assessment.** Certificates mean something. Standards are public, rubrics are transparent, and results are verifiable (see DOC-08).
8. **Continuous, version-aware content.** Adobe ships new features constantly; the curriculum has a defined update policy (DOC-03 §10, DOC-13).

## 7. Success Metrics

Metrics are owned by the product owner and reviewed at each milestone. Targets are initial baselines to be validated in beta (MS-12).

| Metric ID | Category | Metric | Initial Target |
|-----------|----------|--------|----------------|
| M-01 | Learning | Stage completion rate | ≥ 45% of enrolled learners |
| M-02 | Learning | Module assessment pass rate | ≥ 70% (first attempt) |
| M-03 | Learning | Average quiz score across learners | ≥ 75% |
| M-04 | Learning | Capstone portfolio completion | ≥ 25% of graduates produce a publishable capstone |
| M-05 | Engagement | Lesson completion rate | ≥ 70% of started lessons finished |
| M-06 | Engagement | Weekly active learners (WAL) | ≥ 35% of active paid learners |
| M-07 | Experience | Net Promoter Score (NPS) | ≥ 50 |
| M-08 | Experience | CSAT (course rating avg) | ≥ 4.5 / 5 |
| M-09 | Experience | Support resolution time | ≤ 24h for standard tickets |
| M-10 | Business | Paid learners | 10,000 within 24 months of launch |
| M-11 | Business | Conversion (free → paid) | ≥ 5% |
| M-12 | Business | Churn (monthly) | ≤ 5% |
| M-13 | Quality | Content defect rate (per stage) | ≤ 5 issues per stage found in review |
| M-14 | Quality | Accessibility conformance | WCAG 2.2 AA (no critical issues) |
| M-15 | Quality | Doc drift (docs out of sync with reality) | 0 known unrecorded changes at any review |
| M-16 | Engineering | Platform uptime | ≥ 99.5% after GA |

## 8. Future Expansion Strategy

Expansion is **gated by roadmap milestones** (DOC-09) and must never compromise the core mission. Each item is a candidate for a future ADR.

| Horizon | Expansion | Gate |
|---------|-----------|------|
| Near (0–12 mo) | Curriculum breadth: all 8 stages released; Arabic-only content | MS-03 … MS-06 |
| Mid (12–24 mo) | Platform GA; certificates verifiable; premium billing live | MS-13 |
| Mid (18–30 mo) | **Community layer**: forums, peer review, showcases; gamification (badges, streaks) | New milestone |
| Mid (24–36 mo) | **Second language**: English localized content; then French | Content pipeline v2 |
| Long (24–36 mo) | **Enterprise LMS**: team seats, admin reporting, SCORM/LTI, SSO (SAML/OIDC) | Partnership-driven |
| Long (30+ mo) | **Mobile native apps** (iOS/Android) and offline learning | Platform maturity |
| Long (36+ mo) | **AI study assistant / adaptive learning** (personalized paths, spaced repetition engine) | Data + content maturity |
| Long (36+ mo) | Regional editions (Gulf/MENA/North Africa) with localized examples and pricing | Market research |

**Expansion principles:** every expansion must (a) preserve Arabic-first quality, (b) reuse the core architecture (DOC-02), (c) be reflected in DOC-01…DOC-09 before work starts, and (d) pass the quality gates in DOC-16.

## 9. Scope Boundaries

The academy explicitly **does not** do the following (unless a future ADR changes this):

- **Not** a general-purpose marketplace for third-party courses.
- **Not** a replacement for Adobe's official documentation or certification (Adobe Certiport/ACA) — ACA certificates are independent credentials with transparent criteria.
- **Not** a free-tier content dump — free access is limited and intentional.
- **Not** a platform for non-Adobe tool training (Figma, Blender, etc.) — adjacent tools appear only as complementary context within lessons.
- **Not** pirate or unlicensed software/material — all assets must be original or properly licensed (see ADR-007).

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-01). |

## Notes

- Metrics targets are aspirational baselines; they will be recalibrated after the beta program (MS-12) using real data.
- Personas are living documents: update them only via a documented change (DOC-13) and review them with the content team.
- Any conflict between this document and another document must be resolved in favor of this document (it is the top of the hierarchy), then the conflicting document must be corrected.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | Architecture realizes this vision |
| [DOC-03 Curriculum Blueprint](03_CURRICULUM_BLUEPRINT.md) | Curriculum delivers the mission |
| [DOC-08 Assessment Standard](08_ASSESSMENT_STANDARD.md) | Certificates implement goal G-03 |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | Milestones implement long-term goals |
| [DOC-14 Decision Log](14_DECISION_LOG.md) | Open decisions referenced here |
| [DOC-15 Risk Register](15_RISK_REGISTER.md) | Educational/UX risks to the mission |
