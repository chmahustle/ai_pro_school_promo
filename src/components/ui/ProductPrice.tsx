import { formatPriceParts, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Цена продукта из products.ts: «9 900 ₸», «от 249 000 ₸», «бесплатно».
 * Неразрывные пробелы + white-space: nowrap, «от» и «₸» мельче числа. Нет цены — ничего не рендерит.
 */
export function ProductPrice({ product, className }: { product: Product; className?: string }) {
  const { prefix, amount, unit } = formatPriceParts(product);
  if (!amount) return null;
  return (
    <span className={cn("whitespace-nowrap", className)}>
      {prefix && <span className="mr-[0.3em] text-[0.6em] font-semibold">{prefix}</span>}
      {amount}
      {unit && <span className="ml-[0.2em] text-[0.6em] font-bold">{unit}</span>}
    </span>
  );
}
