import type { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Название продукта внутри предложения: «Курс AI Content Creator» → «Курс AI Content Creator» в кавычках,
 * а если в названии уже есть кавычки («Практикум «Вирусные ИИ-ролики»») — без внешних, чтобы не получить ««…»».
 * Первая буква общего слова («Практикум», «Курс») — строчная, аббревиатуры не трогаем.
 */
export function nameInSentence(name: string): string {
  const lowered = /^\p{Lu}\p{Ll}/u.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name;
  return name.includes("«") ? lowered : `«${name}»`;
}

/**
 * Неразрывный пробел перед длинным тире: « — » → «\u00A0— », чтобы тире не оказывалось в начале строки.
 * Применять к заголовкам и подзаголовкам (SectionIntro, hero, карточки) — не править тексты вручную.
 * Не строки (ReactNode с разметкой) возвращаются как есть.
 */
export function nbspDash<T extends ReactNode>(value: T): T {
  return (typeof value === "string" ? value.replace(/ — /g, "\u00A0— ") : value) as T;
}

/**
 * twMerge, который знает наши размеры шрифта из @theme (--text-display-*): без этого `text-display-md` считался цветом
 * и вырезался соседним `text-ink`. Новый размер добавлять и сюда, и в globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display-xl", "display-lg", "display-md", "display-sm"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1500000 → "1 500 000" (неразрывные пробелы) */
export function formatNumber(n: number, locale = "ru-RU") {
  return new Intl.NumberFormat(locale).format(n).replace(/\u00a0/g, "\u202f");
}

/** 1500000 → "1 500 000 ₸" */
export function formatTenge(n: number) {
  return `${formatNumber(n)}\u00a0₸`;
}

/** 50_000_000 → "50 млн", 70_000 → "70 тыс." */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1).replace(".", ",")} млн`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1).replace(".", ",")} тыс.`;
  }
  return String(n);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
