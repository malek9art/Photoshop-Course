import Link from "next/link";
import { ShieldCheckIcon, AlertIcon, XIcon, ArrowRightIcon } from "@/components/icons";
import { get } from "@/lib/db";

export const dynamic = "force-dynamic";

type CertRow = {
  id: string; cert_code: string; title_ar: string; serial: string; status: string;
  issued_at: string; revoked_at: string | null; revoked_reason: string | null;
  user_name: string;
};

export default async function VerifySerialPage({ params }: { params: Promise<{ serial: string }> }) {
  const { serial } = await params;
  const code = serial.toUpperCase();
  const cert = await get<CertRow>(
    `SELECT c.*, u.name AS user_name
     FROM certificates c JOIN users u ON u.id = c.user_id
     WHERE c.serial = $1`,
    code
  );

  const state = !cert ? "missing" : cert.status === "revoked" ? "revoked" : "valid";
  const theme = {
    valid: {
      accent: "from-success-500 to-primary-500",
      chip: "bg-success-50 text-success-700 ring-success-500/20",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "شهادة سارية المفعول",
      titleClass: "text-success-700",
    },
    revoked: {
      accent: "from-danger-500 to-warning-500",
      chip: "bg-danger-50 text-danger-700 ring-danger-500/20",
      icon: <XIcon className="h-8 w-8" />,
      title: "شهادة ملغاة",
      titleClass: "text-danger-700",
    },
    missing: {
      accent: "from-neutral-400 to-neutral-300",
      chip: "bg-neutral-100 text-neutral-500 ring-neutral-300/50",
      icon: <AlertIcon className="h-8 w-8" />,
      title: "شهادة غير موجودة",
      titleClass: "text-neutral-900",
    },
  }[state];

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/verify"
        className="group inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
      >
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-base group-hover:translate-x-0.5" />
        التحقق من شهادة أخرى
      </Link>

      <article className="card mt-4 animate-fade-up overflow-hidden p-0">
        <span aria-hidden="true" className={`block h-1.5 bg-gradient-to-l ${theme.accent}`} />

        <div className="p-8 text-center md:p-10">
          <span
            className={`mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl p-4 ring-1 ${theme.chip}`}
            aria-hidden="true"
          >
            {theme.icon}
          </span>
          <h1 className={`mt-5 text-2xl font-black tracking-tighter ${theme.titleClass}`}>{theme.title}</h1>

          {state === "missing" && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              لم نعثر على شهادة بالرقم التسلسلي{" "}
              <span dir="ltr" className="font-mono font-bold text-neutral-700">
                {code}
              </span>
              . تحقق من الرقم وأعد المحاولة.
            </p>
          )}
          {state === "revoked" && cert && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              هذه الشهادة صدرت سابقًا ثم أُلغيت
              {cert.revoked_reason ? ` (السبب: ${cert.revoked_reason})` : ""}.
            </p>
          )}
          {state === "valid" && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              هذه الوثيقة صادرة رسميًا عن أكاديمية أدوبي الإبداعية.
            </p>
          )}

          {cert && (
            <dl className="mt-8 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-surface-muted/60 text-right text-sm">
              {[
                { label: "حامل الشهادة / Holder", value: cert.user_name, mono: false },
                { label: "نوع الشهادة / Type", value: `${cert.cert_code} — ${cert.title_ar}`, mono: false },
                { label: "الرقم التسلسلي / Serial", value: cert.serial, mono: true },
                {
                  label: "تاريخ الإصدار / Issued",
                  value: new Date(cert.issued_at + "Z").toLocaleDateString("ar-SA"),
                  mono: false,
                },
                { label: "الجهة المصدرة / Authority", value: "أكاديمية أدوبي الإبداعية", mono: false },
                ...(cert.status === "revoked" && cert.revoked_at
                  ? [
                      {
                        label: "تاريخ الإلغاء",
                        value: new Date(cert.revoked_at + "Z").toLocaleDateString("ar-SA"),
                        mono: false,
                      },
                    ]
                  : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-xs text-neutral-500">{row.label}</dt>
                  <dd
                    dir={row.mono ? "ltr" : undefined}
                    className={`text-sm font-bold text-neutral-900 ${row.mono ? "font-mono" : ""}`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </article>
    </div>
  );
}
