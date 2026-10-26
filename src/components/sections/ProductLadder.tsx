import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPublicLadder, getPublicLineup } from "@/data/public";
import { directions } from "@/data/lineup";
import type { Direction } from "@/data/products";
import { LadderStepCard } from "./LadderStepCard";

/**
 * Лестница продуктов одного направления: «для кого», ведущий и карточки ступеней слева направо со стрелками
 * (на мобильных вертикально, стрелки вниз). Данные — products.ts через getPublicLadder; пустую ступень не дорисовываем.
 * Переиспользуется на страницах направлений (шаг 5).
 */
export function ProductLadder({ direction, className, showHeader = true }: { direction: Direction; className?: string; /** Строка «Для кого» и ведущий над лестницей (на страницах направлений они уже в hero) */ showHeader?: boolean }) {
  const ladder = getPublicLadder(direction);
  const { entryBadge } = getPublicLineup();

  return (
    <div className={className}>
      {showHeader && (
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        {ladder.forWhomLinks.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-ink sm:text-[15px]">Для кого:</span>
            <ul className="flex flex-wrap gap-2" role="list">
              {ladder.forWhomLinks.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="inline-flex min-h-9 items-center rounded-pill bg-surface px-4 py-1.5 text-[14px] font-semibold text-ink ring-1 ring-ink/10 transition-colors hover:bg-lavender focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
          <Link href={directions[direction].path} className="ml-2 inline-flex items-center gap-1 text-[14px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            О направлении <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
      )}

      <ol className="step-ladder flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
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
            <LadderStepCard step={step} entryBadge={entryBadge} />
          </li>
        ))}
      </ol>
    </div>
  );
}
