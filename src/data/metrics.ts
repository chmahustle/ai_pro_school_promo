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
    value: 4500,
    prefix: "",
    suffix: "+",
    label: "учеников",
    hint: "прошли программы школы",
    status: "verified",
    note: "Данные школы, 2026-10. Формулировку «учеников/участников» уточнить (TODO.md → «Школа в цифрах»).",
  },
  {
    id: "views",
    value: 70_000_000,
    suffix: "+",
    label: "органических просмотров",
    hint: "в Instagram, TikTok и YouTube",
    format: "compact",
    status: "verified",
    note: "Данные школы, 2026-10.",
  },
  {
    id: "streams",
    value: 45,
    suffix: "+",
    label: "потоков практикума",
    hint: "прошли живые эфиры практикума",
    status: "verified",
    note: "Данные школы, 2026-10. Новый показатель блока.",
  },
  {
    id: "followers",
    value: 96_300,
    suffix: "+",
    label: "подписчиков в соцсетях",
    hint: "Instagram, TikTok, YouTube",
    format: "compact",
    status: "unverified",
    note: "96,3 тыс.+: ждём подтверждения единицы измерения и охвата (TODO.md). Не показывать в продакшене.",
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
 */
/** Значение показателя берётся из `metrics` ниже: одно значение на показатель, дублей чисел нет */
const M = (id: string) => metrics.find((m) => m.id === id)!;
const confirmed = (id: string) => M(id).status === "verified";

/** Источник и дата подтверждения цифр блока «Школа в цифрах» */
const SCHOOL_SOURCE = "Данные школы";
const SCHOOL_AS_OF = "2026-10";

export const homeMetrics: HomeMetric[] = [
  {
    id: "students",
    value: M("students").value,
    suffix: "+",
    label: "Учеников",
    hint: "Прошли программы школы",
    source: SCHOOL_SOURCE,
    sourceUrl: null,
    asOf: SCHOOL_AS_OF,
    verified: confirmed("students"),
    featured: true,
  },
  {
    id: "views",
    value: M("views").value / 1_000_000,
    suffix: "\u00a0млн+",
    label: "Органических просмотров",
    source: SCHOOL_SOURCE,
    sourceUrl: null,
    asOf: SCHOOL_AS_OF,
    verified: confirmed("views"),
  },
  {
    id: "followers",
    value: M("followers").value / 1000,
    suffix: "\u00a0тыс.+",
    decimals: 1,
    label: "Подписчиков в соцсетях",
    source: SCHOOL_SOURCE,
    sourceUrl: null,
    asOf: SCHOOL_AS_OF,
    // verified:false — ждём подтверждения единицы измерения и охвата; в проде карточка скрыта
    verified: confirmed("followers"),
  },
  {
    id: "streams",
    value: M("streams").value,
    suffix: "+",
    label: "Потоков практикума",
    source: SCHOOL_SOURCE,
    sourceUrl: null,
    asOf: SCHOOL_AS_OF,
    verified: confirmed("streams"),
  },
];

/** verified всегда; unverified — только в dev / SHOW_PLACEHOLDERS */
export function getHomeMetrics(): HomeMetric[] {
  return homeMetrics.filter((m) => m.verified || SHOW_PLACEHOLDERS);
}

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

/** Метрики спикеров (для карточек команды) — из лендингов вайб-кодинга */
export const founderMetrics = {
  students: { value: M("students").value, suffix: "+", label: "учеников", status: M("students").status },
  views: { value: M("views").value, suffix: "+", label: "просмотров", status: M("views").status },
};
