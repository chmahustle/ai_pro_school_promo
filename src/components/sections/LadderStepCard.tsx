import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import type { PublicLadderStep } from "@/data/public-types";
import { cn, nbspDash } from "@/lib/utils";

/**
 * Цвет по ступени: входная — розовая (brand-100), средняя — светлая лавандовая, флагман — лавандовая с тонкой тёмной рамкой.
 * Текст ink / ink-700 / ink-500 на всех трёх ≥ 4.6:1 (AA); бейдж brand-600 + белый 5.3:1.
 */
const tiers: Record<PublicLadderStep["tier"], string> = {
  try: "border-brand-200 bg-brand-100",
  project: "border-ink/5 bg-soft-100",
  profession: "border-ink bg-lavender",
};

/** Карточка продукта (ступень лестницы): пилюля ступени, название, результат, формат, цена, старт, кнопка */
export function LadderStepCard({ step, entryBadge, showEntry = true, className }: { step: PublicLadderStep; entryBadge?: string; showEntry?: boolean; className?: string }) {
  const entry = showEntry && step.isEntry;
  return (
    <article
      className={cn(
        "flex flex-1 flex-col rounded-[32px] border p-6 text-ink sm:p-7",
        tiers[step.tier],
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-8 items-center rounded-pill bg-surface px-3.5 text-[13px] font-semibold">{step.stepLabel}</span>
        {entry && entryBadge && (
          <span className="inline-flex h-8 items-center rounded-pill bg-brand-600 px-3.5 text-[13px] font-semibold text-white">{entryBadge}</span>
        )}
      </div>

      <h3 className="mt-5 font-display text-[22px] font-bold leading-tight sm:text-[24px]">{nbspDash(step.name)}</h3>
      {step.devNameNote && <p className="mt-1 text-[12px] font-semibold text-danger">{step.devNameNote}</p>}
      <p className="mt-2 text-[14px] leading-snug text-ink-700">{nbspDash(step.resultLine)}</p>
      <p className="mt-3 text-[13px] leading-snug text-ink-500">{step.format}</p>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <ProductPrice parts={step.price} className="font-display text-[32px] font-extrabold leading-none" />
          {step.start && <span className="whitespace-nowrap text-[13px] font-semibold text-ink-700">Старт {step.start}</span>}
        </div>
        <Button variant="dark" size="md" fillTone="dark" href={step.href} fullWidth icon={<ArrowRight className="size-4" />} className="mt-4">
          {step.ctaLabel}
        </Button>
      </div>
    </article>
  );
}
