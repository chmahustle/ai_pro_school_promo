import Image from "next/image";
import { RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { nbspDash } from "@/lib/utils";

type StudentWorksData = NonNullable<Audience["studentWorks"]>;

/**
 * «Ученики без опыта в коде уже сделали»: белые карточки проектов (скриншот, название, описание).
 * Прод: только записи verified && consent, меньше трёх - блока нет; слот скриншота без файла не рисуется.
 * Dev: показываются все записи, пустой слот - полосатая заглушка с жёлтой подписью.
 */
export function StudentWorks({ data }: { data: StudentWorksData }) {
  const items = data.items.filter((i) => SHOW_PLACEHOLDERS || (i.verified && i.consent));
  if (!SHOW_PLACEHOLDERS && items.length < 3) return null;
  if (items.length === 0) return null;
  return (
    <Section id="student-works" className="scroll-mt-24">
      <SectionIntro id="student-works-title" align="left" eyebrow={data.eyebrow} title={data.title} />
      <RevealGroup as="ul" className="audience-grid grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <RevealItem as="li" key={it.title} className="flex">
            <div className="flex w-full flex-col rounded-[28px] bg-surface p-4 ring-1 ring-ink-100 sm:p-5">
              {it.image ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink-100">
                  <Image src={it.image} alt={it.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
                </div>
              ) : (
                SHOW_PLACEHOLDERS && (
                  <div
                    className="grid aspect-[16/9] w-full place-items-center rounded-2xl bg-[repeating-linear-gradient(135deg,#ece9ff_0_14px,#f3f1ff_14px_28px)]"
                    aria-hidden
                  >
                    <span className="rounded-md bg-[#ffe08a] px-2.5 py-1 text-[12px] font-bold text-ink">скриншот проекта</span>
                  </div>
                )
              )}
              <h3 className="mt-4 px-1 font-display text-[19px] font-bold leading-tight text-ink">{nbspDash(it.title)}</h3>
              <p className="mt-2 px-1 pb-1 text-[15px] leading-relaxed text-ink-500">{nbspDash(it.text)}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
