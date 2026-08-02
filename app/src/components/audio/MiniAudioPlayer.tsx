"use client";

/**
 * Mini Player (Batch 1) — a fixed, glassy bar pinned to the bottom of the
 * screen while the learner scrolls/reads. Appears once the full player is
 * out of view; sits above the mobile bottom-nav. Zero dependencies.
 */
import { useEffect, useState } from "react";
import { focusRing } from "@/lib/a11y";
import { useAudio, useAudioPosition } from "@/lib/audio/hooks";
import { formatTime } from "@/lib/audio/format";
import { PlaySolidIcon, PauseSolidIcon, XIcon } from "./audio-icons";

export function MiniAudioPlayer({ title }: { title: string }) {
  const { status, toggle, stop, source } = useAudio();
  const { time, duration, percent } = useAudioPosition();
  const [fullPlayerInView, setFullPlayerInView] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  /* Hide when the full player is on screen. */
  useEffect(() => {
    const target = document.getElementById("lesson-audio-player");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setFullPlayerInView(entry.isIntersecting);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.06 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  /* Reappear when the user starts playback again. */
  useEffect(() => {
    if (status === "playing") setDismissed(false);
  }, [status]);

  const visible = Boolean(source) && !fullPlayerInView && !dismissed;

  /* Keep the page's content clear of the fixed bar. */
  useEffect(() => {
    if (visible) document.body.classList.add("aca-mini-player-open");
    else document.body.classList.remove("aca-mini-player-open");
    return () => document.body.classList.remove("aca-mini-player-open");
  }, [visible]);

  if (!visible) return null;

  const playing = status === "playing";

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+4.35rem)] z-header px-3 md:bottom-5 md:px-6">
      <div
        role="region"
        aria-label="مشغل صوتي مصغّر"
        className="glass mx-auto flex max-w-xl animate-fade-up items-center gap-3 rounded-2xl p-2.5 shadow-xl shadow-black/20 dark:shadow-black/50"
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
          title={playing ? "إيقاف مؤقت" : "تشغيل"}
          className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md transition-transform duration-fast ease-spring hover:scale-105 active:scale-95 dark:from-primary-400 dark:to-primary-600 ${focusRing}`}
        >
          {playing ? <PauseSolidIcon className="h-5 w-5" /> : <PlaySolidIcon className="h-5 w-5 translate-x-[1px]" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-bold text-neutral-900 dark:text-white">{title}</p>
            <span className="shrink-0 font-mono text-2xs tabular-nums text-neutral-500" dir="ltr">
              {formatTime(time)}
            </span>
          </div>
          <div
            className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-200/90 dark:bg-white/10"
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="التقدم في التشغيل"
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-primary-500 to-accent-500 transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            stop();
            setDismissed(true);
          }}
          aria-label="إيقاف وإغلاق المشغل المصغّر"
          title="إغلاق"
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors duration-fast hover:bg-neutral-200/60 hover:text-neutral-900 md:h-9 md:w-9 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing}`}
        >
          <XIcon className="h-4 w-4" />
        </button>
        <span className="sr-only">{duration > 0 ? `المدة ${formatTime(duration)}` : ""}</span>
      </div>
    </div>
  );
}
