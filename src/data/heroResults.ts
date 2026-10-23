import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/**
 * Плавающие результаты в hero / чипы в метриках.
 * verified: false — показывать только в dev (SHOW_PLACEHOLDERS).
 * В первом экране — только результаты без обещаний дохода (шаг 3a): карточки с суммами заработка убраны.
 * TODO(клиент): подтвердить цифры, добавить фото, дату эфира.
 */

export interface HeroResult {
  id: string;
  name: string;
  /** Строка результата; суммы с ₸ не переносить в UI (whitespace-nowrap) */
  result: string;
  label: string;
  progress: number;
  /** TODO: путь к фото ученика */
  photo: string | null;
  verified: boolean;
}

export const heroResults: HeroResult[] = [
  {
    id: "gulaiym",
    name: "Гульайым",
    result: "1,6 млн просмотров за 5 дней",
    label: "Охват ролика",
    progress: 64,
    photo: null, // TODO: фото ученицы
    verified: false,
  },
];

export interface HeroEvent {
  title: string;
  duration: string;
  tags: string[];
  /** TODO: дата ближайшего эфира */
  date: string | null;
  href: string;
  ctaLabel: string;
}

export const heroEvent: HeroEvent = {
  title: "Бесплатный эфир по вайбкодингу",
  duration: "1,5 часа",
  tags: ["Бизнес", "Фриланс", "Карьера"],
  date: null, // TODO: дата эфира
  href: "/for/business",
  ctaLabel: "Записаться",
};

/**
 * CTA «Бесплатный вебинар» в блоке «Хотите так же?».
 * TODO: формы вебинара на главной ещё нет — повесить id="webinar-form" на блок записи
 * и заменить href на рабочий якорь / URL.
 */
export const webinarCta = {
  href: "/#webinar-form",
} as const;

export const heroTeachers = [
  { name: "Надира Батырбаева", role: "Основатель школы", emoji: "👩🏻‍💻" },
  { name: "Майдан Найманов", role: "ML-инженер, AI-архитектор", emoji: "🧑🏻‍💻" },
] as const;

/** verified всегда; иначе только в dev */
export function getVisibleHeroResults(): HeroResult[] {
  return heroResults.filter((r) => r.verified || SHOW_PLACEHOLDERS);
}
