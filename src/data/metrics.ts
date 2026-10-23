import "server-only";
import type { Metric } from "./types";
import { isPublishable, SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/**
 * Метрики для bento на главной.
 * На сайте — только verified: true; unverified — только в dev (SHOW_PLACEHOLDERS).
 * TODO(клиент): подтвердить цифры → verified: true; подставить value/source/asOf.
 */
export interface HomeMetric {
  id: string;
  value: number;
  /** «+», « ₸», « млн» — рисуются цветом brand */
  suffix?: string;
  prefix?: string;
  label: string;
  /** Пояснение (для большой карточки) */
  hint?: string;
  source: string;
  sourceUrl: string | null;
  asOf: string | null;
  verified: boolean;
  format?: "compact" | "plain";
  decimals?: number;
  /** Большая карточка слева */
  featured?: boolean;
  /** Пилюли под цифрой (география и т.п.) */
  pills?: string[];
}

/**
 * «4 региона» (Казахстан, Россия, Европа, США) из блока убраны по решению владельца (шаг 3b) — не показывать, пока не подтвердят.
 */
export const homeMetrics: HomeMetric[] = [
  {
    id: "students",
    value: 3000,
    suffix: "+",
    label: "Учеников",
    hint: "Прошли программы школы по всему миру",
    source: "Лендинги вайбкодинга",
    sourceUrl: null,
    asOf: null,
    verified: false,
    featured: true,
    // TODO: 1000+ / 2000+ / 3000+ — расходятся
  },
  {
    id: "views",
    value: 70,
    suffix: "\u00a0млн+",
    label: "Просмотры контента",
    source: "Instagram · TikTok · YouTube",
    sourceUrl: null,
    asOf: null,
    verified: false,
    // TODO: 50 или 70 млн
  },
  {
    id: "followers",
    value: 90,
    suffix: "\u00a0тыс.+",
    label: "Подписчики в соцсетях",
    source: "Соцсети школы",
    sourceUrl: null,
    asOf: null,
    verified: false,
    // TODO: 70 или 90 тыс.
  },
  {
    id: "avg-check",
    value: 30_000,
    suffix: "\u00a0₸",
    label: "Средний чек ученика за ролик",
    source: "Страница практикума",
    sourceUrl: null,
    asOf: null,
    verified: false,
  },
];

/** verified всегда; unverified — только в dev / SHOW_PLACEHOLDERS */
export function getHomeMetrics(): HomeMetric[] {
  return homeMetrics.filter((m) => m.verified || SHOW_PLACEHOLDERS);
}

/**
 * Ключевые метрики школы (для /about, лендингов, /reviews).
 *
 * ВАЖНО: источники расходятся. Ниже каждая цифра со статусом:
 *   verified    — одинаково на всех страницах / подтверждено клиентом → показывается
 *   unverified  — есть в источниках, но значения отличаются → НЕ показывается
 *                 без явного флага (см. publishedMetrics)
 *   placeholder — выдумано под вёрстку → заменить
 *
 * TODO(клиент): подтвердить каждую цифру и поменять status на "verified".
 */
export const metrics: Metric[] = [
  {
    id: "students",
    value: 3000,
    prefix: "",
    suffix: "+",
    label: "учеников по миру",
    hint: "прошли программы школы",
    status: "unverified",
    note: "Источники: 1000+ (ai2026), 2000+ (практикум), 3000+ (лендинги вайбкодинга, 2026). Берём последнюю.",
  },
  {
    id: "views",
    value: 70_000_000,
    suffix: "+",
    label: "просмотров ИИ-роликов",
    hint: "в Instagram, TikTok и YouTube",
    format: "compact",
    status: "unverified",
    note: "Источники: 50 млн (главная, ai2026, практикум), 70 млн+ (лендинги вайбкодинга). Берём последнюю.",
  },
  {
    id: "followers",
    value: 90_000,
    suffix: "+",
    label: "подписчиков в соцсетях",
    hint: "Instagram, TikTok, YouTube",
    format: "compact",
    status: "unverified",
    note: "Источники: 70 000 (главная), 90 000 (практикум).",
  },
  {
    id: "years",
    value: 2,
    suffix: "+",
    label: "года в ИИ",
    hint: "учим только тому, что используем в проектах",
    status: "verified",
    note: "Одинаково на всех страницах: «более 2 лет в сфере ИИ».",
  },
  {
    id: "avg-check",
    value: 30_000,
    suffix: "\u00a0₸",
    label: "средний чек за ИИ-ролик",
    hint: "разовые заказы и пакеты до 1 000 000 ₸",
    status: "unverified",
    note: "Источник: страница практикума. Подтвердить у клиента.",
  },
  {
    id: "countries",
    value: 4,
    label: "региона клиентов",
    hint: "Казахстан, Россия, Европа, США",
    status: "unverified",
    note: "Источник: практикум («клиенты из Казахстана, России, Европы и Америки»).",
  },
  {
    id: "rating",
    value: 4.9,
    decimals: 1,
    label: "средняя оценка курсов",
    hint: "по отзывам учеников",
    status: "placeholder",
    note: "PLACEHOLDER: цифры нет в источниках. Подставить реальную или удалить.",
  },
  {
    id: "hours",
    value: 120,
    suffix: "+",
    label: "часов практики",
    hint: "уроки, эфиры, разборы",
    status: "placeholder",
    note: "PLACEHOLDER: посчитать по реальным программам.",
  },
];

/**
 * Явный флаг: показывать ли unverified-метрики. По умолчанию — нет.
 * Включить можно только осознанно здесь, не через env.
 */
export const SHOW_UNVERIFIED_METRICS = false;

/** Метрики для вывода на сайт: verified всегда, unverified — только по флагу, placeholder — только в dev */
export function getPublishedMetrics(opts?: { includeDevPlaceholders?: boolean }): Metric[] {
  return metrics.filter((m) => {
    if (isPublishable(m)) return true;
    if (m.status === "unverified") return SHOW_UNVERIFIED_METRICS;
    if (m.status === "placeholder") return opts?.includeDevPlaceholders ?? process.env.NODE_ENV !== "production";
    return false;
  });
}

/**
 * Статус резидентства Astana Hub: страницы говорят и «резидент», и «в процессе получения».
 * По умолчанию НЕ показываем. TODO(клиент): подтвердить статус.
 */
export const astanaHub = {
  status: "unverified" as const,
  show: false,
  label: "Резидент Astana Hub",
  note: "ai2026: «в процессе получения резидентства»; остальные страницы: «резидент». Уточнить.",
};

/** Метрики спикеров (для карточек команды) — из лендингов вайбкодинга */
export const founderMetrics = {
  students: { value: 3000, suffix: "+", label: "учеников по миру", status: "unverified" as const },
  views: { value: 70_000_000, suffix: "+", label: "просмотров", status: "unverified" as const },
};
