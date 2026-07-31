# 04 — UI Blueprint

> **Document ID:** DOC-04 · **Status:** Active · **Owner:** UX Lead (role)

| Field | Value |
|-------|-------|
| **Title** | UI Blueprint |
| **Purpose** | Documents **all application screens** and their functional requirements for the Arabic, RTL, responsive, mobile-first platform. This document describes **what** each screen must do and how it behaves across mobile/tablet/desktop — it does **not** specify visual design (that is DOC-06) and must not be read as a design spec. |
| **Owner** | UX Lead (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-02 (components C-01…C-14), DOC-06 (design system), DOC-07 (content), DOC-08 (assessment) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | At each platform milestone (MS-08…MS-11); screen additions require a CCP-style entry in DOC-13/14 |

## Table of Contents

- [1. UI Design Principles](#1-ui-design-principles)
- [2. Information Architecture](#2-information-architecture)
- [3. Screen Inventory](#3-screen-inventory)
- [4. Global Patterns & States](#4-global-patterns--states)
- [5. Learner Screens](#5-learner-screens)
- [6. Learning & Assessment Screens](#6-learning--assessment-screens)
- [7. Certificate Screens](#7-certificate-screens)
- [8. Admin Screens](#8-admin-screens)
- [9. Settings, Notifications & Search](#9-settings-notifications--search)
- [10. Responsive Behavior Rules](#10-responsive-behavior-rules)
- [11. RTL Requirements](#11-rtl-requirements)
- [12. Navigation Model](#12-navigation-model)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. UI Design Principles

| # | Principle | Requirement |
|---|-----------|-------------|
| UI-1 | **Arabic first, RTL native** | The default interface direction is RTL. All screens must be designed in RTL first; LTR is a future secondary mode. Logical CSS properties are used (DOC-06 §9). |
| UI-2 | **Mobile first** | Every screen is designed from 360 px width up; desktop is an enhancement, never a requirement for functionality. |
| UI-3 | **Progressive disclosure** | Learners are never shown everything at once; complexity scales with mastery. |
| UI-4 | **One primary action** | Each screen has one clear primary action, visually dominant (DOC-06). |
| UI-5 | **Always resumable** | No learning flow may lose progress on navigation, refresh, or device switch (DOC-02 C-10). |
| UI-6 | **Accessible by default** | WCAG 2.2 AA: keyboard operable, screen-reader compatible (Arabic screen readers), focus visible, contrast AA (DOC-06 §8). |
| UI-7 | **Honest states** | Empty, loading, error, and offline states are designed, not afterthoughts. |
| UI-8 | **Calm, premium feel** | Generous whitespace, restrained color, professional tone — matches the "premium academy" positioning (DOC-01). |

## 2. Information Architecture

```
Adobe Creative Academy (PWA)
├── Public (unauthenticated)
│   ├── Landing / Welcome
│   ├── About & Pricing
│   ├── Login / Register / Password reset
│   └── Certificate Verification (public)
├── Learner (authenticated)
│   ├── Home (Dashboard)
│   ├── Catalog (Browse / Search)
│   ├── Learning (Stage → Module → Lesson Player → Exercises → Quizzes)
│   ├── Progress & Analytics
│   ├── Certificates
│   ├── Community (future)
│   ├── Notifications
│   ├── Settings (Profile / Preferences / Billing)
│   └── Help & Support
└── Admin (staff)
    ├── Dashboard (KPIs)
    ├── Users (manage / roles / enrollments)
    ├── Curriculum (stages / modules / lessons / paths)
    ├── Content (authoring / review / publish)
    ├── Assessments (questions / grading / rubric moderation)
    ├── Certificates (issuance / revocation / verification stats)
    ├── Analytics (learning & product analytics)
    └── Settings (platform / billing / integrations)
```

## 3. Screen Inventory

| ID | Screen | Area | Access | Primary Purpose |
|----|--------|------|--------|-----------------|
| SCR-01 | Landing / Welcome | Public | Public | Explain the academy, show paths & certificates, drive registration |
| SCR-02 | Registration | Public | Public | Create account (email + OTP), language, onboarding |
| SCR-03 | Login | Public | Public | Sign in, remember device, SSO placeholder |
| SCR-04 | Password Reset | Public | Public | Request & confirm password reset |
| SCR-05 | Certificate Verification | Public | Public | Verify a certificate serial/QR |
| SCR-06 | Home (Learner Dashboard) | Learner | Learner | Overview: continue learning, progress, next actions, announcements |
| SCR-07 | Course Catalog | Learner | Learner | Browse stages/modules/paths, filter, search |
| SCR-08 | Stage Detail | Learner | Enrolled or preview | Stage overview, modules, prerequisites, requirements, enroll |
| SCR-09 | Module Detail | Learner | Enrolled | Module content list, quiz/requirements, estimated time |
| SCR-10 | Lesson Player | Learner | Enrolled | Watch/read lesson, navigation, progress, bookmarks, transcript |
| SCR-11 | Exercise Workspace | Learner | Enrolled | Guided practice UI, submission, feedback |
| SCR-12 | Quiz / Assessment | Learner | Enrolled | Timed quiz, one question at a time, auto-save |
| SCR-13 | Results & Feedback | Learner | Enrolled | Score, per-question review, rubric results, next steps |
| SCR-14 | Progress & Analytics | Learner | Learner | Visual progress, streaks, comparisons to standards |
| SCR-15 | Certificates | Learner | Learner | Earned certificates, download, share, verify link |
| SCR-16 | Profile & Settings | Learner | Learner | Profile, preferences, notifications, language, billing |
| SCR-17 | Notifications | Learner | Learner | Notification inbox, preferences |
| SCR-18 | Search Results | Learner | Learner | Search across catalog, lessons, glossary, help |
| SCR-19 | Help & Support | Learner | Learner | FAQ, contact, bug report |
| SCR-20 | Admin Dashboard | Admin | Admin | KPIs, alerts, quick actions |
| SCR-21 | Admin: Users | Admin | Admin | Search/manage users, roles, enrollments, suspend |
| SCR-22 | Admin: Curriculum | Admin | Admin | CRUD stages/modules/lessons, dependencies, versioning |
| SCR-23 | Admin: Content | Admin | Admin | Content authoring review pipeline, publish, media |
| SCR-24 | Admin: Assessments | Admin | Admin | Question banks, quiz config, rubric grading inbox |
| SCR-25 | Admin: Certificates | Admin | Admin | Issuance control, revocation, template, verification logs |
| SCR-26 | Admin: Analytics | Admin | Admin | Learning/product analytics dashboards |
| SCR-27 | Admin: Settings | Admin | Admin | Platform config, features flags, billing, integrations |
| SCR-28 | Community & Forums (future) | Learner | Learner (future) | Discussions, peer review (post-GA milestone) |
| SCR-29 | Billing & Plans | Learner | Learner | Plans, checkout, invoices, cancel (premium launch) |

## 4. Global Patterns & States

Every screen must define these states (implemented once, reused everywhere):

| State | Behavior |
|-------|----------|
| **Loading** | Skeleton placeholders (never raw spinners alone); respects reduced motion. |
| **Empty** | Explains what is missing and offers the primary action (e.g., "لا توجد إشعارات بعد" + action). |
| **Error** | Human Arabic message, retry action, no technical jargon; logged server-side. |
| **Offline** | Banner + cached content continues; submissions queue and sync (DOC-02 C-01). |
| **Partial RTL/LTR content** | Mixed-direction content (e.g., English terms) rendered with correct bidi isolation (DOC-06 §9). |

**Global components (documented functionally in DOC-06 §10):** top app bar, bottom navigation (mobile), side navigation (tablet/desktop), cards, buttons, inputs, modals, toasts, dialogs, tabs, progress indicators, media player, and the RTL-aware "back/forward" chrome.

## 5. Learner Screens

### SCR-01 Landing / Welcome
- **Purpose:** convert visitors; communicate mission, paths, certificates, pricing.
- **Content:** hero (Arabic-first), path highlights, certificate trust, testimonials, pricing (premium), FAQ, CTA register.
- **Actions:** Register, Login, Browse free orientation (STG-01).
- **Responsive:** hero stacks; path cards 1-col mobile → 3-col desktop. All media RTL-aware.
- **States:** pricing availability depends on billing decision OPD-005.

### SCR-02 Registration
- **Purpose:** create account; capture consent; begin onboarding.
- **Fields:** name, email, password (or OTP), language default Arabic, marketing consent, terms acceptance.
- **Flow:** register → email OTP verify → optional placement question → Home.
- **Notes:** consent record required (DOC-02 privacy); password policy per DOC-07 §8.

### SCR-03 Login
- **Purpose:** authenticate returning learners.
- **Features:** email+password, "remember device", forgot password, future SSO button (hidden until OPD-002), session expiry handling.

### SCR-04 Password Reset
- **Purpose:** self-service password recovery via email OTP link; Arabic error messages; rate-limited.

### SCR-06 Home (Learner Dashboard)
- **Purpose:** return users to learning immediately.
- **Sections:** "واصل التعلم" (continue — resumable lesson), daily goal & streak, stage progress summary, upcoming assessments, announcements, recommended next module, certificate reminders.
- **Responsive:** cards grid 1-col mobile → 2–3 col desktop; bottom nav on mobile.

### SCR-07 Course Catalog
- **Purpose:** browse all stages/modules/paths.
- **Features:** filter (stage, difficulty, app, path), sort (recommended, effort, rating), search entry point, "stage locked" indicators with prerequisite hints.
- **RTL note:** filters mirror to the right (start side) on RTL.

### SCR-08 Stage Detail
- **Purpose:** explain a stage and gate enrollment.
- **Content:** overview, modules with durations & difficulty, certificate preview, prerequisites, learner outcomes, estimated total effort.
- **Actions:** Enroll (or "مقفلة — أكمل المتطلب" when prerequisites unmet); enroll → first lesson.

### SCR-09 Module Detail
- **Purpose:** lesson list and module requirements.
- **Content:** sequential lesson list with status icons, module quiz entry, exercise list, estimated time, rubric preview for project modules.
- **Behavior:** locked lessons show unlock conditions (DOC-03 §15).

## 6. Learning & Assessment Screens

### SCR-10 Lesson Player
- **Purpose:** primary learning surface — video/reading + practice.
- **Layout (mobile):** full-screen media player; content sections below; sticky controls.
- **Layout (tablet/desktop):** media left/center (RTL-aware), sidebar with lesson sections + transcript + notes.
- **Features:** play/pause, playback speed, quality selector, subtitles (Arabic + optional English), transcript panel, bookmark, take-note, "mark complete & continue", keyboard shortcuts, resume state sync.
- **Accessibility:** captions on by default, keyboard controls, focus management, reduced-motion handling of auto-advance (DOC-06/07).

### SCR-11 Exercise Workspace
- **Purpose:** guided hands-on practice with the Adobe app (learner works in their own Adobe app, then uploads/submits result files per DOC-07 §4).
- **Features:** brief, steps checklist, reference image/result, upload submission, save draft, submit; feedback screen after grading.
- **Mobile note:** file upload from mobile allowed; desktop encouraged for heavy files (≤ limits per DOC-07).

### SCR-12 Quiz / Assessment
- **Purpose:** run module quizzes, stage exams, and final exam (DOC-08).
- **Features:** timer + auto-save per question, one question per view, question palette, flag for review, confirm-submit dialog, offline queue.
- **Integrity:** attempt counter, cooldown messaging, honor-code statement, anti-cheat telemetry (DOC-08 §9).

### SCR-13 Results & Feedback
- **Purpose:** transparent results immediately or after moderation.
- **Content:** score vs threshold, pass/fail state, per-question review (correct/incorrect + explanation), rubric breakdown for projects, next-step recommendations, retake availability & cooldown.
- **Tone:** constructive, growth-oriented (DOC-07 §2).

### SCR-14 Progress & Analytics
- **Purpose:** motivate and inform.
- **Content:** stage/module progress bars, time spent, streak & daily goals, milestone timeline to certificates, skill heat-map by competency area.
- **Privacy:** learner sees own data only; aggregated comparisons shown as anonymized percentiles.

## 7. Certificate Screens

### SCR-05 Certificate Verification (public)
- **Purpose:** anyone can verify a certificate without an account.
- **Features:** serial/QR input, result (valid/revoked/not found), holder name, certificate title, issue date, issuing authority, signature/fingerprint display.
- **RTL note:** bilingual display (Arabic primary, English secondary fields).

### SCR-15 Certificates (learner)
- **Purpose:** earned credentials.
- **Content:** grid of certificates (CERT-01…08, DOC-03 §16), status (pending eligibility vs earned), download PDF, shareable verification link, QR code, serial number.
- **Behavior:** certificate eligibility explained when not yet earned ("متبقي: 2 وحدات").

### SCR-25 Admin: Certificates
- **Purpose:** operations control.
- **Features:** issuance audit log, manual issuance only via documented exception workflow, revocation with reason (audited), template management (per DOC-08 §7), verification statistics.

## 8. Admin Screens

Admin screens share the admin shell: side navigation (desktop), top bar with search, RTL-first layout, dense-but-accessible tables, bulk actions with confirmations.

| ID | Screen | Key Functions |
|----|--------|---------------|
| SCR-20 | Admin Dashboard | KPIs (enrollments, activations, completions, pass rates, NPS proxy), alerts, pending reviews queue |
| SCR-21 | Admin: Users | Search, view profile, roles, enrollment management, suspend/reactivate, GDPR-style export/delete, impersonation (audited) |
| SCR-22 | Admin: Curriculum | Stage/module/lesson CRUD, dependency editor, version history, CCP approval workflow, statuses (draft/review/published/retired) |
| SCR-23 | Admin: Content | Authoring pipeline inbox (per DOC-16 gates), media upload/transcode status, publish promotion to production |
| SCR-24 | Admin: Assessments | Question bank management, quiz configuration (thresholds, attempts, cooldowns per DOC-08), grading inbox with rubrics, moderation |
| SCR-26 | Admin: Analytics | Dashboards per DOC-01 metrics M-01…M-16, cohort export, raw event explorer (admin-only) |
| SCR-27 | Admin: Settings | Feature flags, billing config (post OPD-005), notification templates, integrations, audit log viewer |

**Admin boundary rules (DOC-02 §6):** admin screens never expose learner answers outside moderation flows; every sensitive action writes an audit record.

## 9. Settings, Notifications & Search

### SCR-16 Profile & Settings
- **Sections:** personal info (name, photo, language — Arabic default), learning preferences (reminders, daily goal, difficulty defaults), notification preferences, accessibility preferences (reduced motion, captions, contrast), privacy & data (export/delete), billing (post-launch), danger zone (delete account).
- **RTL/accessibility:** all forms keyboard-accessible; preference changes save instantly with toast confirmation.

### SCR-17 Notifications
- **Purpose:** notification inbox (in-app), grouped by type (learning, assessment, certificate, system).
- **Features:** unread badge (global), mark read/unread, archive, preferences shortcut, deep links to the target screen.
- **Channels:** in-app always; email/push per preferences (DOC-02 C-13).

### SCR-18 Search Results
- **Purpose:** search across catalog, lessons, glossary, help.
- **Features:** Arabic tokenization + typo tolerance (DOC-02 C-14), filters (type, stage, difficulty), result snippets with RTL-safe highlighting, "search within this stage" refinement.
- **Mobile:** search is a full-screen overlay from the app bar.

## 10. Responsive Behavior Rules

| Breakpoint | Class | Behavior |
|------------|-------|----------|
| 360–575 px | Phone | Single column; bottom navigation (5 items max); player full-screen; modals become bottom sheets; tables become stacked cards |
| 576–767 px | Large phone / small tablet | Bottom nav remains; content gains 2-col grids where useful |
| 768–1023 px | Tablet | Side navigation (collapsed/expandable); 2-col grids; player with transcript below |
| 1024–1279 px | Desktop | Side navigation expanded; 3-col grids; player + transcript sidebar |
| ≥ 1280 px | Large desktop | Full layouts; max content width (DOC-06 §4); admin screens use dense tables |

**Rules:**
1. No functionality is mobile-exclusive or desktop-exclusive (except admin console, which is desktop-first but tablet-usable).
2. Breakpoints are implemented with container queries where appropriate; tests cover all classes in DOC-16.
3. Media players always support mobile data saver / quality selection.

## 11. RTL Requirements

1. **Direction:** `dir="rtl"` and `lang="ar"` on the root document; LTR only for designated foreign strings (isolated with bidi control, DOC-06 §9).
2. **Mirroring:** icons, chevrons, progress direction, carousel direction, and time-relative graphics mirror; icons representing physical objects (e.g., camera lens) do not.
3. **Text alignment:** Arabic body text right-aligned; numbers and Latin terms use logical alignment (start/end, not left/right).
4. **Dates/numbers:** Arabic-Indic digits are the default; toggle for Western digits in settings. All date formatting is locale-correct.
5. **Validation:** every screen ships with an RTL QA checklist item (DOC-16 §R-01).

## 12. Navigation Model

| Surface | Navigation |
|---------|-----------|
| Learner — mobile | Bottom nav: الرئيسية (Home), المكتبة (Catalog), التقدم (Progress), الشهادات (Certificates), الإعدادات (Settings). Contextual back = RTL back (forward gesture). |
| Learner — tablet/desktop | Persistent side nav (collapsible) with the same sections + Search + Notifications in the top bar. |
| Learning focus mode | Player hides global nav (full-screen), returns via "خروج" (exit) with state preserved. |
| Admin | Permanent side nav grouped: لوحة التحكم (Dashboard), المستخدمون (Users), المنهج (Curriculum), المحتوى (Content), التقييم (Assessments), الشهادات (Certificates), التحليلات (Analytics), الإعدادات (Settings). |
| Public | Top nav: الرئيسية، المسارات، الأسعار، الدخول، التسجيل. |

**Navigation rules:** every screen is reachable in ≤ 3 taps/clicks from Home; deep links are stable (screen IDs never change without DOC-13 entry); breadcrumbs are provided on desktop for catalog depth.

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-04): 29 screens + global patterns. |

## Notes

- This blueprint is **functional**; visual styling decisions belong to DOC-06 and its future component specs.
- Screens marked "(future)" (SCR-28, SCR-29 conditional) are not built until their milestone and ADR gates pass (DOC-09).
- Screen IDs are permanent; screen renames require a changelog entry (DOC-13) and cross-reference updates.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-02 System Architecture](02_SYSTEM_ARCHITECTURE.md) | Components C-01…C-14 implement these screens |
| [DOC-06 Design System](06_DESIGN_SYSTEM.md) | Visual/typographic/spacing/accessibility rules |
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Content rendered inside SCR-10…SCR-13 |
| [DOC-08 Assessment Standard](08_ASSESSMENT_STANDARD.md) | Behaviors of SCR-11…SCR-13, SCR-05 |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | UX + RTL + accessibility review gates |
