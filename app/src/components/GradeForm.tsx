"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RubricCriterion } from "@/lib/rubric";

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
    <form className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <p className="text-sm font-bold text-neutral-800">{title} — تصحيح وفق الروبرك ({projectCode})</p>
      <div className="mt-3 space-y-3">
        {criteria.map((c, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3">
            <label htmlFor={`c-${submissionId}-${i}`} className="w-full text-sm font-semibold text-neutral-700 sm:w-52">
              {c.name}
            </label>
            <select
              id={`c-${submissionId}-${i}`}
              value={scores[i] || ""}
              onChange={(e) => setScores((prev) => { const n = [...prev]; n[i] = Number(e.target.value); return n; })}
              className="input max-w-[140px]"
              required
            >
              <option value="" disabled>الدرجة…</option>
              {[4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>{v} — {v === 4 ? "ممتاز" : v === 3 ? "جيد جدًا" : v === 2 ? "مقبول" : "غير مكتمل"}</option>
              ))}
            </select>
            <span className="text-xs text-neutral-500">{scores[i] === 4 ? c.d4 : scores[i] === 1 ? c.d1 : ""}</span>
          </div>
        ))}
        <div>
          <label htmlFor={`f-${submissionId}`} className="label">ملاحظات للمتعلم</label>
          <textarea id={`f-${submissionId}`} rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} className="input" placeholder="ما الذي أُحسن؟ وما الذي يُعدَّل؟" />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {filled && (
          <span className={`badge ${passed ? "badge-green" : "badge-amber"}`}>
            {passed ? `مقبول — متوسط ${avg}/4` : `مُعاد — متوسط ${avg}/4`}
          </span>
        )}
        <button type="submit" disabled={!filled || busy} className="btn-primary">
          {busy ? "جارٍ الحفظ…" : "حفظ التقييم"}
        </button>
      </div>
    </form>
  );
}
