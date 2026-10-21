/**
 * Плейсхолдеры — любые данные (фото, чеки, суммы, логотипы, цифры),
 * которые ещё не подтверждены клиентом. В dev-режиме такие элементы
 * помечаются бейджем <PlaceholderBadge/>. В проде бейдж скрыт, но
 * флаг NEXT_PUBLIC_SHOW_PLACEHOLDERS=true включает его для финальной проверки.
 */
export const SHOW_PLACEHOLDERS =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";

/** Статус проверки данных */
export type VerificationStatus = "verified" | "unverified" | "placeholder";

export interface Verifiable {
  /**
   * verified     — подтверждено клиентом, можно показывать
   * unverified   — есть в источниках, но цифры расходятся; не выводить без явного флага
   * placeholder  — выдуманная заглушка под вёрстку; обязательно заменить
   */
  status: VerificationStatus;
  /** Откуда взято / что нужно уточнить */
  note?: string;
}

/** Можно ли выводить элемент на сайт по умолчанию */
export function isPublishable(v: Verifiable): boolean {
  return v.status === "verified";
}

/** Нужно ли показывать бейдж над элементом */
export function needsBadge(v: Verifiable): boolean {
  return SHOW_PLACEHOLDERS && v.status !== "verified";
}

/**
 * Фильтр для списков (кейсы, отзывы, партнёры).
 * - verified — всегда
 * - unverified — по умолчанию да (это контент с действующих сайтов, не выдумка;
 *   для метрик используется отдельный SHOW_UNVERIFIED_METRICS)
 * - placeholder — только в dev / при NEXT_PUBLIC_SHOW_PLACEHOLDERS
 */
export function filterForPublish<T extends Verifiable>(
  items: T[],
  opts?: { includeUnverified?: boolean },
): T[] {
  const includeUnverified = opts?.includeUnverified ?? true;
  return items.filter((item) => {
    if (item.status === "verified") return true;
    if (item.status === "unverified") return includeUnverified;
    return SHOW_PLACEHOLDERS; // placeholder
  });
}
