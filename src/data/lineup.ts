import "server-only";
import { directionPages, type Direction } from "./products";

/** Направления школы: название, подзаголовок и страница направления (шаг 5a) */
export const directions: Record<Direction, { name: string; tagline: string; path: string; pitch: string }> = {
  creator: { name: "AI-креаторство", tagline: "ИИ-ролики и контент на заказ", path: directionPages.creator, pitch: "Делать ИИ-ролики и контент на заказ" },
  vibecoding: { name: "Вайб-кодинг", tagline: "сайты, боты и автоматизации без кода", path: directionPages.vibecoding, pitch: "Собирать сайты, ботов и автоматизации без кода" },
};

/**
 * Тексты блока «Продуктовая линейка» на главной (шаг 3a). Названия продуктов, цены, форматы и ссылки — в products.ts.
 * Подписи вкладок, заголовок и текст кнопки помощи заданы в ТЗ шага 3a.
 */
export const lineup = {
  id: "lineup",
  title: "Два направления — выберите своё",
  subtitle: "У каждого своя лестница: начните с первой ступени",
  tabs: [
    { id: "creator", label: `${directions.creator.name}: ${directions.creator.tagline}` },
    { id: "vibecoding", label: `${directions.vibecoding.name}: ${directions.vibecoding.tagline}` },
  ] satisfies { id: Direction; label: string }[],
  /** Подзаголовок «Программ» на странице направления */
  ladderSubtitle: { creator: "Два шага: от практикума до курса", vibecoding: "Три шага: от эфира до курса" } satisfies Record<Direction, string>,
  help: { label: "Не знаю, с чего начать", whatsappText: "Помогите выбрать программу" },
  /** Пилюля у входной ступени */
  entryBadge: "Начните с этого",
} as const;

/**
 * Чипы-ссылки «Для кого» в линейке: название и адрес — из audiences.ts (аудитория) или products.ts (продукт).
 * label — явная подпись, когда она короче названия в меню («Новичкам»).
 */
export const lineupForWhomChips: Record<Direction, ({ audience: "business" | "freelancers" | "career" } | { product: "practicum"; label: string })[]> = {
  creator: [{ product: "practicum", label: "Новичкам" }],
  vibecoding: [{ audience: "business" }, { audience: "freelancers" }, { audience: "career" }],
};

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

/** «Результаты учеников»: подписи вкладок */
export const resultsTabs: { id: Direction; label: string }[] = [
  { id: "creator", label: "Креаторство" },
  { id: "vibecoding", label: "Вайб-кодинг" },
];
