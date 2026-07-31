import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header, BottomNav } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "أكاديمية أدوبي الإبداعية", template: "%s — أكاديمية أدوبي الإبداعية" },
  description: "منصة عربية احترافية لتعلم برامج أدوبي الإبداعية — من المبتدئ إلى المحترف المعتمد.",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Tajawal — graceful if offline (system fallbacks in tailwind config) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen pb-20 md:pb-0">
        <Header user={user} />
        <main className="container-app py-6 md:py-10">{children}</main>
        <BottomNav isAdmin={user?.role === "admin"} />
      </body>
    </html>
  );
}
