"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ExamConfig = { passPct: number; attempts: number; cooldownDays: number; durationMin: number };
type ExamItem = { id: number; question: string; options: string[] };
type GradeResult = { id: number; correct: boolean; chosen: number; answerIndex: number };

const LETTERS = ["أ", "ب", "ج", "د", "ه", "و"];

export function ExamPlayer({ code }: { code: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [items, setItems] = useState<ExamItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; passed: boolean; results: GradeResult[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fetch(`/api/exam/${code}`)
      .then((r) => {
        if (r.status === 401) router.replace(`/login?next=/exam/${code}`);
        return r.ok ? r.json() : Promise.reject(new Error("not-found"));
      })
      .then((d) => {
        setTitle(d.title);
        setConfig(d.config);
        setItems(d.items);
        setAttemptsLeft(d.attemptsLeft ?? null);
        setCooldownUntil(d.cooldownUntil ?? null);
      })
      .catch(() => setError("تعذر تحميل الاختبار."));
  }, [code, router]);

  async function submit() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/exam/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds: items.map((i) => i.id), answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) router.push(`/login?next=/exam/${code}`);
        else if (res.status === 429) setError("فترة التهدئة سارية — عد لاحقًا (7 أيام — DOC-08 §5).");
        else if (res.status === 403) setError("استنفدت محاولاتك لهذا الاختبار.");
        else setError(data.error ?? "حدث خطأ.");
        return;
      }
      setResult(data);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!config || items.length === 0) return <p className="text-sm text-neutral-500">جارٍ تحميل الاختبار…</p>;

  if (result) {
    const correctCount = result.results.filter((r) => r.correct).length;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card p-8 text-center">
          <p className="text-5xl" aria-hidden="true">{result.passed ? "🎉" : "📚"}</p>
          <h2 className="mt-3 text-2xl font-extrabold text-neutral-900">
            {result.passed ? "أحسنت! اجتزت اختبار المرحلة" : "لم تجتز الاختبار هذه المرة"}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            نتيجتك: <b>{result.score}%</b> · النجاح من {config.passPct}% · {correctCount}/{result.results.length} إجابة صحيحة
          </p>
          {!result.passed && (
            <p className="mt-2 text-xs text-neutral-500">
              راجع دروس المرحلة ثم أعد المحاولة بعد فترة التهدئة (7 أيام — DOC-08 §5).
            </p>
          )}
          <button type="button" onClick={() => router.push("/catalog")} className="btn-primary mt-6">
            العودة إلى المكتبة
          </button>
        </div>

        <div className="card mt-6 p-6">
          <h3 className="mb-3 font-bold text-neutral-900">مراجعة إجاباتك</h3>
          <ul className="space-y-3">
            {result.results.map((r) => (
              <li key={r.id} className={`rounded-lg border px-4 py-3 text-sm ${r.correct ? "border-primary-200 bg-primary-50/50" : "border-red-200 bg-red-50/50"}`}>
                <span className="font-bold">{r.id}. </span>
                <span className="font-semibold text-neutral-800">{items.find((i) => i.id === r.id)?.question}</span>
                <span className="mt-1 block text-xs text-neutral-600">
                  {r.correct ? "✓ إجابة صحيحة" : `الإجابة الصحيحة: ${LETTERS[r.answerIndex] ?? ""}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (attemptsLeft === 0 || cooldownUntil) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-4xl" aria-hidden="true">⏳</p>
        <h2 className="mt-3 text-lg font-bold text-neutral-900">الاختبار غير متاح حاليًا</h2>
        {cooldownUntil ? (
          <p className="mt-2 text-sm text-neutral-600">
            فترة التهدئة سارية حتى {new Date(cooldownUntil).toLocaleDateString("ar-SA")} — أعد المحاولة بعدها (DOC-08 §5).
          </p>
        ) : (
          <p className="mt-2 text-sm text-neutral-600">استنفدت المحاولات المسموحة لهذا الاختبار.</p>
        )}
        <button type="button" onClick={() => router.push("/catalog")} className="btn-primary mt-6">العودة إلى المكتبة</button>
      </div>
    );
  }

  const item = items[idx];
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-xl font-extrabold text-neutral-900">{title}</h1>
        <p className="mt-1 text-xs text-neutral-500">
          السؤال {idx + 1} من {items.length} · النجاح من {config.passPct}% · المحاولات المتبقية: {attemptsLeft ?? "—"}
        </p>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${answers[i] !== undefined ? "bg-primary-600" : i === idx ? "bg-accent-500" : "bg-neutral-200"}`} />
          ))}
        </div>
      </header>

      <div className="card p-6">
        <h2 className="text-lg font-bold leading-relaxed text-neutral-900">{item.question}</h2>
        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">الخيارات</legend>
          {item.options.map((opt, i) => {
            const selected = answers[idx] === i;
            return (
              <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${selected ? "border-primary-500 bg-primary-50" : "border-neutral-200 hover:border-primary-300"}`}>
                <input type="radio" name="answer" checked={selected} onChange={() => setAnswers((prev) => { const n = [...prev]; n[idx] = i; return n; })} className="mt-1 accent-primary-700" />
                <span className="text-sm leading-relaxed text-neutral-800"><span className="font-bold">{LETTERS[i] ?? i + 1})</span> {opt}</span>
              </label>
            );
          })}
        </fieldset>

        <div className="mt-6 flex justify-between gap-3">
          <button type="button" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="btn-outline">السابق</button>
          {idx + 1 < items.length ? (
            <button type="button" onClick={() => setIdx(idx + 1)} disabled={answers[idx] === undefined} className="btn-primary">التالي ←</button>
          ) : (
            <button type="button" onClick={submit} disabled={busy || answers.filter((a) => a !== undefined).length < items.length} className="btn-primary">
              {busy ? "جارٍ التصحيح…" : "إنهاء الاختبار وتسليمه"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
