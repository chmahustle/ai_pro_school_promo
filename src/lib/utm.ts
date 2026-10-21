"use client";

/**
 * Сохранение UTM-меток и источника перехода, чтобы передать их в заявке.
 * Пишем в sessionStorage при первом заходе и не перезаписываем внутри сессии
 * (first-touch в рамках сессии).
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ttclid",
  "gclid",
  "yclid",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>> & {
  landing_page?: string;
  referrer?: string;
  first_seen_at?: string;
};

const STORAGE_KEY = "aps_utm";

export function captureUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as UtmParams;

    const params = new URLSearchParams(window.location.search);
    const utm: UtmParams = {
      landing_page: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
      first_seen_at: new Date().toISOString(),
    };
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) utm[key] = v;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    return utm;
  } catch {
    return {};
  }
}

export function getUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : captureUtm();
  } catch {
    return {};
  }
}
