import type { Dictionary } from "./ru";

/**
 * Казахский словарь — заготовка. Заполняется постепенно; отсутствующие ключи
 * автоматически берутся из RU (см. i18n/index.ts → mergeDeep).
 * TODO(клиент): перевод.
 */
export const kz: DeepPartial<Dictionary> = {
  nav: {
    directions: "Бағыттар",
    forWhom: "Кімге",
    courses: "Курстар",
    results: "Нәтижелер",
    about: "Біз туралы",
    blog: "Блог",
    contacts: "Байланыс",
    login: "Кіру",
    apply: "Өтінім қалдыру",
    menu: "Мәзір",
    close: "Жабу",
    allCourses: "Барлық курстар",
    language: "Тіл",
  },
  common: {
    learnMore: "Толығырақ",
    apply: "Өтінім қалдыру",
  },
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
