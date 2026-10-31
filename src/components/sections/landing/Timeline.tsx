import { Container, RevealGroup, RevealItem, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { cn, nbspDash } from "@/lib/utils";
import { TimelineCta } from "./TimelineCta";

type TimelineData = NonNullable<Audience["timeline"]>;

/**
 * «Что будет на эфире, по минутам» - в стиле «Как это работает» с главной: сиреневая панель, нумерованные узлы на белой линии
 * (на телефоне линия вертикальная слева), под узлами компактные карточки: время, заголовок, пояснение.
 * Выделенный шаг - тёмная карточка с чипами. Кнопка записи внизу; цена в ней приходит из products.ts (price).
 */
export function Timeline({ data, price, formAnchor }: { data: TimelineData; price: string; formAnchor: string }) {
  const n = data.items.length;
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="mt-4 scroll-mt-24 px-2 sm:px-4">
      <div className="rounded-2xl bg-lavender py-14 sm:rounded-3xl sm:py-16">
        <Container>
          <SectionIntro id="timeline-title" align="left" eyebrow={data.eyebrow} title={data.title} wide />

          <div className="relative" style={{ ["--n" as string]: n }}>
            {/* Линия: на ≥lg горизонтальная через центры узлов, на мобильном вертикальная слева (декор) */}
            <div aria-hidden className="pointer-events-none absolute left-[calc(100%/var(--n)/2)] right-[calc(100%/var(--n)/2)] top-[22px] hidden h-3 rounded-full bg-white/85 lg:block" />
            <div aria-hidden className="pointer-events-none absolute bottom-8 left-5 top-8 w-3 -translate-x-1/2 rounded-full bg-white/85 lg:hidden" />

            <RevealGroup as="ol" className="relative grid gap-3 lg:items-start lg:pt-14 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]">
              {data.items.map((it, i) => (
                <RevealItem as="li" key={it.title} className="relative pl-14 lg:pl-0">
                  <span className="absolute left-0 top-2 z-10 grid size-10 place-items-center rounded-full bg-ink font-display text-[15px] text-white ring-8 ring-lavender lg:-top-12 lg:left-1/2 lg:-translate-x-1/2">
                    {i + 1}
                  </span>
                  <div className={cn("flex flex-col gap-1.5 rounded-[20px] p-4", it.highlight ? "bg-dark text-white" : "bg-surface shadow-soft")}>
                    <p className="font-display text-[13px] font-bold leading-none text-brand">{it.time}</p>
                    <h3 className={cn("font-display text-[17px] font-bold leading-snug", it.highlight ? "text-white" : "text-ink")}>{nbspDash(it.title)}</h3>
                    <p className={cn("text-[13.5px] leading-snug", it.highlight ? "text-white/70" : "text-ink-500")}>{nbspDash(it.text)}</p>
                    {it.chips && it.chips.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {it.chips.map((c) => (
                          <li key={c} className="rounded-pill bg-white/10 px-2.5 py-1 text-[12px] font-semibold leading-snug text-white">
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="mt-8">
            <TimelineCta label={data.ctaLabel} price={price} href={`#${formAnchor}`} />
          </div>
        </Container>
      </div>
    </section>
  );
}
