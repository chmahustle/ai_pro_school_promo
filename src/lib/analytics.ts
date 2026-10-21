"use client";

/**
 * Единый модуль аналитики. Все пиксели подключаются в <Analytics/> (layout),
 * а события отправляются через track(). Если ID пикселя не задан — вызов
 * молча игнорируется, поэтому модуль безопасно использовать везде.
 *
 * События:
 *   page_view        — просмотр страницы (авто, из <Analytics/>)
 *   view_landing     — просмотр ЦА-лендинга {audience}
 *   cta_click        — клик по CTA {label, location}
 *   lead_start       — пользователь начал заполнять форму
 *   lead_submit      — форма отправлена {audience, course}
 *   lead_success     — заявка принята (страница /thanks)
 *   messenger_click  — клик по WhatsApp/Telegram
 */

export type AnalyticsEvent =
  | { name: "page_view"; params: { path: string } }
  | { name: "view_landing"; params: { audience: string } }
  | { name: "cta_click"; params: { label: string; location: string } }
  | { name: "lead_start"; params: { form_id: string } }
  | { name: "lead_submit"; params: { form_id: string; audience?: string; course?: string } }
  | { name: "lead_success"; params: { source?: string } }
  | { name: "messenger_click"; params: { channel: "whatsapp" | "telegram" } };

export const analyticsIds = {
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  yandexMetrika: process.env.NEXT_PUBLIC_YM_ID ?? "",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: { track: (...args: any[]) => void; page: () => void };
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    ym?: (...args: any[]) => void;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Маппинг наших событий на стандартные события пикселей */
const META_MAP: Partial<Record<AnalyticsEvent["name"], string>> = {
  view_landing: "ViewContent",
  lead_submit: "Lead",
  lead_success: "CompleteRegistration",
  messenger_click: "Contact",
};
const TIKTOK_MAP: Partial<Record<AnalyticsEvent["name"], string>> = {
  view_landing: "ViewContent",
  lead_submit: "SubmitForm",
  lead_success: "CompleteRegistration",
  messenger_click: "Contact",
};

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const { name, params } = event;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, params);
  }

  // Meta Pixel
  if (window.fbq && analyticsIds.metaPixel) {
    const std = META_MAP[name];
    if (name === "page_view") window.fbq("track", "PageView");
    else if (std) window.fbq("track", std, params);
    else window.fbq("trackCustom", name, params);
  }

  // TikTok Pixel
  if (window.ttq && analyticsIds.tiktokPixel) {
    const std = TIKTOK_MAP[name];
    if (name === "page_view") window.ttq.page();
    else window.ttq.track(std ?? name, params);
  }

  // GA4
  if (window.gtag && analyticsIds.ga4) {
    if (name === "page_view") {
      window.gtag("event", "page_view", { page_path: params.path });
    } else {
      window.gtag("event", name, params);
    }
  }

  // Яндекс.Метрика
  if (window.ym && analyticsIds.yandexMetrika) {
    const id = Number(analyticsIds.yandexMetrika);
    if (name === "page_view") window.ym(id, "hit", params.path);
    else window.ym(id, "reachGoal", name, params);
  }
}
