/**
 * Идентификаторы продуктов (из products.ts) — отдельный модуль без данных, безопасный для клиента:
 * аналитика передаёт product в событиях Lead/Contact.
 */
export const PRODUCT_IDS = ["practicum", "ai-creator", "efir", "offline", "course"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

/** Значение «Не знаю, помогите выбрать» в форме и на странице /thanks/general */
export const GENERAL_PRODUCT = "general" as const;
export type LeadProduct = ProductId | typeof GENERAL_PRODUCT;

export const isLeadProduct = (v: string): v is LeadProduct => v === GENERAL_PRODUCT || (PRODUCT_IDS as readonly string[]).includes(v);

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

/** Страница курса/аудитории → продукт для форм и кнопок: страницы курсов и лендинги эфира (`/for/*`) */
export function productForCourseSlug(slug: string): ProductId {
  if (slug === "practicum") return "practicum";
  if (slug === "ai-creator") return "ai-creator";
  return "efir"; // vibecoding и лендинги ЦА — бесплатный эфир
}

/** Значение из кнопки/формы (id продукта, слаг курса или ЦА) → продукт заявки; пусто — по странице, иначе "" (выбор вручную) */
export function resolveLeadProduct(value: string | undefined, pathname?: string): LeadProduct | "" {
  if (value && isLeadProduct(value)) return value;
  if (value) return productForCourseSlug(value);
  return (pathname && productIdForPath(pathname)) || "";
}
