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

/** Строка «для кого» под вкладкой направления */
export const lineupForWhom: Record<Direction, string> = {
  creator: "Новички и контентщики",
  vibecoding: "Бизнес, фрилансеры и специалисты в найме",
};

/** «Выберите свой путь»: две шапки-группы; какая аудитория к какому направлению относится */
export const audienceGroups: { direction: Direction; title: string; slugs: ("beginners" | "business" | "freelancers" | "career")[] }[] = [
  // Фрилансеров-контентщиков (отдельной карточки и лендинга) в данных нет — не добавляем, пока их нет в audiences.ts
  { direction: "creator", title: "AI-креаторство", slugs: ["beginners"] },
  { direction: "vibecoding", title: "Вайб-кодинг", slugs: ["business", "freelancers", "career"] },
];

/** «Как это работает»: переключатель путей */
export const pathTabs: { id: Direction; label: string }[] = [
  { id: "creator", label: "Креаторство" },
  { id: "vibecoding", label: "Вайб-кодинг" },
];

/** Последний шаг пути вайб-кодинга: проект для компании-партнёра (из описания курса в products.ts → resultLine) */
export const partnerProjectStep = { title: "Проект для компании-партнёра" } as const;

/** «Результаты учеников»: подписи вкладок */
export const resultsTabs: { id: Direction; label: string }[] = [
  { id: "creator", label: "Креаторство" },
  { id: "vibecoding", label: "Вайб-кодинг" },
];
