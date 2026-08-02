"use client";

/**
 * Premium Audio Player (Batch 1) — Udemy/Coursera-grade, zero dependencies.
 * RTL, responsive, keyboard accessible, reduced-motion safe.
 * Built entirely on the AudioProvider architecture (Batch 7).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { focusRing } from "@/lib/a11y";
import {
  useAudio,
  useAudioMediaSession,
  useAudioPosition,
  useAudioVolume,
  usePlaybackRate,
  describeAudioStatus,
} from "@/lib/audio/hooks";
import { formatTime } from "@/lib/audio/format";
import {
  PlaySolidIcon,
  PauseSolidIcon,
  StopIcon,
  Replay10Icon,
  Forward10Icon,
  VolumeIcon,
  VolumeMuteIcon,
  SpeedIcon,
  MusicNoteIcon,
  HeadphonesIcon,
} from "./audio-icons";

/* ------------------------------------------------------------ ripple */

type Ripple = { id: number; x: number; y: number; size: number };

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }]);
    window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 650);
  }, []);
  const nodes = (): React.ReactNode =>
    ripples.map((r) => (
      <span
        key={r.id}
        aria-hidden="true"
        className="pointer-events-none absolute animate-ripple-out rounded-full bg-current opacity-20"
        style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
      />
    ));
  return { onPointerDown, nodes };
}

/* ---------------------------------------------------- transport button */

function TransportButton({
  label,
  onClick,
  children,
  className = "",
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { onPointerDown, nodes } = useRipple();
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      onPointerDown={onPointerDown}
      className={`relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl text-neutral-500 transition-all duration-fast ease-smooth hover:bg-neutral-200/50 hover:text-neutral-900 active:scale-95 disabled:pointer-events-none disabled:opacity-40 md:h-10 md:w-10 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing} ${className}`}
    >
      {nodes()}
      <span className="relative">{children}</span>
    </button>
  );
}

/* ------------------------------------------------------- progress bar */

