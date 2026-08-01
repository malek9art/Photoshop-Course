import Link from "next/link";
import { focusRing, touchTarget } from "@/lib/a11y";
import { CheckIcon, InboxIcon, ChevronLeftIcon } from "./icons";

/**
 * Shared UI atoms (DOC-06 components) — Phase 8 premium redesign.
 * Server-safe: no client hooks here. Interactive widgets live in `ui-client.tsx`.
 */

/* ------------------------------------------------------------------ Card */

export function Card({
  children,
  className = "",
  hover = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "section" | "article" | "li";
}) {
  return <Tag className={`card p-5 md:p-6 ${hover ? "card-hover" : ""} ${className}`}>{children}</Tag>;
}

/** Card with a soft gradient hairline on top — used for "featured" surfaces. */
export function FeatureCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card card-hover overflow-hidden p-5 md:p-6 ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary-500/60 to-transparent"
      />
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- Progress */

export function ProgressBar({
  percent,
  className = "",
  label,
  tone = "primary",
  size = "md",
}: {
  percent: number;
  className?: string;
  label?: string;
  tone?: "primary" | "accent" | "success";
  size?: "sm" | "md" | "lg";
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };
  const fills = {
    primary: "from-primary-600 to-primary-400",
    accent: "from-accent-600 to-accent-400",
    success: "from-success-600 to-success-500",
  };
  return (
    <div
      className={`${heights[size]} w-full overflow-hidden rounded-full bg-neutral-200/80 ${className}`}
      role="progressbar"
      aria-valuenow={p}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `التقدم ${p}%`}
    >
      {/* Width transition is GPU-cheap and reduced-motion safe (DOC-06 §7) */}
      <div
        className={`h-full rounded-full bg-gradient-to-l ${fills[tone]} transition-[width] duration-700 ease-out-expo`}
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

/** Circular progress ring — for dashboards & KPI cards. */
export function ProgressRing({
  percent,
  size = 92,
  stroke = 8,
  label,
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
  children?: React.ReactNode;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={p}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `التقدم ${p}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-neutral-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * p) / 100}
          className="stroke-primary-500 transition-[stroke-dashoffset] duration-1000 ease-out-expo"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? <span className="text-lg font-black text-neutral-900">{p}%</span>}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- Badges */

type Tone = "green" | "amber" | "gray" | "red" | "blue" | "brand";

export function Badge({ children, tone = "gray", className = "" }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  const map: Record<Tone, string> = {
    green: "badge-green",
    amber: "badge-amber",
    gray: "badge-gray",
    red: "badge-red",
    blue: "badge-blue",
    brand: "badge-brand",
  };
  return <span className={`${map[tone]} ${className}`}>{children}</span>;
}

export function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; tone: Tone }> = {
    B1: { label: "مبتدئ", tone: "green" },
    B2: { label: "مبتدئ متقدم", tone: "green" },
    I1: { label: "متوسط", tone: "amber" },
    I2: { label: "متوسط متقدم", tone: "amber" },
    A1: { label: "متقدم", tone: "brand" },
    A2: { label: "متقدم جدًا", tone: "brand" },
  };
  const info = map[level] ?? { label: level, tone: "gray" as const };
  return <Badge tone={info.tone}>{info.label}</Badge>;
}

export function LessonStateBadge({ state, status }: { state: string | null; status: string }) {
  if (state === "completed")
    return (
      <Badge tone="green">
        <CheckIcon className="h-3 w-3" strokeWidth={2.6} />
        مكتمل
      </Badge>
    );
  if (state === "in_progress") return <Badge tone="amber">قيد التقدم</Badge>;
  if (status === "published") return <Badge tone="brand">متاح</Badge>;
  if (status === "in_review") return <Badge tone="amber">قيد المراجعة</Badge>;
  return <Badge tone="gray">قريبًا</Badge>;
}

/** Small metadata chip (icon + text) used across cards and headers. */
export function MetaChip({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-hairline">
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ Statistics */

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "brand" | "accent" | "success" | "neutral";
}) {
  const tones = {
    brand: "from-primary-500/12 to-primary-500/0 text-primary-600",
    accent: "from-accent-500/12 to-accent-500/0 text-accent-600",
    success: "from-success-500/12 to-success-500/0 text-success-600",
    neutral: "from-neutral-500/10 to-neutral-500/0 text-neutral-500",
  };
  return (
    <div className="card card-hover overflow-hidden p-5">
      <div className={`absolute inset-0 -z-0 bg-gradient-to-bl ${tones[tone]}`} aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tighter text-neutral-900">{value}</p>
          {hint ? <p className="mt-1.5 text-xs text-neutral-500">{hint}</p> : null}
        </div>
        {icon ? (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface ring-1 ring-hairline ${tones[tone].split(" ").pop()}`}>
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Empty state */

export function EmptyState({
  title,
  hint,
  action,
  actionHref,
  icon,
  className = "",
}: {
  title: string;
  hint?: string;
  action?: string;
  actionHref?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card flex animate-fade-up flex-col items-center gap-4 px-6 py-14 text-center ${className}`}>
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-neutral-400 ring-1 ring-hairline"
        aria-hidden="true"
      >
        {icon ?? <InboxIcon className="h-7 w-7" />}
      </span>
      <div>
        <p className="text-lg font-bold text-neutral-900">{title}</p>
        {hint ? <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">{hint}</p> : null}
      </div>
      {action && actionHref ? (
        <Link href={actionHref} className={`btn-primary mt-1 ${touchTarget}`}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- Sections */

export function SectionHeader({
  title,
  subtitle,
  action,
  actionHref,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-sub">{subtitle}</p> : null}
      </div>
      {action && actionHref ? (
        <Link
          href={actionHref}
          className={`group inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 ${focusRing}`}
        >
          {action}
          <ChevronLeftIcon className="h-4 w-4 transition-transform duration-fast group-hover:-translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

/** Breadcrumb — RTL aware, semantic <nav><ol>. */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسار التنقل">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronLeftIcon className="h-3.5 w-3.5 opacity-40" />}
            {item.href ? (
              <Link href={item.href} className={`rounded transition-colors hover:text-primary-600 ${focusRing}`}>
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-neutral-700" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ----------------------------------------------------------------- Alert */

export function Alert({
  tone = "info",
  title,
  children,
  role = "status",
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  children?: React.ReactNode;
  role?: "status" | "alert";
}) {
  const cls = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    danger: "alert-danger",
  }[tone];
  return (
    <div role={role} className={cls}>
      <span aria-hidden="true" className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-current opacity-60" />
      <div className="min-w-0">
        {title ? <p className="font-bold">{title}</p> : null}
        {children ? <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div> : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Brand */

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 rounded-xl ${focusRing} ${className}`}
      aria-label="أكاديمية أدوبي الإبداعية — الرئيسية"
    >
      <span
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-lg font-black text-white shadow-sm transition-transform duration-base ease-spring group-hover:scale-105"
        aria-hidden="true"
      >
        أ
        <span className="absolute inset-0 bg-sheen bg-shimmer opacity-0 transition-opacity duration-slow group-hover:animate-shimmer group-hover:opacity-100" />
      </span>
      <span className="hidden text-[0.9375rem] font-bold tracking-tight text-neutral-900 xs:block">
        أكاديمية أدوبي الإبداعية
      </span>
    </Link>
  );
}

export { focusRing, touchTarget };
