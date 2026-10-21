import { z } from "zod";

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
  /** Что интересует: slug курса или ЦА */
  interest: z.string().min(1, "Выберите направление"),
  comment: z.string().trim().max(500).optional(),
  consent: z
    .boolean({ required_error: "Нужно согласие на обработку данных" })
    .refine((v) => v === true, { message: "Нужно согласие на обработку данных" }),
  /** Служебные поля (скрытые) */
  formId: z.string().default("default"),
  page: z.string().optional(),
  utm: z.record(z.string(), z.string().optional()).optional(),
  /** Honeypot — боты заполняют, люди нет */
  website: z.string().max(0).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Варианты «что интересует» для селекта в форме */
export const LEAD_INTERESTS = [
  { value: "ai-creator", label: "Курс «ИИ-креатор»" },
  { value: "practicum", label: "Практикум по вирусным роликам" },
  { value: "vibecoding", label: "Вайбкодинг" },
  { value: "business", label: "Вайбкодинг для бизнеса (эфир)" },
  { value: "freelancers", label: "Вайбкодинг для фрилансеров (эфир)" },
  { value: "career", label: "Вайбкодинг для специалистов в найме (эфир)" },
  { value: "consult", label: "Нужна консультация" },
] as const;

export type LeadInterest = (typeof LEAD_INTERESTS)[number]["value"];
