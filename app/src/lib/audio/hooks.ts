"use client";

/**
 * Audio Hooks — the public API surface of the audio architecture (Batch 7).
 * Components use these hooks (never the engine directly), so future TTS
 * backends can be plugged in without touching the UI.
 */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AudioContext, type AudioContextValue } from "./audio-provider";
import { PLAYBACK_RATES } from "./types";

/** Access the audio controller. Must be used inside <AudioProvider>. */
export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>");
  return ctx;
}

/** Position + progress derived from the live playback clock. */
export function useAudioPosition(): {
  time: number;
  duration: number;
  remaining: number;
  percent: number;
} {
  const { time, duration } = useAudio();
  return {
    time,
    duration,
    remaining: Math.max(0, duration - time),
    percent: duration > 0 ? Math.min(100, (time / duration) * 100) : 0,
  };
}

/** Playback speed preset control. */
export function usePlaybackRate() {
  const { rate, setRate } = useAudio();
  return { rate, setRate, rates: PLAYBACK_RATES };
}

/** Volume + mute (remembers the last non-zero level). */
export function useAudioVolume() {
  const { volume, setVolume } = useAudio();
  const [muted, setMuted] = useState(false);
  const lastRef = useRef(1);

  useEffect(() => {
    if (volume > 0) lastRef.current = volume;
    if (volume === 0) setMuted(true);
    else setMuted(false);
  }, [volume]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (next) {
        lastRef.current = Math.max(volume, 0.15);
        setVolume(0);
      } else {
        setVolume(lastRef.current || 1);
      }
      return next;
    });
  }, [volume, setVolume]);

  return { volume, muted, setVolume, toggleMute };
}

/**
 * Wire browser lock-screen / media keys (MediaSession) to the player.
 * Pure enhancement — degrades silently where unsupported.
 */
export function useAudioMediaSession(title: string | null, enabled: boolean) {
  const { toggle, skip } = useAudio();

  useEffect(() => {
    if (!enabled || !title || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      ms.metadata = new MediaMetadata({
        title,
        artist: "أكاديمية أدوبي الإبداعية",
        album: "النسخ الصوتية للدروس",
      });
      ms.setActionHandler("play", () => void toggle());
      ms.setActionHandler("pause", () => void toggle());
      ms.setActionHandler("previoustrack", () => skip(-10));
      ms.setActionHandler("nexttrack", () => skip(10));
      ms.setActionHandler("seekbackward", () => skip(-10));
      ms.setActionHandler("seekforward", () => skip(10));
    } catch {
      /* MediaSession unsupported/blocked — fine, player still works */
    }
    return () => {
      try {
        ms.metadata = null;
        ms.setActionHandler("play", null);
        ms.setActionHandler("pause", null);
        ms.setActionHandler("previoustrack", null);
        ms.setActionHandler("nexttrack", null);
        ms.setActionHandler("seekbackward", null);
        ms.setActionHandler("seekforward", null);
      } catch {
        /* ignore */
      }
    };
  }, [title, enabled, toggle, skip]);
}

/** Live status copy (announced to screen readers via aria-live). */
export function describeAudioStatus(status: string, title: string | null): string {
  switch (status) {
    case "playing":
      return `جارٍ تشغيل: ${title ?? "التسجيل الصوتي"}`;
    case "paused":
      return "تم الإيقاف المؤقت";
    case "loading":
      return "جارٍ تحميل الصوت…";
    case "ended":
      return "انتهى التسجيل الصوتي";
    case "error":
      return "تعذّر تشغيل الصوت";
    default:
      return "";
  }
}
