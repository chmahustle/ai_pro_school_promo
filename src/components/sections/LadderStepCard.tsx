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
        "step-card relative isolate flex flex-1 flex-col rounded-[32px] border p-6 text-ink sm:p-7",
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

      <div className="relative mt-auto pt-16 sm:pt-24">
        <StepDecor tier={step.tier} />
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <ProductPrice parts={step.price} className="font-display text-[32px] font-extrabold leading-none" />
          {step.start && <span className="whitespace-nowrap text-[13px] font-semibold text-ink-700">Старт {step.start}</span>}
        </div>
        <Button variant="dark" size="md" fillTone="dark" href={step.href} fullWidth icon={<ArrowRight className="step-arrow size-4" />} className="mt-4">
          {step.ctaLabel}
        </Button>
      </div>
    </article>
  );
}

/**
 * Декор по роли карточки (не по позиции): входная — четырёхконечная звезда, средняя — кольцо, флагман — мягкий блоб.
 * Стоит в зоне над ценой (отступ pt блока), позади текста (-z-10 в isolate-карточке), не интерактивен; на мобильном меньше.
 * Hover-движение — в globals.css (.step-card), только на устройствах с мышью.
 */
function StepDecor({ tier }: { tier: PublicLadderStep["tier"] }) {
  return (
    <span aria-hidden className="pointer-events-none absolute -right-3 top-2 -z-10 sm:-right-4 size-[52px] sm:size-[84px]">
      <svg viewBox="0 0 100 100" className={`step-fig step-fig-${tier} size-full overflow-visible`}>
        {tier === "try" && (
          <path
            fill="#ece9ff"
            d="M50 6C53.4 32.6 67.4 46.6 94 50C67.4 53.4 53.4 67.4 50 94C46.6 67.4 32.6 53.4 6 50C32.6 46.6 46.6 32.6 50 6Z"
          />
        )}
        {tier === "project" && <circle cx="50" cy="50" r="42" fill="none" stroke="#b8a6ff" strokeOpacity="0.7" strokeWidth="3" />}
        {tier === "profession" && (
          <path fill="#b8a6ff" fillOpacity="0.28" d="M52 5C74 6 95 24 95 48C95 73 76 95 51 95C27 95 5 77 5 52C5 27 28 4 52 5Z" />
        )}
      </svg>
    </span>
  );
}
