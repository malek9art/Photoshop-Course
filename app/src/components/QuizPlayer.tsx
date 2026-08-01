"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, ProgressRing } from "./ui";
import { SuccessCheck, Skeleton } from "./feedback";
import { ClockIcon, ArrowLeftIcon, CheckCircleIcon, AlertIcon, QuizIcon } from "./icons";

type QuizMeta = { code: string; title: string; config: { passPct: number; attempts: number } };
type QuizItem = { id: number; question: string; options: string[] };
type GradeResult = { id: number; correct: boolean; chosen: number; answerIndex: number; explanation: string };

/**
 * Module quiz player (AT-04, DOC-08 §5).
 * Per-question POSTs are formative feedback only (free, unlimited).
 * ONE graded attempt is consumed when the player finalizes the quiz
 * (all questions answered) — mirrors the documented "3 attempts / 24 h" rule.
 */
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

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fetch(`/api/quiz/${code}`)
      .then((r) => {
        if (r.status === 401) router.replace(`/login?next=/quiz/${code}`);
        return r.ok ? r.json() : Promise.reject(new Error("not-found"));
      })
      .then((data) => {
        setMeta({ code: data.code, title: data.title, config: data.config });
        setItems(data.items);
        setItemIds(data.items.map((i: QuizItem) => i.id));
        setAttemptsLeft(data.attemptsLeft ?? null);
        setCooldownUntil(data.cooldownUntil ?? null);
        setBestScore(data.bestScore ?? null);
      })
      .catch(() => setError("تعذر تحميل الاختبار. تأكد من وجود ملف الاختبار."));
  }, [code, router]);

  /** Formative per-question feedback — never consumes an attempt. */
  async function submitAnswer() {
    if (chosen === null || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/quiz/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds: [items[idx].id], answers: [chosen] }),
      });
      if (res.status === 401) {
        router.push(`/login?next=/quiz/${code}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError("حدث خطأ أثناء التصحيح — أعد المحاولة.");
        return;
      }
      const last = data.results[data.results.length - 1];
      setFeedback(last);
      setAnswers((prev) => [...prev, chosen]);
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

  /** End of attempt: ONE graded submission for the whole quiz (DOC-08 §5). */
  async function finish() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/quiz/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds, answers, finalize: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) router.push(`/login?next=/quiz/${code}`);
        else if (res.status === 429) setError("فترة التهدئة سارية بين المحاولات (24 ساعة — DOC-08 §5).");
        else if (res.status === 403) setError("استنفدت محاولاتك الثلاث لهذا الاختبار (DOC-08 §5).");
        else setError(data.error ?? "حدث خطأ أثناء التصحيح.");
        return;
      }
      setResult({ score: data.score, passed: data.passed });
      setAttemptsLeft(data.attemptsLeft ?? attemptsLeft);
      setBestScore(data.bestScore ?? bestScore);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (error)
    return (
      <div className="mx-auto max-w-2xl animate-shake">
        <Alert tone="danger" role="alert" title="تعذّر إتمام العملية">
          {error}
        </Alert>
      </div>
    );
  if (!meta || items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" aria-busy="true" aria-label="جارٍ تحميل الاختبار">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-2 w-full" />
        <div className="card space-y-3 p-6">
          <Skeleton className="h-6 w-4/5" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }
  // DOC-08 §5: block when attempts exhausted or cooldown active (logged-in users).
  if (attemptsLeft === 0 || cooldownUntil) {
    return (
      <div className="card mx-auto max-w-md animate-fade-up p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-50 text-warning-600 ring-1 ring-warning-500/20" aria-hidden="true">
          <ClockIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-neutral-900">الاختبار غير متاح حاليًا</h2>
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
        <div className="card relative overflow-hidden p-8 text-center md:p-12" role="status" aria-live="polite">
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${
              result.passed ? "from-success-500 to-primary-500" : "from-warning-500 to-accent-500"
            }`}
          />
          <div className="flex flex-col items-center gap-5">
            {result.passed ? (
              <SuccessCheck className="h-20 w-20" />
            ) : (
              <span className="flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-warning-50 text-warning-600">
                <AlertIcon className="h-9 w-9" />
              </span>
            )}
            <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
              {result.passed ? "أحسنت! اجتزت الاختبار" : "حاول مرة أخرى"}
            </h2>
            <ProgressRing percent={result.score} size={128} stroke={10} label="نتيجتك">
              <span className="text-3xl font-black tracking-tighter text-neutral-900">{result.score}%</span>
              <span className="mt-0.5 text-2xs font-semibold text-neutral-500">نتيجتك</span>
            </ProgressRing>
            <p className="text-sm text-neutral-500">
              نسبة النجاح المطلوبة {meta.config.passPct}%
              {attemptsLeft !== null && attemptsLeft > 0 && !result.passed && (
                <span className="mt-1.5 block text-xs">
                  لديك {attemptsLeft} محاولة متبقية (بعد فترة التهدئة 24 ساعة — DOC-08 §5).
                </span>
              )}
            </p>
            <button type="button" onClick={() => router.push("/catalog")} className="btn-primary btn-lg mt-2">
              العودة إلى المكتبة
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const item = items[idx];
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 sticky top-[4.25rem] z-30 -mx-1 rounded-2xl border border-hairline bg-canvas/85 p-4 backdrop-blur-xl md:top-[5rem]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900">
              <QuizIcon className="h-5 w-5 shrink-0 text-primary-600" />
              <span className="truncate">{meta.title}</span>
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              السؤال {idx + 1} من {items.length} · نسبة النجاح {meta.config.passPct}%
              {attemptsLeft !== null && ` · المحاولات المتبقية: ${attemptsLeft}/3`}
              {bestScore !== null && bestScore > 0 && ` · أفضل نتيجة: ${bestScore}%`}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-surface-muted px-3 py-1.5 text-xs font-bold text-neutral-700 ring-1 ring-hairline">
            {idx + 1}/{items.length}
          </span>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-slow ${
                i < idx ? "bg-primary-500" : i === idx ? "bg-accent-500" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </header>

      <div key={idx} className="card animate-fade-up p-6 md:p-8">
        <h2 className="text-lg font-bold leading-loose text-neutral-900">{item.question}</h2>
        <fieldset className="mt-6 space-y-2.5" disabled={!!feedback}>
          <legend className="sr-only">الخيارات</legend>
          {item.options.map((opt, i) => {
            const letter = ["أ", "ب", "ج", "د", "ه"][i] ?? i + 1;
            const selected = chosen === i;
            const showState = feedback !== null;
            const isCorrect = feedback?.answerIndex === i;
            return (
              <label
                key={i}
                className={`group flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-fast ease-smooth has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary-500/15 ${
                  showState
                    ? isCorrect
                      ? "border-success-500/40 bg-success-50"
                      : selected
                        ? "border-danger-500/40 bg-danger-50"
                        : "border-hairline opacity-55"
                    : selected
                      ? "border-primary-500 bg-primary-50 shadow-sm"
                      : "border-hairline hover:-translate-y-px hover:border-primary-400 hover:bg-surface-muted"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={i}
                  checked={selected}
                  onChange={() => setChosen(i)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                    showState
                      ? isCorrect
                        ? "bg-success-500 text-white"
                        : selected
                          ? "bg-danger-500 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      : selected
                        ? "bg-primary-600 text-white"
                        : "bg-surface-muted text-neutral-500 ring-1 ring-hairline group-hover:bg-primary-100 group-hover:text-primary-700"
                  }`}
                >
                  {showState && isCorrect ? <CheckCircleIcon className="h-4 w-4" /> : letter}
                </span>
                <span className="pt-0.5 text-sm leading-loose text-neutral-800">{opt}</span>
              </label>
            );
          })}
        </fieldset>

        {feedback && (
          <div
            className={`mt-5 flex animate-fade-up items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
              feedback.correct
                ? "border-success-500/25 bg-success-50 text-success-800"
                : "border-warning-500/25 bg-warning-50 text-warning-800"
            }`}
            aria-live="polite"
          >
            {feedback.correct ? (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-bold">
                {feedback.correct
                  ? "إجابة صحيحة"
                  : `الإجابة الصحيحة: ${["أ", "ب", "ج", "د", "ه"][feedback.answerIndex] ?? ""}`}
              </p>
              {feedback.explanation && <p className="mt-1 leading-loose opacity-90">{feedback.explanation}</p>}
            </div>
          </div>
        )}

        <div className="mt-7 flex justify-between gap-3">
          {!feedback ? (
            <button type="button" onClick={submitAnswer} disabled={chosen === null || busy} className="btn-primary btn-lg w-full">
              {busy ? "جارٍ التصحيح…" : "تأكيد الإجابة"}
            </button>
          ) : idx + 1 < items.length ? (
            <button type="button" onClick={next} className="btn-primary btn-lg group w-full">
              السؤال التالي
              <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-1" />
            </button>
          ) : (
            <button type="button" onClick={finish} disabled={busy} className="btn-primary btn-lg w-full">
              {busy ? "جارٍ اعتماد النتيجة…" : "عرض النتيجة"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
