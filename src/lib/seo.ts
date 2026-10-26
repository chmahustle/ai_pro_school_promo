import type { Metadata } from "next";
import { IS_INDEXABLE, SITE_URL, site } from "./site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Канонический адрес, если страница дублирует другую (по умолчанию — её собственный path) */
  canonicalPath?: string;
  /**
   * OG-картинка (1200×630).
   *  - undefined → общая /og/default.png (сгенерирована из src/app/opengraph-image.tsx;
   *    пересоздать: `curl localhost:3000/opengraph-image > public/og/default.png`)
   *  - null      → не задавать; картинку подставит file-based opengraph-image.tsx
   *    того же сегмента (/courses/[slug], /for/[audience])
   *  - string    → явный путь из /public или абсолютный URL
   * Важно: Next заменяет объект openGraph целиком, поэтому корневой file-based OG
   * НЕ наследуется страницами, задающими собственный openGraph.
   */
  image?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Единый конструктор метаданных: title, description, canonical, OG, Twitter.
 * OG-превью критичны для WhatsApp/Telegram — там показываются title+description+image.
 */
export function buildMetadata({ title, description, path, canonicalPath, image = "/og/default.png", noIndex = false, type = "website" }: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} — ${site.name}`;
  const imageUrl = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : undefined;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: canonicalPath ? `${SITE_URL}${canonicalPath}` : url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: noIndex || !IS_INDEXABLE ? { index: false, follow: false } : { index: true, follow: true },
  };
}
