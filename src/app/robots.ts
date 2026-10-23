import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Тестовые и прочие не-боевые домены закрыты целиком
  if (!IS_INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/thanks", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
