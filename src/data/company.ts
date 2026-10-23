import "server-only";
/**
 * Юридические реквизиты для футера и оферты.
 * TODO(клиент): заполнить real legalName / БИН / адрес.
 */
export const company = {
  /** ИП / ТОО — для «© …» */
  legalName: "",
  /** БИН или ИИН */
  bin: "",
  /** Юридический адрес */
  address: "",
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
