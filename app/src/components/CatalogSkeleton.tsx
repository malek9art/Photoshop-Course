import { Skeleton } from "./feedback";

export function CatalogSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="جارٍ تحميل المكتبة">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function StageSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="جارٍ تحميل المرحلة">
      <div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-72" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-52 rounded-xl" />
      ))}
    </div>
  );
}
