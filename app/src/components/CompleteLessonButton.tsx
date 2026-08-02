"use client";

/**
 * Verified lesson completion (Phase 11 — Batch 3/5/10).
 * Tracks the three requirements live (opened / 70% reading time / reached
 * end of page), syncs them to the server, and only then calls the server's
 * authoritative completion API. On success shows a professional celebration
 * overlay with the suggested next lesson + automatic transition (cancellable).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { focusRing } from "@/lib/a11y";
import { CheckIcon, CheckCircleIcon, ArrowLeftIcon, BookIcon, SparkIcon, XIcon, QuizIcon, ExamIcon, TrophyIcon } from "./icons";
import { SuccessCheck } from "./feedback";

type SyncStatus = {
  opened: boolean;
  reachedEnd: boolean;
  elapsedSeconds: number;
  thresholdSeconds: number;
  timePercent: number;
  state: string | null;
  completed: boolean;
};

type NextLesson = { id: string; title: string; href: string };

type NextAction = { type: "lesson" | "quiz" | "exam" | "done"; title: string; href: string };

type CompleteResponse = {
  ok: boolean;
  nextLesson?: NextLesson | null;
  nextAction?: NextAction | null;
  moduleHref?: string;
  achievements?: { code: string; title_ar: string; icon: string }[];
};

const SYNC_EVERY_MS = 5000;
const AUTO_NEXT_SECONDS = 8;

async function postSync(body: Record<string, unknown>): Promise<SyncStatus | null> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status ?? null;
  } catch {
    return null;
  }
}

export function CompleteLessonButton({
  lessonId,
  alreadyCompleted,
  readingSeconds = 0,
}: {
  lessonId: string;
  alreadyCompleted: boolean;
  /** Expected reading time in seconds — used for the 70% completion gate. */
  readingSeconds?: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [success, setSuccess] = useState<CompleteResponse | null>(null);
  const [countdown, setCountdown] = useState(AUTO_NEXT_SECONDS);
  const [autoCancelled, setAutoCancelled] = useState(false);

  const spentRef = useRef(0);
  const reachedEndRef = useRef(false);
  const openedRef = useRef(false);
  const lastSyncRef = useRef(0);

  /* ----------------------------- activity tracking (Batch 3) ------------ */
  useEffect(() => {
    // 1) Mark the lesson as opened.
    openedRef.current = true;
    void postSync({ targetType: "lesson", targetId: lessonId, action: "sync", opened: true }).then((s) => {
      if (s) setStatus(s);
    });

    // 2) Track active reading seconds (only while the tab is visible).
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        spentRef.current += 1;
        const now = Date.now();
        if (now - lastSyncRef.current >= SYNC_EVERY_MS) {
          lastSyncRef.current = now;
          void postSync({
            targetType: "lesson",
            targetId: lessonId,
            action: "sync",
            spentSeconds: spentRef.current,
            reachedEnd: reachedEndRef.current,
          }).then((s) => {
            if (s) setStatus(s);
          });
        }
      }
    }, 1000);

    // 3) Detect "reached the end of the page".
    const onScroll = () => {
      const doc = document.documentElement;
      const nearBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 140;
      if (nearBottom && !reachedEndRef.current) {
        reachedEndRef.current = true;
        void postSync({
          targetType: "lesson",
          targetId: lessonId,
          action: "sync",
          spentSeconds: spentRef.current,
          reachedEnd: true,
        }).then((s) => {
          if (s) setStatus(s);
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      // Final flush so nothing is lost on navigation.
      if (openedRef.current) {
        void postSync({
          targetType: "lesson",
          targetId: lessonId,
          action: "sync",
          spentSeconds: spentRef.current,
          reachedEnd: reachedEndRef.current,
        });
      }
    };
  }, [lessonId]);

  /* --------------------------- automatic transition (Batch 5/10) -------- */
  useEffect(() => {
    const action = success?.nextAction;
    if (!action || action.type === "done" || autoCancelled) return;
    if (countdown <= 0) {
      router.push(action.href);
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [success, countdown, autoCancelled, router]);

  const complete = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "lesson", targetId: lessonId, state: "completed" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data as CompleteResponse);
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 1400);
        router.refresh();
      } else if (res.status === 403) {
        // Server rejected the completion — show why + refresh requirements.
        setError(data.message ?? "لم تكتمل متطلبات إكمال الدرس بعد.");
        const s = await postSync({
          targetType: "lesson",
          targetId: lessonId,
          action: "sync",
          spentSeconds: spentRef.current,
          reachedEnd: reachedEndRef.current,
        });
        if (s) setStatus(s);
      } else {
        setError(data.error ?? "حدث خطأ أثناء الحفظ.");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم — تحقق من اتصالك.");
    } finally {
      setBusy(false);
    }
  }, [busy, lessonId, router]);

  /* ---------------------------------------------- already completed state */
  if (alreadyCompleted || status?.completed) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl bg-success-50 px-4 py-2.5 text-sm font-semibold text-success-700 ring-1 ring-inset ring-success-500/20 dark:bg-success-500/10 dark:text-success-500">
        <CheckCircleIcon className="h-4 w-4" />
        درس مكتمل
      </span>
    );
  }

  const timePercent = status?.timePercent ?? 0;
  const thresholdMin = Math.max(1, Math.ceil((status?.thresholdSeconds ?? Math.ceil(readingSeconds * 0.7)) / 60));
  const allMet = Boolean(status?.opened && status?.reachedEnd && timePercent >= 100);

  const Requirement = ({
    met,
    label,
    children,
  }: {
    met: boolean;
    label: string;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 ease-spring ${
          met ? "bg-success-500" : "bg-neutral-200 dark:bg-white/10"
        } ${met ? "animate-pop-check motion-reduce:animate-none" : ""}`}
        aria-hidden="true"
      >
        {met ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      <span className={`text-xs font-medium ${met ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-400"}`}>
        {label}
      </span>
      {children}
    </div>
  );

  return (
    <>
      {/* Live requirements checklist */}
      <div className="w-full rounded-2xl border border-hairline bg-surface p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-2xs font-bold uppercase tracking-widest text-neutral-400">متطلبات إكمال الدرس</p>
          <span className="font-mono text-2xs font-bold tabular-nums text-primary-600">{Math.round(timePercent)}%</span>
        </div>
        <div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10"
          role="progressbar"
          aria-label="متطلبات وقت القراءة"
          aria-valuenow={Math.round(timePercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-500 ease-out-expo"
            style={{ width: `${Math.min(100, timePercent)}%` }}
          />
        </div>

        <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
          <Requirement met={Boolean(status?.opened)} label="تم فتح الدرس" />
          <Requirement met={Boolean(status?.reachedEnd)} label="وصلت إلى نهاية الصفحة" />
          <Requirement met={timePercent >= 100} label={`اقرأ ${thresholdMin} دقيقة على الأقل`}>
            {timePercent < 100 && timePercent > 0 ? (
              <span className="font-mono text-2xs tabular-nums text-neutral-400">{Math.round(timePercent)}%</span>
            ) : null}
          </Requirement>
        </div>

        {!allMet && (
          <p className="mt-3 text-2xs leading-relaxed text-neutral-400">
            يكتمل الدرس تلقائيًا عندما تُنجز المتطلبات الثلاثة — 70% من زمن القراءة المتوقع
            ({thresholdMin} دقيقة) ثم زر الإكمال بالأسفل.
          </p>
        )}
      </div>

      <span className="relative mt-4 inline-block">
        {celebrate && <SuccessCheck className="absolute -top-5 end-0 h-14 w-14" />}
      </span>

      <button
        type="button"
        onClick={complete}
        disabled={busy || !allMet}
        aria-live="polite"
        title={allMet ? "إكمال الدرس" : "أكمل جميع المتطلبات أولاً"}
        className={`btn-primary group mt-4 ${error ? "animate-shake" : ""}`}
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
            {allMet ? "إكمال الدرس" : "أكمل المتطلبات أولاً"}
          </>
        )}
      </button>

      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-danger-200/70 bg-danger-50 px-3.5 py-2.5 text-xs font-medium text-danger-700 dark:border-danger-500/25 dark:bg-danger-500/10 dark:text-danger-400">
          <span aria-hidden="true" className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-danger-500" />
          {error}
        </p>
      )}

      {/* ================= Success overlay (Batch 5): next lesson + module */}
      {success && (
        <div
          className="fixed inset-0 z-overlay flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="تم إكمال الدرس"
        >
          <div aria-hidden="true" className="absolute inset-0 animate-fade-in bg-neutral-950/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-3xl border border-hairline bg-surface p-7 text-center shadow-2xl dark:border-white/10 dark:bg-surface-raised">
            {/* celebratory glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_50%_0%,rgb(var(--accent-500)/0.18),transparent_70%)]"
            />

            {/* CSS confetti — decorative, reduced-motion safe (Batch 10) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-visible">
              {[
                { c: "bg-primary-500", x: "8%", d: "0s", r: "300deg" },
                { c: "bg-accent-400", x: "18%", d: "0.3s", r: "-420deg" },
                { c: "bg-success-500", x: "30%", d: "0.15s", r: "480deg" },
                { c: "bg-danger-500", x: "42%", d: "0.45s", r: "-360deg" },
                { c: "bg-accent-500", x: "55%", d: "0.1s", r: "540deg" },
                { c: "bg-primary-400", x: "66%", d: "0.5s", r: "-300deg" },
                { c: "bg-success-400", x: "78%", d: "0.25s", r: "420deg" },
                { c: "bg-danger-400", x: "90%", d: "0.4s", r: "-480deg" },
              ].map((p, i) => (
                <span
                  key={i}
                  className={`confetti-piece ${p.c}`}
                  style={{ insetInlineStart: p.x, "--cx": p.x, "--cd": p.d, "--cr": p.r } as React.CSSProperties}
                />
              ))}
            </div>

            <span className="relative mx-auto flex h-20 w-20 animate-pop-check items-center justify-center rounded-full bg-gradient-to-br from-success-500 to-success-600 text-4xl shadow-glow motion-reduce:animate-none">
              🎉
            </span>

            <h2 className="relative mt-5 text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
              أحسنت! أكملت الدرس
            </h2>
            <p className="relative mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              تقدّمك محفوظ — متابعة ممتعة في رحلتك نحو الاحتراف.
            </p>

            {success.achievements && success.achievements.length > 0 && (
              <div className="relative mt-5 space-y-2">
                {success.achievements.map((a) => (
                  <div
                    key={a.code}
                    className="flex items-center gap-3 rounded-2xl border border-accent-500/25 bg-accent-50 px-4 py-3 text-start dark:border-accent-400/20 dark:bg-accent-500/10"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {a.icon}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-accent-700 dark:text-accent-400">
                        إنجاز جديد!
                      </p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">{a.title_ar}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {success.nextAction && success.nextAction.type !== "done" ? (
              <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-hairline bg-surface-muted/70 px-4 py-3.5 text-start">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    success.nextAction.type === "quiz"
                      ? "bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400"
                      : success.nextAction.type === "exam"
                        ? "bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400"
                        : "bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"
                  }`}
                  aria-hidden="true"
                >
                  {success.nextAction.type === "quiz" ? (
                    <QuizIcon className="h-4 w-4" />
                  ) : success.nextAction.type === "exam" ? (
                    <ExamIcon className="h-4 w-4" />
                  ) : (
                    <BookIcon className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-2xs font-semibold text-neutral-400">
                    {success.nextAction.type === "quiz"
                      ? "الخطوة التالية: اختبار الوحدة"
                      : success.nextAction.type === "exam"
                        ? "الخطوة التالية: اختبار المرحلة"
                        : "الدرس التالي المقترح"}
                  </p>
                  <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{success.nextAction.title}</p>
                </div>
                {!autoCancelled && (
                  <span className="shrink-0 font-mono text-2xs tabular-nums text-primary-600 dark:text-primary-400" aria-live="polite">
                    {countdown}s
                  </span>
                )}
              </div>
            ) : (
              <p className="relative mt-5 flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface-muted/70 px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">
                <TrophyIcon className="h-4 w-4 text-accent-500" />
                وصلت إلى نهاية المسار المتاح — دروس جديدة قادمة!
              </p>
            )}

            <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row">
              {success.nextAction && success.nextAction.type !== "done" ? (
                <Link href={success.nextAction.href} className={`btn-primary w-full justify-center sm:flex-1 ${focusRing}`}>
                  {success.nextAction.type === "quiz"
                    ? "ابدأ اختبار الوحدة"
                    : success.nextAction.type === "exam"
                      ? "ابدأ اختبار المرحلة"
                      : "الدرس التالي"}
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href={success.moduleHref ?? "/catalog"}
                className="btn-outline w-full justify-center sm:flex-1"
              >
                <BookIcon className="h-4 w-4" />
                العودة للوحدة
              </Link>
            </div>

            <div className="relative mt-4 flex items-center justify-center gap-2">
              {success.nextAction && success.nextAction.type !== "done" && !autoCancelled ? (
                <button
                  type="button"
                  onClick={() => setAutoCancelled(true)}
                  className={`inline-flex items-center gap-1 text-2xs font-semibold text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200 ${focusRing}`}
                >
                  <XIcon className="h-3 w-3" />
                  إلغاء الانتقال التلقائي
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className={`inline-flex items-center gap-1 text-2xs font-semibold text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200 ${focusRing}`}
                >
                  <SparkIcon className="h-3 w-3" />
                  البقاء في الصفحة
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
