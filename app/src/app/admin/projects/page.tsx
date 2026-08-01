import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { GradeForm } from "@/components/GradeForm";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { loadProjectRubric } from "@/lib/rubric";

export const dynamic = "force-dynamic";

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

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">تصحيح المشاريع (AT-05)</h1>
        <p className="mt-1 text-sm text-neutral-500">
          التقييم وفق الروبرك (4 معايير، مقياس 1–4) — النجاح: متوسط ≥ 3.0 وعدم وجود أي معيار بدرجة 1 (DOC-08 §6).
        </p>
      </header>

      {submissions.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-4xl" aria-hidden="true">📭</p>
          <p className="mt-3 font-bold text-neutral-800">لا تسليمات بعد</p>
        </Card>
      )}

      {submissions.map((s) => {
        const rubric = loadProjectRubric(s.project_code);
        const statusLabel = s.status === "passed" ? "مقبول ✓" : s.status === "returned" ? "مُعاد" : "قيد المراجعة";
        return (
          <Card key={s.id} className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-neutral-900">{s.title || s.project_code}</p>
                <p className="text-xs text-neutral-500">
                  {s.project_code} · {s.user_name} ({s.user_email}) · {new Date(s.created_at + "Z").toLocaleDateString("ar-SA")}
                </p>
                {s.note && <p className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600">ملاحظة المتعلم: {s.note}</p>}
              </div>
              <span className={`badge ${s.status === "passed" ? "badge-green" : s.status === "returned" ? "badge-amber" : "badge-gray"}`}>{statusLabel}</span>
            </div>

            {s.has_grade > 0 && (
              <p className="mt-3 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-800">
                آخر تقييم: متوسط {s.score_avg}/4{s.feedback ? ` — ${s.feedback}` : ""}
              </p>
            )}

            {rubric && rubric.criteria.length > 0 ? (
              <GradeForm submissionId={s.id} projectCode={s.project_code} criteria={rubric.criteria} title={s.title || s.project_code} />
            ) : (
              <p className="mt-3 text-xs text-neutral-500">لا يوجد ملف روبرك لهذا المشروع ({s.project_code}).</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
