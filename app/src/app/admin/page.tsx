import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getDb, all } from "@/lib/db";

export const dynamic = "force-dynamic";

type Stats = { users: number; lessons: number; published: number; attempts: number; submissions: number; certificates: number };

function loadStats(): Stats {
  const q = (sql: string) => (all(sql)[0] as any)?.c as number;
  return {
    users: q("SELECT COUNT(*) AS c FROM users"),
    lessons: q("SELECT COUNT(*) AS c FROM lessons"),
    published: q("SELECT COUNT(*) AS c FROM lessons WHERE status='published'"),
    attempts: q("SELECT COUNT(*) AS c FROM quiz_attempts"),
    submissions: q("SELECT COUNT(*) AS c FROM submissions"),
    certificates: q("SELECT COUNT(*) AS c FROM certificates"),
  };
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  getDb(); // ensure schema
  const stats = loadStats();
  const users = all<{ id: string; email: string; name: string; role: string; created_at: string }>(
    "SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 20"
  );
  const attempts = all<{ id: string; user_id: string; quiz_code: string; score_pct: number; passed: number; created_at: string }>(
    "SELECT * FROM quiz_attempts ORDER BY created_at DESC LIMIT 20"
  );
  const submissions = all<{ id: string; user_id: string; project_code: string; title: string; status: string; created_at: string }>(
    "SELECT * FROM submissions ORDER BY created_at DESC LIMIT 20"
  );

  const cards = [
    { label: "المستخدمون", value: stats.users },
    { label: "الدروس", value: stats.lessons },
    { label: "دروس منشورة", value: stats.published },
    { label: "محاولات اختبار", value: stats.attempts },
    { label: "تسليمات مشاريع", value: stats.submissions },
    { label: "شهادات", value: stats.certificates },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-neutral-500">نظرة عامة على المنصة — المحتوى والمستخدمون والأنشطة.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Card key={c.label} className="p-4 text-center">
            <p className="text-2xl font-extrabold text-primary-700">{c.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{c.label}</p>
          </Card>
        ))}
      </div>

      <section aria-label="المستخدمون">
        <h2 className="mb-3 text-lg font-bold text-neutral-900">أحدث المستخدمين</h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100 text-right">
                <th className="px-4 py-2 font-bold text-neutral-700">الاسم</th>
                <th className="px-4 py-2 font-bold text-neutral-700">البريد</th>
                <th className="px-4 py-2 font-bold text-neutral-700">الدور</th>
                <th className="px-4 py-2 font-bold text-neutral-700">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-neutral-200">
                  <td className="px-4 py-2 font-semibold text-neutral-800">{u.name}</td>
                  <td className="px-4 py-2 text-neutral-600" dir="ltr">{u.email}</td>
                  <td className="px-4 py-2">{u.role === "admin" ? "مدير" : "طالب"}</td>
                  <td className="px-4 py-2 text-neutral-500">{new Date(u.created_at + "Z").toLocaleDateString("ar-SA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="محاولات الاختبارات">
          <h2 className="mb-3 text-lg font-bold text-neutral-900">محاولات الاختبارات</h2>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 text-right">
                  <th className="px-4 py-2 font-bold text-neutral-700">الاختبار</th>
                  <th className="px-4 py-2 font-bold text-neutral-700">النتيجة</th>
                  <th className="px-4 py-2 font-bold text-neutral-700">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-neutral-500">لا محاولات بعد</td></tr>
                )}
                {attempts.map((a) => (
                  <tr key={a.id} className="border-t border-neutral-200">
                    <td className="px-4 py-2 text-neutral-700">{a.quiz_code}</td>
                    <td className="px-4 py-2 font-bold text-neutral-800">{a.score_pct}%</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${a.passed ? "badge-green" : "badge-amber"}`}>{a.passed ? "ناجح" : "لم يجتز"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        <section aria-label="تسليمات المشاريع">
          <h2 className="mb-3 text-lg font-bold text-neutral-900">تسليمات المشاريع</h2>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 text-right">
                  <th className="px-4 py-2 font-bold text-neutral-700">المشروع</th>
                  <th className="px-4 py-2 font-bold text-neutral-700">المستخدم</th>
                  <th className="px-4 py-2 font-bold text-neutral-700">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-neutral-500">لا تسليمات بعد</td></tr>
                )}
                {submissions.map((s) => (
                  <tr key={s.id} className="border-t border-neutral-200">
                    <td className="px-4 py-2 text-neutral-700">{s.title || s.project_code}</td>
                    <td className="px-4 py-2 text-neutral-600">{s.user_id}</td>
                    <td className="px-4 py-2">
                      <span className="badge badge-gray">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </div>
  );
}
