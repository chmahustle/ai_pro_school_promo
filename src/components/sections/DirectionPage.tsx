import type { ReactNode } from "react";
import Image from "next/image";
import { Button, Pill, Section, SectionIntro } from "@/components/ui";
import { getPublicDirectionPage, getPublicLineup } from "@/data/public";
import type { Direction } from "@/data/products";
import { nbspDash } from "@/lib/utils";
import { HomeStories } from "./HomeStories";
import { LeadSection } from "./LeadSection";
import { PageHero } from "./PageHero";
import { ProductLadder } from "./ProductLadder";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Страница направления: hero (название, «для кого», ведущий), лестница продуктов, [дополнительные секции],
 * кейсы направления (verified && consent, меньше 3 — скрыты), форма. FAQ направления нет в данных — блока нет.
 */
export function DirectionPage({ direction, children }: { direction: Direction; children?: ReactNode }) {
  const page = getPublicDirectionPage(direction);
  const lineup = getPublicLineup();

  return (
    <div className="calm-hover">
      <PageHero
        id={`${direction}-title`}
        eyebrow="Направление"
        title={page.name}
        description={capitalize(page.tagline)}
        actions={
          <Button variant="dark" size="lg" fillTone="dark" href="#ladder">
            Выбрать программу
          </Button>
        }
        aside={
          <div className="rounded-[28px] bg-surface/92 p-6 shadow-soft backdrop-blur-[2px] sm:p-7">
            <Pill tone="lavender">Для кого</Pill>
            <p className="mt-4 font-display text-[22px] font-bold leading-tight sm:text-[26px]">{nbspDash(page.forWhom)}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
              {page.leader.photo && (
                <span className="relative size-12 overflow-hidden rounded-full ring-2 ring-white">
                  <Image src={page.leader.photo} alt="" fill sizes="48px" className="scale-[1.5] object-cover object-[50%_22%]" />
                </span>
              )}
              <p className="text-[15px] text-ink-500">
                Ведёт <span className="font-semibold text-ink">{page.leader.name}</span>
              </p>
            </div>
          </div>
        }
      />

      <Section id="ladder" className="scroll-mt-24" aria-labelledby="ladder-title">
        <SectionIntro id="ladder-title" eyebrow="Программы" title="Начните с первой ступени" description={lineup.subtitle} />
        <ProductLadder direction={direction} showHeader={false} />
      </Section>

      {children}

      <div className="mt-6 sm:mt-10">
        <HomeStories direction={direction} limit={3} />
      </div>

      <LeadSection
        className="mt-10 sm:mt-16"
        id="lead"
        formId={`direction-${direction}`}
        title={`Записаться: ${page.name}`}
        defaultProduct={page.entryProduct}
        compact
        tone="mesh"
        mesh="home"
      />
    </div>
  );
}
