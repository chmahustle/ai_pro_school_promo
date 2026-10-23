import { z } from "zod";
import { isLeadProduct } from "@/data/product-ids";

import { normalizePhone, PHONE_FORMAT_ERROR } from "@/lib/phone";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите имя")
    .max(80, "Слишком длинное имя"),
  phone: z
    .string()
    .transform((v) => normalizePhone(v) ?? "")
    .refine((v) => v !== "", PHONE_FORMAT_ERROR),
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
