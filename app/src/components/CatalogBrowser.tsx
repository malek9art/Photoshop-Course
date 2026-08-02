"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DifficultyBadge, EmptyState, MetaChip } from "./ui";
import { SearchInput, FilterChips } from "./ui-client";
import { LayersIcon, BookIcon, ClockIcon, ArrowLeftIcon, CompassIcon, SearchIcon, LockIcon } from "./icons";
import type { StageRow } from "@/lib/data";
import type { LockInfo } from "@/lib/locks";

type LevelFilter = "all" | "B" | "I" | "A";

const LEVEL_LABELS: Record<Exclude<LevelFilter, "all">, string> = {
  B: "مبتدئ",
  I: "متوسط",
  A: "متقدم",
};

/**
 * Client-side search + level filtering over the stage list.
 * Pure presentation: the data still comes from the server (`listStages`),
 * no API, route or query changes.
 */
export function CatalogBrowser({
  stages,
  stageLocks = {},
}: {
  stages: StageRow[];
  /** stageId → LockInfo (server-computed) — shows which stages are gated. */
  stageLocks?: Record<string, LockInfo>;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { B: 0, I: 0, A: 0 };
    for (const s of stages) {
      const k = s.difficulty?.charAt(0);
      if (k && k in c) c[k] += 1;
    }
    return c;
  }, [stages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stages.filter((s) => {
      const matchesLevel = level === "all" || s.difficulty?.startsWith(level);
      const matchesQuery =
        !q ||
        s.title_ar.toLowerCase().includes(q) ||
        (s.title_en ?? "").toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);
      return matchesLevel && matchesQuery;
    });
  }, [stages, query, level]);

  if (stages.length === 0) {
    return (
      <EmptyState
        title="لا توجد مراحل بعد"
        hint="ستظهر المراحل الدراسية فور نشر المحتوى."
        icon={<CompassIcon className="h-7 w-7" />}
      />
    );
  }

  return (
    <section aria-label="تصفح المراحل">
      {/* Toolbar */}
      <div className="sticky top-[4.25rem] z-30 -mx-1 mb-6 flex flex-col gap-3 rounded-2xl border border-hairline bg-canvas/80 p-3 backdrop-blur-xl md:top-[5rem] md:flex-row md:items-center md:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="ابحث في المراحل الدراسية"
          placeholder="ابحث باسم المرحلة أو رمزها…"
          className="md:max-w-xs"
        />
        <FilterChips<LevelFilter>
          label="تصفية حسب المستوى"
          value={level}
          onChange={setLevel}
          options={[
            { value: "all", label: "الكل", count: stages.length },
            { value: "B", label: LEVEL_LABELS.B, count: counts.B },
            { value: "I", label: LEVEL_LABELS.I, count: counts.I },
            { value: "A", label: LEVEL_LABELS.A, count: counts.A },
          ]}
        />
      </div>

      <p className="mb-4 text-xs text-neutral-500" role="status" aria-live="polite">
        عرض {filtered.length} من {stages.length} مرحلة
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج مطابقة"
          hint="جرّب كلمة بحث أخرى أو أزل عوامل التصفية."
          icon={<SearchIcon className="h-7 w-7" />}
        />
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {filtered.map((stage) => (
            <Link
              key={stage.id}
              href={`/catalog/${stage.id}`}
              className="card card-hover group flex flex-col overflow-hidden p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-0.5 origin-top scale-y-0 bg-gradient-to-b from-primary-500 to-accent-500 transition-transform duration-slow ease-out-expo group-hover:scale-y-100"
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">{stage.id}</span>
                  <h2 className="mt-1.5 text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-primary-600">
                    {stage.title_ar}
                  </h2>
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500" dir="ltr">
                    {stage.title_en}
                  </p>
                </div>
                {stageLocks[stage.id]?.locked ? (
                  <span
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-2xs font-bold text-neutral-500 ring-1 ring-inset ring-hairline dark:bg-white/5 dark:text-neutral-400 dark:ring-white/10"
                    title="أكمل المتطلبات السابقة أولاً."
                  >
                    <LockIcon className="h-3 w-3" />
                    مقفلة
                  </span>
                ) : (
                  <DifficultyBadge level={stage.difficulty} />
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                <MetaChip icon={<LayersIcon className="h-3 w-3" />}>{stage.module_count} وحدات</MetaChip>
                <MetaChip icon={<BookIcon className="h-3 w-3" />}>{stage.lesson_count} دروس</MetaChip>
                <MetaChip icon={<ClockIcon className="h-3 w-3" />}>{stage.effort_hours ?? "—"} ساعة</MetaChip>
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                استعراض المرحلة
                <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
