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
} as const;

export type Company = typeof company;
