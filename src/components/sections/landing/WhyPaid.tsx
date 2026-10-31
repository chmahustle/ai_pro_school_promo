import { ArrowLink } from "@/components/ui";
import type { Audience } from "@/data/types";
import { nbspDash } from "@/lib/utils";

type WhyPaidData = NonNullable<Audience["whyPaid"]>;

/**
 * «Почему эфир платный» - компактная тёмная полоса (как «Strimmeo» на странице «О школе»): розовая подпись «Почему {цена}»,
 * заголовок, пояснение, справа кнопка записи с розовым кружком-стрелкой; в углу - едва заметная звезда.
 * Цена эфира приходит строкой из products.ts (efirPriceLabel); нет цены (эфир бесплатный) - блока нет.
 */
export function WhyPaid({ data, price, ctaLabel, formAnchor }: { data: WhyPaidData; price: string; ctaLabel: string; formAnchor: string }) {
  if (!price) return null;
  return (
    <section id="why-paid" aria-labelledby="why-paid-title" className="mt-4 scroll-mt-24 px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-2xl bg-dark text-white sm:rounded-3xl">
        <svg viewBox="0 0 100 100" aria-hidden className="audience-spark pointer-events-none absolute -right-6 -top-10 size-44 fill-white/[0.05]">
          <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
        </svg>
        <div className="container-site relative flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-10">
          <div className="min-w-0 max-w-3xl">
            <p className="text-[12px] font-bold uppercase tracking-wider text-brand-200">
              Почему <span className="whitespace-nowrap">{price}</span>
            </p>
            <h2 id="why-paid-title" className="mt-1 font-display text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-bold leading-tight">
              {nbspDash(data.title)}
            </h2>
            <p className="mt-1.5 max-w-[66ch] text-[14px] leading-snug text-white/65">{nbspDash(data.text)}</p>
          </div>
          <ArrowLink href={`#${formAnchor}`} tone="onDark" className="shrink-0 self-start sm:self-center">
            {ctaLabel}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
