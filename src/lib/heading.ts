import type { ReactNode } from "react";

/** Заголовок длиннее этого числа символов набирается на ступень мельче */
export const LONG_TITLE_CHARS = 50;

export const isLongTitle = (title: ReactNode): boolean => typeof title === "string" && title.length > LONG_TITLE_CHARS;

/**
 * Единое правило размера заголовков блоков: длинный текст (> 50 символов) — на ступень меньше
 * (display-lg → display-md, display-md → display-sm). Применять в общих компонентах заголовков, не точечно.
 */
export function headingSize(title: ReactNode, base: "lg" | "md" = "md"): string {
  if (base === "lg") return isLongTitle(title) ? "text-display-md" : "text-display-lg";
  return isLongTitle(title) ? "text-display-sm" : "text-display-md";
}

/** Ширина колонки заголовка: обычная 22ch, у длинных — не уже 30ch */
export const headingMaxWidth = (title: ReactNode): string => (isLongTitle(title) ? "max-w-[30ch]" : "max-w-[22ch]");
