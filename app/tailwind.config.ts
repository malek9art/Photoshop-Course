import type { Config } from "tailwindcss";

/**
 * Design tokens per DOC-06 (roles fixed; values are interim defaults while OPD-007 is open).
 * - primary: teal (premium, calm) — interactive/active elements
 * - accent: amber/gold — secondary brand color, highlights
 * - neutral: warm stone grays
 * RTL-first: layout uses logical properties; `rtl:`/`ltr:` variants available.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        neutral: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
      fontFamily: {
        sans: [
          "Tajawal",
          "Segoe UI",
          "Tahoma",
          "Noto Kufi Arabic",
          "IBM Plex Sans Arabic",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
