import type { Course } from "@/data/types";
import { formatPriceParts, getPaymentNote, getProductForCourse } from "@/data/products";
import { getCourseStart } from "@/lib/course-start";
import { CourseHeroClient } from "./CourseHeroClient";

/** Hero курса (серверная часть): собирает только публичные поля и цену из products.ts, анимации — в клиентской части */
export function CourseHero({ course }: { course: Course }) {
  const start = getCourseStart(course);
  const product = getProductForCourse(course.slug);
  return (
    <CourseHeroClient
      course={{
        slug: course.slug,
        shortName: course.shortName,
        tagline: course.tagline,
        description: course.description,
        accent: course.accent,
        ctaLabel: course.ctaLabel,
        duration: course.duration,
        // Формат — из products.ts (единый источник с карточками лестницы и каталога)
        format: product?.format ?? course.format,
        level: course.level,
        badgeDate: start.badgeDate,
        startFact: start.factValue,
        price: product ? formatPriceParts(product) : null,
        paymentNote: product ? getPaymentNote(product) : null,
      }}
    />
  );
}
