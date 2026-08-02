/**
 * Engine registry — the only place that maps an AudioSource to an engine.
 *
 * Today only `url` sources are registered (HTML5 <audio>). TTS providers
 * (OpenAI / ElevenLabs / Azure) will register factories here when they are
 * integrated — the UI keeps working unchanged because it only talks to the
 * AudioEngine contract.
 *
 * No API keys and no external services are referenced in this file.
 */
import { HtmlAudioEngine } from "./html-engine";
import type {
  AudioEngine,
  AudioEngineEvents,
  AudioEngineFactory,
  AudioSource,
  AudioStatus,
  TtsProviderId,
} from "./types";

/** Future TTS provider factories register themselves here (see ADR-011). */
export const ttsEngineRegistry: Partial<Record<TtsProviderId, AudioEngineFactory>> = {};

function createUrlEngine(source: AudioSource, events: AudioEngineEvents): AudioEngine {
  return new HtmlAudioEngine(source, events);
}

/**
 * A graceful no-op engine used when a `tts` source references a provider
 * that has not been integrated yet. It fails with a friendly Arabic message
 * instead of throwing — the UI renders the standard error state.
 */
class UnavailableEngine implements AudioEngine {
  readonly kind = "unavailable";
  readonly source: AudioSource;

  constructor(source: AudioSource, private provider: TtsProviderId, private events: AudioEngineEvents) {
    this.source = source;
    queueMicrotask(() => {
      events.onStatusChange("error");
      events.onError(
        `مزوّد الصوت (${provider}) غير مهيّأ بعد — سيتم تفعيله في إصدار لاحق.`
      );
    });
  }

  play(): Promise<void> {
    return Promise.resolve();
  }
  pause(): void {}
  stop(): void {}
  seek(): void {}
  skip(): void {}
  setVolume(): void {}
  setRate(): void {}
  getStatus(): AudioStatus {
    return "error";
  }
  getTime(): number {
    return 0;
  }
  getDuration(): number {
    return 0;
  }
  getVolume(): number {
    return 1;
  }
  getRate(): number {
    return 1;
  }
  destroy(): void {}
}

/** Create the engine that matches the source. This is the single entry point. */
export function createAudioEngine(source: AudioSource, events: AudioEngineEvents): AudioEngine {
  if (source.kind === "url") return createUrlEngine(source, events);

  const factory = ttsEngineRegistry[source.provider];
  if (factory) return factory(source, events);
  return new UnavailableEngine(source, source.provider, events);
}
