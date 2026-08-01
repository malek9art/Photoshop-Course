import { redirect } from "next/navigation";
import { SectionHeader, Badge } from "@/components/ui";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, Td, Tr } from "@/components/admin/DataTable";
import { CertificateIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { all } from "@/lib/db";
import { certTitle } from "@/lib/certs";

export const dynamic = "force-dynamic";

export const metadata = { title: "إدارة الشهادات" };

export default async function AdminCertsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/certificates");
  if (user.role !== "admin") redirect("/");

  const users = await all<{ id: string; email: string; name: string }>("SELECT id, email, name FROM users ORDER BY name");
  const certs = await all<{
    id: string; user_id: string; cert_code: string; title_ar: string; serial: string; status: string; issued_at: string; revoked_reason: string | null;
  }>("SELECT * FROM certificates ORDER BY issued_at DESC LIMIT 50");

  const activeCount = certs.filter((c) => c.status === "active").length;

  return (
    <AdminShell
      title="إدارة الشهادات"
      subtitle="إصدار الشهادات (مراجَع ومسجَّل) — يحدث تلقائيًا أيضًا عند إكمال مرحلة."
    >
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* ==================================================== Issue form */}
        <section aria-label="إصدار شهادة" className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden p-0">
            <div className="flex items-center gap-3 border-b border-hairline bg-surface-muted/60 px-6 py-5">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-500/20"
                aria-hidden="true"
              >
                <CertificateIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-neutral-900">إصدار شهادة يدوي</h2>
                <p className="text-2xs text-neutral-500">حالة استثنائية — تُسجَّل في السجل</p>
              </div>
            </div>

            <form method="post" action="/api/admin/issue-certificate" className="space-y-4 p-6">
              <div>
                <label htmlFor="user_id" className="label">
                  المستخدم
                </label>
                <select id="user_id" name="user_id" required className="input">
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cert_code" className="label">
                  نوع الشهادة
                </label>
                <select id="cert_code" name="cert_code" required className="input">
                  {["CERT-01", "CERT-02", "CERT-03", "CERT-04", "CERT-05", "CERT-06", "CERT-07", "CERT-08"].map((c) => (
                    <option key={c} value={c}>
                      {c} — {certTitle(c)}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                إصدار الشهادة
              </button>
            </form>
          </div>
        </section>

        {/* ================================================= Issued table */}
        <section aria-label="الشهادات المصدرة">
          <SectionHeader
            title="الشهادات المصدرة"
            subtitle={`${certs.length} شهادة · ${activeCount} سارية`}
          />
          <DataTable
            rowCount={certs.length}
            empty="لا شهادات بعد"
            caption="الشهادات المصدرة"
            columns={[
              { key: "serial", label: "الرقم التسلسلي" },
              { key: "user", label: "المستخدم" },
              { key: "type", label: "النوع" },
              { key: "date", label: "التاريخ" },
              { key: "status", label: "الحالة" },
              { key: "actions", label: "إجراءات" },
            ]}
          >
            {certs.map((c) => (
              <Tr key={c.id}>
                <Td dir="ltr" mono className="font-bold text-neutral-900">
                  {c.serial}
                </Td>
                <Td mono className="max-w-[10rem] truncate text-neutral-500">
                  {c.user_id}
                </Td>
                <Td className="whitespace-nowrap text-neutral-700">{c.cert_code}</Td>
                <Td className="whitespace-nowrap text-xs text-neutral-500">
                  {new Date(c.issued_at + "Z").toLocaleDateString("ar-SA")}
                </Td>
                <Td>
                  <Badge tone={c.status === "active" ? "green" : "red"}>
                    {c.status === "active" ? "سارية" : `ملغاة${c.revoked_reason ? `: ${c.revoked_reason}` : ""}`}
                  </Badge>
                </Td>
                <Td>
                  {c.status === "active" && (
                    <form method="post" action="/api/admin/revoke-certificate" className="flex items-center gap-2">
                      <input type="hidden" name="cert_id" value={c.id} />
                      <label htmlFor={`reason-${c.id}`} className="sr-only">
                        سبب إلغاء الشهادة {c.serial}
                      </label>
                      <input
                        id={`reason-${c.id}`}
                        name="reason"
                        required
                        placeholder="سبب الإلغاء (مسجَّل)"
                        className="input max-w-[10rem] py-1.5 text-xs"
                      />
                      <button
                        type="submit"
                        className="btn-outline btn-sm border-danger-500/30 text-danger-600 hover:border-danger-500/60 hover:bg-danger-50"
                      >
                        إلغاء
                      </button>
                    </form>
                  )}
                </Td>
              </Tr>
            ))}
          </DataTable>
        </section>
      </div>
    </AdminShell>
  );
}
