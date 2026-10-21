"use client";

import { ENABLED_LOCALES, LOCALES, LOCALE_LABELS } from "@/i18n";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Переключатель RU/KZ. Неактивные локали (нет перевода) показываются disabled
 * с подсказкой — структура готова, перевод добавляется в i18n/dictionaries/kz.ts.
 */
export function LangSwitch({ className, invert }: { className?: string; invert?: boolean }) {
  const { locale, setLocale, t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        "inline-flex h-10 items-center gap-0.5 rounded-pill p-1 text-[13px] font-semibold",
        invert ? "bg-white/10" : "bg-ink/[0.06]",
        className,
      )}
    >
      {LOCALES.map((l) => {
        const enabled = ENABLED_LOCALES.includes(l);
        const isActive = l === locale;
        return (
          <button
            key={l}
            type="button"
            disabled={!enabled}
            aria-pressed={isActive}
            title={enabled ? undefined : "Қазақша нұсқасы дайындалуда"}
            onClick={() => setLocale(l)}
            className={cn(
              "h-8 rounded-pill px-2.5 transition-colors",
              isActive
                ? invert
                  ? "bg-white text-ink"
                  : "bg-surface text-ink shadow-soft"
                : invert
                  ? "text-white/70 hover:text-white"
                  : "text-ink-500 hover:text-ink",
              !enabled && "cursor-not-allowed opacity-40 hover:text-inherit",
            )}
          >
            {LOCALE_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
