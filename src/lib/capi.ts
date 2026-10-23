import "server-only";
/**
 * Meta Conversions API (серверная отправка событий). Токен и тестовый код — только из env на сервере:
 *   META_CAPI_TOKEN        — токен доступа (обязателен для отправки)
 *   META_TEST_EVENT_CODE   — необязательный код из Events Manager → Test Events (только для проверки)
 *   NEXT_PUBLIC_META_PIXEL_ID — ID пикселя (тот же, что в браузере)
 * Нет токена или ID пикселя — событие тихо пропускается, без ошибок.
 */
import { buildCapiEvent, type CapiEventInput } from "./capi-core";

/**
 * Версия Graph API. Взята из документации Meta: страница «Graph API → Changelog» (последняя версия v26.0, опубликована
 * 29.07.2026) и пример запроса в «Conversions API → Using the API» (https://graph.facebook.com/v26.0/<PIXEL_ID>/events).
 * При обновлении сверяйтесь с https://developers.facebook.com/docs/graph-api/changelog/
 */
export const GRAPH_API_VERSION = "v26.0";

export interface SendCapiResult {
  sent: boolean;
  skipped?: "no-token" | "no-pixel";
  status?: number;
}

export async function sendCapiEvent(input: CapiEventInput): Promise<SendCapiResult> {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token) return { sent: false, skipped: "no-token" };
  if (!pixelId) return { sent: false, skipped: "no-pixel" };

  const body: Record<string, unknown> = { data: [buildCapiEvent(input)] };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    return { sent: res.ok, status: res.status };
  } catch {
    // сетевые сбои CAPI не должны ломать сайт
    return { sent: false };
  }
}
