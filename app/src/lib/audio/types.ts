/**
 * Audio Architecture — Phase 9 (Batch 7)
 * ----------------------------------------------------------------------------
 * Provider-agnostic core. The UI (player, mini player, hooks) only talks to
 * this interface, so a future provider (OpenAI TTS / ElevenLabs / Azure)
 * can be plugged in by registering an engine factory — no UI rewrite.
 *
 * No API keys, no external services, no network calls are made from here.
 */

/** TTS providers we prepare slots for (none are wired yet). */
export type TtsProviderId = "openai" | "elevenlabs" | "azure";

/**
 * The thing the player plays.
 * - `url`: a plain audio file (current — served from `content/audio/`).
 * - `tts`: a provider-generated stream (future). Requires a registered
 *   engine factory; otherwise a friendly "unavailable" engine is used.
 */
export type AudioSource =
  | { kind: "url"; url: string; title?: string; mimeType?: string }
  | {
      kind: "tts";
      provider: TtsProviderId;
      text: string;
      voice?: string;
      model?: string;
      title?: string;
    };

export type AudioStatus = "idle" | "loading" | "ready" | "playing" | "paused" | "ended" | "error";

/** Callbacks the engine fires into the provider (state lives in React). */
export interface AudioEngineEvents {
  onStatusChange(status: AudioStatus): void;
  onTimeUpdate(time: number): void;
  onDurationChange(duration: number): void;
  onVolumeChange(volume: number): void;
  onRateChange(rate: number): void;
  onError(message: string): void;
}

/**
 * The contract every playback backend implements.
 * The current backend is HTML5 `<audio>`; future backends (OpenAI TTS,
 * ElevenLabs, Azure Speech) implement the same contract.
 */
export interface AudioEngine {
  readonly kind: string;
  readonly source: AudioSource;
  play(): Promise<void>;
  pause(): void;
  /** Pause + rewind to the beginning. */
  stop(): void;
  /** Seek to an absolute time (seconds). */
  seek(time: number): void;
  /** Seek relative (e.g. ±10s). */
  skip(seconds: number): void;
  /** 0..1 */
  setVolume(volume: number): void;
  /** 0.5..2 */
  setRate(rate: number): void;
  getStatus(): AudioStatus;
  getTime(): number;
  getDuration(): number;
  getVolume(): number;
  getRate(): number;
  destroy(): void;
}

export type AudioEngineFactory = (source: AudioSource, events: AudioEngineEvents) => AudioEngine;

/** Allowed playback speeds (UI preset list). */
export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;

/** Clamp helpers shared by engines. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
