"use client";

/**
 * Единый модуль аналитики. Пиксели подключаются в <Analytics/> (layout, только production),
 * события отправляются через track(). Если ID системы не задан или скрипт не загружен — вызов молча игнорируется.
 *
 * События:
 *   page_view        — просмотр страницы (авто, из <Analytics/>)
 *   view_landing     — просмотр ЦА-лендинга {audience}
 *   cta_click        — клик по CTA {label, location}
 *   lead_start       — пользователь начал заполнять форму
 *   lead_submit      — форма отправлена (кастомное событие, не стандартный Lead)
 *   lead_success     — заявка принята (кастомное событие)
 *   lead             — Lead: подтверждённая заявка (trackLead; подключается на /thanks)
 *   contact          — Contact: клик по ссылке/кнопке WhatsApp (авто, из <Analytics/>; trackContact)
 *
 * Lead и Contact уходят во все подключённые системы и дублируются на сервер в Meta Conversions API (/api/capi)
 * с тем же event_id, что и браузерное событие, — Meta дедуплицирует их.
 */
import type { ProductId } from "@/data/product-ids";

export interface LeadParams {
  product?: ProductId | null;
  page: string;
  form_id?: string;
}
export interface ContactParams {
  product?: ProductId | null;
  page: string;
  channel: "whatsapp";
}

export type AnalyticsEvent =
  | { name: "page_view"; params: { path: string } }
  | { name: "view_landing"; params: { audience: string } }
  | { name: "cta_click"; params: { label: string; location: string } }
  | { name: "lead_start"; params: { form_id: string } }
  | { name: "lead_submit"; params: { form_id: string; audience?: string; course?: string } }
  | { name: "lead_success"; params: { source?: string } }
  | { name: "lead"; params: LeadParams }
  | { name: "contact"; params: ContactParams };

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

/** Стандартные события пикселей для наших событий; всё остальное уходит как кастомное с исходным именем */
const META_MAP: Partial<Record<AnalyticsEvent["name"], string>> = {
  view_landing: "ViewContent",
  lead: "Lead",
  contact: "Contact",
};
const TIKTOK_MAP: Partial<Record<AnalyticsEvent["name"], string>> = {
  view_landing: "ViewContent",
  lead: "SubmitForm",
  contact: "Contact",
};
const GA4_MAP: Partial<Record<AnalyticsEvent["name"], string>> = {
  lead: "generate_lead",
};

/** Идентификатор события — общий у браузерного пикселя и CAPI (дедупликация) */
export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function send(event: AnalyticsEvent, eventId: string) {
  if (typeof window === "undefined") return;
  const { name, params } = event;
  const p = params as Record<string, unknown>;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, params, eventId);
  }

  // Meta Pixel: eventID — для дедупликации с Conversions API
  if (window.fbq && analyticsIds.metaPixel) {
    const std = META_MAP[name];
    if (name === "page_view") window.fbq("track", "PageView", {}, { eventID: eventId });
    else if (std) window.fbq("track", std, p, { eventID: eventId });
    else window.fbq("trackCustom", name, p, { eventID: eventId });
  }

  // TikTok Pixel
  if (window.ttq && analyticsIds.tiktokPixel) {
    const std = TIKTOK_MAP[name];
    if (name === "page_view") window.ttq.page();
    else window.ttq.track(std ?? name, p, { event_id: eventId });
  }

  // GA4
  if (window.gtag && analyticsIds.ga4) {
    if (name === "page_view") window.gtag("event", "page_view", { page_path: p.path });
    else window.gtag("event", GA4_MAP[name] ?? name, p);
  }

  // Яндекс.Метрика
  if (window.ym && analyticsIds.yandexMetrika) {
    const id = Number(analyticsIds.yandexMetrika);
    if (name === "page_view") window.ym(id, "hit", p.path);
    else window.ym(id, "reachGoal", name, p);
  }
}

/** Отправить событие во все подключённые системы. Можно track({name, params}) или track(name, params). */
export function track(event: AnalyticsEvent): void;
export function track<N extends AnalyticsEvent["name"]>(name: N, params: Extract<AnalyticsEvent, { name: N }>["params"]): void;
export function track(arg: AnalyticsEvent | AnalyticsEvent["name"], params?: unknown): void {
  const event = (typeof arg === "string" ? { name: arg, params } : arg) as AnalyticsEvent;
  send(event, newEventId());
}

/** Данные для Conversions API */
interface CapiPayload {
  event: "Lead" | "Contact";
  eventId: string;
  url: string;
  product?: ProductId | null;
  name?: string;
  phone?: string;
}

/** Серверная копия события для Meta CAPI. Если токена на сервере нет — /api/capi тихо пропустит. */
function sendToCapi(payload: CapiPayload) {
  // Только production и только если подключён Meta Pixel (event_id имеет смысл лишь вместе с браузерным событием)
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined" || !analyticsIds.metaPixel) return;
  try {
    void fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // аналитика не должна ломать страницу
  }
}

/** Contact: клик по ссылке/кнопке WhatsApp. product — id из products.ts. */
export function trackContact(params: ContactParams): string {
  const eventId = newEventId();
  send({ name: "contact", params }, eventId);
  sendToCapi({ event: "Contact", eventId, url: window.location.href, product: params.product });
  return eventId;
}

/**
 * Lead: подтверждённая заявка. Подключается на /thanks (следующий шаг).
 * Имя и телефон в пиксели НЕ уходят — только в CAPI, где сервер хэширует их SHA-256.
 */
export function trackLead(params: LeadParams & { name?: string; phone?: string }): string {
  const { name, phone, ...pixelParams } = params;
  const eventId = newEventId();
  send({ name: "lead", params: pixelParams }, eventId);
  sendToCapi({ event: "Lead", eventId, url: window.location.href, product: params.product, name, phone });
  return eventId;
}
