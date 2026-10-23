/**
 * Идентификаторы продуктов (из products.ts) — отдельный модуль без данных, безопасный для клиента:
 * аналитика передаёт product в событиях Lead/Contact.
 */
export type ProductId = "practicum" | "ai-creator" | "efir" | "offline" | "course";

/** Какой продукт «стоит за» страницей — для события Contact, когда клик по WhatsApp не помечен явно */
export function productIdForPath(pathname: string): ProductId | null {
  if (pathname.startsWith("/courses/ai-creator")) return "ai-creator";
  if (pathname.startsWith("/courses/practicum")) return "practicum";
  if (pathname.startsWith("/courses/vibecoding-offline")) return "offline";
  if (pathname.startsWith("/courses/vibecoding-course")) return "course";
  if (pathname.startsWith("/courses/vibecoding")) return "efir";
  if (pathname.startsWith("/for/")) return "efir"; // лендинги ЦА — это бесплатный эфир
  return null;
}
