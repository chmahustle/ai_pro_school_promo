import "server-only";
import type { Lead } from "./schema";
import { products } from "@/data/products";

function productLabel(id: string): string {
  return products.find((p) => p.id === id)?.name ?? "Не знаю, помогите выбрать";
}

/**
 * Серверные адаптеры доставки заявок. Выбирается через LEADS_ADAPTER в .env.
 * Все адаптеры принимают нормализованный Lead и возвращают { ok, id? }.
 *
 *  mock      — логирует в консоль (dev / до подключения CRM)
 *  webhook   — POST JSON на LEADS_WEBHOOK_URL (amoCRM/Bitrix24 через Make/n8n/Albato,
 *              либо напрямую в вебхук CRM)
 *  telegram  — сообщение в чат через бота
 *
 * TODO(клиент): выбрать адаптер и заполнить переменные окружения.
 */

export interface DeliveryResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface LeadAdapter {
  name: string;
  deliver(lead: Lead): Promise<DeliveryResult>;
}

const mockAdapter: LeadAdapter = {
  name: "mock",
  async deliver(lead) {
    console.info("[leads:mock] new lead", JSON.stringify(lead, null, 2));
    return { ok: true, id: `mock_${Date.now()}` };
  },
};

const webhookAdapter: LeadAdapter = {
  name: "webhook",
  async deliver(lead) {
    const url = process.env.LEADS_WEBHOOK_URL;
    if (!url) return { ok: false, error: "LEADS_WEBHOOK_URL is not set" };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEADS_WEBHOOK_SECRET
          ? { "X-Webhook-Secret": process.env.LEADS_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({ ...lead, product_name: productLabel(lead.product), source: "ai-pro-school.kz", sent_at: new Date().toISOString() }),
    });
    if (!res.ok) return { ok: false, error: `webhook ${res.status}` };
    return { ok: true };
  },
};

const telegramAdapter: LeadAdapter = {
  name: "telegram",
  async deliver(lead) {
    const token = process.env.LEADS_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.LEADS_TELEGRAM_CHAT_ID;
    if (!token || !chatId) return { ok: false, error: "Telegram credentials are not set" };

    const utm = Object.entries(lead.utm ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const text = [
      `🆕 Заявка с сайта`,
      `👤 ${lead.name}`,
      `📞 +${lead.phone}`,
      `🎯 ${productLabel(lead.product)}`,
      lead.segment ? `🧩 сегмент: ${lead.segment}` : null,
      lead.comment ? `💬 ${lead.comment}` : null,
      lead.page ? `📄 ${lead.page}` : null,
      lead.firstPage && lead.firstPage !== lead.page ? `🚪 первая страница: ${lead.firstPage}` : null,
      lead.referrer ? `↩️ ${lead.referrer}` : null,
      utm ? `\n${utm}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) return { ok: false, error: `telegram ${res.status}` };
    return { ok: true };
  },
};

const adapters: Record<string, LeadAdapter> = {
  mock: mockAdapter,
  webhook: webhookAdapter,
  telegram: telegramAdapter,
};

export function getLeadAdapter(): LeadAdapter {
  const key = process.env.LEADS_ADAPTER ?? "mock";
  return adapters[key] ?? mockAdapter;
}
