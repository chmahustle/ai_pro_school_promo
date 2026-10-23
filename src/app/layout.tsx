import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { interTight, manrope } from "@/styles/fonts";
import { ScrollControls } from "@/components/layout/ScrollControls";
import { Providers } from "@/components/layout/Providers";
import { Analytics } from "@/components/layout/Analytics";
import { IS_INDEXABLE, SITE_URL, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [{ url: "/og/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/og/logo.svg", type: "image/svg+xml" }],
    shortcut: "/og/logo.svg",
  },
  // OG-картинка берётся из src/app/opengraph-image.tsx (file-based), поэтому здесь не указываем
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
};

export const viewport: Viewport = {
  themeColor: "#f6f5fa",
  width: "device-width",
  initialScale: 1,
};

/**
 * Все страницы — статические (SSG). Локаль читается из cookie на клиенте в LocaleProvider,
 * чтобы не превращать layout в динамический рендер.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${interTight.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <Providers>
          {children}
          <ScrollControls />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
