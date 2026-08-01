import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { Alert, EmptyState, SectionHeader, Badge } from "@/components/ui";
import { Reveal } from "@/components/motion";
import Markdown from "@/components/Markdown";
import { ProjectIcon, InboxIcon, CheckCircleIcon, ClockIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { CONTENT_DIR } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "المشاريع" };

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

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const { error, submitted } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/projects");
  const projects = listProjects();
  const mine = await all<{ project_code: string; title: string; status: string; created_at: string }>(
    "SELECT project_code, title, status, created_at FROM submissions WHERE user_id = $1 ORDER BY created_at DESC",
    user.id
  );

  return (
    <div className="stack-lg">
      {/* ========================================================== Header */}
      <header className="relative overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-10 md:px-10 md:py-12">
        <div aria-hidden="true" className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40 mask-fade-b" />
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-2xl">
          <p className="eyebrow">التطبيق العملي</p>
          <h1 className="mt-3 text-4xl font-black tracking-tighter text-neutral-900">المشاريع</h1>
          <p className="mt-4 text-base leading-loose text-neutral-500">
            مشاريع المراحل — طبّق ما تعلمته وقدّم عملك للمراجعة (محاولتان كحد أقصى، بفاصل 3 أيام —
            DOC-08 §5).
          </p>
        </div>
      </header>

      {/* ======================================================== Feedback */}
      {error === "max-submissions" && (
        <Alert tone="warning" role="alert" title="بلغت الحد الأقصى للتسليمات">
          بلغت الحد الأقصى لتسليمات هذا المشروع (محاولتان — DOC-08 §5).
        </Alert>
      )}
      {error === "cooldown" && (
        <Alert tone="warning" role="alert" title="فترة التهدئة سارية">
          فترة التهدئة بين تسليمات المشروع سارية (3 أيام — DOC-08 §5). أعد المحاولة لاحقًا.
        </Alert>
      )}
      {submitted === "1" && (
        <Alert tone="success" title="تم استلام تسليمك">
          سيُراجع وفق الروبرك خلال 72 ساعة (DOC-08 §8).
        </Alert>
      )}

      {/* ==================================================== Submissions */}
      <Reveal as="section">
        <SectionHeader eyebrow="سجلّك" title="تسليماتي" subtitle="كل ما قدّمته من مشاريع وحالته الحالية." />
        {mine.length > 0 ? (
          <ul className="stagger space-y-2.5">
            {mine.map((s, i) => {
              const passed = s.status === "passed";
              return (
                <li
                  key={i}
                  className="card card-hover flex flex-wrap items-center justify-between gap-4 p-4 md:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${
                        passed
                          ? "bg-success-50 text-success-600 ring-success-500/20"
                          : "bg-warning-50 text-warning-600 ring-warning-500/20"
                      }`}
                      aria-hidden="true"
                    >
                      {passed ? <CheckCircleIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-neutral-900">{s.title || s.project_code}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-mono">{s.project_code}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(s.created_at + "Z").toLocaleDateString("ar-SA")}</span>
                      </p>
                    </div>
                  </div>
                  <Badge tone={passed ? "green" : "amber"}>{passed ? "مقبول" : "قيد المراجعة"}</Badge>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title="لا توجد تسليمات بعد"
            hint="قدّم مشروع المرحلة أدناه لبدء بناء ملف أعمالك."
            icon={<InboxIcon className="h-7 w-7" />}
          />
        )}
      </Reveal>

      {/* ======================================================= Projects */}
      {projects.length === 0 ? (
        <EmptyState
          title="لا توجد مشاريع منشورة بعد"
          hint="ستظهر مشاريع المراحل فور نشر المحتوى."
          icon={<ProjectIcon className="h-7 w-7" />}
        />
      ) : (
        projects.map((p) => {
          const submittedCount = mine.filter((s) => s.project_code === p.code).length;
          const remaining = 2 - submittedCount; // DOC-08 §5: 2 submissions max
          const exhausted = remaining <= 0;
          return (
            <Reveal key={p.code} as="section" className="scroll-mt-24">
              <div className="card overflow-hidden p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface-muted/50 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-500/15"
                      aria-hidden="true"
                    >
                      <ProjectIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-2xs font-bold tracking-wider text-primary-600">{p.code}</p>
                      <h2 className="mt-0.5 text-base font-bold text-neutral-900">{p.title}</h2>
                    </div>
                  </div>
                  {submittedCount > 0 && (
                    <Badge tone={exhausted ? "amber" : "gray"}>التسليمات: {submittedCount}/2</Badge>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <Markdown>{p.markdown}</Markdown>

                  {exhausted ? (
                    <div className="mt-8">
                      <Alert tone="warning">
                        بلغت الحد الأقصى لتسليمات هذا المشروع (محاولتان — DOC-08 §5).
                      </Alert>
                    </div>
                  ) : (
                    <form
                      method="post"
                      action="/api/projects"
                      className="mt-8 rounded-2xl border border-dashed border-hairline-strong bg-surface-muted/60 p-5 md:p-6"
                    >
                      <p className="mb-4 text-sm font-bold text-neutral-900">
                        تسليم المشروع
                        <span className="ms-2 text-xs font-medium text-neutral-500">
                          (متبقٍ {remaining} من محاولتين)
                        </span>
                      </p>
                      <input type="hidden" name="project_code" value={p.code} />
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`title-${p.code}`} className="label">
                            عنوان التسليم
                          </label>
                          <input
                            id={`title-${p.code}`}
                            name="title"
                            required
                            className="input"
                            placeholder={`تسليم ${p.code} — نسختي`}
                          />
                        </div>
                        <div>
                          <label htmlFor={`note-${p.code}`} className="label">
                            ملاحظة للمراجع{" "}
                            <span className="font-normal text-neutral-400">(اختياري)</span>
                          </label>
                          <textarea
                            id={`note-${p.code}`}
                            name="note"
                            rows={3}
                            className="input resize-y"
                            placeholder="وصف مختصر لما أنجزته…"
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary mt-5">
                        تسليم المشروع
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })
      )}
    </div>
  );
}
