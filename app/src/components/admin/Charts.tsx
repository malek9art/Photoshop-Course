/**
 * Dependency-free SVG charts (server-renderable).
 * Kept intentionally tiny: no charting library, no client JS, no layout shift.
 */

/** Horizontal bar list — great for "top N" breakdowns. */
export function BarList({
  items,
  label,
}: {
  items: { label: string; value: number; hint?: string }[];
  label: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-3" aria-label={label}>
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="min-w-0 truncate font-semibold text-neutral-700">{item.label}</span>
            <span className="shrink-0 font-bold text-neutral-900">
              {item.value}
              {item.hint ? <span className="ms-1 font-normal text-neutral-400">{item.hint}</span> : null}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-l from-primary-600 to-primary-400 transition-[width] duration-700 ease-out-expo"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Sparkline / area trend — points are evenly spaced. */
export function Sparkline({
  values,
  label,
  height = 64,
  className = "",
}: {
  values: number[];
  label: string;
  height?: number;
  className?: string;
}) {
  if (values.length === 0) return null;
  const w = 240;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const pts = values.map((v, i) => [i * step, height - (v / max) * (height - 8) - 4] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height }}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary-500))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="rgb(var(--primary-500))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path
        d={line}
        fill="none"
        stroke="rgb(var(--primary-500))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Donut chart for a small set of statuses. */
export function Donut({
  segments,
  label,
  size = 132,
  stroke = 16,
}: {
  segments: { label: string; value: number; color: string }[];
  label: string;
  size?: number;
  stroke?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="-rotate-90 shrink-0" role="img" aria-label={label}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-neutral-200" />
        {total > 0 &&
          segments.map((seg) => {
            const len = (seg.value / total) * c;
            const el = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={stroke}
                stroke={seg.color}
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <ul className="space-y-2 text-xs">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: seg.color }}
            />
            <span className="text-neutral-600">{seg.label}</span>
            <span className="font-bold text-neutral-900">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
