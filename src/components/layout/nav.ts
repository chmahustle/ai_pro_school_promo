import type { Dictionary } from "@/i18n";

export interface NavLink {
  key: keyof Dictionary["nav"];
  href: string;
}

/** Основные пункты хедера (кроме «Для кого» — он отдельный, с mega-menu) */
export const mainNav: NavLink[] = [
  { key: "courses", href: "/courses" },
  { key: "results", href: "/reviews" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
];

/** Куда ведёт кнопка «Подобрать программу» в шапке: блок «Продуктовая линейка» на главной */
export const PICK_PROGRAM_HREF = "/#lineup";

/** Страницы направлений — пункты меню (названия — как в src/data/lineup.ts → directions) */
export const directionNav = [
  { label: "AI-креаторство", href: "/courses/creator" },
  { label: "Вайб-кодинг", href: "/courses/vibecoding" },
] as const;

/** Ссылка «Вход» — личный кабинет / платформа. TODO(клиент): адрес ЛК (GetCourse / своя платформа) */
export const LOGIN_URL = "https://strimmeo.com";
