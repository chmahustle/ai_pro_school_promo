import { NextResponse } from "next/server";
import { z } from "zod";
import { sendCapiEvent } from "@/lib/capi";

export const runtime = "nodejs";

/** Тело запроса от браузера (lib/analytics.ts → sendToCapi). Токена тут нет и быть не может. */
const bodySchema = z.object({
  event: z.enum(["Lead", "Contact"]),
  eventId: z.string().min(8).max(100),
  url: z.string().url().max(2000).optional(),
  product: z.string().max(40).nullish(),
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
});

/** Мягкий rate-limit в памяти: 60 событий в минуту с одного IP */
const hits = new Map<string, { count: number; ts: number }>();
function limited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > 60;
}

function cookie(header: string | null, name: string): string | undefined {
  const m = header?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m?.[1] ? decodeURIComponent(m[1]) : undefined;
}

/**
 * POST /api/capi — серверная копия браузерного события для Meta Conversions API.
 * Всегда отвечает 200 {ok:true}: нет токена, ошибка Meta или неверный запрос не должны влиять на сайт.
 */
export async function POST(req: Request) {
  const ok = NextResponse.json({ ok: true });
  try {
    // Только со своего сайта: Origin должен совпадать с Host
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) return ok;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
    if (limited(ip ?? "unknown")) return ok;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return ok;
    const { event, eventId, url, product, name, phone } = parsed.data;

    const cookies = req.headers.get("cookie");
    await sendCapiEvent({
      eventName: event,
      eventId,
      eventSourceUrl: url ?? req.headers.get("referer") ?? undefined,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
      fbp: cookie(cookies, "_fbp"),
      fbc: cookie(cookies, "_fbc"),
      name,
      phone,
      customData: { product: product ?? undefined },
    });
  } catch {
    // тихо: аналитика не должна давать ошибок
  }
  return ok;
}
