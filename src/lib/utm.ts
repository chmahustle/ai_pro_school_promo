"use client";

/**
 * Сохранение UTM-меток, источника перехода и первой страницы, чтобы передать их в заявке.
 * Пишем в sessionStorage при первом заходе и не перезаписываем внутри сессии (first-touch в рамках сессии).
 * Хранятся: utm_source/medium/campaign/content/term, referrer, первая страница, fbclid/ttclid/gclid/yclid.
 * Cookies _fbp и _fbc читаются в момент отправки заявки (пиксель выставляет их уже после первого захода).
 * Любые обращения к sessionStorage/cookie — в try/catch (приватный режим, запрет cookie).
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

/** Читает cookie по имени (в try/catch: доступ может быть запрещён) */
export function readCookie(name: string): string | undefined {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    return m?.[1] ? decodeURIComponent(m[1]) : undefined;
  } catch {
    return undefined;
  }
}

/** Всё, что уходит в заявку вместе с формой */
export interface Attribution {
  /** utm_* и click-id (fbclid, ttclid, gclid, yclid) первого захода */
  utm: Record<string, string>;
  referrer?: string;
  /** Первая страница сессии */
  firstPage?: string;
  fbp?: string;
  fbc?: string;
  ttclid?: string;
}

/**
 * Атрибуция на момент отправки: сохранённые first-touch данные + свежие cookies _fbp/_fbc.
 * Нет cookie _fbc, но заход был с fbclid — собираем fbc в формате Meta: fb.1.<время захода, мс>.<fbclid>.
 */
export function getAttribution(): Attribution {
  const stored = getUtm();
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = stored[key];
    if (v) utm[key] = v;
  }
  const seenMs = stored.first_seen_at ? Date.parse(stored.first_seen_at) : Date.now();
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc") ?? (stored.fbclid ? `fb.1.${Number.isNaN(seenMs) ? Date.now() : seenMs}.${stored.fbclid}` : undefined);
  return {
    utm,
    referrer: stored.referrer,
    firstPage: stored.landing_page,
    fbp,
    fbc,
    ttclid: stored.ttclid,
  };
}

/** Сегмент заявки: лендинг /for/<segment> → segment, иначе utm_content */
export function getSegment(pathname: string, utm: Record<string, string>): string | undefined {
  const m = pathname.match(/^\/for\/([^/?#]+)/);
  return m?.[1] ?? utm.utm_content ?? undefined;
}
