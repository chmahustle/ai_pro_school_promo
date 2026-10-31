import { Reveal, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { PaybackCalcCard } from "./PaybackCalcCard";

type PaybackData = NonNullable<Audience["payback"]>;

/**
 * «Окупаемость»: слева пример на одном боте (три строки и годовой итог зелёным), справа калькулятор потерь.
 * Цена эфира приходит строкой с сервера (efirPriceLabel), в тексте не хардкодится; пусто - предложения про цену нет.
 */
export function Payback({ data, price }: { data: PaybackData; price: string }) {
  const { example, calc } = data;
  return (
    <Section id="payback" className="scroll-mt-24 !py-12 sm:!py-14">
      <SectionIntro id="payback-title" align="left" eyebrow={data.eyebrow} title={data.title} wide />
      <div className="grid gap-3 lg:grid-cols-2">
        <Reveal className="flex w-full flex-col rounded-[24px] bg-surface p-5 ring-1 ring-ink-100 sm:p-6">
          <h3 className="font-display text-[19px] font-bold leading-tight text-ink">{example.title}</h3>
          <dl className="mt-3 divide-y divide-ink-100">
            {example.rows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0">
                <dt className="text-[14px] text-ink-700">{r.label}</dt>
                <dd className="whitespace-nowrap text-right text-[14px] font-bold text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[12px] text-ink-500">{example.yearLabel}</p>
          <p className="mt-1 whitespace-nowrap font-display text-[clamp(1.75rem,1.4rem+1.8vw,2.5rem)] font-extrabold leading-none text-success">{example.yearValue}</p>
          {price && <p className="mt-3 text-[14px] leading-snug text-ink-700">Эфир стоит <span className="whitespace-nowrap">{price}</span>, это примерно неделя такой переплаты.</p>}
        </Reveal>
        <RevealItem className="flex">
          <PaybackCalcCard config={calc} price={price} />
        </RevealItem>
      </div>
    </Section>
  );
}
