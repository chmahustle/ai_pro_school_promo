import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/lib/site";
import { courses } from "@/data/courses";
import { landingAudiences } from "@/data/audiences";

export default function sitemap(): MetadataRoute.Sitemap {
  // На тестовом домене карта сайта пустая
  if (!IS_INDEXABLE) return [];
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // /blog не в карте сайта до первых статей
    { url: `${SITE_URL}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  // Страницы направлений и продуктов вайб-кодинга (шаг 5a); /courses/vibecoding уже в списке курсов
  const newPages: MetadataRoute.Sitemap = ["/courses/creator", "/courses/vibecoding-offline", "/courses/vibecoding-course"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  const landingPages: MetadataRoute.Sitemap = landingAudiences.map((a) => ({
    url: `${SITE_URL}${a.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...staticPages, ...coursePages, ...newPages, ...landingPages];
}
