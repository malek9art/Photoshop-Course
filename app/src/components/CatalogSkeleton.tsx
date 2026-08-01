import { Skeleton } from "./feedback";

export function CatalogSkeleton() {
  return (
    <div className="stack-lg" aria-busy="true" aria-label="جارٍ تحميل المكتبة">
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div>
        <Skeleton className="mb-6 h-14 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StageSkeleton() {
  return (
    <div className="stack-lg" aria-busy="true" aria-label="جارٍ تحميل المرحلة">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-busy="true" aria-label="جارٍ تحميل الدرس">
      <div className="space-y-5">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-2 w-40" />
        <div className="space-y-3 pt-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </div>
      <div className="hidden space-y-4 lg:block">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="stack-lg" aria-busy="true" aria-label="جارٍ التحميل">
      <Skeleton className="h-52 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
