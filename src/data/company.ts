import "server-only";
import { site } from "@/lib/site";

/**
 * Данные школы для футера и юридических блоков. Сами документы (политика, оферта) - в src/data/legalDocs.ts.
 */
export const company = {
  /** Описание под логотипом в футере */
  description: "Практическое обучение ИИ: ИИ-контент, вайб-кодинг, автоматизация. Для новичков, фрилансеров, бизнеса и специалистов в найме.",
  /**
   * Реквизиты ТОО - единственный источник для футеров, /contacts и подписей форм.
   * Банковские реквизиты (банк, БИК, КБе, счёт) сюда и на сайт не добавляем (scripts/check-payload.mjs следит за утечкой).
   */
  legalName: "ТОО «AI PRO SCHOOL»",
  bin: "251140018138",
  address: "район Нұра, улица Санжар Асфендияров, дом 12, кв/офис 59, Казахстан",
  website: "https://ai-pro-school.kz",
  /** Год в копирайте футеров: считается при сборке/рендере на сервере, не в браузере (нет расхождения при гидратации) */
  copyrightYear: new Date().getFullYear(),
  /**
   * Контакты и соцсети для футера. Пустой URL - иконка/ссылка не показывается. Значения живут в lib/site.ts (общие с контактами и разметкой),
   * здесь - единая точка для футера.
   */
  contacts: {
    phone: site.phones.primary,
    phoneRaw: site.phones.primaryRaw,
    whatsapp: site.whatsapp,
    social: { instagram: site.socials.instagram, tiktok: site.socials.tiktok, youtube: site.socials.youtube },
  },
} as const;

export type Company = typeof company;
