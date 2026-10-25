import type { Dictionary } from "@/i18n";

export interface NavLink {
  key: keyof Dictionary["nav"];
  href: string;
}

/** Основные пункты хедера (кроме «Направления» — оно отдельное, с выпадающим меню) */
export const mainNav: NavLink[] = [
  { key: "results", href: "/reviews" },
  { key: "about", href: "/about" },
];

/** Куда ведёт кнопка «Подобрать программу» в шапке: блок «Продуктовая линейка» на главной */
export const PICK_PROGRAM_HREF = "/#lineup";

/** Кабинет Strimmeo (ссылка в футере). TODO(клиент): адрес ЛК (GetCourse / своя платформа) */
export const LOGIN_URL = "https://strimmeo.com";
