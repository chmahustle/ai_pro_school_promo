/**
 * Телефон: маска ввода, нормализация, формат для плейсхолдера. Модуль без зависимостей — его проверяет tests/phone.test.mjs.
 * Формат: +7 (XXX) XXX-XX-XX — 10 цифр после +7; в заявке и в Meta CAPI уходит 7XXXXXXXXXX (11 цифр).
 */

export const PHONE_PLACEHOLDER = "+7 (XXX) XXX-XX-XX";
export const PHONE_FORMAT_ERROR = "Введите номер в формате +7 (XXX) XXX-XX-XX";

/** Номер → 7XXXXXXXXXX (11 цифр). 8XXXXXXXXXX и 10 цифр без кода страны приводятся к 7…; не получилось — null */
export function normalizePhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) d = `7${d.slice(1)}`;
  if (d.length === 10) d = `7${d}`;
  return /^7\d{10}$/.test(d) ? d : null;
}

/**
 * Маска ввода: любой ввод → «+7 (XXX) XXX-XX-XX».
 * Поле при фокусе уже содержит «+7» (LeadForm), поэтому набираются 10 цифр номера; ведущая 8 после «+7» отбрасывается.
 * Вставка без «+»: 11 цифр с 7/8 — код страны отбрасывается, 10 цифр — национальный номер.
 */
export function formatPhoneInput(raw: string): string {
  const d = raw.replace(/\D/g, "");
  let national: string;
  if (raw.trim().startsWith("+")) {
    national = d.startsWith("7") ? d.slice(1) : d;
    // «+7» уже в поле, а человек по привычке набирает 8…: национальный номер с 8 не начинается
    if (national.startsWith("8")) national = national.slice(1);
  }
  else if (d.length === 10) national = d;
  else national = d.startsWith("7") || d.startsWith("8") ? d.slice(1) : d;
  national = national.slice(0, 10);

  if (d.length === 0) return "";
  let out = "+7";
  if (national.length > 0) out += ` (${national.slice(0, 3)}`;
  if (national.length >= 3) out += ")";
  if (national.length > 3) out += ` ${national.slice(3, 6)}`;
  if (national.length > 6) out += `-${national.slice(6, 8)}`;
  if (national.length > 8) out += `-${national.slice(8, 10)}`;
  return out;
}
