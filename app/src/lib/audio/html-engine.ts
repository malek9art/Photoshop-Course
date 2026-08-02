/**
 * HTML5 `<audio>` engine — the only engine currently registered.
 * Wraps a plain HTMLAudioElement and normalises its events to the
 * AudioEngine contract (see types.ts).
 */
import { clamp, type AudioEngine, type AudioEngineEvents, type AudioSource, type AudioStatus } from "./types";

function describeMediaError(code: number | undefined): string {
  switch (code) {
    case 1:
      return "تم إيقاف تحميل الصوت.";
    case 2:
      return "تعذّر الاتصال بالملف الصوتي. تحقق من اتصالك بالإنترنت.";
    case 3:
      return "تعذّر فك ترميز هذا الملف الصوتي.";
    case 4:
      return "صيغة الملف الصوتي غير مدعومة في متصفحك.";
    default:
      return "حدث خطأ غير متوقع في مشغل الصوت.";
  }
}

export class HtmlAudioEngine implements AudioEngine {
  readonly kind = "html";
  readonly source: AudioSource;

  private el: HTMLAudioElement;
  private events: AudioEngineEvents;
  private status: AudioStatus = "idle";

  constructor(source: AudioSource, events: AudioEngineEvents) {
    if (source.kind !== "url") {
      throw new Error("HtmlAudioEngine only accepts url sources");
    }
    this.source = source;
    this.events = events;

    const el = new Audio();
    el.preload = "metadata";
    // iOS: avoid fullscreen takeover when playback starts.
    (el as HTMLMediaElement & { playsInline?: boolean }).playsInline = true;
    el.src = source.url;
    this.el = el;
    this.bind();
  }

  private bind(): void {
    const el = this.el;
    el.addEventListener("loadedmetadata", this.handleLoadedMetadata);
    el.addEventListener("durationchange", this.handleDurationChange);
    el.addEventListener("timeupdate", this.handleTimeUpdate);
    el.addEventListener("play", this.handlePlay);
    el.addEventListener("playing", this.handlePlaying);
    el.addEventListener("pause", this.handlePause);
    el.addEventListener("waiting", this.handleWaiting);
    el.addEventListener("ended", this.handleEnded);
    el.addEventListener("volumechange", this.handleVolumeChange);
    el.addEventListener("ratechange", this.handleRateChange);
    el.addEventListener("error", this.handleError);
  }

  private unbind(): void {
    const el = this.el;
    el.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
    el.removeEventListener("durationchange", this.handleDurationChange);
    el.removeEventListener("timeupdate", this.handleTimeUpdate);
    el.removeEventListener("play", this.handlePlay);
    el.removeEventListener("playing", this.handlePlaying);
    el.removeEventListener("pause", this.handlePause);
    el.removeEventListener("waiting", this.handleWaiting);
    el.removeEventListener("ended", this.handleEnded);
    el.removeEventListener("volumechange", this.handleVolumeChange);
    el.removeEventListener("ratechange", this.handleRateChange);
    el.removeEventListener("error", this.handleError);
  }

  /* ------------------------------------------------------------ events */

  private setStatus(status: AudioStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.events.onStatusChange(status);
  }

  private handleLoadedMetadata = () => {
    this.events.onDurationChange(this.el.duration || 0);
    this.events.onTimeUpdate(this.el.currentTime || 0);
    if (this.status === "loading") this.setStatus("ready");
    if (this.status === "idle") this.setStatus("ready");
  };

  private handleDurationChange = () => this.events.onDurationChange(this.el.duration || 0);

  private handleTimeUpdate = () => this.events.onTimeUpdate(this.el.currentTime || 0);

  private handlePlay = () => this.setStatus("playing");

  private handlePlaying = () => this.setStatus("playing");

  private handlePause = () => {
    if (this.status === "ended") return;
    this.setStatus("paused");
  };

  private handleWaiting = () => this.setStatus("loading");

  private handleEnded = () => {
    this.setStatus("ended");
    this.events.onTimeUpdate(this.el.duration || 0);
  };

  private handleVolumeChange = () => this.events.onVolumeChange(this.el.volume);

  private handleRateChange = () => this.events.onRateChange(this.el.playbackRate);

  private handleError = () => {
    const mediaError = this.el.error;
    this.setStatus("error");
    this.events.onError(describeMediaError(mediaError?.code));
  };

  /* ----------------------------------------------------------- control */

  async play(): Promise<void> {
    if (this.status === "error") return;
    if (this.el.ended) this.el.currentTime = 0;
    this.setStatus("loading");
    try {
      await this.el.play();
      // The `playing`/`play` events will flip the status; guard for engines
      // where the event is delayed.
      this.setStatus("playing");
    } catch {
      this.setStatus("paused");
      this.events.onError("تعذّر تشغيل الصوت. جرّب مرة أخرى.");
    }
  }

  pause(): void {
    this.el.pause();
    this.setStatus("paused");
  }

  stop(): void {
    this.el.pause();
    this.el.currentTime = 0;
    this.events.onTimeUpdate(0);
    this.setStatus("idle");
  }

  seek(time: number): void {
    const duration = this.el.duration;
    const target = Number.isFinite(duration) && duration > 0 ? clamp(time, 0, duration) : Math.max(0, time);
    this.el.currentTime = target;
    this.events.onTimeUpdate(target);
  }

  skip(seconds: number): void {
    const duration = this.el.duration;
    const base = this.el.currentTime + seconds;
    this.seek(Number.isFinite(duration) && duration > 0 ? clamp(base, 0, duration) : Math.max(0, base));
  }

  setVolume(volume: number): void {
    this.el.volume = clamp(volume, 0, 1);
    this.el.muted = volume === 0;
  }

  setRate(rate: number): void {
    this.el.playbackRate = clamp(rate, 0.5, 2);
  }

  /* ------------------------------------------------------------- state */

  getStatus(): AudioStatus {
    return this.status;
  }

  getTime(): number {
    return this.el.currentTime || 0;
  }

  getDuration(): number {
    return this.el.duration || 0;
  }

  getVolume(): number {
    return this.el.volume;
  }

  getRate(): number {
    return this.el.playbackRate;
  }

  destroy(): void {
    this.unbind();
    this.el.pause();
    this.el.removeAttribute("src");
    this.el.load();
  }
}
