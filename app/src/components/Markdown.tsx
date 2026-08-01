import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/**
 * Renders lesson markdown body with the Arabic prose styles (DOC-06/07).
 * Server component: markdown is rendered at request time (no client JS,
 * no hydration flash for lesson content).
 *
 * Phase 8: adds interactive callouts (blockquotes starting with a marker),
 * premium code blocks and figure-style images — presentation only, the
 * markdown source and content pipeline are untouched.
 */

const CALLOUTS: { key: string; tone: string; label: string }[] = [
  { key: "ملاحظة", tone: "info", label: "ملاحظة" },
  { key: "تنبيه", tone: "warning", label: "تنبيه" },
  { key: "تحذير", tone: "danger", label: "تحذير" },
  { key: "نصيحة", tone: "success", label: "نصيحة" },
  { key: "مهم", tone: "brand", label: "مهم" },
];

const TONE_CLASSES: Record<string, string> = {
  info: "border-info-500/30 bg-info-50 text-info-800",
  warning: "border-warning-500/30 bg-warning-50 text-warning-800",
  danger: "border-danger-500/30 bg-danger-50 text-danger-800",
  success: "border-success-500/30 bg-success-50 text-success-800",
  brand: "border-primary-500/30 bg-primary-50 text-primary-800",
};

/** Extract the leading Arabic keyword of a blockquote to style it as a callout. */
function detectCallout(node: React.ReactNode): { tone: string; label: string } | null {
  const text = extractText(node).trim();
  for (const c of CALLOUTS) {
    if (text.startsWith(`${c.key}:`) || text.startsWith(`${c.key} :`) || text.startsWith(`**${c.key}**`)) {
      return { tone: c.tone, label: c.label };
    }
  }
  return null;
}

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as never)) {
    return extractText((node as { props: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

const components: Components = {
  blockquote({ children }) {
    const callout = detectCallout(children);
    if (!callout) return <blockquote>{children}</blockquote>;
    return (
      <aside
        className={`my-7 rounded-2xl border px-5 py-4 shadow-xs transition-shadow hover:shadow-sm ${TONE_CLASSES[callout.tone]}`}
        role="note"
      >
        <p className="mb-1 text-2xs font-bold uppercase tracking-widest opacity-70">{callout.label}</p>
        <div className="[&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
      </aside>
    );
  },
  img({ src, alt }) {
    if (!src || typeof src !== "string") return null;
    return (
      <figure className="my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="w-full rounded-2xl border border-hairline shadow-sm transition-transform duration-slow ease-out-expo hover:scale-[1.01]"
        />
        {alt ? (
          <figcaption className="mt-3 text-center text-xs text-neutral-500">{alt}</figcaption>
        ) : null}
      </figure>
    );
  },
  table({ children }) {
    return (
      <div className="my-7 overflow-x-auto rounded-2xl border border-hairline">
        <table className="!my-0 !block w-full !border-0 md:!table">{children}</table>
      </div>
    );
  },
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ar" dir="rtl" lang="ar">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
