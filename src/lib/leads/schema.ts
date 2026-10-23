import { z } from "zod";
import { isLeadProduct } from "@/data/product-ids";

/** Нормализует телефон к формату 7XXXXXXXXXX (11 цифр) */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return "7" + digits.slice(1);
  if (digits.length === 10) return "7" + digits;
  return digits;
}

export const KZ_PHONE_REGEX = /^7\d{10}$/;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите имя")
    .max(80, "Слишком длинное имя"),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => KZ_PHONE_REGEX.test(v), "Введите номер в формате +7 (7XX) XXX-XX-XX"),
  /** Продукт из products.ts или «general» («Не знаю, помогите выбрать») */
  product: z.string().refine(isLeadProduct, "Выберите продукт"),
  comment: z.string().trim().max(500).optional(),
  /** Служебные поля (скрытые) */
  formId: z.string().default("default"),
  /** Страница, с которой отправлена заявка */
  page: z.string().max(500).optional(),
  /** Общий с браузерным Lead идентификатор события (дедупликация в Meta) */
  eventId: z.string().min(8).max(100).optional(),
  /** Сегмент: из /for/<сегмент> или utm_content */
  segment: z.string().max(120).optional(),
  referrer: z.string().max(1000).optional(),
  /** Первая страница сессии */
  firstPage: z.string().max(500).optional(),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(300).optional(),
  ttclid: z.string().max(300).optional(),
  /** utm_* и click-id первого захода */
  utm: z.record(z.string(), z.string().optional()).optional(),
  /** Honeypot — боты заполняют, люди нет. Непустое значение не ошибка валидации: /api/lead отвечает успехом и не передаёт заявку */
  website: z.string().max(500).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
