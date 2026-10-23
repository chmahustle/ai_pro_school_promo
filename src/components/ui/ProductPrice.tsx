import type { PriceParts } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Цена: «9 900 ₸», «от 249 000 ₸», «бесплатно». Части приходят готовыми с сервера (formatPriceParts) —
 * компонент ничего не знает о данных продуктов. Неразрывные пробелы + nowrap, «от» и «₸» мельче числа.
 * Нет цены (пустое amount) — ничего не рендерит.
 */
export function ProductPrice({ parts, className }: { parts: Pick<PriceParts, "prefix" | "amount" | "unit">; className?: string }) {
  if (!parts.amount) return null;
  return (
    <span className={cn("whitespace-nowrap", className)}>
      {parts.prefix && <span className="mr-[0.3em] text-[0.6em] font-semibold">{parts.prefix}</span>}
      {parts.amount}
      {parts.unit && <span className="ml-[0.2em] text-[0.6em] font-bold">{parts.unit}</span>}
    </span>
  );
}
