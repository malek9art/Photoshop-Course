import type { Config } from "tailwindcss";

/**
 * ===========================================================================
 *  Design System — "Aurora" (Phase 8 premium UI)
 * ===========================================================================
 *  Roles remain those fixed by DOC-06; only the *values* and the token
 *  plumbing changed (OPD-007 interim values → CSS-variable driven tokens).
 *
 *  - Every palette is emitted through CSS custom properties (R G B triplets)
 *    so the same utility class works in light and dark mode without touching
 *    a single component.  `rgb(var(--x) / <alpha-value>)` keeps opacity
 *    modifiers (`bg-primary-600/40`) fully functional.
 *  - RTL-first: layout relies on logical properties; `rtl:`/`ltr:` variants
 *    stay available.
 *  - Dark mode: class strategy (`.dark` on <html>), no flash (inline script
 *    in the root layout).
 * ===========================================================================
 */

/** Helper: build a scale of `rgb(var(--token) / <alpha-value>)` entries. */
const scale = (name: string, steps: (number | string)[]) =>
  Object.fromEntries(steps.map((s) => [String(s), `rgb(var(--${name}-${s}) / <alpha-value>)`]));

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Brand — deep teal, calm & premium (interactive/active elements) */
        primary: scale("primary", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        /* Secondary brand — refined gold (highlights, certificates) */
        accent: scale("accent", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        /* Neutrals — flip automatically between light & dark */
        neutral: scale("neutral", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),

        /* Semantic status colours */
        success: scale("success", [50, 100, 200, 500, 600, 700, 800]),
        warning: scale("warning", [50, 100, 200, 500, 600, 700, 800]),
        danger: scale("danger", [50, 100, 200, 500, 600, 700, 800]),
        info: scale("info", [50, 100, 200, 500, 600, 700, 800]),

        /* Surfaces & elevations (semantic aliases) */
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          muted: "rgb(var(--surface-muted) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
          inverted: "rgb(var(--surface-inverted) / <alpha-value>)",
        },
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)",
        "hairline-strong": "rgb(var(--hairline-strong) / <alpha-value>)",
      },

      fontFamily: {
        sans: [
          "Tajawal",
          "IBM Plex Sans Arabic",
          "Noto Kufi Arabic",
          "Segoe UI",
          "Tahoma",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Tajawal",
          "IBM Plex Sans Arabic",
          "Noto Kufi Arabic",
          "system-ui",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "JetBrains Mono", "Menlo", "monospace"],
      },

      /* Fluid, Arabic-aware type scale (line-height tuned for Arabic script) */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        xs: ["0.75rem", { lineHeight: "1.7" }],
        sm: ["0.875rem", { lineHeight: "1.85" }],
        base: ["1rem", { lineHeight: "1.9" }],
        lg: ["1.125rem", { lineHeight: "1.8" }],
        xl: ["1.25rem", { lineHeight: "1.65" }],
        "2xl": ["clamp(1.4rem, 1.2rem + 0.9vw, 1.75rem)", { lineHeight: "1.5", letterSpacing: "-0.005em" }],
        "3xl": ["clamp(1.7rem, 1.35rem + 1.6vw, 2.25rem)", { lineHeight: "1.42", letterSpacing: "-0.01em" }],
        "4xl": ["clamp(2rem, 1.5rem + 2.4vw, 3rem)", { lineHeight: "1.32", letterSpacing: "-0.015em" }],
        "5xl": ["clamp(2.4rem, 1.6rem + 3.6vw, 3.9rem)", { lineHeight: "1.22", letterSpacing: "-0.02em" }],
        "6xl": ["clamp(2.9rem, 1.8rem + 5vw, 4.8rem)", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
      },

      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        wider: "0.04em",
        widest: "0.14em",
      },

      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.375rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },

      /* Soft, layered elevations — no harsh 2010-era shadows */
      boxShadow: {
        xs: "0 1px 2px 0 rgb(var(--shadow) / 0.04)",
        sm: "0 1px 2px 0 rgb(var(--shadow) / 0.04), 0 1px 3px 0 rgb(var(--shadow) / 0.05)",
        DEFAULT: "0 2px 4px -2px rgb(var(--shadow) / 0.06), 0 4px 12px -2px rgb(var(--shadow) / 0.07)",
        md: "0 4px 8px -4px rgb(var(--shadow) / 0.07), 0 8px 24px -6px rgb(var(--shadow) / 0.09)",
        lg: "0 8px 16px -8px rgb(var(--shadow) / 0.09), 0 20px 40px -12px rgb(var(--shadow) / 0.12)",
        xl: "0 16px 32px -16px rgb(var(--shadow) / 0.12), 0 32px 64px -24px rgb(var(--shadow) / 0.16)",
        glow: "0 0 0 1px rgb(var(--primary-500) / 0.16), 0 12px 40px -12px rgb(var(--primary-500) / 0.35)",
        "glow-accent": "0 0 0 1px rgb(var(--accent-500) / 0.18), 0 12px 40px -12px rgb(var(--accent-500) / 0.35)",
        inset: "inset 0 1px 0 0 rgb(255 255 255 / 0.06)",
      },

      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgb(var(--hairline) / 0.9) 1px, transparent 1px), linear-gradient(to left, rgb(var(--hairline) / 0.9) 1px, transparent 1px)",
        "aurora":
          "radial-gradient(60% 80% at 80% 10%, rgb(var(--primary-500) / 0.28), transparent 60%), radial-gradient(50% 70% at 10% 20%, rgb(var(--accent-500) / 0.20), transparent 62%), radial-gradient(70% 90% at 50% 100%, rgb(var(--primary-700) / 0.28), transparent 65%)",
        "sheen":
          "linear-gradient(100deg, transparent 20%, rgb(255 255 255 / 0.22) 45%, transparent 70%)",
      },

      backgroundSize: {
        grid: "44px 44px",
        shimmer: "220% 100%",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: {
        fast: "140ms",
        DEFAULT: "220ms",
        slow: "420ms",
      },

      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "fade-down": {
          from: { opacity: "0", transform: "translate3d(0, -12px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translate3d(18px, 0, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(10px)", transform: "translate3d(0, 10px, 0)" },
          to: { opacity: "1", filter: "blur(0)", transform: "translate3d(0, 0, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-120% 0" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pop-check": {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "progress-fill": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        "ripple-out": {
          from: { transform: "scale(0)", opacity: "0.35" },
          to: { transform: "scale(2.6)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "20%, 60%": { transform: "translate3d(-5px,0,0)" },
          "40%, 80%": { transform: "translate3d(5px,0,0)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },

      animation: {
        "fade-in": "fade-in 380ms cubic-bezier(0.22,0.61,0.36,1) both",
        "fade-up": "fade-up 520ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-down": "fade-down 420ms cubic-bezier(0.16,1,0.3,1) both",
        "slide-in": "slide-in 460ms cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 300ms cubic-bezier(0.34,1.56,0.64,1) both",
        "blur-in": "blur-in 640ms cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.9s linear infinite",
        float: "float 7s ease-in-out infinite",
        "gradient-pan": "gradient-pan 14s ease-in-out infinite",
        "pop-check": "pop-check 480ms cubic-bezier(0.34,1.56,0.64,1) both",
        "progress-fill": "progress-fill 900ms cubic-bezier(0.16,1,0.3,1) both",
        "ripple-out": "ripple-out 620ms cubic-bezier(0.16,1,0.3,1) forwards",
        shake: "shake 420ms cubic-bezier(0.36,0.07,0.19,0.97) both",
        "spin-slow": "spin-slow 2.4s linear infinite",
      },

      screens: {
        xs: "420px",
        "3xl": "1720px",
      },

      maxWidth: {
        prose: "72ch",
        content: "1180px",
        wide: "1400px",
      },

      zIndex: {
        header: "40",
        overlay: "60",
        toast: "80",
      },
    },
  },
  plugins: [],
};

export default config;
