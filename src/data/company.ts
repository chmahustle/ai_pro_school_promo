import "server-only";
import { site } from "@/lib/site";

/**
 * Данные школы для футера и юридических страниц.
 * TODO(клиент): заполнить реквизиты (legal) и поставить legal.verified: true.
 */
export const company = {
  /** Описание под логотипом в футере */
  description: "Практическое обучение ИИ: ИИ-контент, вайб-кодинг, автоматизация. Для новичков, фрилансеров, бизнеса и специалистов в найме.",
  /**
   * Реквизиты. В футере «© 2026 {name}» и БИН/адрес — только когда name и bin заполнены и verified: true;
   * иначе «© 2026 AI Pro School».
   */
  legal: {
    /** ИП / ТОО */
    name: "",
    /** БИН или ИИН */
    bin: "",
    /** Юридический адрес (необязательно) */
    address: "",
    /** Реквизиты подтверждены школой */
    verified: false,
  },
  /**
   * Контакты и соцсети для футера. Пустой URL — иконка/ссылка не показывается. Значения живут в lib/site.ts (общие с контактами и разметкой),
   * здесь — единая точка для футера.
   */
  contacts: {
    phone: site.phones.primary,
    phoneRaw: site.phones.primaryRaw,
    whatsapp: site.whatsapp,
    social: { instagram: site.socials.instagram, tiktok: site.socials.tiktok, youtube: site.socials.youtube },
  },
  /**
   * Публичная оферта: ссылка в футере только когда offerApproved: true и offerUrl — страница на домене сайта
   * («/offer» или адрес на нашем домене). Старая оферта (nadira-school.kz) в футере не показывается.
   */
  offerApproved: false,
  offerUrl: "",
  /**
   * Политику конфиденциальности (/privacy) утвердил юрист школы. Пока false: в dev на странице видна пометка,
   * а production-сборка печатает предупреждение (scripts/check-legal.mjs). Переключать вручную после утверждения.
   */
  privacyApproved: false,
  /**
   * Формулировка согласия под кнопкой формы (без чекбокса). Единое место: окончательную редакцию утвердит юрист школы.
   * Ссылка — на слове linkText.
   */
  privacyConsent: {
    before: "Отправляя форму, вы соглашаетесь с ",
    linkText: "политикой конфиденциальности",
    href: "/privacy",
  },
} as const;

export type Company = typeof company;
