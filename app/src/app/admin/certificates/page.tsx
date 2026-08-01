import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { certTitle } from "@/lib/certs";

export const dynamic = "force-dynamic";

export default async function AdminCertsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/certificates");
  if (user.role !== "admin") redirect("/");

  const users = await all<{ id: string; email: string; name: string }>("SELECT id, email, name FROM users ORDER BY name");
  const certs = await all<{
    id: string; user_id: string; cert_code: string; title_ar: string; serial: string; status: string; issued_at: string; revoked_reason: string | null;
  }>("SELECT * FROM certificates ORDER BY issued_at DESC LIMIT 50");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-extrabold text-neutral-900">إدارة الشهادات</h1>
        <p className="mt-1 text-sm text-neutral-500">إصدار الشهادات (مراجَع ومسجَّل) — يحدث تلقائيًا أيضًا عند إكمال مرحلة.</p>
      </header>

      <Card className="max-w-lg p-6">
        <h2 className="font-bold text-neutral-900">إصدار شهادة يدوي (حالة استثنائية)</h2>
        <form method="post" action="/api/admin/issue-certificate" className="mt-4 space-y-3">
          <div>
            <label htmlFor="user_id" className="label">المستخدم</label>
            <select id="user_id" name="user_id" required className="input">
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cert_code" className="label">نوع الشهادة</label>
            <select id="cert_code" name="cert_code" required className="input">
              {["CERT-01","CERT-02","CERT-03","CERT-04","CERT-05","CERT-06","CERT-07","CERT-08"].map((c) => (
                <option key={c} value={c}>{c} — {certTitle(c)}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">إصدار الشهادة</button>
        </form>
      </Card>

      <section aria-label="الشهادات المصدرة">
        <h2 className="mb-3 text-lg font-bold text-neutral-900">الشهادات المصدرة</h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100 text-right">
                <th className="px-4 py-2 font-bold text-neutral-700">الرقم التسلسلي</th>
                <th className="px-4 py-2 font-bold text-neutral-700">المستخدم</th>
                <th className="px-4 py-2 font-bold text-neutral-700">النوع</th>
                <th className="px-4 py-2 font-bold text-neutral-700">التاريخ</th>
                <th className="px-4 py-2 font-bold text-neutral-700">الحالة</th>
                <th className="px-4 py-2 font-bold text-neutral-700">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-4 text-center text-neutral-500">لا شهادات بعد</td></tr>
              )}
              {certs.map((c) => (
                <tr key={c.id} className="border-t border-neutral-200">
                  <td className="px-4 py-2 font-mono font-bold text-neutral-800" dir="ltr">{c.serial}</td>
                  <td className="px-4 py-2 text-neutral-600">{c.user_id}</td>
                  <td className="px-4 py-2 text-neutral-700">{c.cert_code}</td>
                  <td className="px-4 py-2 text-neutral-500">{new Date(c.issued_at + "Z").toLocaleDateString("ar-SA")}</td>
                  <td className="px-4 py-2">
                    <span className={`badge ${c.status === "active" ? "badge-green" : "badge-amber"}`}>
                      {c.status === "active" ? "سارية" : `ملغاة${c.revoked_reason ? `: ${c.revoked_reason}` : ""}`}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {c.status === "active" && (
                      <form method="post" action="/api/admin/revoke-certificate" className="flex items-center gap-2">
                        <input type="hidden" name="cert_id" value={c.id} />
                        <input name="reason" required placeholder="سبب الإلغاء (مسجَّل)" className="input max-w-[160px] py-1.5 text-xs" />
                        <button type="submit" className="btn-outline text-xs text-red-700 hover:bg-red-50">إلغاء</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
