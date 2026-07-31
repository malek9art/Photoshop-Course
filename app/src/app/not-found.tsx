import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl" aria-hidden="true">🧭</p>
      <h1 className="text-2xl font-extrabold text-neutral-900">الصفحة غير موجودة</h1>
      <p className="text-sm text-neutral-500">ربما أُزيلت الصفحة أو أن الرابط غير صحيح.</p>
      <Link href="/" className="btn-primary">العودة إلى الرئيسية</Link>
    </div>
  );
}
