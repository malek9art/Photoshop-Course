import Link from "next/link";

/** Small shared UI atoms (DOC-06 components: cards, badges, progress). */

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function ProgressBar({ percent, className = "" }: { percent: number; className?: string }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-neutral-200 ${className}`} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={`التقدم ${p}%`}>
      <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${p}%` }} />
    </div>
  );
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "green" | "amber" | "gray" }) {
  const cls = tone === "green" ? "badge-green" : tone === "amber" ? "badge-amber" : "badge-gray";
  return <span className={cls}>{children}</span>;
}

export function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; tone: "green" | "amber" | "gray" }> = {
    B1: { label: "مبتدئ", tone: "green" },
    B2: { label: "مبتدئ متقدم", tone: "green" },
    I1: { label: "متوسط", tone: "amber" },
    I2: { label: "متوسط متقدم", tone: "amber" },
    A1: { label: "متقدم", tone: "gray" },
    A2: { label: "متقدم جدًا", tone: "gray" },
  };
  const info = map[level] ?? { label: level, tone: "gray" as const };
  return <Badge tone={info.tone}>{info.label}</Badge>;
}

export function LessonStateBadge({ state, status }: { state: string | null; status: string }) {
  if (state === "completed") return <Badge tone="green">مكتمل ✓</Badge>;
  if (state === "in_progress") return <Badge tone="amber">قيد التقدم</Badge>;
  if (status === "published") return <Badge tone="green">متاح</Badge>;
  if (status === "in_review") return <Badge tone="amber">قيد المراجعة</Badge>;
  return <Badge tone="gray">قريبًا</Badge>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <p className="text-lg font-bold text-neutral-800">{title}</p>
      {hint ? <p className="text-sm text-neutral-500">{hint}</p> : null}
    </div>
  );
}

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="أكاديمية أدوبي الإبداعية — الرئيسية">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-lg font-black text-white" aria-hidden="true">
        أ
      </span>
      <span className="text-base font-bold text-neutral-900">
        أكاديمية أدوبي الإبداعية
      </span>
    </Link>
  );
}
