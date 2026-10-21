"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, ENABLED_LOCALES, getDictionary, type Dictionary, type Locale } from "./index";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const COOKIE = "aps_locale";

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Восстанавливаем сохранённую локаль после гидратации (страницы статические, cookie читаем на клиенте)
  useEffect(() => {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(ru|kz)`));
    const saved = m?.[1] as Locale | undefined;
    if (saved && saved !== initialLocale && ENABLED_LOCALES.includes(saved)) {
      setLocaleState(saved);
      document.documentElement.lang = saved === "kz" ? "kk" : "ru";
    }
  }, [initialLocale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = l === "kz" ? "kk" : "ru";
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: getDictionary(locale) }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}

/** Короткий хук для строк интерфейса */
export function useT() {
  return useLocale().t;
}
