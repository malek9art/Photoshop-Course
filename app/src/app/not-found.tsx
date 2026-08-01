import Link from "next/link";
import { CompassIcon, ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] animate-fade-up flex-col items-center justify-center px-4 text-center">
      <span
        className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-muted text-neutral-400 ring-1 ring-hairline"
        aria-hidden="true"
      >
        <span className="absolute inset-0 animate-float rounded-3xl bg-primary-500/5 motion-reduce:animate-none" />
        <CompassIcon className="h-10 w-10" />
      </span>

      <p className="mt-8 text-6xl font-black tracking-tighter text-neutral-900">404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
        ربما أُزيلت الصفحة أو أن الرابط غير صحيح. جرّب العودة إلى الرئيسية أو تصفّح المكتبة الدراسية.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary group">
          العودة إلى الرئيسية
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-base group-hover:-translate-x-1" />
        </Link>
        <Link href="/catalog" className="btn-outline">
          تصفح المكتبة
        </Link>
      </div>
    </div>
  );
}
