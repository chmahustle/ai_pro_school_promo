import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads/schema";
import { getLeadAdapter } from "@/lib/leads/adapters";

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

  // Honeypot заполнен → делаем вид, что всё ок, но не отправляем
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }

  try {
    const adapter = getLeadAdapter();
    const result = await adapter.deliver(parsed.data);
    if (!result.ok) {
      console.error("[leads] delivery failed", adapter.name, result.error);
      return NextResponse.json({ ok: false, error: "Не удалось отправить заявку" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("[leads] unexpected", e);
    return NextResponse.json({ ok: false, error: "Внутренняя ошибка" }, { status: 500 });
  }
}
