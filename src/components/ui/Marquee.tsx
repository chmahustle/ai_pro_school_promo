import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Длительность одного круга (пресеты); точнее — через durationSec */
  speed?: "slow" | "normal" | "fast";
  /** Длительность круга в секундах: переопределяет speed (держите ~6–8 с на элемент, чтобы скорость не зависела от числа копий) */
  durationSec?: number;
  reverse?: boolean;
  gap?: string;
  /** Пауза по hover и по фокусу внутри ленты */
  pauseOnHover?: boolean;
  /** Сколько раз повторить содержимое в каждой половине: чтобы половина всегда была шире экрана и лента не «пустела» */
  repeat?: number;
}

const speeds = { slow: 60, normal: 40, fast: 24 };

/**
 * Бесконечная лента: содержимое повторяется `repeat` раз в каждой из двух половин, цикл сдвигает ровно на половину —
 * шва не видно. Повторы и вторая половина aria-hidden. Анимация CSS, при reduced-motion глобально отключается.
 */
export function Marquee({
  children,
  className,
  speed = "normal",
  durationSec,
  reverse,
  gap = "gap-10",
  pauseOnHover,
  repeat = 1,
}: MarqueeProps) {
  const copies = Math.max(1, repeat);

  const group = (hidden: boolean) =>
    Array.from({ length: copies }, (_, i) => (
      <div key={i} className={cn("flex shrink-0 items-center", gap)} aria-hidden={hidden || i > 0 ? true : undefined}>
        {children}
      </div>
    ));

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative w-full overflow-hidden mask-fade-x">
        <div
          className={cn(
            "flex w-max animate-marquee items-center",
            gap,
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]",
          )}
          style={{ animationDuration: `${durationSec ?? speeds[speed]}s` }}
        >
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
