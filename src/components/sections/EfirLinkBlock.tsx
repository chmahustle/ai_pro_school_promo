import { Button, Section } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getPublicLadder } from "@/data/public";

/**
 * Короткий блок на странице направления вайб-кодинга (id="efir"): название эфира, результат, формат, цена из products.ts
 * и кнопка на нейтральную страницу эфира. Подробности эфира живут на этой странице, не здесь.
 */
export function EfirLinkBlock() {
  const efir = getPublicLadder("vibecoding").steps.find((s) => s.isEntry);
  if (!efir) return null;
  return (
    <Section id="efir" className="scroll-mt-28" aria-labelledby="efir-link-title">
      <div className="flex flex-col gap-6 rounded-[28px] bg-lavender p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wider text-ink-500">Первая ступень</p>
          <h2 id="efir-link-title" className="mt-2 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-extrabold leading-tight">
            {efir.name}
          </h2>
          <p className="mt-2 max-w-[48ch] text-[15px] leading-snug text-ink-700">{efir.resultLine}</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 text-[14px] text-ink-500">
            <span>{efir.format}</span>
            <ProductPrice parts={efir.price} className="font-display text-[22px] font-extrabold text-ink" />
          </p>
        </div>
        <Button variant="dark" size="lg" fillTone="dark" href={efir.href} className="shrink-0">
          {efir.ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
