import { ru, type Dictionary } from "./dictionaries/ru";
import { kz, type DeepPartial } from "./dictionaries/kz";

export const LOCALES = ["ru", "kz"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_LABELS: Record<Locale, string> = { ru: "RU", kz: "KZ" };

/** Какие локали реально доступны для переключения (KZ включится, когда будет перевод) */
export const ENABLED_LOCALES: readonly Locale[] = ["ru"];

function mergeDeep<T extends object>(base: T, override: DeepPartial<T>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override) as (keyof T)[]) {
    const o = override[key];
    const b = base[key];
    if (o && typeof o === "object" && b && typeof b === "object") {
      out[key as string] = mergeDeep(b as object, o as DeepPartial<object>);
    } else if (o !== undefined) {
      out[key as string] = o;
    }
  }
  return out as T;
}

const dictionaries: Record<Locale, Dictionary> = {
  ru,
  kz: mergeDeep(ru, kz),
};

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? ru;
}

export type { Dictionary };
