import { Skeleton } from "./feedback";

/** Home skeleton (DOC-04 §4 Loading: skeleton placeholders, matches the real layout). */
export function HomeSkeleton() {
  return (
    <div className="stack-lg" aria-busy="true" aria-label="جارٍ تحميل الصفحة الرئيسية">
      <Skeleton className="h-[24rem] w-full rounded-3xl sm:rounded-4xl" />
      <section>
        <Skeleton className="mb-6 h-7 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </section>
      <section>
        <Skeleton className="mb-6 h-7 w-52" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
