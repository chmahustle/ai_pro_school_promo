import type { Course } from "@/data/types";
import { currentDate, formatCohortDate, getNextCohort } from "@/data/products";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

export interface CourseStart {
  /** «26 октября» — для бейджа «Старт …»; null — даты нет, бейдж не показываем */
  badgeDate: string | null;
  /** Значение для плитки «Старт»: дата с днём недели или пояснение; null — плитку не показываем */
  factValue: string | null;
  /** Подпись плитки: «Старт» или «Записи эфиров» (у практикума без подтверждённой даты — про записи) */
  factLabel: string;
}

/**
 * Старт курса. Практикум — ближайший день потока из products.ts (getNextCohort), но только при cohortVerified: true:
 * в проде неподтверждённую дату не показываем (остаётся startNote курса или ничего), в dev — с пометкой.
 * Остальные курсы — пояснение из данных курса (startNote), конкретные даты не выдумываем.
 */
export function getCourseStart(course: Pick<Course, "slug" | "startNote">, now: Date = currentDate()): CourseStart {
  if (course.slug === "practicum") {
    const cohort = getNextCohort("practicum", now);
    if (cohort && (cohort.verified || SHOW_PLACEHOLDERS)) {
      const mark = cohort.verified ? "" : " (не подтверждено)"; // dev-only: в проде сюда попадают только подтверждённые даты
      return { badgeDate: formatCohortDate(cohort) + mark, factValue: formatCohortDate(cohort, true) + mark, factLabel: "Старт" };
    }
    return { badgeDate: null, factValue: course.startNote ?? null, factLabel: "Записи эфиров" };
  }
  return { badgeDate: null, factValue: course.startNote ?? null, factLabel: "Старт" };
}
