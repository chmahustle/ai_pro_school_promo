import { ArrowDown, ArrowUp, Check } from "lucide-react";
import { Container, RevealGroup, RevealItem, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";
import { cn, nbspDash } from "@/lib/utils";

type BenefitsData = NonNullable<Audience["benefits"]>;

/** Icon - компонент значка; нет - в круге пишется «₸». Зелёный - экономия/рост, розовый - доход */
const icons = {
  down: { Icon: ArrowDown, box: "bg-success/10 text-success", mark: "bg-success/10 text-success" },
  up: { Icon: ArrowUp, box: "bg-brand-50 text-brand", mark: "bg-brand-50 text-brand" },
  tenge: { Icon: null, box: "bg-brand-50 text-brand", mark: "bg-brand-50 text-brand" },
  growth: { Icon: ArrowUp, box: "bg-success/10 text-success", mark: "bg-success/10 text-success" },
} as const;

/**
 * «Два способа» (экономия/доход, доход на стороне/рост на работе) - панель на сиреневом фоне (bg-lavender, чтобы не повторять серую панель болей перед ней),
 * на ней две компактные белые карточки со строками: галочка, заголовок, пояснение, тонкие разделители.
 */
export function Benefits({ data }: { data: BenefitsData }) {
  return (
    <section id="benefits" aria-labelledby="benefits-title" className="mt-4 scroll-mt-24 px-2 sm:px-4">
      <div className="rounded-2xl bg-lavender py-14 sm:rounded-3xl sm:py-16">
        <Container>
          <SectionIntro id="benefits-title" align="left" eyebrow={data.eyebrow} title={data.title} />
          <RevealGroup className="grid gap-4 lg:grid-cols-2">
            {data.columns.map((col) => {
              const { Icon, box, mark } = icons[col.icon];
              return (
                <RevealItem key={col.title} className="flex">
                  <div className="flex w-full flex-col rounded-[24px] bg-surface p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", box)}>
                        {Icon ? <Icon className="size-[18px]" aria-hidden /> : <span className="font-display text-[18px] font-extrabold leading-none" aria-hidden>₸</span>}
                      </span>
                      <h3 className="font-display text-[20px] font-bold leading-tight text-ink">{col.title}</h3>
                    </div>
                    <ul className="mt-4 divide-y divide-ink-100">
                      {col.items.map((it) => (
                        <li key={it.title} className="flex items-start gap-3 py-3.5 first:pt-1 last:pb-0">
                          <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", mark)}>
                            <Check className="size-3" aria-hidden />
                          </span>
                          <div>
                            <p className="font-sans text-[15px] font-bold leading-snug text-ink">{nbspDash(it.title)}</p>
                            <p className="mt-1 text-[14px] leading-relaxed text-ink-500">{nbspDash(it.text)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </div>
    </section>
  );
}