function ProgressControl() {
  const { seek } = useAudio();
  const { time, duration, percent } = useAudioPosition();
  const value = duration > 0 ? Math.min(time, duration) : 0;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (Number.isFinite(next)) seek(next);
  };

  return (
    <div className="group flex w-full items-center gap-3">
      <span className="w-12 shrink-0 text-left font-mono text-xs font-semibold tabular-nums text-neutral-500" dir="ltr">
        {formatTime(value)}
      </span>

      <div className="relative flex h-9 flex-1 items-center md:h-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 h-1.5 rounded-full bg-neutral-200/90 dark:bg-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute h-1.5 rounded-full bg-gradient-to-l from-primary-500 to-accent-500 shadow-[0_0_10px_rgb(var(--primary-500)/0.45)]"
          style={{ width: `${percent}%`, insetInlineStart: 0 }}
        />
        <div
          aria-hidden="true"
          className="absolute h-4 w-4 -translate-y-1/2 scale-90 rounded-full border-2 border-primary-600 bg-white shadow-md transition-transform duration-fast ease-spring group-hover:scale-110 group-hover:shadow-glow dark:border-primary-400"
          style={{ insetInlineStart: `calc(${percent}% - 8px)`, top: "50%" }}
        />
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 0}
          step={0.1}
          value={duration > 0 ? value : 0}
          onChange={onChange}
          disabled={duration <= 0}
          aria-label="موضع التشغيل"
          aria-valuetext={`${formatTime(value)} من ${formatTime(duration)}`}
          className="aca-range absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
        />
        {/* focus ring lands on the wrapper (input itself is invisible) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary-500/70 ring-offset-2 ring-offset-surface opacity-0 transition-opacity duration-fast focus-within:opacity-100"
        />
      </div>

      <span className="w-12 shrink-0 text-right font-mono text-xs font-semibold tabular-nums text-neutral-500" dir="ltr">
        -{formatTime(Math.max(0, duration - time))}
      </span>
    </div>
  );
}

/* --------------------------------------------------------- volume row */

function VolumeControl() {
  const { volume, muted, setVolume, toggleMute } = useAudioVolume();

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "إلغاء كتم الصوت" : "كتم الصوت"}
        aria-pressed={muted}
        title={muted ? "إلغاء الكتم" : "كتم الصوت"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-neutral-500 transition-all duration-fast ease-smooth hover:bg-neutral-200/50 hover:text-neutral-900 active:scale-95 md:h-9 md:w-9 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white ${focusRing}`}
      >
        {muted || volume === 0 ? <VolumeMuteIcon className="h-[18px] w-[18px]" /> : <VolumeIcon className="h-[18px] w-[18px]" />}
      </button>
      <div className="group relative hidden h-8 w-24 items-center sm:flex">
        <div aria-hidden="true" className="absolute inset-x-0 h-1 rounded-full bg-neutral-200/90 dark:bg-white/10" />
        <div
          aria-hidden="true"
          className="absolute h-1 rounded-full bg-neutral-500 dark:bg-white/45"
          style={{ width: `${muted ? 0 : volume * 100}%`, insetInlineStart: 0 }}
        />
        <div
          aria-hidden="true"
          className="absolute h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-neutral-600 bg-white opacity-0 shadow-sm transition-opacity duration-fast group-hover:opacity-100 group-focus-within:opacity-100 dark:border-neutral-200"
          style={{ insetInlineStart: `calc(${muted ? 0 : volume * 100}% - 7px)`, top: "50%" }}
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="مستوى الصوت"
          className="aca-range absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------- speed menu */

const RATE_LABELS: Record<number, string> = {
  0.75: "0.75×",
  1: "1×",
  1.25: "1.25×",
  1.5: "1.5×",
  2: "2×",
};

function SpeedMenu() {
  const { rate, setRate, rates } = usePlaybackRate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // Move focus into the menu (WAI-ARIA menu-button pattern).
    const selected = listRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]');
    (selected ?? listRef.current?.querySelector<HTMLButtonElement>("[role='menuitemradio']"))?.focus();
    const onPointer = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.querySelector<HTMLButtonElement>("[data-speed-trigger]")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Roving tabindex + arrow keys inside the listbox. */
  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitemradio']") ?? []
    );
    if (items.length === 0) return;
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") next = (idx + 1) % items.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowRight") next = (idx - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next].focus();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        data-speed-trigger
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`سرعة التشغيل: ${RATE_LABELS[rate] ?? `${rate}×`}`}
        className={`inline-flex h-11 items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold tabular-nums text-neutral-600 transition-all duration-fast ease-smooth hover:bg-neutral-200/50 hover:text-neutral-900 active:scale-95 md:h-9 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white ${focusRing} ${
          open ? "bg-neutral-200/60 text-neutral-900 dark:bg-white/10 dark:text-white" : ""
        }`}
      >
        <SpeedIcon className="h-[17px] w-[17px]" />
        {RATE_LABELS[rate] ?? `${rate}×`}
      </button>

      {open && (
        <div
          ref={listRef}
          role="menu"
          aria-label="اختر سرعة التشغيل"
          onKeyDown={onListKeyDown}
          className="absolute bottom-full start-0 z-30 mb-2 w-32 animate-scale-in origin-bottom rounded-2xl border border-hairline bg-surface p-1.5 shadow-lg dark:bg-surface-raised dark:shadow-black/60"
        >
          {rates.map((r, i) => {
            const selected = rate === r;
            return (
              <button
                key={r}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={i === 0 ? 0 : -1}
                onClick={() => {
                  setRate(r);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold tabular-nums transition-colors duration-fast ${focusRing} ${
                  selected
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
                    : "text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {RATE_LABELS[r] ?? `${r}×`}
                {selected && (
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- EQ bars */

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div
      className="flex h-5 items-end gap-[3px]"
      aria-hidden="true"
      style={{ opacity: playing ? 1 : 0.45 }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`eq-bar w-[3px] rounded-full bg-gradient-to-t from-primary-500 to-accent-400 ${playing ? "" : "paused"}`}
          style={{ height: "100%", animationDelay: `${i * 0.14}s` }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ player */

export function AudioPlayer({
  title,
  mimeType,
  sizeLabel,
}: {
  title: string;
  mimeType?: string;
  sizeLabel?: string;
}) {
  const { status, error, toggle, stop, skip, source } = useAudio();
  const { time, duration } = useAudioPosition();
  const hasTrack = duration > 0 && Number.isFinite(duration);

  useAudioMediaSession(source?.kind === "url" ? title : null, true);

  const playing = status === "playing";
  const loading = status === "loading";

  return (
    <section
      id="lesson-audio-player"
      aria-label="مشغل الصوت"
      className="audio-player relative mt-8 overflow-hidden rounded-3xl border border-hairline bg-surface p-5 shadow-md md:p-6"
    >
      {/* ambient gold/teal wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-bl from-primary-500/[0.07] via-transparent to-accent-500/[0.08] dark:from-primary-500/[0.14] dark:to-accent-500/[0.1]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-accent-400/70 to-transparent"
      />

      {/* Live status for screen readers */}
      <span role="status" aria-live="polite" className="sr-only">
        {describeAudioStatus(status, title)}
      </span>

      {/* Header row */}
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-sm">
          <HeadphonesIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{title}</p>
          <p className="mt-0.5 flex items-center gap-2 text-2xs font-medium text-neutral-500 dark:text-neutral-400">
            <MusicNoteIcon className="h-3 w-3" />
            النسخة الصوتية للدرس
            {mimeType ? <span aria-hidden="true">·</span> : null}
            {mimeType ? <span dir="ltr">{mimeType.replace("audio/", "").toUpperCase()}</span> : null}
            {sizeLabel ? <span aria-hidden="true">·</span> : null}
            {sizeLabel ? <span>{sizeLabel}</span> : null}
          </p>
        </div>
        <Equalizer playing={playing} />
      </div>

      {/* Transport row */}
      <div className="relative mt-5 flex items-center justify-center gap-2 md:gap-3">
        <TransportButton label="إرجاع 10 ثوانٍ" onClick={() => skip(-10)}>
          <Replay10Icon className="h-5 w-5" />
        </TransportButton>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
          title={playing ? "إيقاف مؤقت" : "تشغيل"}
          className={`relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow transition-all duration-base ease-spring hover:scale-105 hover:shadow-glow active:scale-95 md:h-16 md:w-16 dark:from-primary-400 dark:to-primary-600 ${focusRing}`}
        >
          {loading ? (
            <span
              aria-hidden="true"
              className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
            />
          ) : playing ? (
            <PauseSolidIcon className="h-6 w-6" />
          ) : (
            <PlaySolidIcon className="h-6 w-6 translate-x-[1px]" />
          )}
        </button>

        <TransportButton label="تقديم 10 ثوانٍ" onClick={() => skip(10)}>
          <Forward10Icon className="h-5 w-5" />
        </TransportButton>

        <TransportButton label="إيقاف" onClick={stop} disabled={status === "idle"}>
          <StopIcon className="h-5 w-5" />
        </TransportButton>
      </div>

      {/* Progress */}
      <div className="relative mt-5">
        <ProgressControl />
      </div>

      {/* Bottom row */}
      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-4">
        <VolumeControl />
        <SpeedMenu />
      </div>

      {/* Error state */}
      {status === "error" && error ? (
        <div
          role="alert"
          className="relative mt-4 flex items-start gap-2.5 rounded-2xl border border-danger-200/70 bg-danger-50 px-4 py-3 text-sm text-danger-800 dark:border-danger-500/25 dark:bg-danger-500/10 dark:text-danger-300"
        >
          <span aria-hidden="true" className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-danger-500" />
          <p>{error}</p>
        </div>
      ) : null}

      {/* Hint when track not loaded yet */}
      {!hasTrack && status !== "error" && status !== "loading" ? (
        <p className="relative mt-4 text-center text-2xs text-neutral-400 dark:text-neutral-500">
          اضغط تشغيل لبدء الاستماع — يمكنك مواصلة القراءة أثناء التشغيل.
        </p>
      ) : null}
    </section>
  );
}
