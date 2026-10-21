/**
 * Глобальные константы сайта. Источник: ai-pro-school.kz (окт. 2026).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-pro-school.kz"
).replace(/\/$/, "");

export const site = {
  name: "AI Pro School",
  legalName: "AI Pro School", // TODO: юридическое лицо (ИП/ТОО) для футера и оферты
  tagline: "Онлайн-школа ИИ в Казахстане",
  description:
    "Практическое обучение заработку на ИИ: ИИ-контент, вайбкодинг, автоматизация. Для новичков, фрилансеров, бизнеса и специалистов в найме.",
  locale: "ru_KZ",
  country: "Казахстан",
  city: "Астана", // TODO: уточнить город для контактов/офлайн-формата

  phones: {
    // Источник: wa.me-ссылки на текущем сайте
    primary: "+7 700 506 60 01",
    primaryRaw: "77005066001",
    secondary: "+7 700 506 60 02",
    secondaryRaw: "77005066002",
  },
  whatsapp: "https://wa.me/77005066001",
  telegram: "", // TODO: ссылка на Telegram-канал/бота, если есть
  email: "", // TODO: контактный e-mail

  socials: {
    instagram: "https://www.instagram.com/ai_pro_school",
    tiktok: "https://www.tiktok.com/@nadira_batyrbaeva",
    youtube: "https://youtube.com/@nadira_batyrbayeva",
  },

  /** Собственная платформа ИИ-креаторов (упоминается на практикуме) */
  platformUrl: "https://strimmeo.com",

  /** Существующая оферта (Tilda). TODO: перенести на /privacy */
  legacyOfferUrl: "https://nadira-school.kz/public",
} as const;

export type Site = typeof site;
