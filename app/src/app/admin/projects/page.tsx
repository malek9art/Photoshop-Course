import { redirect } from "next/navigation";
import { EmptyState, Badge, StatCard } from "@/components/ui";
import { AdminShell } from "@/components/admin/AdminShell";
import { GradeForm } from "@/components/GradeForm";
import { Reveal } from "@/components/motion";
import { InboxIcon, ClockIcon, CheckCircleIcon, ProjectIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { loadProjectRubric } from "@/lib/rubric";

export const dynamic = "force-dynamic";

export const metadata = { title: "تصحيح المشاريع" };

export default async function AdminProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/projects");
  if (user.role !== "admin") redirect("/");

  const submissions = await all<{
    id: string; user_id: string; project_code: string; title: string; note: string | null; status: string; created_at: string;
    user_name: string; user_email: string; has_grade: number; score_avg: number | null; feedback: string | null;
  }>(
    `SELECT s.*, u.name AS user_name, u.email AS user_email,
       (SELECT COUNT(*) FROM grades g WHERE g.submission_id = s.id) AS has_grade,
       (SELECT g.score_avg FROM grades g WHERE g.submission_id = s.id ORDER BY g.graded_at DESC LIMIT 1) AS score_avg,
       (SELECT g.feedback FROM grades g WHERE g.submission_id = s.id ORDER BY g.graded_at DESC LIMIT 1) AS feedback
     FROM submissions s JOIN users u ON u.id = s.user_id
     ORDER BY s.created_at DESC`
  );

  const pending = submissions.filter((s) => s.status !== "passed" && Number(s.has_grade) === 0).length;
  const graded = submissions.filter((s) => Number(s.has_grade) > 0).length;
  const passed = submissions.filter((s) => s.status === "passed").length;

  return (
    <AdminShell
      title="تصحيح المشاريع (AT-05)"
      subtitle="التقييم وفق الروبرك (4 معايير، مقياس 1–4) — النجاح: متوسط ≥ 3.0 وعدم وجود أي معيار بدرجة 1 (DOC-08 §6)."
    >
      <section aria-label="ملخص التصحيح">
        <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="إجمالي التسليمات" value={submissions.length} icon={<ProjectIcon className="h-5 w-5" />} tone="neutral" />
          <StatCard label="بانتظار التصحيح" value={pending} icon={<ClockIcon className="h-5 w-5" />} tone="accent" />
          <StatCard label="تم تقييمها" value={graded} icon={<CheckCircleIcon className="h-5 w-5" />} tone="brand" />
          <StatCard label="مقبولة" value={passed} icon={<CheckCircleIcon className="h-5 w-5" />} tone="success" />
        </div>
      </section>

      {submissions.length === 0 ? (
        <EmptyState
          title="لا تسليمات بعد"
          hint="ستظهر تسليمات المتعلّمين هنا فور استلامها."
          icon={<InboxIcon className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-5">
          {submissions.map((s, i) => {
            const rubric = loadProjectRubric(s.project_code);
            const statusLabel = s.status === "passed" ? "مقبول" : s.status === "returned" ? "مُعاد" : "قيد المراجعة";
            const tone = s.status === "passed" ? "green" : s.status === "returned" ? "amber" : "gray";
            return (
              <Reveal key={s.id} as="section" delay={Math.min(i, 6) * 40}>
                <div className="card overflow-hidden p-0">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline bg-surface-muted/50 px-6 py-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-2xs font-bold tracking-wider text-primary-600">
                          {s.project_code}
                        </span>
                        {Number(s.has_grade) > 0 && (
                          <Badge tone="blue">آخر تقييم: {s.score_avg}/4</Badge>
                        )}
                      </div>
                      <p className="mt-1.5 text-base font-bold text-neutral-900">{s.title || s.project_code}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                        <span className="font-semibold text-neutral-700">{s.user_name}</span>
                        <span dir="ltr" className="font-mono">
                          {s.user_email}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(s.created_at + "Z").toLocaleDateString("ar-SA")}</span>
                      </p>
                    </div>
                    <Badge tone={tone}>{statusLabel}</Badge>
                  </div>

                  <div className="p-6">
                    {s.note && (
                      <div className="mb-5 rounded-2xl border border-hairline bg-surface-muted/60 px-4 py-3">
                        <p className="text-2xs font-bold uppercase tracking-widest text-neutral-400">ملاحظة المتعلم</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-700">{s.note}</p>
                      </div>
                    )}

                    {Number(s.has_grade) > 0 && s.feedback && (
                      <div className="mb-5 rounded-2xl border border-info-500/25 bg-info-50 px-4 py-3">
                        <p className="text-2xs font-bold uppercase tracking-widest text-info-700/70">آخر ملاحظات</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-info-800">{s.feedback}</p>
                      </div>
                    )}

                    {rubric && rubric.criteria.length > 0 ? (
                      <GradeForm
                        submissionId={s.id}
                        projectCode={s.project_code}
                        criteria={rubric.criteria}
                        title={s.title || s.project_code}
                      />
                    ) : (
                      <p className="text-xs text-neutral-500">
                        لا يوجد ملف روبرك لهذا المشروع ({s.project_code}).
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
