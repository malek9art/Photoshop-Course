"use client";

/**
 * AudioProvider + AudioContext — Phase 9 audio architecture (Batch 7).
 *
 * Owns the lifecycle of the current AudioEngine (create / swap / destroy),
 * mirrors its events into React state, and exposes a stable controller API.
 * The UI never touches the engine directly — swapping the backend (URL file,
 * OpenAI TTS, ElevenLabs, Azure) requires zero UI changes.
 */
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { createAudioEngine } from "./engine-registry";
import { clamp, PLAYBACK_RATES, type AudioEngine, type AudioSource, type AudioStatus } from "./types";

export interface AudioContextValue {
  /** The active source (null = player disabled). */
  source: AudioSource | null;
  status: AudioStatus;
  time: number;
  duration: number;
  volume: number;
  rate: number;
  error: string | null;
  /** Swap the current source (recreates the engine). */
  load: (source: AudioSource | null) => void;
  clear: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  setVolume: (volume: number) => void;
  setRate: (rate: number) => void;
}

export const AudioContext = createContext<AudioContextValue | null>(null);

const VOLUME_KEY = "aca:audio:volume";
const RATE_KEY = "aca:audio:rate";

function readStored(key: string, fallback: number, min: number, max: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? clamp(n, min, max) : fallback;
  } catch {
    return fallback;
  }
}

export function AudioProvider({
  source,
  children,
}: {
  source: AudioSource | null;
  children: React.ReactNode;
}) {
  const engineRef = useRef<AudioEngine | null>(null);
  const [currentSource, setCurrentSource] = useState<AudioSource | null>(source);

  const [status, setStatus] = useState<AudioStatus>("idle");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [rate, setRateState] = useState(1);
  const [error, setError] = useState<string | null>(null);

  /* Sync with the `source` prop (e.g. lesson navigation). */
  useEffect(() => {
    setCurrentSource(source);
  }, [source]);

  /* (Re)create the engine whenever the source changes. */
  useEffect(() => {
    const previous = engineRef.current;
    if (previous) {
      previous.destroy();
      engineRef.current = null;
    }
    setStatus("idle");
    setTime(0);
    setDuration(0);
    setError(null);

    if (!currentSource) return;

    const engine = createAudioEngine(currentSource, {
      onStatusChange: setStatus,
      onTimeUpdate: setTime,
      onDurationChange: setDuration,
      onVolumeChange: (v) => {
        setVolumeState(v);
        try {
          window.localStorage.setItem(VOLUME_KEY, String(v));
        } catch {
          /* storage unavailable — volume still applies for the session */
        }
      },
      onRateChange: (r) => {
        setRateState(r);
        try {
          window.localStorage.setItem(RATE_KEY, String(r));
        } catch {
          /* ignore */
        }
      },
      onError: setError,
    });

    // Restore the learner's preferences for this engine instance.
    engine.setVolume(readStored(VOLUME_KEY, 1, 0, 1));
    const storedRate = readStored(RATE_KEY, 1, 0.5, 2);
    // Only restore a rate the UI actually offers.
    engine.setRate(PLAYBACK_RATES.includes(storedRate as (typeof PLAYBACK_RATES)[number]) ? storedRate : 1);

    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [currentSource]);

  const load = useCallback((next: AudioSource | null) => setCurrentSource(next), []);
  const clear = useCallback(() => setCurrentSource(null), []);

  const play = useCallback(() => {
    void engineRef.current?.play().catch(() => undefined);
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.getStatus() === "playing") engine.pause();
    else void engine.play().catch(() => undefined);
  }, []);

  const seek = useCallback((t: number) => {
    engineRef.current?.seek(t);
  }, []);

  const skip = useCallback((seconds: number) => {
    engineRef.current?.skip(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    engineRef.current?.setVolume(clamp(v, 0, 1));
  }, []);

  const setRate = useCallback((r: number) => {
    engineRef.current?.setRate(r);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        source: currentSource,
        status,
        time,
        duration,
        volume,
        rate,
        error,
        load,
        clear,
        play,
        pause,
        stop,
        toggle,
        seek,
        skip,
        setVolume,
        setRate,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
