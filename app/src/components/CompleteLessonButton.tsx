"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, CheckCircleIcon } from "./icons";
import { SuccessCheck } from "./feedback";

/** Marks a lesson complete (POST /api/progress) then refreshes. */
export function CompleteLessonButton({ lessonId, alreadyCompleted }: { lessonId: string; alreadyCompleted: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [error, setError] = useState(false);

  async function complete() {
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "lesson", targetId: lessonId, state: "completed" }),
      });
      if (res.ok) {
        setCelebrate(true);
        window.setTimeout(() => {
          setCelebrate(false);
          router.refresh();
        }, 1150);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (alreadyCompleted) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl bg-success-50 px-4 py-2.5 text-sm font-semibold text-success-700 ring-1 ring-inset ring-success-500/20">
        <CheckCircleIcon className="h-4 w-4" />
        درس مكتمل
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={complete}
        disabled={busy}
        aria-live="polite"
        className={`btn-primary group ${error ? "animate-shake" : ""}`}
      >
        {busy ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            />
            جارٍ الحفظ…
          </>
        ) : (
          <>
            <CheckIcon className="h-4 w-4 transition-transform duration-base ease-spring group-hover:scale-125" strokeWidth={2.4} />
            إكمال الدرس
          </>
        )}
      </button>

      {error && (
        <span role="alert" className="text-xs font-medium text-danger-600">
          تعذّر حفظ التقدم — حاول مرة أخرى.
        </span>
      )}

      {/* Completion celebration overlay */}
      {celebrate && (
        <div
          className="fixed inset-0 z-overlay flex items-center justify-center bg-neutral-950/35 backdrop-blur-sm"
          role="status"
          aria-live="assertive"
        >
          <div className="flex animate-scale-in flex-col items-center gap-4 rounded-3xl border border-hairline bg-surface px-10 py-9 shadow-xl">
            <SuccessCheck />
            <p className="text-lg font-bold text-neutral-900">أحسنت! تم إكمال الدرس</p>
            <p className="text-sm text-neutral-500">تقدّمك محفوظ — واصل إلى الدرس التالي.</p>
          </div>
        </div>
      )}
    </>
  );
}
