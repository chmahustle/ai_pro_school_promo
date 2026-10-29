"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Горизонтальная карусель карточек со scroll-snap: свайп/колёсико/тачпад + кнопки «назад/вперёд» (с md).
 * Без автопрокрутки. Карточки (li) передаются children; на мобильном видна часть следующей карточки.
 */
export function BuildCarousel({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? 400) + 16;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const btn = "grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  return (
    <div className={className}>
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Назад" className={btn}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Вперёд" className={btn}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
      <ul
        ref={ref}
        aria-label={label}
        className={cn("-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-3 no-scrollbar sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8")}
      >
        {children}
      </ul>
      <p className="mt-1 text-[12px] text-white/50 md:hidden">Листайте вправо</p>
    </div>
  );
}
