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
          <Link href={directions[direction].path} className="ml-2 inline-flex items-center gap-1 text-[14px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            О направлении <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
      )}

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
            <LadderStepCard step={step} entryBadge={entryBadge} />
          </li>
        ))}
      </ol>
    </div>
  );
}
