import { SparkIcon, ShieldCheckIcon, CertificateIcon, BookIcon } from "./icons";

const HIGHLIGHTS = [
  { icon: BookIcon, title: "منهج عربي متدرّج", body: "من الأساسيات إلى الاحتراف، بترتيب مدروس." },
  { icon: ShieldCheckIcon, title: "تقييم عادل", body: "اختبارات ومشاريع تقيس الفهم لا الحفظ." },
  { icon: CertificateIcon, title: "شهادات موثّقة", body: "رقم تسلسلي قابل للتحقق العام." },
];

/**
 * Split auth shell — brand story on one side, the form on the other.
 * Presentation only: the form (and its POST target) is passed as children.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden rounded-3xl bg-neutral-950 p-10 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 animate-gradient-pan bg-aurora bg-[length:180%_180%] motion-reduce:animate-none" />
          <div className="absolute inset-0 bg-grid-fade bg-grid opacity-[0.07]" />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-2xs font-bold tracking-widest text-white/90 backdrop-blur-md">
            <SparkIcon className="h-3.5 w-3.5 text-accent-300" />
            أكاديمية أدوبي الإبداعية
          </span>
          <h2 className="mt-7 text-3xl font-black leading-tight tracking-tighter text-white">
            تعلّم الإبداع الرقمي
            <br />
            بالعربية، باحتراف.
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-loose text-white/60">
            انضم إلى منصة تعليمية مصمّمة من الصفر للمتعلّم العربي — بلا حشو، وبلا إعلانات.
          </p>
        </div>

        <ul className="relative mt-10 space-y-5">
          {HIGHLIGHTS.map((h) => (
            <li key={h.title} className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-accent-300 backdrop-blur-md">
                <h.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{h.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/55">{h.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Form panel */}
      <div className="flex flex-col justify-center">
        <div className="card p-7 md:p-9">
          <h1 className="text-2xl font-black tracking-tighter text-neutral-900">{title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{subtitle}</p>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
