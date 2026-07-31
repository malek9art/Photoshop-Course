# 15 — Risk Register

> **Document ID:** DOC-15 · **Status:** Active · **Owner:** Risk Owner (role; interim: Governance Lead)

| Field | Value |
|-------|-------|
| **Title** | Risk Register |
| **Purpose** | Documents all known project risks — technical, educational, UX, performance, and future — with likelihood, impact, severity, owner, mitigation strategy, and contingency. The register is reviewed quarterly and updated whenever a risk changes or a new risk appears. |
| **Owner** | Risk Owner (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-01 (goals at risk), DOC-02 (technical risks), DOC-09 (roadmap), DOC-10 (agent behavior risks), DOC-14 (decision gaps) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | Quarterly (or on any milestone completion/incident) |

## Table of Contents

- [1. Risk Methodology](#1-risk-methodology)
- [2. Risk Register](#2-risk-register)
- [3. Top Risks & Focus](#3-top-risks--focus)
- [4. Risk Review Log](#4-risk-review-log)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Risk Methodology

- **Likelihood (L):** 1 (rare) … 5 (almost certain)
- **Impact (I):** 1 (negligible) … 5 (catastrophic)
- **Severity (S) = L × I:** 1–6 low, 8–12 medium, 15–20 high, 25 critical
- **Status:** Open / Mitigating / Watch / Closed
- Every risk has an **owner** and a **mitigation** (proactive) and **contingency** (reactive) plan.
- New risks are added immediately (DOC-10 R-07, DOC-13 entry); closed risks are kept in the register with a closure note.

## 2. Risk Register

### 2.1 Technical Risks

| ID | Risk | L | I | S | Owner | Mitigation Strategy | Contingency | Status |
|----|------|---|---|---|-------|---------------------|-------------|--------|
| R-T-01 | Premature technology lock-in before OPD-001…005 resolved | 3 | 4 | 12 | Lead Architect | Blueprints are technology-agnostic (ADR-004); prohibition P-03/P-05; ADRs required before implementation | Re-evaluate stack at MS-07 gate; cost of reversal contained by logical specs | Open |
| R-T-02 | Module boundary violations erode the modular monolith (DOC-02 §6) | 3 | 4 | 12 | Lead Architect | DOC-16 Architecture Review gate; code review norms; dependency rules in DOC-02 §7 | Architecture refactor of violating module; extract to service if hot spot | Watch |
| R-T-03 | Content/platform coupling breaks independent release (AP-3) | 2 | 4 | 8 | Lead Architect | Content-package schema + versioning (DOC-07 §8, DOC-05 ENT-CONTENTPKG); publishing workflow (DOC-02 §8.1) | Emergency revert of content version; platform hotfix | Open |
| R-T-04 | Data model drift from DOC-05 logical blueprint | 3 | 3 | 9 | Data Architect | Physical schema traceability requirement (DOC-05 Notes); DOC-16 Consistency Review | Schema migration with ADR + changelog | Watch |
| R-T-05 | Security/privacy incident (PII, certificates forged) | 2 | 5 | 10 | Security Lead (role) | OWASP baseline (DOC-02 §9); certificate tamper-evidence (DOC-05 §7); audit logging; least privilege | Incident response runbook (create at MS-08); revocation process (DOC-08 §7.3) | Open |
| R-T-06 | Regional data-residency/compliance gaps (MENA) | 3 | 4 | 12 | Security Lead | OPD-003 includes residency review; consent records (ENT-CONSENT); erasure workflow (DOC-05 §7) | Legal review; provider change | Open |
| R-T-07 | RTL/bidi bugs degrade the core experience | 3 | 4 | 12 | UX Lead | Logical properties mandate (DOC-06 §9); RTL QA matrix (TASK-218); DOC-16 UX/RTL gate | Targeted fix sprints; automated RTL screenshot tests at MS-11 | Watch |
| R-T-08 | Arabic typography/rendering issues (fonts, diacritics, numerals) | 3 | 3 | 9 | Design Lead | Font selection review (DOC-06 §4); rendering tests per stage | Font fallback strategy; OS-level font testing | Watch |

### 2.2 Educational Risks

| ID | Risk | L | I | S | Owner | Mitigation Strategy | Contingency | Status |
|----|------|---|---|---|-------|---------------------|-------------|--------|
| R-E-01 | Content quality/reproducibility failures erode trust | 3 | 5 | 15 | Content Director | DOC-07 standards; DOC-16 Educational Review; rubric anchors; pilot validation (TASK-103) | Stage-specific content rework cycles; learner refunds/credits | Open |
| R-E-02 | Content production velocity can't meet roadmap (210 h curriculum) | 4 | 4 | 16 | Project Manager | Parallel agent batches (MS-03…06); template-driven production (DOC-07); pilot to measure AD rate | Re-sequence milestones; trim electives; scope express paths first | **Top risk** |
| R-E-03 | Assessment thresholds mis-calibrated (too hard/too easy) | 3 | 4 | 12 | Assessment Lead | DOC-08 §10 calibration loop; beta data (TASK-302); quarterly pass-rate review | Threshold versioning per DOC-08 §4 (never silent changes) | Open |
| R-E-04 | Terminology inconsistency across Arabic content | 3 | 3 | 9 | Content Director | Glossary governance (DOC-07 §2.3, TASK-108); automated glossary lint | Terminology cleanup pass per stage | Open |
| R-E-05 | Certificates lose credibility (gaming/cheating) | 2 | 5 | 10 | Assessment Lead | DOC-08 §9 integrity program; verification page; audits | Revocation + due process; integrity tooling at MS-09 | Open |
| R-E-06 | Adobe app version changes invalidate lessons | 4 | 3 | 12 | Content Director | DOC-03 §17 update policy; appVersion metadata; 60-day assessment cycle | Prioritized lesson patches per affected module | Open |

### 2.3 UX Risks

| ID | Risk | L | I | S | Owner | Mitigation Strategy | Contingency | Status |
|----|------|---|---|---|-------|---------------------|-------------|--------|
| R-U-01 | Mobile-first experience regresses desktop/tablet parity | 3 | 3 | 9 | UX Lead | DOC-04 §10 responsive rules; breakpoint test matrix (DOC-16) | Responsive fix sprints at MS-11 | Watch |
| R-U-02 | Learner drop-off due to frustration (findability, feedback loops) | 3 | 4 | 12 | UX Lead | Progress-first dashboard (SCR-06/14); DOC-04 states design; on-ramp (SCR-01/02) | Funnel analysis from analytics (C-10); targeted UX fixes | Open |
| R-U-03 | Accessibility non-conformance discovered late | 3 | 4 | 12 | A11y Lead | A11y requirements in DOC-06 §8/DOC-07 §9; a11y audit milestone (TASK-217); automated scans | Remediation sprints; WCAG 2.2 AA blocker for GA | Open |
| R-U-04 | Notification fatigue or missing critical alerts | 2 | 2 | 4 | UX Lead | Preference center (SCR-16/17); quiet hours; event-driven targeting | Notification policy tuning with data | Watch |

### 2.4 Performance Risks

| ID | Risk | L | I | S | Owner | Mitigation Strategy | Contingency | Status |
|----|------|---|---|---|-------|---------------------|-------------|--------|
| R-P-01 | Media-heavy lessons degrade on mobile networks (MENA) | 4 | 4 | 16 | Lead Architect | CDN + adaptive bitrate (DOC-02 C-01); quality selection; offline caching; data-saver mode | Lower default bitrate; segment pre-fetch tuning | **Top risk** |
| R-P-02 | Search performance with Arabic tokenization | 2 | 3 | 6 | Lead Architect | Dedicated search module (C-14); indexing strategy decided at OPD-002/003 | Query optimization; pagination/caching | Open |
| R-P-03 | Launch-day scale surprises (10k+ users) | 2 | 4 | 8 | Lead Architect | Load tests at MS-13; horizontal scaling plan (DOC-02 §10); SLOs (DOC-01 M-16) | Auto-scaling runbook; CDN offload | Open |

### 2.5 Future Risks

| ID | Risk | L | I | S | Owner | Mitigation Strategy | Contingency | Status |
|----|------|---|---|---|-------|---------------------|-------------|--------|
| R-F-01 | Market/competitive shift (free YouTube content, Adobe's own academy) | 4 | 4 | 16 | Product owner | Differentiation: structured certification, Arabic-native quality, community (DOC-01 G-03/G-07) | Pivot to enterprise/education licensing; focus niches | **Top risk** |
| R-F-02 | Multi-language expansion cost underestimation | 3 | 3 | 9 | Product owner | Reverse-localization design (DOC-07 §7); translation pipeline planned not built | Gate expansion on English pilot (TASK-306) metrics | Open |
| R-F-03 | Brand/trademark complications ("Adobe" naming) | 2 | 4 | 8 | Product owner | Legal review before launch; ADR-007; naming decision OPD-007 | Rename/re-brand contingency budgeted at MS-13 | Open |
| R-F-04 | Governance erosion as agent count grows (doc drift, rule fatigue) | 3 | 4 | 12 | Governance Lead | DOC-16 Documentation Review; automated doc lint (TASK-101); quarterly audits | Governance refresh sprint; tightened DoD | Open |

### 2.6 Agent/Process Risks

| ID | Risk | L | I | S | Owner | Mitigation Strategy | Contingency | Status |
|----|------|---|---|---|-------|---------------------|-------------|--------|
| R-G-01 | Documentation drift (reality diverges from docs) | 4 | 4 | 16 | Governance Lead | R-05 mandatory updates; changelog enforcement; DOC-16 review; baseline verification (TASK-102) | Drift-detection pass; corrective doc update task | **Top risk** |
| R-G-02 | Duplicate/conflicting agent work | 3 | 4 | 12 | Governance Lead | R-02/R-03 rules; task claiming protocol (DOC-11 §1); handover reviews | Conflict resolution via PM; rework task | Watch |
| R-G-03 | Loss of context on agent handover (weak handovers) | 3 | 4 | 12 | Governance Lead | DOC-12 mandatory + quality rules + fresh-agent test; quarterly sampling | Follow-up handover call; task Notes enrichment | Watch |
| R-G-04 | Unrecorded assumptions propagate errors | 4 | 3 | 12 | Governance Lead | R-07; task Notes requirement; ADR for durable assumptions | Assumption review at milestone boundaries | Open |

## 3. Top Risks & Focus

| Rank | Risk | Severity | Focus action | Due |
|------|------|----------|--------------|-----|
| 1 | R-E-02 Content production velocity | 16 | Pilot (TASK-103) to measure real AD rate; adjust MS-03…06 estimates | MS-02 |
| 2 | R-P-01 Media on mobile networks | 16 | Media pipeline ADR (TASK-203) includes adaptive delivery requirements | MS-07 |
| 3 | R-F-01 Market/competitive shift | 16 | Validate differentiation in beta; lean into certification + community | MS-12 |
| 4 | R-G-01 Documentation drift | 16 | Doc lint automation (TASK-101); independent baseline review (TASK-102) | MS-02 |
| 5 | R-E-01 Content quality | 15 | Pilot quality bar; rubric anchors; DOC-16 gates | MS-03 |

## 4. Risk Review Log

| Date | Reviewer | Action |
|------|----------|--------|
| 2026-07-31 | Project Foundation Architect | Baseline register created: 29 risks across 6 categories; top 5 identified; quarterly cadence set. |

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-15): 29 risks, 6 categories, top-5 focus. |

## Notes

- Severity changes are recorded in the Risk Review Log; risk status is updated continuously.
- New risks found by any agent are added per DOC-10 R-07 and referenced in handovers (DOC-12 §8).

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-01 Project Vision](01_PROJECT_VISION.md) | Goals and metrics at risk |
| [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | Technical risk mitigations |
| [DOC-09 Project Roadmap](09_PROJECT_ROADMAP.md) | Milestone-gated mitigations |
| [DOC-14 Decision Log](14_DECISION_LOG.md) | Open decisions are risk drivers |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | Review gates mitigate quality risks |
