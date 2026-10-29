import "server-only";
import type { Partner } from "./types";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/**
 * Полоса «Где нас видели».
 * На сайте: verified && logoPermission.
 * В dev / SHOW_PLACEHOLDERS - все записи (кроме удалённых), с PLACEHOLDER.
 *
 * Astana Hub / резидентство - не включаем, пока verified !== true.
 * Казахтелеком - убран (клиент ученицы, не школы).
 *
 * TODO(клиент): подтвердить verified + logoPermission, прислать файлы логотипов.
 */
export const partners: Partner[] = [
  {
    id: "aipreneurs",
    name: "Ai'Preneurs",
    logo: null,
    relation: "graduate",
    verified: true,
    logoPermission: false, // TODO: разрешение на логотип
    note: "Выпускница программы Ai'Preneurs (Надира).",
  },
  {
    id: "kcell",
    name: "Kcell Summit",
    logo: null,
    relation: "winner",
    verified: true,
    logoPermission: false, // TODO: разрешение на логотип
    note: "Победа Майдана Найманова на Kcell Summit.",
  },
  {
    id: "strimmeo",
    name: "Strimmeo",
    logo: null,
    url: "https://strimmeo.com",
    relation: "founders",
    verified: true,
    logoPermission: false, // TODO: разрешение на логотип
    note: "Основатели платформы Strimmeo.com",
  },
  {
    id: "technowomen",
    name: "TechnoWomen KZ",
    logo: null,
    textOnly: true, // TODO(клиент): прислать логотип TechnoWomen KZ - заменить текст на логотип
    relation: "partner",
    verified: true,
    logoPermission: true,
    note: "Партнёр школы (подтверждено владельцем 2026-10-30).",
  },
  {
    id: "it-ayel",
    name: "IT Ayel",
    logo: null,
    relation: "speaker",
    verified: false, // TODO: подтвердить спикерство → true
    logoPermission: false,
    note: "Спикер - только после verified.",
  },
];

/** Прод: verified && logoPermission && есть файл логотипа (без логотипов полоса скрыта). Dev: все (для вёрстки). */
export function getVisiblePartners(): Partner[] {
  if (SHOW_PLACEHOLDERS) return partners;
  return partners.filter((p) => p.verified && p.logoPermission && (Boolean(p.logo) || p.textOnly === true));
}

/** @deprecated используйте getVisiblePartners */
export const publishedPartners = partners.filter((p) => p.verified && p.logoPermission);
