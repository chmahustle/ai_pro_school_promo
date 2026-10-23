/**
 * Плейсхолдеры — любые данные (фото, чеки, суммы, логотипы, цифры),
 * которые ещё не подтверждены клиентом. Показываются ТОЛЬКО в dev (`next dev`, NODE_ENV !== "production"),
 * поверх них — бейдж <PlaceholderBadge/>.
 *
 * Production-сборка флаг NEXT_PUBLIC_SHOW_PLACEHOLDERS игнорирует: раньше при true в проде показывались
 * заглушки (кейсы «Компания A/B», «Эксперт C»). Дополнительно scripts/check-env.mjs (prebuild) валит сборку,
 * если этот флаг выставлен в окружении или в .env-файлах.
 */
export const SHOW_PLACEHOLDERS = process.env.NODE_ENV !== "production";

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
