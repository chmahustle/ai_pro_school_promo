/**
 * Чистые функции Meta Conversions API: нормализация, SHA-256, сборка события. Без секретов и без сети —
 * поэтому тестируются отдельно. Отправка и токен — в capi.ts (server-only).
 *
 * Правила Meta (developers.facebook.com → Conversions API → Customer Information Parameters):
 *   ph — убрать символы, буквы и ведущие нули, обязателен код страны (у нас 7XXXXXXXXXX); хэш SHA-256;
 *   fn/ln — нижний регистр, без знаков препинания; хэш SHA-256;
 *   client_ip_address, client_user_agent, fbc, fbp — НЕ хэшируются.
 */
import { createHash } from "node:crypto";

export const sha256 = (value: string): string => createHash("sha256").update(value, "utf8").digest("hex");

/** Телефон → только цифры в формате 7XXXXXXXXXX (Казахстан/Россия); не получилось — null */
export function normalizePhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) d = `7${d.slice(1)}`;
  if (d.length === 10) d = `7${d}`;
  return /^7\d{10}$/.test(d) ? d : null;
}

/** Имя → {fn, ln}: нижний регистр, без знаков препинания; первое слово — имя, последнее (если слов больше одного) — фамилия */
export function normalizeName(raw: string | undefined | null): { fn?: string; ln?: string } {
  if (!raw) return {};
  const words = raw
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
  if (words.length === 0) return {};
  return { fn: words[0], ln: words.length > 1 ? words[words.length - 1] : undefined };
}

export interface CapiEventInput {
  eventName: "Lead" | "Contact";
  /** Общий с браузерным событием — Meta дедуплицирует по event_id + event_name */
  eventId: string;
  eventSourceUrl?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  /** Исходные имя и телефон: хэшируются здесь, в открытом виде никуда не уходят */
  name?: string;
  phone?: string;
  customData?: Record<string, string | number | undefined>;
  /** Unix-время в секундах; по умолчанию — сейчас */
  eventTime?: number;
}

/** Событие в формате CAPI (user_data: хэшированные ph/fn/ln + нехэшированные IP, UA, fbp, fbc) */
export function buildCapiEvent(input: CapiEventInput) {
  const phone = normalizePhone(input.phone);
  const { fn, ln } = normalizeName(input.name);
  const userData: Record<string, string | string[]> = {};
  if (input.ip) userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (phone) userData.ph = [sha256(phone)];
  if (fn) userData.fn = [sha256(fn)];
  if (ln) userData.ln = [sha256(ln)];

  const customData = Object.fromEntries(Object.entries(input.customData ?? {}).filter(([, v]) => v !== undefined && v !== ""));

  return {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: "website" as const,
    ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
    user_data: userData,
    ...(Object.keys(customData).length > 0 ? { custom_data: customData } : {}),
  };
}
