import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicNavMenu } from "@/data/public-types";
import { NoBreakTerms } from "@/components/ui/NoBreakTerms";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { cn } from "@/lib/utils";

/**
 * Крупная кликабельная карточка направления (выпадающее меню и мобильная панель): название, суть, «для кого»,
 * строка «Начать с …» и стрелка → (внутренняя ссылка). Hover и focus-visible подсвечивают всю карточку.
 */
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
      <span className="font-display text-[22px] font-extrabold leading-tight">
        <NoBreakTerms text={card.title} />
      </span>
      <span className="mt-2 text-[15px] font-semibold leading-snug text-ink-700">
        <NoBreakTerms text={card.pitch} />
      </span>
      <span className="mb-4 mt-3 text-[13px] leading-snug text-ink-500">
        <span className="font-semibold text-ink-700">Для кого:</span> {card.forWhom}
      </span>
      <span className="mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-[14px] font-semibold">
        <span>
          {card.start.before}
          {card.start.free ? (
            ", бесплатно"
          ) : (
            <>
              {" за "}
              <ProductPrice parts={card.start.price} />
            </>
          )}
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
