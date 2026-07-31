import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, ProgressBar } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { listStages, listModulesWithLessons } from "@/lib/data";
import { all } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  const stages = listStages();
  const overall = all(
    "SELECT COUNT(*) AS c FROM progress WHERE user_id = ? AND target_type='lesson' AND state='completed'",
    user.id
  )[0] as any;
  const totalLessons = all("SELECT COUNT(*) AS c FROM lessons WHERE content_path IS NOT NULL")[0] as any;
  const percent = totalLessons.c > 0 ? Math.round((overall.c / totalLessons.c) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-700 text-2xl font-black text-white" aria-hidden="true">
          {user.name.charAt(0)}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">{user.name}</h1>
          <p className="text-sm text-neutral-500" dir="ltr">{user.email}</p>
          <p className="mt-1 text-xs text-neutral-500">الدور: {user.role === "admin" ? "مدير" : "طالب"}</p>
        </div>
      </header>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-neutral-900">تقدمك العام</h2>
          <span className="text-sm font-bold text-primary-700">{percent}%</span>
        </div>
        <ProgressBar percent={percent} className="mt-3" />
        <p className="mt-2 text-xs text-neutral-500">
          {overall.c} من {totalLessons.c} درسًا متاحًا مكتملًا
        </p>
      </Card>

      <section aria-label="تقدم المراحل">
        <h2 className="mb-4 text-xl font-bold text-neutral-900">تقدم المراحل</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {stages.map((stage) => {
            const modules = listModulesWithLessons(stage.id, user.id);
            const total = modules.reduce((s, m) => s + m.lesson_count, 0);
            const done = modules.reduce((s, m) => s + m.completed_lessons, 0);
            const p = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Card key={stage.id}>
                <div className="flex items-center justify-between">
                  <Link href={`/catalog/${stage.id}`} className="font-bold text-neutral-900 hover:text-primary-800">
                    {stage.title_ar}
                  </Link>
                  <span className="text-xs font-bold text-primary-700">{p}%</span>
                </div>
                <ProgressBar percent={p} className="mt-3" />
                <p className="mt-2 text-xs text-neutral-500">{done} / {total} درسًا مكتملًا</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
