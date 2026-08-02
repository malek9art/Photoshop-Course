import { CatalogBrowser } from "@/components/CatalogBrowser";
import { listStages } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { getStageLock, type LockInfo } from "@/lib/locks";

export const dynamic = "force-dynamic";

export const metadata = { title: "المكتبة الدراسية" };

export default async function CatalogPage() {
  const user = await getCurrentUser();
  const stages = await listStages();
  const totalModules = stages.reduce((s, x) => s + (x.module_count ?? 0), 0);
  const totalLessons = stages.reduce((s, x) => s + (x.lesson_count ?? 0), 0);
  const totalHours = stages.reduce((s, x) => s + (x.effort_hours ?? 0), 0);

  /* Server-side stage gates — shown as lock chips on the cards. */
  const stageLocks: Record<string, LockInfo> = {};
  if (user) {
    for (const stage of stages) {
      stageLocks[stage.id] = await getStageLock(user.id, stage.id);
    }
  }

  return (
    <div className="stack-lg">
      <header className="relative overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-10 md:px-10 md:py-14">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 mask-fade-b" />
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-2xl">
          <p className="eyebrow">المنهج الكامل</p>
          <h1 className="mt-3 text-4xl font-black tracking-tighter text-neutral-900">المكتبة الدراسية</h1>
          <p className="mt-4 text-base leading-loose text-neutral-500">
            مراحل متدرّجة تغطي منظومة أدوبي الإبداعية — أكمل كل مرحلة للحصول على شهادتها المعتمدة.
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { label: "مرحلة", value: stages.length },
              { label: "وحدة", value: totalModules },
              { label: "درس", value: totalLessons },
              { label: "ساعة", value: totalHours },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-medium text-neutral-500">{s.label}</dt>
                <dd className="text-2xl font-black tracking-tighter text-neutral-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <CatalogBrowser stages={stages} stageLocks={stageLocks} />
    </div>
  );
}
