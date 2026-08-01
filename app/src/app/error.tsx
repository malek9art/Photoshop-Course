"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertIcon, ArrowLeftIcon } from "@/components/icons";

/** Route-level error boundary — friendly Arabic error state with a retry path. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaced in server/browser logs for diagnostics; no PII is rendered.
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[55vh] animate-fade-up flex-col items-center justify-center px-4 text-center"
    >
      <span
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-danger-50 text-danger-600 ring-1 ring-danger-500/20"
        aria-hidden="true"
      >
        <AlertIcon className="h-9 w-9" />
      </span>

      <h1 className="mt-7 text-2xl font-black tracking-tighter text-neutral-900">حدث خطأ غير متوقع</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        تعذّر عرض هذه الصفحة. يمكنك إعادة المحاولة الآن — وإن استمرت المشكلة، عد إلى الصفحة الرئيسية.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-2xs text-neutral-400" dir="ltr">
          ref: {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          إعادة المحاولة
        </button>
        <Link href="/" className="btn-outline group">
          العودة إلى الرئيسية
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
