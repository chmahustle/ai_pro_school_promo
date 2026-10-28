import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MeshBackdrop, Pill, Ribbon } from "@/components/ui";
import { LeadButton } from "@/components/ui/LeadButton";
import { getPublicLineup } from "@/data/public";

/**
 * Hero страницы «Курсы»: заголовок, подзаголовок и две кнопки на mesh-фоне с лёгкой лентой, как hero главной.
 * Список программ - ниже, в каталоге (#courses), справа в hero его нет.
 */
export function CoursesHero() {
  const lineup = getPublicLineup();
  return (
    <section className="px-2 sm:px-4" aria-labelledby="courses-hero-title">
      <div className="relative mx-auto overflow-hidden rounded-3xl">
        <MeshBackdrop variant="home" rounded="rounded-3xl" />
        <Ribbon variant="right" tone="light" className="hidden sm:block" draw />

        <div className="container-site relative z-10 py-14 sm:py-16 lg:py-20">
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
        </div>
      </div>
    </section>
  );
}
