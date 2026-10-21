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
} as const;

export type Company = typeof company;
