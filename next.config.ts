import type { NextConfig } from "next";
import { legalDocs } from "./src/data/legalDocs";

/** Боевые хосты, которые индексируются; всё остальное получает X-Robots-Tag: noindex. */
const INDEXABLE_HOSTS = ["ai-pro-school.kz", "www.ai-pro-school.kz"];
const siteHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-pro-school.kz").hostname;
  } catch {
    return "";
  }
})();
const NOINDEX = { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" };

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1920],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // noindex на тестовом домене: (1) если сайт собран под не-боевой NEXT_PUBLIC_SITE_URL - на все ответы;
  // (2) в любом случае - по заголовку Host test.* / tests.* (на случай, если переменную на сервере забыли).
  async headers() {
    return [
      ...(INDEXABLE_HOSTS.includes(siteHost) ? [] : [{ source: "/:path*", headers: [NOINDEX] }]),
      { source: "/:path*", has: [{ type: "host" as const, value: "tests?\\.ai-pro-school\\.kz" }], headers: [NOINDEX] },
    ];
  },
  async redirects() {
    return [
      // Legacy URLs from the current Tilda site
      { source: "/ai2026", destination: "/courses/ai-creator", permanent: true },
      { source: "/prakticum", destination: "/courses/practicum", permanent: true },
      { source: "/courses/ai2026", destination: "/courses/ai-creator", permanent: true },
      // Юридические документы лежат в Google Docs; короткие адреса на нашем домене (на /public ссылается п. 13.2 оферты).
      // Проект не static export, поэтому обычный серверный редирект; временный, чтобы адрес документа можно было сменить
      { source: legalDocs.privacy.sitePath, destination: legalDocs.privacy.docHref, permanent: false },
      { source: legalDocs.offer.sitePath, destination: legalDocs.offer.docHref, permanent: false },
    ];
  },
};

export default nextConfig;
