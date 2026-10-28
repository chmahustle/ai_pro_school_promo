import type { PriceParts } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Цена: «9 900 ₸», «от 249 000 ₸», «бесплатно»; при подтверждённой старой цене рядом зачёркнутая (parts.old). Части приходят готовыми с сервера (formatPriceParts) —
 * компонент ничего не знает о данных продуктов. Неразрывные пробелы + nowrap, «от» и «₸» мельче числа.
 * Нет цены (пустое amount) — ничего не рендерит.
 */
export function ProductPrice({ parts, className }: { parts: Pick<PriceParts, "prefix" | "amount" | "unit"> & { old?: string }; className?: string }) {
  if (!parts.amount) return null;
  return (
    <span className={cn("whitespace-nowrap", className)}>
      {parts.prefix && <span className="mr-[0.3em] text-[0.6em] font-semibold">{parts.prefix}</span>}
      {parts.amount}
      {parts.unit && <span className="ml-[0.2em] text-[0.6em] font-bold">{parts.unit}</span>}
      {/* Старая цена: зачёркнута, мельче и приглушена (цвет наследуется от карточки) */}
      {parts.old && (
        <span className="ml-[0.5em] text-[0.55em] font-semibold line-through opacity-55">
          {parts.old}
          {parts.unit && <span className="ml-[0.2em]">{parts.unit}</span>}
        </span>
      )}
    </span>
  );
}
