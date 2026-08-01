import { redirect } from "next/navigation";
import { StatCard, SectionHeader, Badge } from "@/components/ui";
import { AdminShell, AdminQuickLink } from "@/components/admin/AdminShell";
import { DataTable, Td, Tr } from "@/components/admin/DataTable";
import { BarList, Sparkline, Donut } from "@/components/admin/Charts";
import { Reveal } from "@/components/motion";
import {
  UsersIcon,
  BookIcon,
  CheckCircleIcon,
  QuizIcon,
  ProjectIcon,
  CertificateIcon,
  ClockIcon,
} from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "لوحة التحكم" };

type Stats = { users: number; lessons: number; published: number; attempts: number; submissions: number; certificates: number };

async function loadStats(): Promise<Stats> {
  const q = async (sql: string) => (await all<{ c: number }>(sql))[0]?.c ?? 0;
  const [users, lessons, published, attempts, submissions, certificates] = await Promise.all([
    q("SELECT COUNT(*)::int AS c FROM users"), q("SELECT COUNT(*)::int AS c FROM lessons"), q("SELECT COUNT(*)::int AS c FROM lessons WHERE status='published'"), q("SELECT COUNT(*)::int AS c FROM quiz_attempts"), q("SELECT COUNT(*)::int AS c FROM submissions"), q("SELECT COUNT(*)::int AS c FROM certificates"),
  ]);
  return { users, lessons, published, attempts, submissions, certificates };
}

/** Group timestamps into the last 14 days (client-free, derived from loaded rows). */
function dailySeries(dates: string[], days = 14): number[] {
  const buckets = new Array(days).fill(0);
  const now = Date.now();
  for (const d of dates) {
    const t = new Date(d + "Z").getTime();
    if (Number.isNaN(t)) continue;
    const diff = Math.floor((now - t) / 86_400_000);
    if (diff >= 0 && diff < days) buckets[days - 1 - diff] += 1;
  }
  return buckets;
}

