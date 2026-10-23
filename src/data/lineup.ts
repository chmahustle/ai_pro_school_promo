import "server-only";
import type { Direction } from "./products";

/**
 * Тексты блока «Продуктовая линейка» на главной (шаг 3a). Названия продуктов, цены, форматы и ссылки — в products.ts.
 * Подписи вкладок, заголовок и текст кнопки помощи заданы в ТЗ шага 3a.
 */
export const lineup = {
  id: "lineup",
  title: "Два направления — выберите своё",
  subtitle: "У каждого своя лестница: начните с первой ступени",
  tabs: [
    { id: "creator", label: "AI-креаторство: ИИ-ролики и контент на заказ" },
    { id: "vibecoding", label: "Вайб-кодинг: сайты, боты и автоматизации без кода" },
  ] satisfies { id: Direction; label: string }[],
  help: { label: "Не знаю, с чего начать", whatsappText: "Помогите выбрать программу" },
  /** Пилюля у входной ступени */
  entryBadge: "Начните с этого",
} as const;

/**
 * Строка «для кого» под вкладкой: названия аудиторий из действующих страниц курсов (courses.ts → forWhom), первые три.
 * TODO(клиент): утвердить формулировку «для кого» для каждого направления.
 */
export const lineupForWhomSource = { creator: "ai-creator", vibecoding: "vibecoding" } as const;
