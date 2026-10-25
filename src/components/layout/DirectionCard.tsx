import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicNavMenu } from "@/data/public-types";
import { NoBreakTerms } from "@/components/ui/NoBreakTerms";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { cn } from "@/lib/utils";
import { DirectionIcon } from "./DirectionIcon";

/**
 * Крупная кликабельная карточка направления (выпадающее меню и мобильная панель): название, суть, «для кого»,
 * строка «Начать с …» и стрелка → (внутренняя ссылка). Hover и focus-visible подсвечивают всю карточку.
 */
/** «Начать с практикума за 9 900 ₸» / «Начать с эфира, бесплатно» — цена и «бесплатно» из данных */
export function StartLine({ start }: { start: PublicNavMenu["cards"][number]["start"] }) {
  return (
    <>
      {start.before}
      {start.free ? (
        ", бесплатно"
      ) : (
        <>
          {" за "}
          <ProductPrice parts={start.price} />
        </>
      )}
    </>
  );
}

export function DirectionCard({ card, onNavigate, className }: { card: PublicNavMenu["cards"][number]; onNavigate: () => void; className?: string }) {
  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      className={cn(
        "group flex h-full flex-col rounded-2xl bg-white/80 p-5 text-ink ring-1 ring-ink/5 transition-[background-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:bg-white hover:shadow-card motion-reduce:hover:translate-y-0",
        "focus-visible:bg-white focus-visible:shadow-card focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <DirectionIcon direction={card.direction} />
        <span className="font-display text-[22px] font-extrabold leading-tight">
          <NoBreakTerms text={card.title} />
        </span>
      </span>
      <span className="mt-3 text-[15px] font-semibold leading-snug text-ink-700">
        <NoBreakTerms text={card.pitch} />
      </span>
      <span className="mb-4 mt-3 text-[13px] leading-snug text-ink-500">
        <span className="font-semibold text-ink-700">Для кого:</span> {card.forWhom}
      </span>
      <span className="mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-[14px] font-semibold">
        <span>
          <StartLine start={card.start} />
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