function relativeTime(iso: string): string {
  const t = new Date(iso + "Z").getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.floor((Date.now() - t) / 60_000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يومًا`;
  return new Date(t).toLocaleDateString("ar-SA");
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  const stats = await loadStats();
  const users = await all<{ id: string; email: string; name: string; role: string; created_at: string }>(
    "SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 20"
  );
  const attempts = await all<{ id: string; user_id: string; quiz_code: string; score_pct: number; passed: number; created_at: string }>(
    "SELECT * FROM quiz_attempts ORDER BY created_at DESC LIMIT 20"
  );
  const submissions = await all<{ id: string; user_id: string; project_code: string; title: string; status: string; created_at: string }>(
    "SELECT * FROM submissions ORDER BY created_at DESC LIMIT 20"
  );

  /* ---- Derived analytics (no extra queries, no logic change) ---- */
  const passedAttempts = attempts.filter((a) => a.passed).length;
  const passRate = attempts.length > 0 ? Math.round((passedAttempts / attempts.length) * 100) : 0;
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + (a.score_pct ?? 0), 0) / attempts.length)
      : 0;
  const publishRate = stats.lessons > 0 ? Math.round((stats.published / stats.lessons) * 100) : 0;

  const quizBreakdown = Object.entries(
    attempts.reduce<Record<string, number>>((acc, a) => {
      acc[a.quiz_code] = (acc[a.quiz_code] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const submissionStatuses = ["passed", "returned", "submitted"].map((status, i) => ({
    label: status === "passed" ? "مقبول" : status === "returned" ? "مُعاد" : "قيد المراجعة",
    value: submissions.filter((s) => s.status === status).length,
    color: ["rgb(var(--success-500))", "rgb(var(--warning-500))", "rgb(var(--neutral-400))"][i],
  }));

  const signupSeries = dailySeries(users.map((u) => u.created_at));

  const activity = [
    ...users.map((u) => ({
      kind: "user" as const,
      at: u.created_at,
      text: `انضم ${u.name} إلى المنصة`,
      meta: u.role === "admin" ? "مدير" : "طالب",
    })),
    ...attempts.map((a) => ({
      kind: "attempt" as const,
      at: a.created_at,
      text: `محاولة اختبار ${a.quiz_code} — ${a.score_pct}%`,
      meta: a.passed ? "ناجح" : "لم يجتز",
    })),
    ...submissions.map((s) => ({
      kind: "submission" as const,
      at: s.created_at,
      text: `تسليم مشروع ${s.title || s.project_code}`,
      meta: s.status,
    })),
  ]
    .sort((a, b) => new Date(b.at + "Z").getTime() - new Date(a.at + "Z").getTime())
    .slice(0, 10);

  const ACTIVITY_ICON = {
    user: UsersIcon,
    attempt: QuizIcon,
    submission: ProjectIcon,
  };

  return (
    <AdminShell
      title="نظرة عامة"
      subtitle="مؤشرات المنصة الرئيسية — المحتوى والمستخدمون والأنشطة، محدَّثة لحظيًا."
      actions={
        <>
          <AdminQuickLink href="/admin/projects" label="تصحيح المشاريع" />
          <AdminQuickLink href="/admin/certificates" label="إصدار شهادة" />
        </>
      }
    >
      {/* =========================================================== KPIs */}
      <section aria-label="المؤشرات الرئيسية">
        <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="المستخدمون" value={stats.users} icon={<UsersIcon className="h-5 w-5" />} tone="brand" />
          <StatCard label="الدروس" value={stats.lessons} icon={<BookIcon className="h-5 w-5" />} tone="neutral" />
          <StatCard
            label="دروس منشورة"
            value={stats.published}
            hint={`${publishRate}% من الإجمالي`}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            tone="success"
          />
          <StatCard label="محاولات اختبار" value={stats.attempts} icon={<QuizIcon className="h-5 w-5" />} tone="accent" />
          <StatCard label="تسليمات مشاريع" value={stats.submissions} icon={<ProjectIcon className="h-5 w-5" />} tone="neutral" />
          <StatCard label="شهادات" value={stats.certificates} icon={<CertificateIcon className="h-5 w-5" />} tone="success" />
        </div>
      </section>

      {/* ========================================================= Charts */}
      <Reveal as="section">
        <SectionHeader title="التحليلات" subtitle="مشتقّة من أحدث 20 سجلًا في كل جدول." />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral-500">تسجيلات جديدة</p>
                <p className="mt-1.5 text-3xl font-black tracking-tighter text-neutral-900">
                  {signupSeries.reduce((a, b) => a + b, 0)}
                </p>
                <p className="mt-1 text-2xs text-neutral-400">آخر 14 يومًا</p>
              </div>
            </div>
            <div className="mt-5">
              <Sparkline values={signupSeries} label="تسجيلات المستخدمين خلال 14 يومًا" />
            </div>
          </div>

          <div className="card p-6">
            <p className="text-xs font-semibold text-neutral-500">أداء الاختبارات</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-black tracking-tighter text-neutral-900">{passRate}%</p>
                <p className="mt-1 text-2xs text-neutral-400">نسبة النجاح</p>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tighter text-neutral-900">{avgScore}%</p>
                <p className="mt-1 text-2xs text-neutral-400">متوسط الدرجات</p>
              </div>
            </div>
            <div className="mt-5">
              {quizBreakdown.length > 0 ? (
                <BarList items={quizBreakdown} label="توزيع المحاولات على الاختبارات" />
              ) : (
                <p className="text-xs text-neutral-400">لا محاولات بعد.</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <p className="text-xs font-semibold text-neutral-500">حالة التسليمات</p>
            <div className="mt-5">
              {submissions.length > 0 ? (
                <Donut segments={submissionStatuses} label="توزيع حالات تسليمات المشاريع" />
              ) : (
                <p className="text-xs text-neutral-400">لا تسليمات بعد.</p>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ======================================================= Activity */}
      <Reveal as="section">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader title="أحدث المستخدمين" />
            <DataTable
              rowCount={users.length}
              empty="لا مستخدمين بعد"
              caption="أحدث المستخدمين المسجّلين"
              columns={[
                { key: "name", label: "الاسم" },
                { key: "email", label: "البريد" },
                { key: "role", label: "الدور" },
                { key: "created", label: "تاريخ الإنشاء" },
              ]}
            >
              {users.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <span className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-2xs font-black text-white"
                        aria-hidden="true"
                      >
                        {u.name.charAt(0)}
                      </span>
                      <span className="font-semibold text-neutral-900">{u.name}</span>
                    </span>
                  </Td>
                  <Td dir="ltr" mono className="text-neutral-500">
                    {u.email}
                  </Td>
                  <Td>
                    <Badge tone={u.role === "admin" ? "brand" : "gray"}>{u.role === "admin" ? "مدير" : "طالب"}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-neutral-500">
                    {new Date(u.created_at + "Z").toLocaleDateString("ar-SA")}
                  </Td>
                </Tr>
              ))}
            </DataTable>
          </div>

          <div>
            <SectionHeader title="سجل النشاط" />
            <div className="card p-6">
              {activity.length === 0 ? (
                <p className="text-sm text-neutral-500">لا نشاط بعد.</p>
              ) : (
                <ol className="relative space-y-5 border-s border-hairline ps-5">
                  {activity.map((item, i) => {
                    const Icon = ACTIVITY_ICON[item.kind];
                    return (
                      <li key={i} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -start-[1.9rem] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-surface text-neutral-500"
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-sm font-medium leading-relaxed text-neutral-800">{item.text}</p>
                        <p className="mt-0.5 flex items-center gap-2 text-2xs text-neutral-400">
                          <ClockIcon className="h-3 w-3" />
                          {relativeTime(item.at)}
                          <span aria-hidden="true">·</span>
                          <span>{item.meta}</span>
                        </p>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ========================================= Attempts & submissions */}
      <Reveal as="section">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeader title="محاولات الاختبارات" />
            <DataTable
              rowCount={attempts.length}
              empty="لا محاولات بعد"
              caption="أحدث محاولات الاختبارات"
              columns={[
                { key: "quiz", label: "الاختبار" },
                { key: "score", label: "النتيجة" },
                { key: "state", label: "الحالة" },
              ]}
            >
              {attempts.map((a) => (
                <Tr key={a.id}>
                  <Td mono className="text-neutral-700">
                    {a.quiz_code}
                  </Td>
                  <Td className="font-bold text-neutral-900">{a.score_pct}%</Td>
                  <Td>
                    <Badge tone={a.passed ? "green" : "amber"}>{a.passed ? "ناجح" : "لم يجتز"}</Badge>
                  </Td>
                </Tr>
              ))}
            </DataTable>
          </div>

          <div>
            <SectionHeader title="تسليمات المشاريع" action="تصحيح" actionHref="/admin/projects" />
            <DataTable
              rowCount={submissions.length}
              empty="لا تسليمات بعد"
              caption="أحدث تسليمات المشاريع"
              columns={[
                { key: "project", label: "المشروع" },
                { key: "user", label: "المستخدم" },
                { key: "state", label: "الحالة" },
              ]}
            >
              {submissions.map((s) => (
                <Tr key={s.id}>
                  <Td className="font-semibold text-neutral-800">{s.title || s.project_code}</Td>
                  <Td mono className="max-w-[10rem] truncate text-neutral-500">
                    {s.user_id}
                  </Td>
                  <Td>
                    <Badge tone={s.status === "passed" ? "green" : s.status === "returned" ? "amber" : "gray"}>
                      {s.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </DataTable>
          </div>
        </div>
      </Reveal>
    </AdminShell>
  );
}
