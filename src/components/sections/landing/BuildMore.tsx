import { RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { nbspDash } from "@/lib/utils";
import { IdeasToggle } from "./IdeasToggle";

type BuildMoreData = NonNullable<Audience["buildMore"]>;

/** «Навайбкодить можно не только сайт» - светлая секция: шесть белых карточек задач и раскрывающаяся плашка «Ещё идеи» */
export function BuildMore({ data }: { data: BuildMoreData }) {
  return (
    <Section id="build-more" className="scroll-mt-24">
      <SectionIntro id="build-more-title" align="left" eyebrow={data.eyebrow} title={data.title} description={data.description} wide />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.cards.map((c) => (
          <RevealItem as="li" key={c.title} className="flex">
            <div className="flex w-full flex-col gap-2 rounded-[28px] bg-surface p-6 ring-1 ring-ink-100 sm:p-7">
              <h3 className="font-display text-[20px] font-bold leading-tight text-ink">{nbspDash(c.title)}</h3>
              <p className="text-[15px] leading-relaxed text-ink-500">{nbspDash(c.text)}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      <IdeasToggle title={data.ideasTitle} ideas={data.ideas} />
    </Section>
  );
}
