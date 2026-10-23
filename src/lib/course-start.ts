import type { Course } from "@/data/types";
import { formatCohortDate, getNextCohort } from "@/data/products";

export interface CourseStart {
  /** «26 октября» — для бейджа «Старт …»; null — даты нет, бейдж не показываем */
  badgeDate: string | null;
  /** Значение для плитки «Старт»: дата с днём недели или пояснение; null — плитку не показываем */
  factValue: string | null;
}

/**
 * Старт курса. Практикум — ближайший день потока из products.ts (getNextCohort); нет потока — без даты.
 * Остальные курсы — пояснение из данных курса (startNote), конкретные даты не выдумываем.
 */
export function getCourseStart(course: Pick<Course, "slug" | "startNote">, now: Date = new Date()): CourseStart {
  if (course.slug === "practicum") {
    const cohort = getNextCohort("practicum", now);
    return cohort
      ? { badgeDate: formatCohortDate(cohort), factValue: formatCohortDate(cohort, true) }
      : { badgeDate: null, factValue: course.startNote ?? null };
  }
  return { badgeDate: null, factValue: course.startNote ?? null };
}
