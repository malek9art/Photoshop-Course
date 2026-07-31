import { Skeleton } from "./feedback";

/** Dashboard skeleton (DOC-04 §4 Loading: skeleton placeholders). */
export function HomeSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="جارٍ تحميل لوحة التحكم">
      <Skeleton className="h-44 w-full rounded-2xl md:h-52" />
      <section>
        <Skeleton className="mb-4 h-6 w-40" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </section>
      <section>
        <Skeleton className="mb-4 h-6 w-44" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
