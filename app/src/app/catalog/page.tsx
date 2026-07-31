import Link from "next/link";
import { Card, DifficultyBadge } from "@/components/ui";
import { listStages } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "المكتبة الدراسية" };

export default function CatalogPage() {
  const stages = listStages();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">المكتبة الدراسية</h1>
        <p className="mt-1 text-sm text-neutral-500">
          ثماني مراحل متدرجة تغطي منظومة أدوبي الإبداعية — أكمل كل مرحلة للحصول على شهادتها.
        </p>
      </header>

      {stages.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-4xl" aria-hidden="true">📚</p>
          <p className="text-lg font-bold text-neutral-800">لا توجد مراحل بعد</p>
          <p className="max-w-sm text-sm text-neutral-500">ستظهر المراحل الدراسية فور نشر المحتوى.</p>
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {stages.map((stage) => (
          <Card key={stage.id} className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-700">{stage.id}</span>
              <DifficultyBadge level={stage.difficulty} />
            </div>
            <h2 className="mt-2 text-lg font-bold text-neutral-900">{stage.title_ar}</h2>
            <p className="text-xs text-neutral-500">{stage.title_en}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
              <span className="badge-gray">{stage.module_count} وحدات</span>
              <span className="badge-gray">{stage.lesson_count} دروس</span>
              <span className="badge-gray">{stage.effort_hours ?? "—"} ساعات</span>
            </div>
            <Link href={`/catalog/${stage.id}`} className="btn-outline mt-4 self-start">
              استعراض المرحلة ←
            </Link>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
