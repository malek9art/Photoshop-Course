# 06 — Design System

> **Document ID:** DOC-06 · **Status:** Active · **Owner:** Design Lead (role)

| Field | Value |
|-------|-------|
| **Title** | Design System |
| **Purpose** | Defines the visual principles, brand guidelines, spacing, typography, color system, icon rules, accessibility requirements, and responsive principles for the academy. It is the single reference for all visual decisions — implementation tokens/components will be derived from it and must conform to it. |
| **Owner** | Design Lead (role) |
| **Version** | 1.0.0 |
| **Status** | Active |
| **Dependencies** | DOC-01 (premium positioning), DOC-04 (screen requirements), DOC-07 (content media rules) |
| **Last Updated** | 2026-07-31 |
| **Review Cadence** | At design milestones (MS-11) and whenever brand elements change |

## Table of Contents

- [1. Design Philosophy](#1-design-philosophy)
- [2. Brand Guidelines](#2-brand-guidelines)
- [3. Spacing & Layout Grid](#3-spacing--layout-grid)
- [4. Typography](#4-typography)
- [5. Color System](#5-color-system)
- [6. Iconography Rules](#6-iconography-rules)
- [7. Imagery, Illustration & Motion](#7-imagery-illustration--motion)
- [8. Accessibility Standards](#8-accessibility-standards)
- [9. RTL & Responsive Principles](#9-rtl--responsive-principles)
- [10. Component Inventory (functional)](#10-component-inventory-functional)
- [Revision History](#revision-history)
- [Notes](#notes)
- [Cross References](#cross-references)

---

## 1. Design Philosophy

1. **Premium & calm.** Generous whitespace, restrained color, refined detail. The interface never competes with the creative work being taught.
2. **Arabic-first elegance.** Arabic typography is the visual hero. Western design tropes are adapted, not copied, to an RTL reading experience.
3. **Clarity over decoration.** Every visual element has a function; decorative elements are minimal and purposeful.
4. **Design tokens before components.** Colors, spacing, and type are defined as named tokens; no hard-coded values in implementation (future).
5. **Accessible aesthetics.** Beauty never trades off accessibility; contrast, size, and motion standards are non-negotiable (DOC-16).

## 2. Brand Guidelines

> Placeholder values are marked `[TBD]` where brand identity work is required before launch. No agent may invent final brand values without a brand ADR.

### 2.1 Brand identity

| Element | Value / Guideline |
|---------|-------------------|
| Product name | Adobe Creative Academy — الاسم التجاري المقترح: «أكاديمية أدوبي الإبداعية» (final Arabic name `[TBD]` with trademark review) |
| Brand promise | "من المبتدئ إلى المحترف المعتمد" (From beginner to certified professional) |
| Tone of voice | Expert, encouraging, professional, culturally native; never childish, never corporate-cold |
| Logo | `[TBD]` — must work on light/dark surfaces, Arabic wordmark primary, English lockup secondary; min clear space = height of the "أ" counter; no recoloring, no effects, no rotation |
| Legal | All use of "Adobe" marks is governed by Adobe trademark guidelines; the academy is **not** affiliated with or certified by Adobe unless a formal agreement exists (DOC-01 §9, ADR-007) |

### 2.2 Brand usage rules

- The brand mark is never placed on noisy imagery without a scrim.
- Arabic and English marks are never mixed in the same lockup except in approved bilingual layouts.
- Certificate templates follow their own brand rules in DOC-08 §7.

## 3. Spacing & Layout Grid

- **Base unit:** 4 px. All spacing is a multiple of 4: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96`.
- **Tokens:** `space-1`(4) `space-2`(8) `space-3`(12) `space-4`(16) `space-5`(24) `space-6`(32) `space-7`(48) `space-8`(64) `space-9`(96).
- **Grid:** 12-column fluid grid on desktop/tablet, 4-column on mobile. Gutters: 16 px mobile, 24 px tablet, 32 px desktop. Max content width 1200 px (1440 px for admin data views).
- **Vertical rhythm:** section spacing `space-6`/`space-7`; component spacing `space-4`/`space-5`.
- **Touch targets:** ≥ 44 × 44 px on mobile; ≥ 40 px elsewhere (WCAG 2.5.5 AAA preferred where feasible).
- **Arabic note:** optical margins for Arabic script extend the baseline grid; hanging punctuation is allowed for display type only.

## 4. Typography

### 4.1 Typefaces (candidate stack — final selection `[TBD]` with licensing review)

| Role | Arabic | Latin/fallback |
|------|--------|----------------|
| Display / Headings | IBM Plex Sans Arabic or Tajawal (Bold/Black) — `[TBD]` | Inter / system |
| Body | Tajawal or IBM Plex Sans Arabic (Regular/Medium) — `[TBD]` | Inter / system |
| Mono / code-like values | IBM Plex Mono (for shortcuts, hex codes) | — |
| Fallback | `system-ui` Arabic-aware stack | — |

**Rules:** fonts must be self-hosted or licensed for web use (ADR-007); no system-default-only rendering for headings; Arabic fonts require proper `font-feature-settings` (e.g., proper diacritic placement).

### 4.2 Type scale (design tokens)

| Token | Size / Line-height | Use |
|-------|--------------------|-----|
| `display-xl` | 40/56 px | Landing hero (desktop) |
| `display-lg` | 32/44 px | Screen hero titles |
| `heading-lg` | 28/40 px | Page titles (desktop) |
| `heading-md` | 22/32 px | Section titles |
| `heading-sm` | 18/28 px | Card titles |
| `body-lg` | 17/28 px | Reading content |
| `body-md` | 16/26 px | Default body |
| `body-sm` | 14/22 px | Secondary text |
| `caption` | 12/18 px | Captions, timestamps |

**Arabic-specific rules:**
- Arabic line-height is 1.5–1.8 × Latin equivalents (taller ascenders/descenders, diacritics).
- Arabic headings prefer lighter weights at display sizes (Arabic glyphs thicken visually).
- Letter-spacing: **never** apply positive tracking to Arabic; negative tracking only at display sizes with testing.
- Numerals: Arabic-Indic (٠١٢٣…) default in content; Western digits for code/technical values; switchable in settings (DOC-04 §11).

## 5. Color System

### 5.1 Palette structure (all values `[TBD]` pending brand work — tokens and roles are fixed)

| Token group | Tokens | Role |
|-------------|--------|------|
| **Primary** | `primary-50…900` | Brand color for actions, links, active states |
| **Secondary** | `secondary-50…900` | Supporting brand color, accents, path identity |
| **Neutral** | `neutral-0…1000` | Surfaces, text, borders (warm-leaning to suit Arabic culture) |
| **Semantic** | `success`, `warning`, `danger`, `info` (+50…900 each) | Status, feedback, alerts |
| **Surface** | `surface-0/1/2/3`, `surface-inverse` | Elevation of cards/dialogs/nav |
| **Text** | `text-primary`, `text-secondary`, `text-tertiary`, `text-inverse`, `text-on-accent` | Readability roles |
| **Border** | `border-subtle`, `border-default`, `border-strong` | Dividers and outlines |

### 5.2 Color usage rules

1. Primary color is reserved for interactive/active elements — never for large background fills except brand surfaces.
2. Semantic colors never used decoratively; `danger` implies actionable error, `warning` implies caution, `success` implies completion.
3. **Contrast:** all text/icon-on-surface pairs meet WCAG 2.2 AA (≥ 4.5:1 body, ≥ 3:1 large text/icons). A contrast-check pass is part of DOC-16.
4. **Dark mode:** supported from launch; same token roles, adjusted values; never pure black `#000` (use neutral-1000 warm dark).
5. **Meaning independence:** color never carries information alone — always paired with icon/text (WCAG 1.4.1).
6. Exam/quiz surfaces use a distinct, calmer surface so learners recognize assessment contexts (DOC-04 SCR-12).

## 6. Iconography Rules

| Rule | Value |
|------|-------|
| Style | Outline (stroke-based), 1.5–2 px stroke, 24 × 24 default grid |
| Rounded caps | Rounded joins/caps for friendliness |
| Library | One source library (e.g., Lucide-style, `[TBD]`) — no mixed icon sets |
| Sizes | 16, 20, 24, 32, 40 px tokens only |
| Mirroring | Icons mirror in RTL: chevrons, arrows, playback "forward/back", progress direction. Icons for physical objects (camera, keyboard) and brand marks do **not** mirror (DOC-04 §11) |
| Meaning | Every icon paired with text label in navigation/actions; decorative icons marked `aria-hidden` |
| Status | Success/warning/danger icons filled, outline elsewhere |
| Custom icons | Only via design system governance (ADR + DOC-13), never ad hoc |

## 7. Imagery, Illustration & Motion

- **Photography:** authentic, regionally representative (Arab creatives, Arab workspaces); licensed or original (ADR-007); used with scrims where text overlays.
- **Illustration:** a consistent flat/soft-3D style `[TBD]` for empty states and onboarding; one style across the product.
- **Lesson media:** follows DOC-07 §6 (resolution, captions, thumbnails).
- **Motion (UI):**
  - Durations: micro-interactions 150–200 ms; panel transitions 200–300 ms; page transitions ≤ 300 ms.
  - Easing: `ease-out` for entrances, `ease-in-out` for loops; no bouncy easings.
  - **Reduced motion:** `prefers-reduced-motion: reduce` disables all non-essential motion; carousels, auto-advance, and confetti are static.
  - Progress/loading: skeleton shimmer must respect reduced motion (use opacity pulse only).
- **Video player chrome** follows DOC-04 SCR-10; autoplay is never enabled with sound.

## 8. Accessibility Standards

Baseline: **WCAG 2.2 Level AA** — enforced in DOC-16 §Accessibility Review.

| Area | Requirement |
|------|-------------|
| Contrast | §5.2 rule 3; verify with automated + manual checks |
| Keyboard | Full keyboard operability; visible focus indicator (2 px ring, offset 2 px); logical focus order = visual RTL reading order |
| Screen readers | All Arabic UI read correctly by Arabic SRs (NVDA+Arabic, VoiceOver ar); landmarks, headings hierarchy, aria-live for toasts/errors |
| Forms | Labels always visible (never placeholder-only); error messages linked via `aria-describedby`; Arabic error text |
| Touch | Targets ≥ 44 px; no time-limited interactions without warning (assessment timers exempt with 5-min warnings) |
| Zoom | Layout works at 200% zoom and 320 px width without loss (reflow) |
| Captions | All video has Arabic captions; English optional (DOC-07 §6) |
| Target size, pointer gestures, drag | Drag alternatives provided (e.g., file upload has a browse button) |
| Consistency | Same components behave the same everywhere; identical action labels |

## 9. RTL & Responsive Principles

- **Direction:** `dir="rtl"` root; logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-*`) mandatory; physical properties prohibited in layout.
- **Mirroring map:** alignment (start/end), text, progress bars (fill from right), carousels, steppers, timeline, back/forward, pagination — all mirror. Icons/objects per §6.
- **Bidi:** mixed Arabic/English strings use proper isolation (`<bdi>` / `unicode-bidi: isolate`); parentheses and punctuation follow locale rules.
- **Responsive:** mobile-first breakpoints 360/576/768/1024/1280/1536 (DOC-04 §10); container-query driven components; test matrix covers all breakpoints in both directions once LTR is added.
- **RTL QA:** every component/screen includes an RTL check item in DOC-16 (R-01).

## 10. Component Inventory (functional)

> Visual specs per component will be authored in the implementation milestone (MS-11). This list fixes **what components exist** and their accessibility contract.

| Component | Functional + a11y contract |
|-----------|----------------------------|
| Buttons (primary/secondary/ghost/destructive, icon-btn) | ≥ 44 px, focus ring, aria labels, RTL icons, loading state with aria-busy |
| Inputs (text, email, password, textarea, select, search, file) | Visible labels, error/help text links, char counters, autofill styling |
| Checkbox / Radio / Switch | Keyboard native, clear selected state, group semantics |
| Cards | Semantic grouping; interactive cards are real buttons/links |
| Navigation (top bar, side nav, bottom nav, tabs, breadcrumbs) | Landmarks, current-page indication, collapse behavior per DOC-04 §12 |
| Dialog / Modal / Bottom sheet | Focus trap, escape close, `role=dialog`, scroll lock, RTL-aware sheet side |
| Toast / Snackbar | `aria-live=polite`, icon+text, action optional, dismissible |
| Progress (linear, ring, steps, skeletons) | `role=progressbar` with values; reduced-motion variants |
| Tables (admin) | Real `<table>` or grid with row/col headers; responsive stacking |
| Media player | Keyboard full control, captions toggle, focus ring, RTL direction of controls |
| Avatar / Badge / Tag | Alt text / aria-label; status colors with icon pairing |
| Empty state / Error state / 404 | Per DOC-04 §4; illustration + text + action |

---

## Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-07-31 | Project Foundation Architect | Initial baseline (DOC-06). |

## Notes

- Token **names/roles** are fixed by this document; token **values** marked `[TBD]` are brand decisions requiring an ADR before implementation (MS-11).
- Design tokens must be implemented once and consumed everywhere; ad hoc styling is a quality-gate failure (DOC-16).
- Any conflict between this document and a marketing/brand asset is resolved by the Design Lead, recorded in DOC-13.

## Cross References

| Reference | Relationship |
|-----------|--------------|
| [DOC-01 Project Vision](01_PROJECT_VISION.md) | Premium positioning |
| [DOC-04 UI Blueprint](04_UI_BLUEPRINT.md) | Screens this system styles |
| [DOC-07 Content Standards](07_CONTENT_STANDARDS.md) | Media/caption/accessibility in content |
| [DOC-08 Assessment Standard](08_ASSESSMENT_STANDARD.md) | Certificate template design constraints |
| [DOC-16 Quality Checklist](16_QUALITY_CHECKLIST.md) | UX + accessibility review gates |
