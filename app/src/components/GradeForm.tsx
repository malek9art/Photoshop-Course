"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RubricCriterion } from "@/lib/rubric";
import { Alert } from "./ui";

/** Admin rubric grading form (DOC-08 §6): 1–4 per criterion, auto verdict. */
export function GradeForm({ submissionId, projectCode, criteria, title }: {
  submissionId: string;
  projectCode: string;
  criteria: RubricCriterion[];
  title: string;
}) {
  const router = useRouter();
  const [scores, setScores] = useState<number[]>(criteria.map(() => 0));
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filled = scores.every((s) => s >= 1 && s <= 4);
  const avg = filled ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100 : 0;
  const passed = filled && avg >= 3.0 && !scores.includes(1);

  async function submit() {
    if (!filled || busy) return;
    setBusy(true);
    const fd = new FormData();
    fd.set("submission_id", submissionId);
    fd.set("feedback", feedback);
    scores.forEach((s, i) => fd.set(`criterion_${i}`, String(s)));
    try {
      const res = await fetch("/api/admin/grade-submission", { method: "POST", body: fd });
      if (res.ok || res.redirected) {
        setError(null);
        router.refresh();
      } else {
        setError("تعذر حفظ التقييم — تأكد من اكتمال الدرجات وأعد المحاولة.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم — أعد المحاولة.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="rounded-2xl border border-hairline bg-surface-muted/60 p-5 md:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-sm font-bold text-neutral-900">
        تصحيح وفق الروبرك <span className="font-mono text-xs text-primary-600">({projectCode})</span>
      </p>
      <div className="mt-5 space-y-4">
        {criteria.map((c, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-hairline">
            <label htmlFor={`c-${submissionId}-${i}`} className="w-full text-sm font-semibold text-neutral-700 sm:w-52">
              {c.name}
            </label>
            <select
              id={`c-${submissionId}-${i}`}
              value={scores[i] || ""}
              onChange={(e) => setScores((prev) => { const n = [...prev]; n[i] = Number(e.target.value); return n; })}
              className="input max-w-[150px]"
              required
            >
              <option value="" disabled>الدرجة…</option>
              {[4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>{v} — {v === 4 ? "ممتاز" : v === 3 ? "جيد جدًا" : v === 2 ? "مقبول" : "غير مكتمل"}</option>
              ))}
            </select>
            <span className="flex-1 text-xs leading-relaxed text-neutral-500">
              {scores[i] === 4 ? c.d4 : scores[i] === 1 ? c.d1 : ""}
            </span>
          </div>
        ))}
        <div>
          <label htmlFor={`f-${submissionId}`} className="label">ملاحظات للمتعلم</label>
          <textarea
            id={`f-${submissionId}`}
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="input resize-y"
            placeholder="ما الذي أُحسن؟ وما الذي يُعدَّل؟"
          />
        </div>
      </div>
      {error && (
        <div className="mt-4 animate-shake">
          <Alert tone="danger" role="alert">
            {error}
          </Alert>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
        <div className="flex items-center gap-3">
          {filled ? (
            <>
              <span className={passed ? "badge-green" : "badge-amber"}>{passed ? "مقبول" : "مُعاد"}</span>
              <span className="text-sm font-bold text-neutral-900">متوسط {avg}/4</span>
            </>
          ) : (
            <span className="text-xs text-neutral-500">أكمل درجات المعايير الأربعة لعرض الحكم.</span>
          )}
        </div>
        <button type="submit" disabled={!filled || busy} className="btn-primary">
          {busy && (
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            />
          )}
          {busy ? "جارٍ الحفظ…" : "حفظ التقييم"}
        </button>
      </div>
    </form>
  );
}
