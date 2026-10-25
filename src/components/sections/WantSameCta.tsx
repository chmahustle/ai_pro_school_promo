import { vocabulary } from "@/data/vocabulary";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { webinarCta } from "@/data/heroResults";
import { Ribbon } from "@/components/ui";
import { cn, noBreakHyphen } from "@/lib/utils";

/** Четырёхконечная искра — форма как в логотипе */
function Spark({
  className,
  fill = "#E8307E",
  size = 32,
}: {
  className?: string;
  fill?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={fill}
      className={cn("want-same-spark", className)}
      aria-hidden
    >
      <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
    </svg>
  );
}

/** Круглая кнопка-стрелка в углу плитки: при наведении на плитку сдвигается и увеличивается, цвет меняется (см. класс у плитки) */
const arrowChip =
  "absolute bottom-4 right-4 z-10 grid size-10 place-items-center rounded-full transition-[transform,background-color] duration-300 group-hover:translate-x-1 group-hover:scale-110 sm:bottom-5 sm:right-5";

const tileBase = cn(
  "want-same-tile group relative flex h-40 overflow-hidden rounded-2xl p-5 sm:h-[200px] sm:p-6",
  "transition-transform duration-200 ease-out",
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-white",
  "motion-reduce:transition-none",
);

const titleClass =
  "relative z-10 max-w-[12ch] font-display text-[22px] font-bold leading-tight tracking-[-0.02em] sm:text-[24px] lg:text-[26px]";

/**
 * Финальный CTA «Хотите так же?» — три плитки после отзывов/кейсов.
 */
export function WantSameCta() {
  return (
    <section aria-labelledby="want-same-title" className="px-2 py-24 sm:px-4">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl bg-dark px-5 py-12 lg:px-12 lg:py-[72px]">
          <Ribbon variant="pair" tone="dark" />

          <div className="relative z-10 mx-auto max-w-[52rem] text-center">
            <h2
              id="want-same-title"
              className="font-display text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-bold leading-tight tracking-[-0.015em] text-white"
            >
              Хотите <span className="text-brand">так же</span>?
            </h2>
            <p className="mt-3 text-[14px] text-white/70 sm:text-[15px]">
              Подберём программу под вашу цель и темп.
            </p>
          </div>

          <div
            className={cn(
              "relative z-10 mt-8 grid grid-cols-1 gap-5 md:grid-cols-2",
              "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]",
            )}
          >
            {/* 1. Подобрать программу */}
            <Link href="/#audiences" className={cn(tileBase, "bg-brand text-white md:col-span-1")}>
              <span className={titleClass}>Подобрать программу</span>
              <span
                className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 opacity-90 sm:-right-10"
                aria-hidden
              >
                <Spark fill="#ECE9FF" size={200} className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px]" />
              </span>
              <span className={cn(arrowChip, "bg-white/25 text-white group-hover:bg-dark")}>
                <ArrowRight className="size-5" aria-hidden />
              </span>
            </Link>

            {/* 2. Смотреть результаты */}
            <Link href="/reviews" className={cn(tileBase, "bg-surface text-ink")}>
              <span className={titleClass}>Смотреть результаты</span>
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <span className="want-same-sticker want-same-sticker-a absolute left-[8%] top-[46%] rounded-pill bg-ink px-3.5 py-1.5 font-display text-[11px] font-bold tracking-wide text-white sm:left-[10%] sm:top-[50%] sm:text-[12px]">
                  ОТЗЫВЫ
                </span>
                <span className="want-same-sticker want-same-sticker-b absolute right-[28%] top-[60%] rounded-pill bg-ink px-3.5 py-1.5 font-display text-[11px] font-bold tracking-wide text-white sm:right-[30%] sm:top-[62%] sm:text-[12px]">
                  ЧЕКИ
                </span>
              </div>
              <span className={cn(arrowChip, "bg-dark text-white group-hover:bg-brand")}>
                <ArrowRight className="size-5" aria-hidden />
              </span>
            </Link>

            {/* 3. Эфир «Вайб-кодинг вживую» */}
            <Link
              href={webinarCta.href}
              className={cn(tileBase, "bg-lavender text-ink md:col-span-2 lg:col-span-1")}
            >
              <span className={titleClass}>{noBreakHyphen(vocabulary.efir)}</span>
              <svg
                className="pointer-events-none absolute -bottom-16 -right-10 h-[180%] w-[90%] opacity-80"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden
              >
                <circle cx="100" cy="100" r="78" stroke="#FFFFFF" strokeWidth="10" />
              </svg>
              <span className="pointer-events-none absolute bottom-8 right-[28%]" aria-hidden>
                <Spark fill="#14121F" size={36} />
              </span>
              <span className="pointer-events-none absolute bottom-14 right-8" aria-hidden>
                <Spark fill="#E8307E" size={24} />
              </span>
              <span className={cn(arrowChip, "bg-dark text-white group-hover:bg-brand")}>
                <ArrowRight className="size-5" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
