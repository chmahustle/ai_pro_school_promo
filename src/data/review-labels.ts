import type { ReviewKind } from "./types";

/** Подписи типов отзывов (только текст — безопасно для клиента) */
export const reviewKindLabels: Record<ReviewKind, string> = {
  text: "Отзывы",
  video: "Видео",
  receipt: "Оплаты",
  chat: "Переписки",
};
