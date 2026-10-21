/**
 * Маска казахстанского/российского номера: +7 (7XX) XXX-XX-XX
 * Принимает любой ввод, возвращает отформатированную строку.
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  // Пользователь начал с 8 → считаем как 7
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  // Если ввели без кода страны (начали с 7XX без ведущей 7) — добавим
  if (digits.length > 0 && !digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";
  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length > 0) out += " (" + rest.slice(0, 3);
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += " " + rest.slice(3, 6);
  if (rest.length > 6) out += "-" + rest.slice(6, 8);
  if (rest.length > 8) out += "-" + rest.slice(8, 10);
  return out;
}

export const PHONE_PLACEHOLDER = "+7 (7__) ___-__-__";
