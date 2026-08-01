import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header, BottomNav } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { themeInitScript } from "@/components/theme";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "أكاديمية أدوبي الإبداعية", template: "%s — أكاديمية أدوبي الإبداعية" },
  description: "منصة عربية احترافية لتعلم برامج أدوبي الإبداعية — من المبتدئ إلى المحترف المعتمد.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* No-flash theme boot (runs before first paint) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Tajawal — graceful if offline (system fallbacks in tailwind config) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas pb-24 md:pb-0">
        {/* Ambient background wash — purely decorative, fixed & GPU-cheap */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-primary-500/[0.07] blur-3xl dark:bg-primary-500/[0.09]" />
          <div className="absolute bottom-[-18rem] left-[-12%] h-[34rem] w-[34rem] rounded-full bg-accent-500/[0.06] blur-3xl dark:bg-accent-500/[0.05]" />
        </div>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[90] focus:rounded-xl focus:bg-primary-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          تخطَّ إلى المحتوى الرئيسي
        </a>

        <Header user={user} />

        <main id="main" className="container-app py-8 md:py-12">
          <PageTransition>{children}</PageTransition>
        </main>

        <SiteFooter />
        <BottomNav isAdmin={user?.role === "admin"} />
      </body>
    </html>
  );
}
