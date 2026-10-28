import type { Course } from "@/data/types";

export interface CourseStart {
  /** «26 октября» — для бейджа «Старт …»; null — даты нет, бейдж не показываем */
  badgeDate: string | null;
  /** Значение для плитки «Старт»: дата с днём недели или пояснение; null — плитку не показываем */
  factValue: string | null;
  /** Подпись плитки: «Старт» или «Записи эфиров» (у практикума без подтверждённой даты — про записи) */
  factLabel: string;
}

/**
 * Старт курса. Практикум: даты начала не показываем нигде (решение владельца) — вместо неё пояснение про записи эфиров (startNote).
 * Остальные курсы — пояснение из данных курса (startNote), конкретные даты не выдумываем.
 */
export function getCourseStart(course: Pick<Course, "slug" | "startNote">): CourseStart {
  if (course.slug === "practicum") {
    return { badgeDate: null, factValue: course.startNote ?? null, factLabel: "Записи эфиров" };
  }
  return { badgeDate: null, factValue: course.startNote ?? null, factLabel: "Старт" };
}
