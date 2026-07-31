"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders lesson markdown body with the Arabic prose styles (DOC-06/07). */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ar" dir="rtl" lang="ar">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
