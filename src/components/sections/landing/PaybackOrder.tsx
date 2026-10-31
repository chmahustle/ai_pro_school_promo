import { Reveal, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { cn, formatTenge, nbspDash } from "@/lib/utils";

type PaybackOrderData = NonNullable<Audience["paybackOrder"]>;

/** «раз/раза» после числа: в 10 раз, в 2 раза, в 21 раз */
function timesWord(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  return m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14) ? "раза" : "раз";
}

/**
 * «Один заказ окупает эфир в N раз»: слева сравнение цены эфира и среднего заказа (множитель - целая часть от деления),
 * справа розовая карточка со схемой заказа, под ними (если есть в данных) ряд карточек «Что можно предложить». Цена эфира приходит из products.ts (price, ₸); нет цены или эфир бесплатный - блока нет.
 */
export function PaybackOrder({ data, price }: { data: PaybackOrderData; price: number | null }) {
  if (!price || price <= 0) return null;
  const times = Math.floor(data.orderValue / price);
  if (times < 2) return null;
  return (
    <Section id="payback-order" className="scroll-mt-24 !py-12 sm:!py-14">
      <SectionIntro id="payback-order-title" align="left" eyebrow={data.eyebrow} title={`Один заказ окупает эфир в ${times} ${timesWord(times)}`} wide />
      <div className="grid gap-3 lg:grid-cols-2">
        <Reveal className="flex w-full flex-col rounded-[24px] bg-surface p-5 ring-1 ring-ink-100 sm:p-6">
          <dl className="divide-y divide-ink-100">
            <div className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0">
              <dt className="text-[14px] text-ink-700">Эфир</dt>
              <dd className="whitespace-nowrap text-right text-[14px] font-bold text-ink">{formatTenge(price)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-[14px] text-ink-700">{data.orderLabel}</dt>
              <dd className="whitespace-nowrap text-right text-[14px] font-bold text-ink">от {formatTenge(data.orderValue)}</dd>
            </div>
          </dl>
          <p className="mt-4 whitespace-nowrap font-display text-[clamp(2rem,1.5rem+2vw,2.75rem)] font-extrabold leading-none text-success">×{times}</p>
          <p className="mt-1.5 text-[14px] text-ink-700">{data.caption}</p>
        </Reveal>

        <RevealItem className="flex">
          <div className="flex w-full flex-col rounded-[24px] bg-brand p-5 text-white sm:p-6">
            <h3 className="font-display text-[19px] font-bold leading-tight">{data.schemeTitle}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {data.scheme.map((s) => (
                <li key={s} className="rounded-pill bg-white/20 px-3 py-1.5 text-[13px] font-semibold leading-snug">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-[14px] leading-snug text-white/95">{data.note}</p>
          </div>
        </RevealItem>
      </div>

      {data.offers && data.offers.items.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-[19px] font-bold leading-tight text-ink">{data.offers.title}</h3>
          <RevealGroup as="ul" className={cn("audience-grid mt-3 grid gap-3 sm:grid-cols-2", data.offers.items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
            {data.offers.items.map((o) => (
              <RevealItem as="li" key={o.title} className="flex">
                <div className="flex w-full flex-col gap-1 rounded-[20px] bg-surface p-4 ring-1 ring-ink-100">
                  <p className="text-[12px] font-bold text-brand-700">{o.kicker}</p>
                  <h4 className="font-display text-[16px] font-bold leading-snug text-ink">{nbspDash(o.title)}</h4>
                  <p className="text-[13.5px] leading-snug text-ink-500">{nbspDash(o.text)}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}
    </Section>
  );
}
