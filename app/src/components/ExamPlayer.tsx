"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, ProgressRing } from "./ui";
import { SuccessCheck, Skeleton } from "./feedback";
import { ClockIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, AlertIcon, ExamIcon } from "./icons";

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

  if (error)
    return (
      <div className="mx-auto max-w-2xl animate-shake">
        <Alert tone="danger" role="alert" title="تعذّر إتمام العملية">
          {error}
        </Alert>
      </div>
    );
  if (!config || items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" aria-busy="true" aria-label="جارٍ تحميل الاختبار">
        <Skeleton className="h-7 w-64" />
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

  if (result) {
    const correctCount = result.results.filter((r) => r.correct).length;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card relative overflow-hidden p-8 text-center md:p-12">
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${
              result.passed ? "from-success-500 to-primary-500" : "from-warning-500 to-accent-500"
            }`}
          />
          <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
            {result.passed ? (
              <SuccessCheck className="h-20 w-20" />
            ) : (
              <span className="flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-warning-50 text-warning-600">
                <AlertIcon className="h-9 w-9" />
              </span>
            )}
            <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
              {result.passed ? "أحسنت! اجتزت اختبار المرحلة" : "لم تجتز الاختبار هذه المرة"}
            </h2>
            <ProgressRing percent={result.score} size={128} stroke={10} label="نتيجتك">
              <span className="text-3xl font-black tracking-tighter text-neutral-900">{result.score}%</span>
              <span className="mt-0.5 text-2xs font-semibold text-neutral-500">نتيجتك</span>
            </ProgressRing>
            <p className="text-sm text-neutral-500">
              النجاح من {config.passPct}% · {correctCount}/{result.results.length} إجابة صحيحة
            </p>
            {!result.passed && (
              <p className="text-xs text-neutral-500">
                راجع دروس المرحلة ثم أعد المحاولة بعد فترة التهدئة (7 أيام — DOC-08 §5).
              </p>
            )}
            <button type="button" onClick={() => router.push("/catalog")} className="btn-primary btn-lg mt-2">
              العودة إلى المكتبة
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="card mt-6 p-6 md:p-8">
          <h3 className="mb-4 text-base font-bold text-neutral-900">مراجعة إجاباتك</h3>
          <ul className="space-y-2.5">
            {result.results.map((r) => (
              <li
                key={r.id}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-shadow hover:shadow-xs ${
                  r.correct ? "border-success-500/25 bg-success-50/60" : "border-danger-500/25 bg-danger-50/60"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white ${
                    r.correct ? "bg-success-500" : "bg-danger-500"
                  }`}
                >
                  {r.correct ? <CheckCircleIcon className="h-4 w-4" /> : <AlertIcon className="h-4 w-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-relaxed text-neutral-800">
                    {items.find((i) => i.id === r.id)?.question}
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    {r.correct ? "إجابة صحيحة" : `الإجابة الصحيحة: ${LETTERS[r.answerIndex] ?? ""}`}
                  </span>
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
      <div className="card mx-auto max-w-md animate-fade-up p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-50 text-warning-600 ring-1 ring-warning-500/20" aria-hidden="true">
          <ClockIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-neutral-900">الاختبار غير متاح حاليًا</h2>
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
      <header className="sticky top-[4.25rem] z-30 -mx-1 mb-6 rounded-2xl border border-hairline bg-canvas/85 p-4 backdrop-blur-xl md:top-[5rem]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900">
              <ExamIcon className="h-5 w-5 shrink-0 text-primary-600" />
              <span className="truncate">{title}</span>
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              السؤال {idx + 1} من {items.length} · النجاح من {config.passPct}% · المحاولات المتبقية:{" "}
              {attemptsLeft ?? "—"}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-surface-muted px-3 py-1.5 text-xs font-bold text-neutral-700 ring-1 ring-hairline">
            {answers.filter((a) => a !== undefined).length}/{items.length}
          </span>
        </div>
        {/* Question navigator — jump to any answered/unanswered question */}
        <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label="التنقل بين الأسئلة">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`السؤال ${i + 1}${answers[i] !== undefined ? " — تمت الإجابة" : ""}`}
              aria-current={i === idx ? "true" : undefined}
              className={`h-7 min-w-[1.75rem] rounded-lg px-1 text-2xs font-bold transition-all duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                i === idx
                  ? "bg-accent-500 text-neutral-950"
                  : answers[i] !== undefined
                    ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </header>

      <div key={idx} className="card animate-fade-up p-6 md:p-8">
        <h2 className="text-lg font-bold leading-loose text-neutral-900">{item.question}</h2>
        <fieldset className="mt-6 space-y-2.5">
          <legend className="sr-only">الخيارات</legend>
          {item.options.map((opt, i) => {
            const selected = answers[idx] === i;
            return (
              <label
                key={i}
                className={`group flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-fast ease-smooth has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary-500/15 ${
                  selected
                    ? "border-primary-500 bg-primary-50 shadow-sm"
                    : "border-hairline hover:-translate-y-px hover:border-primary-400 hover:bg-surface-muted"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selected}
                  onChange={() =>
                    setAnswers((prev) => {
                      const n = [...prev];
                      n[idx] = i;
                      return n;
                    })
                  }
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                    selected
                      ? "bg-primary-600 text-white"
                      : "bg-surface-muted text-neutral-500 ring-1 ring-hairline group-hover:bg-primary-100 group-hover:text-primary-700"
                  }`}
                >
                  {LETTERS[i] ?? i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-loose text-neutral-800">{opt}</span>
              </label>
            );
          })}
        </fieldset>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            className="btn-outline group"
          >
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5" />
            السابق
          </button>
          {idx + 1 < items.length ? (
            <button
              type="button"
              onClick={() => setIdx(idx + 1)}
              disabled={answers[idx] === undefined}
              className="btn-primary group"
            >
              التالي
              <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={busy || answers.filter((a) => a !== undefined).length < items.length}
              className="btn-primary"
            >
              {busy ? "جارٍ التصحيح…" : "إنهاء الاختبار وتسليمه"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
