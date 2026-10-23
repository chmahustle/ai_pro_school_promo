import "server-only";
/**
 * Тексты и настройки форм заявок. Формулировка согласия — в company.ts (privacyConsent).
 */
export const formConfig = {
  /** Обещание под кнопкой. Источник — разбор сайта 22.10.2026; поменять срок можно только здесь */
  responseNote: {
    text: "Ответим в WhatsApp в течение 5 минут",
    source: "разбор сайта 22.10.2026",
    asOf: "2026-10-22",
  },
  /** Вариант «Не знаю» в списке продуктов */
  generalOption: { value: "general", label: "Не знаю, помогите выбрать" },
  /** Текст сообщения в WhatsApp для «Не знаю» (у продуктов — whatsappText из products.ts) */
  generalWhatsappText: "Здравствуйте! Помогите выбрать программу",
} as const;
