"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { focusRing } from "@/lib/a11y";
import { CheckCircleIcon, AlertIcon, InfoIcon, XIcon, ChevronDownIcon, SearchIcon } from "./icons";

/**
 * Interactive UI primitives — client components.
 * No third-party libraries: native dialog semantics, ARIA patterns,
 * CSS transitions only (GPU friendly, reduced-motion safe).
 */

/* ---------------------------------------------------------------- Ripple */

/**
 * Button with a material-style ripple + optional pending state.
 * Renders a plain <button>, so every existing handler keeps working.
 */
export function RippleButton({
  children,
  className = "btn-primary",
  pending = false,
  pendingLabel,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; pendingLabel?: string }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }]);
    window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 650);
  }, []);

  return (
    <button {...rest} onPointerDown={onPointerDown} disabled={rest.disabled || pending} className={className}>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute animate-ripple-out rounded-full bg-current opacity-25"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className="relative inline-flex items-center gap-2">
        {pending && (
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
          />
        )}
        {pending && pendingLabel ? pendingLabel : children}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------- Toast */

export type ToastTone = "success" | "error" | "info";
type ToastItem = { id: number; tone: ToastTone; message: string };

let pushToastExternal: ((tone: ToastTone, message: string) => void) | null = null;

/** Fire a toast from anywhere (no context plumbing needed). */
export function toast(tone: ToastTone, message: string) {
  pushToastExternal?.(tone, message);
}

/** Mount once per page that needs toasts. */
export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    pushToastExternal = (tone, message) => {
      const id = Date.now() + Math.random();
      setItems((s) => [...s, { id, tone, message }]);
      window.setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 4200);
    };
    return () => {
      pushToastExternal = null;
    };
  }, []);

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-success-600" />,
    error: <AlertIcon className="h-5 w-5 text-danger-600" />,
    info: <InfoIcon className="h-5 w-5 text-info-600" />,
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-toast flex flex-col items-center gap-2 px-4 md:bottom-8"
      role="region"
      aria-label="التنبيهات"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-center gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm font-medium text-neutral-800 shadow-lg"
        >
          {icons[t.tone]}
          <span className="min-w-0 flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))}
            aria-label="إغلاق التنبيه"
            className={`rounded-lg p-1 text-neutral-400 hover:text-neutral-700 ${focusRing}`}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Dialog */

/** Accessible confirmation dialog (Esc to close, backdrop click, focus moved in). */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  tone = "primary",
  onConfirm,
  onCancel,
  pending = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-overlay flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onCancel}
        className="absolute inset-0 animate-fade-in bg-neutral-950/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md animate-scale-in rounded-3xl border border-hairline bg-surface p-6 shadow-xl"
      >
        <h2 id={titleId} className="text-lg font-bold text-neutral-900">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm leading-relaxed text-neutral-500">{description}</p> : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-start">
          <button type="button" onClick={onCancel} className="btn-outline justify-center">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={tone === "danger" ? "btn-danger justify-center" : "btn-primary justify-center"}
          >
            {pending && (
              <span
                aria-hidden="true"
                className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
              />
            )}
            {confirmLabel}
          </button>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="إغلاق"
          className={`absolute left-4 top-4 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 ${focusRing}`}
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Tabs */

export function Tabs({
  tabs,
  initial = 0,
  className = "",
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  initial?: number;
  className?: string;
}) {
  const [active, setActive] = useState(initial);
  const baseId = useId();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    // RTL: ArrowLeft moves forward
    const dir = e.key === "ArrowLeft" ? 1 : -1;
    setActive((i) => (i + dir + tabs.length) % tabs.length);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="inline-flex gap-1 rounded-2xl border border-hairline bg-surface-muted p-1"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-fast ease-smooth ${focusRing} ${
              i === active
                ? "bg-surface text-neutral-900 shadow-xs ring-1 ring-hairline"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) =>
        i === active ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            className="mt-5 animate-fade-up"
          >
            {tab.content}
          </div>
        ) : null
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Accordion */

export function Accordion({
  title,
  children,
  defaultOpen = false,
  meta,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  meta?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className="card overflow-hidden !p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-right transition-colors hover:bg-surface-muted ${focusRing}`}
      >
        <span className="min-w-0 flex-1">{title}</span>
        <span className="flex items-center gap-3">
          {meta}
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-base ease-smooth ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={open ? "animate-fade-up border-t border-hairline px-5 py-4" : ""}
      >
        {open ? children : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Search box */

/** Instant client-side filter input (used for catalog/table filtering). */
export function SearchInput({
  value,
  onChange,
  placeholder = "ابحث…",
  label,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-4 w-4 text-neutral-400" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pe-10 ps-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="مسح البحث"
          className={`absolute inset-y-0 left-2.5 my-auto h-7 w-7 rounded-lg text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700 ${focusRing}`}
        >
          <XIcon className="mx-auto h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------- Segmented filter */

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar flex gap-2 overflow-x-auto">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-fast ease-smooth ${focusRing} ${
              active
                ? "border-primary-500/30 bg-primary-50 text-primary-700"
                : "border-hairline bg-surface text-neutral-600 hover:border-hairline-strong hover:text-neutral-900"
            }`}
          >
            {opt.label}
            {typeof opt.count === "number" && (
              <span className={`rounded-full px-1.5 text-2xs ${active ? "bg-primary-500/15" : "bg-neutral-200/70"}`}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
