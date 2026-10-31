import { X } from "lucide-react";
import { Pill, RevealGroup, RevealItem } from "@/components/ui";
import { headingSize } from "@/lib/heading";
import type { Audience } from "@/data/types";
import { cn, nbspDash } from "@/lib/utils";

type NotForData = NonNullable<Audience["notFor"]>;

/** Четырёхконечная звезда из логотипа (как у «Ведёт курс» и «Ведущие эфира») */
const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";

/**
 * «Кому эфир не подойдёт» - в дизайне «Формата эфира»: сиреневая панель, слева пилюля и заголовок, справа белые плитки 2 в ряд
 * (нечётная последняя - на всю ширину). Декор - большая звезда в левом нижнем углу.
 */
export function NotFor({ data }: { data: NotForData }) {
  if (data.items.length === 0) return null;
  return (
    <section id="not-for" className="mt-4 scroll-mt-24 px-2 sm:px-4" aria-labelledby="not-for-title">
      <div className="relative isolate overflow-hidden rounded-2xl bg-lavender sm:rounded-3xl">
        <svg aria-hidden viewBox="0 0 100 100" fill="#ffffff" className="pointer-events-none absolute -bottom-12 -left-10 -z-10 size-[210px] opacity-80 sm:size-[250px]">
          <path d={STAR} />
        </svg>
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute bottom-24 left-[34%] -z-10 hidden size-5 fill-brand lg:block">
          <path d={STAR} />
        </svg>

        <div className="container-site relative grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="flex flex-col items-start">
            <Pill tone="white" dot>
              {data.eyebrow}
            </Pill>
            <h2 id="not-for-title" className={cn("mt-4 text-ink", headingSize(data.title))}>
              {nbspDash(data.title)}
            </h2>
          </div>

          <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2">
            {data.items.map((it, i) => (
              <RevealItem as="li" key={it.title} className={cn("flex", data.items.length % 2 === 1 && i === data.items.length - 1 && "sm:col-span-2")}>
                <div className="audience-tile flex min-h-[150px] w-full flex-col gap-3 rounded-[24px] bg-surface p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] font-bold leading-tight text-ink">{nbspDash(it.title)}</h3>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-500">
                      <X className="size-4" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-auto text-[15px] leading-relaxed text-ink-500">{nbspDash(it.text)}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
