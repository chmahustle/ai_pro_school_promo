import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getPublicLadder, getPublicLineup } from "@/data/public";
import type { Direction } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Лестница продуктов одного направления: «для кого», ведущий и карточки ступеней слева направо со стрелками
 * (на мобильных вертикально, стрелки вниз). Данные — products.ts через getPublicLadder; пустую ступень не дорисовываем.
 * Переиспользуется на страницах направлений (шаг 5).
 */
export function ProductLadder({ direction, className }: { direction: Direction; className?: string }) {
  const ladder = getPublicLadder(direction);
  const { entryBadge } = getPublicLineup();

  return (
    <div className={className}>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        {ladder.forWhom && (
          <p className="text-[14px] leading-relaxed text-ink-500 sm:text-[15px]">
            <span className="font-semibold text-ink">Для кого:</span> {ladder.forWhom}
          </p>
        )}
        <div className="flex shrink-0 items-center gap-3">
          {ladder.leader.photo && (
            <span className="relative size-10 overflow-hidden rounded-full ring-2 ring-white">
              <Image src={ladder.leader.photo} alt="" fill sizes="40px" className="scale-[1.5] object-cover object-[50%_22%]" />
            </span>
          )}
          <p className="text-[14px] text-ink-500">
            Ведёт <span className="font-semibold text-ink">{ladder.leader.name}</span>
          </p>
        </div>
      </div>

      <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
        {ladder.steps.map((step, i) => (
          <li key={step.id} className="contents">
            {i > 0 && (
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center self-center rounded-full bg-surface text-ink shadow-soft ring-1 ring-ink/5"
              >
                <ArrowDown className="size-5 lg:hidden" />
                <ArrowRight className="hidden size-5 lg:block" />
              </span>
            )}
            <article
              className={cn(
                "flex flex-1 flex-col rounded-[32px] border-2 bg-lavender p-6 text-ink sm:p-7",
                step.isEntry ? "border-ink" : "border-transparent",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 items-center rounded-pill bg-surface px-3.5 text-[13px] font-semibold">{step.stepLabel}</span>
                {step.isEntry && (
                  <span className="inline-flex h-8 items-center rounded-pill bg-brand px-3.5 text-[13px] font-semibold text-white">{entryBadge}</span>
                )}
              </div>

              <h3 className="mt-5 font-display text-[22px] font-bold leading-tight sm:text-[24px]">{step.name}</h3>
              {step.devNameNote && <p className="mt-1 text-[12px] font-semibold text-danger">{step.devNameNote}</p>}
              <p className="mt-2 text-[14px] leading-snug text-ink-700">{step.resultLine}</p>
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
          </li>
        ))}
      </ol>
    </div>
  );
}
