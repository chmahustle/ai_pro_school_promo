import { after, NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads/schema";
import { getLeadAdapter } from "@/lib/leads/adapters";
import { sendCapiEvent } from "@/lib/capi";

export const runtime = "nodejs";

/** Простейший rate-limit в памяти (на инстанс): 10 заявок / 10 минут с одного IP */
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 10;

function rateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Слишком много запросов. Попробуйте позже." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ ok: false, error: first?.message ?? "Проверьте поля формы" }, { status: 422 });
  }

  // Honeypot заполнен → отвечаем обычным успехом, дальше не передаём, факт логируем (без персональных данных)
  if (parsed.data.website) {
    console.warn("[leads] honeypot triggered, lead dropped", { ip, formId: parsed.data.formId, page: parsed.data.page });
    return NextResponse.json({ ok: true });
  }

  try {
    const adapter = getLeadAdapter();
    const result = await adapter.deliver(parsed.data);
    if (!result.ok) {
      console.error("[leads] delivery failed", adapter.name, result.error);
      return NextResponse.json({ ok: false, error: "Не удалось отправить заявку" }, { status: 502 });
    }
    // Lead в Meta CAPI — после ответа, чтобы не задерживать посетителя; сбой CAPI на заявку не влияет
    const lead = parsed.data;
    if (lead.eventId) {
      const eventId = lead.eventId;
      const userAgent = req.headers.get("user-agent") ?? undefined;
      const cookies = req.headers.get("cookie");
      const cookie = (name: string) => {
        const m = cookies?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
        return m?.[1] ? decodeURIComponent(m[1]) : undefined;
      };
      after(async () => {
        try {
          await sendCapiEvent({
            eventName: "Lead",
            eventId,
            eventSourceUrl: lead.page ? new URL(lead.page, req.headers.get("origin") ?? `https://${req.headers.get("host") ?? "localhost"}`).href : undefined,
            ip: ip === "unknown" ? undefined : ip,
            userAgent,
            fbp: lead.fbp ?? cookie("_fbp"),
            fbc: lead.fbc ?? cookie("_fbc"),
            name: lead.name,
            phone: lead.phone,
            customData: { product: lead.product },
          });
        } catch {
          // тихо
        }
      });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("[leads] unexpected", e);
    return NextResponse.json({ ok: false, error: "Внутренняя ошибка" }, { status: 500 });
  }
}
