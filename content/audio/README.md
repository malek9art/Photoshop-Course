# Audio Assets — Lesson Audio Files

> **Purpose:** Local, first-party audio narrations for lessons (Phase 9 / ADR-011).
> **Status:** Convention established — **no audio files shipped yet** (audio production is a future media milestone).

## 1. Convention

Place one audio file per lesson, named exactly like the lesson file:

```
content/audio/LES-010101.mp3      ← for content/.../LES-010101.md
content/audio/LES-020301.m4a
```

| Aspect | Rule |
|--------|------|
| File name | `{lesson-code}.{ext}` — same code as the lesson Markdown file |
| Supported formats | `mp3` (preferred), `m4a`, `ogg`, `wav`, `webm`, `aac` |
| Location | `content/audio/` (flat; no subdirectories) |
| Discoverability | Automatic — the app scans this folder per lesson; **no database changes needed** |
| Serving | Streamed by the app's own route (`/api/audio/{lesson-code}`) with HTTP Range support — no external hosting today |

## 2. How it works

1. `app/src/lib/audio-assets.ts` resolves `content/audio/{lesson-code}.{ext}` at request time.
2. `app/src/app/api/audio/[lessonId]/route.ts` streams the file (200 full / 206 partial ranges, correct MIME).
3. The lesson page renders the premium player automatically; when no file exists it shows
   «النسخة الصوتية ستتوفر قريبًا» — the page never breaks.

## 3. Production notes (future)

- Every file must carry a license record (`ENT-ASSET.licenseRef`) before publication (DOC-07 §6).
- Narration quality will be governed by the future media pipeline (MS-03 / OPD-004); TTS providers
  (OpenAI / ElevenLabs / Azure) can be plugged into the audio engine registry later — see
  `docs/14_DECISION_LOG.md` ADR-011 and `app/src/lib/audio/engine-registry.ts`.
- No API keys or external services are used at this stage.
