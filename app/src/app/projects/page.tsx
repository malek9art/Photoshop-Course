import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Card } from "@/components/ui";
import Markdown from "@/components/Markdown";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { CONTENT_DIR } from "@/lib/content";

export const dynamic = "force-dynamic";

type ProjectDoc = { code: string; title: string; markdown: string };

function listProjects(): ProjectDoc[] {
  const out: ProjectDoc[] = [];
  if (!fs.existsSync(CONTENT_DIR)) return out;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/^STG-\d{2}-PROJECT\.md$/.test(entry.name)) {
        const md = fs.readFileSync(full, "utf-8");
        const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? entry.name;
        const bodyIdx = md.indexOf("## 1.");
        out.push({ code: entry.name.replace(/\.md$/, ""), title, markdown: bodyIdx > 0 ? md.slice(bodyIdx) : md });
      }
    }
  };
  walk(CONTENT_DIR);
  return out.sort();
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ error?: string; submitted?: string }> }) {
  const { error, submitted } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/projects");
  const projects = listProjects();
  const mine = all<{ project_code: string; title: string; status: string; created_at: string }>(
    "SELECT project_code, title, status, created_at FROM submissions WHERE user_id = ? ORDER BY created_at DESC",
    user.id
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">المشاريع</h1>
        <p className="mt-1 text-sm text-neutral-500">مشاريع المراحل — طبّق ما تعلمته وقدّم عملك للمراجعة (محاولتان كحد أقصى، بفاصل 3 أيام — DOC-08 §5).</p>
      </header>

      {error === "max-submissions" && (
        <p role="alert" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          بلغت الحد الأقصى لتسليمات هذا المشروع (محاولتان — DOC-08 §5).
        </p>
      )}
      {error === "cooldown" && (
        <p role="alert" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          فترة التهدئة بين تسليمات المشروع سارية (3 أيام — DOC-08 §5). أعد المحاولة لاحقًا.
        </p>
      )}
      {submitted === "1" && (
        <p role="status" className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-800">
          تم استلام تسليمك — سيُراجع وفق الروبرك خلال 72 ساعة (DOC-08 §8).
        </p>
      )}

      {mine.length > 0 ? (
        <section aria-label="تسليماتي">
          <h2 className="mb-3 text-lg font-bold text-neutral-900">تسليماتي</h2>
          <div className="space-y-2">
            {mine.map((s, i) => (
              <Card key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-neutral-800">{s.title || s.project_code}</p>
                  <p className="text-xs text-neutral-500">{s.project_code} · {new Date(s.created_at + "Z").toLocaleDateString("ar-SA")}</p>
                </div>
                <span className={`badge ${s.status === "passed" ? "badge-green" : "badge-amber"}`}>{s.status === "passed" ? "مقبول ✓" : "قيد المراجعة"}</span>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-4xl" aria-hidden="true">📭</p>
          <p className="text-lg font-bold text-neutral-800">لا توجد تسليمات بعد</p>
          <p className="max-w-sm text-sm text-neutral-500">قدّم مشروع المرحلة أدناه لبدء بناء ملف أعمالك.</p>
        </div>
      )}

      {projects.map((p) => {
        const submittedCount = mine.filter((s) => s.project_code === p.code).length;
        const remaining = 2 - submittedCount; // DOC-08 §5: 2 submissions max
        const exhausted = remaining <= 0;
        return (
        <section key={p.code} aria-label={p.title} className="scroll-mt-24">
          <Card className="p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-bold text-primary-700">{p.code}</span>
              {submittedCount > 0 && (
                <span className={`badge ${exhausted ? "badge-amber" : "badge-gray"}`}>
                  التسليمات: {submittedCount}/2
                </span>
              )}
            </div>
            <Markdown>{p.markdown}</Markdown>

            {exhausted ? (
              <p className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                بلغت الحد الأقصى لتسليمات هذا المشروع (محاولتان — DOC-08 §5).
              </p>
            ) : (
            <form method="post" action="/api/projects" className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4">
              <input type="hidden" name="project_code" value={p.code} />
              <label htmlFor={`title-${p.code}`} className="label">عنوان التسليم</label>
              <input id={`title-${p.code}`} name="title" required className="input" placeholder={`تسليم ${p.code} — نسختي`} />
              <label htmlFor={`note-${p.code}`} className="label mt-3">ملاحظة للمراجع (اختياري)</label>
              <textarea id={`note-${p.code}`} name="note" rows={2} className="input" placeholder="وصف مختصر لما أنجزته…" />
              <button type="submit" className="btn-primary mt-4">تسليم المشروع</button>
            </form>
            )}
          </Card>
        </section>
        );
      })}
    </div>
  );
}
