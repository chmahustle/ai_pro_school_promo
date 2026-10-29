"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Карточки-примеры: на ≥1024 px - сетка из трёх колонок (без стрелок), ниже - горизонтальная лента со scroll-snap
 * (карточка 84% ширины, виден край следующей). Стрелки «назад/вперёд» показываются только там, где есть переполнение.
 * Без автопрокрутки. Карточки (li) передаются children.
 */
export function BuildCarousel({ children, label, className, always = false }: { children: ReactNode; label: string; className?: string; always?: boolean }) {
  const ref = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (el) setOverflow(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

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
      {overflow && (
        <div className={cn("mb-4 flex justify-end gap-2", !always && "lg:hidden")}>
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Назад" className={btn}>
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Вперёд" className={btn}>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
      <ul
        ref={ref}
        aria-label={label}
        className={cn(
          "-mx-4 -mt-4 flex snap-x snap-mandatory scroll-pl-4 items-stretch gap-4 overflow-x-auto px-4 pb-6 pt-4 no-scrollbar sm:-mx-6 sm:scroll-pl-6 sm:px-6",
          !always && "lg:mx-0 lg:mt-0 lg:pt-0 lg:pb-0 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-x-4 lg:gap-y-4 lg:overflow-visible lg:px-0 lg:pb-0",
          always && "lg:-mx-8 lg:scroll-pl-8 lg:px-8",
        )}
      >
        {children}
      </ul>
      {overflow && <p className={cn("mt-1 text-[12px] text-white/70", !always && "lg:hidden")}>Листайте вправо</p>}
    </div>
  );
}
