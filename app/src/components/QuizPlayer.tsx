"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type QuizMeta = { code: string; title: string; config: { passPct: number; attempts: number } };
type QuizItem = { id: number; question: string; options: string[] };
type GradeResult = { id: number; correct: boolean; chosen: number; answerIndex: number; explanation: string };

export function QuizPlayer({ code }: { code: string }) {
  const router = useRouter();
  const [meta, setMeta] = useState<QuizMeta | null>(null);
  const [items, setItems] = useState<QuizItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<GradeResult | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const startedRef = useRef(false);
  const lastGradeRef = useRef<{ score: number; passed: boolean } | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fetch(`/api/quiz/${code}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("not-found"))))
      .then((data) => {
        setMeta({ code: data.code, title: data.title, config: data.config });
        setItems(data.items);
        setItemIds(data.items.map((i: QuizItem) => i.id));
        setAttemptsLeft(data.attemptsLeft ?? null);
        setCooldownUntil(data.cooldownUntil ?? null);
        setBestScore(data.bestScore ?? null);
      })
      .catch(() => setError("تعذر تحميل الاختبار. تأكد من وجود ملف الاختبار."));
  }, [code]);

  async function submitAnswer() {
    if (chosen === null || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/quiz/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds, answers: [...answers, chosen] }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) setError("فترة التهدئة سارية بين المحاولات (24 ساعة — DOC-08 §5).");
        else if (res.status === 403) setError("استنفدت محاولاتك الثلاث لهذا الاختبار (DOC-08 §5).");
        else setError(data.error ?? "حدث خطأ أثناء التصحيح.");
        return;
      }
      lastGradeRef.current = { score: data.score, passed: data.passed };
      const last = data.results[data.results.length - 1];
      setFeedback(last);
      setAnswers((prev) => [...prev, chosen]);
      setAttemptsLeft(data.attemptsLeft ?? attemptsLeft);
      setBestScore(data.bestScore ?? bestScore);
    } finally {
      setBusy(false);
    }
  }

  function next() {
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
      setChosen(null);
      setFeedback(null);
    }
  }

  function finish() {
    const grade = lastGradeRef.current ?? { score: 0, passed: false };
    setResult(grade);
    router.refresh();
  }

  if (error) return <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!meta || items.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-3" aria-busy="true" aria-label="جارٍ تحميل الاختبار">
        <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="h-40 animate-pulse rounded-xl bg-neutral-200" />
        <div className="h-10 animate-pulse rounded-lg bg-neutral-200" />
      </div>
    );
  }
  // DOC-08 §5: block when attempts exhausted or cooldown active (logged-in users).
  if (attemptsLeft === 0 || cooldownUntil) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p className="text-4xl" aria-hidden="true">⏳</p>
        <h2 className="mt-3 text-lg font-bold text-neutral-900">الاختبار غير متاح حاليًا</h2>
        {cooldownUntil ? (
          <p className="mt-2 text-sm text-neutral-600">
            فترة التهدئة بين المحاولات سارية حتى {new Date(cooldownUntil).toLocaleString("ar-SA")} — أعد المحاولة بعدها (24 ساعة — DOC-08 §5).
          </p>
        ) : (
          <p className="mt-2 text-sm text-neutral-600">استنفدت المحاولات الثلاث المسموحة لهذا الاختبار (DOC-08 §5).</p>
        )}
        {bestScore !== null && (
          <p className="mt-2 text-xs text-neutral-500">أفضل نتيجة مسجلة: {bestScore}%</p>
        )}
        <button type="button" onClick={() => router.push("/catalog")} className="btn-primary mt-6">العودة إلى المكتبة</button>
      </div>
    );
  }
  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card p-8 text-center" role="status" aria-live="polite">
          <p className="text-5xl" aria-hidden="true">{result.passed ? "🎉" : "💪"}</p>
          <h2 className="mt-3 text-2xl font-extrabold text-neutral-900">
            {result.passed ? "أحسنت! اجتزت الاختبار" : "حاول مرة أخرى"}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            نتيجتك: <b>{result.score}%</b> — نسبة النجاح المطلوبة {meta.config.passPct}%
            {attemptsLeft !== null && attemptsLeft > 0 && !result.passed && (
              <span className="mt-1 block text-xs text-neutral-500">
                لديك {attemptsLeft} محاولة متبقية (بعد فترة التهدئة 24 ساعة — DOC-08 §5).
              </span>
            )}
          </p>
          <button type="button" onClick={() => router.push("/catalog")} className="btn-primary mt-6">
            العودة إلى المكتبة
          </button>
        </div>
      </div>
    );
  }

  const item = items[idx];
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-xl font-extrabold text-neutral-900">{meta.title}</h1>
        <p className="mt-1 text-xs text-neutral-500">
          السؤال {idx + 1} من {items.length} · نسبة النجاح {meta.config.passPct}%
          {attemptsLeft !== null && ` · المحاولات المتبقية: ${attemptsLeft}/3`}
          {bestScore !== null && bestScore > 0 && ` · أفضل نتيجة: ${bestScore}%`}
        </p>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < idx ? "bg-primary-600" : i === idx ? "bg-accent-500" : "bg-neutral-200"}`} />
          ))}
        </div>
      </header>

      <div className="card p-6">
        <h2 className="text-lg font-bold leading-relaxed text-neutral-900">{item.question}</h2>
        <fieldset className="mt-5 space-y-3" disabled={!!feedback}>
          <legend className="sr-only">الخيارات</legend>
          {item.options.map((opt, i) => {
            const letter = ["أ", "ب", "ج", "د", "ه"][i] ?? i + 1;
            const selected = chosen === i;
            const showState = feedback !== null;
            const isCorrect = feedback?.answerIndex === i;
            return (
              <label
                key={i}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  showState
                    ? isCorrect
                      ? "border-primary-400 bg-primary-50"
                      : selected
                        ? "border-red-300 bg-red-50"
                        : "border-neutral-200 opacity-60"
                    : selected
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={i}
                  checked={selected}
                  onChange={() => setChosen(i)}
                  className="mt-1 accent-primary-700"
                />
                <span className="text-sm leading-relaxed text-neutral-800">
                  <span className="font-bold">{letter})</span> {opt}
                </span>
              </label>
            );
          })}
        </fieldset>

        {feedback && (
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${feedback.correct ? "bg-primary-50 text-primary-800" : "bg-amber-50 text-amber-800"}`}>
            <p className="font-bold">{feedback.correct ? "إجابة صحيحة ✓" : `الإجابة الصحيحة: ${["أ", "ب", "ج", "د", "ه"][feedback.answerIndex] ?? ""}`}</p>
            {feedback.explanation && <p className="mt-1 leading-relaxed">{feedback.explanation}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-between gap-3">
          {!feedback ? (
            <button type="button" onClick={submitAnswer} disabled={chosen === null || busy} className="btn-primary w-full">
              {busy ? "جارٍ التصحيح…" : "تأكيد الإجابة"}
            </button>
          ) : idx + 1 < items.length ? (
            <button type="button" onClick={next} className="btn-primary w-full">السؤال التالي ←</button>
          ) : (
            <button type="button" onClick={finish} className="btn-primary w-full">عرض النتيجة</button>
          )}
        </div>
      </div>
    </div>
  );
}
