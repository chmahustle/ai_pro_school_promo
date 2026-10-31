import { Fragment } from "react";
import { Container, RevealGroup, RevealItem, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { nbspDash } from "@/lib/utils";

type SellMoreData = NonNullable<Audience["sellMore"]>;

/**
 * «Что продать текущему клиенту» - панель на сиреневом фоне (bg-lavender, как «Что даёт вайб-кодинг»): три белые карточки услуг
 * с ценой-подписью и белая карточка с примером связки; итог - на розовой плашке, как «вывод» в «Для кого».
 */
export function SellMore({ data }: { data: SellMoreData }) {
  return (
    <section id="sell-more" aria-labelledby="sell-more-title" className="mt-4 scroll-mt-24 px-2 sm:px-4">
      <div className="rounded-2xl bg-lavender py-14 sm:rounded-3xl sm:py-16">
        <Container>
          <SectionIntro id="sell-more-title" align="left" eyebrow={data.eyebrow} title={data.title} />

          <RevealGroup as="ul" className="audience-grid grid gap-4 md:grid-cols-3">
            {data.cards.map((c) => (
              <RevealItem as="li" key={c.title} className="flex">
                <div className="flex w-full flex-col gap-3 rounded-[24px] bg-surface p-5 sm:p-6">
                  <h3 className="font-display text-[20px] font-bold leading-tight text-ink">{nbspDash(c.title)}</h3>
                  <p className="text-[14px] leading-relaxed text-ink-500">{nbspDash(c.text)}</p>
                  <p className="mt-auto whitespace-nowrap pt-3 font-display text-[16px] font-bold text-brand-700">{c.tag}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealItem className="mt-4 rounded-[24px] bg-surface p-5 sm:p-7">
            <p className="text-[13px] font-semibold text-brand-700">{data.example.label}</p>
            <h3 className="mt-1 font-display text-[22px] font-bold leading-tight text-ink">{nbspDash(data.example.title)}</h3>

            <div className="mt-5 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
              {data.example.parts.map((p, i) => (
                <Fragment key={p.title}>
                  {i > 0 && (
                    <span className="grid shrink-0 place-items-center font-display text-[22px] font-bold leading-none text-brand" aria-hidden>
                      +
                    </span>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 self-stretch rounded-2xl bg-soft-100 p-4 sm:p-5">
                    <p className="text-[12px] font-semibold text-ink-500">{p.kicker}</p>
                    <p className="font-sans text-[16px] font-bold leading-snug text-ink">{nbspDash(p.title)}</p>
                    <p className="mt-auto whitespace-nowrap pt-2 text-[14px] font-semibold text-brand-700">{p.price}</p>
                  </div>
                </Fragment>
              ))}
            </div>

            <div className="mt-3 rounded-2xl bg-brand p-5 text-white sm:p-6">
              <p className="text-[12px] font-semibold text-white/80">{data.example.total.label}</p>
              <p className="mt-1 whitespace-nowrap font-display text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-extrabold leading-none">{data.example.total.value}</p>
              <p className="mt-2 text-[14px] font-semibold text-white/90">{nbspDash(data.example.total.note)}</p>
            </div>
          </RevealItem>
        </Container>
      </div>
    </section>
  );
}
