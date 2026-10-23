import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MeshBackdrop, Pill, Reveal, Ribbon } from "@/components/ui";
import { LeadButton } from "@/components/ui/LeadButton";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getPublicCatalog, getPublicLineup } from "@/data/public";
import { cn } from "@/lib/utils";

/** Цвета строк по направлению: розовая — креаторство, тёмная — вайб-кодинг */
const rowTone = {
  creator: { row: "bg-brand text-white", sub: "text-white/75", arrow: "bg-white text-brand group-hover:bg-dark group-hover:text-white" },
  vibecoding: { row: "bg-dark text-white", sub: "text-white/65", arrow: "bg-white text-ink group-hover:bg-brand group-hover:text-white" },
} as const;

/**
 * Hero страницы «Курсы»: слева заголовок и CTA, справа все продукты списком-быстрыми ссылками
 * (названия, форматы и цены — из products.ts). На mesh-фоне с лёгкой лентой, как hero главной.
 */
export function CoursesHero() {
  const { steps } = getPublicCatalog();
  const lineup = getPublicLineup();
  return (
    <section className="px-2 sm:px-4" aria-labelledby="courses-hero-title">
      <div className="relative mx-auto overflow-hidden rounded-3xl">
        <MeshBackdrop variant="home" rounded="rounded-3xl" />
        <Ribbon variant="right" tone="light" className="hidden sm:block" draw />

        <div className="container-site relative z-10 grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
          <div className="flex flex-col items-start">
            <Pill tone="brand" dot>
              Каталог
            </Pill>
            <h1 id="courses-hero-title" className="mt-4 font-display text-[clamp(2.25rem,1.4rem+3.4vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.015em] text-ink">
              Программы <span className="text-gradient-brand">AI&nbsp;Pro&nbsp;School</span>
            </h1>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-500">{lineup.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LeadButton variant="dark" size="md" source="courses-hero" icon={<ArrowUpRight className="size-4" />}>
                Подобрать программу
              </LeadButton>
              <Link href="#courses" className="inline-flex h-12 items-center rounded-pill px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-white/70">
                Смотреть каталог
              </Link>
            </div>
          </div>

          <Reveal delay={0.1}>
            <ul className="flex flex-col gap-2.5">
              {steps.map((s, i) => {
                const t = rowTone[s.direction];
                return (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      className={cn(
                        "group flex items-center gap-4 rounded-[24px] p-3.5 pr-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card sm:p-4 sm:pr-4",
                        t.row,
                      )}
                    >
                      <span className="font-display text-2xl font-extrabold tabular-nums opacity-30">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[17px] font-bold leading-tight">{s.name}</span>
                        <span className={cn("mt-0.5 block text-[13px]", t.sub)}>
                          {s.format} · <ProductPrice parts={s.price} className="font-semibold" />
                        </span>
                      </span>
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300 group-hover:rotate-45", t.arrow)}>
                        <ArrowUpRight className="size-5" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
