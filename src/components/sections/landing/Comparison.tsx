import { RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { Audience } from "@/data/types";

interface ComparisonProps {
  data: NonNullable<Audience["comparison"]>;
  accent?: Audience["accent"];
}

/**
 * Сравнение в языке меню «Для кого»: серая подложка со списком белых строк. В каждой строке слева квадратная плитка
 * с номером, по центру задача и прежний вариант («до»), справа «после» в закруглённой тёмной плитке, растянутой на столбец.
 */
export function Comparison({ data }: ComparisonProps) {
  return (
    <Section id="comparison">
      <SectionIntro id="comparison-title" align="left" eyebrow="Наглядно" title={data.title} description={data.description} />

      <RevealGroup as="ul" className="flex flex-col gap-1 rounded-[28px] bg-ink/[0.06] p-2 sm:p-2.5">
        {data.rows.map((row, i) => (
          <RevealItem as="li" key={row.task}>
            <div className="grid items-center gap-3 rounded-[22px] bg-surface p-3 transition-shadow duration-200 hover:shadow-soft sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5 sm:p-4">
              <div className="flex items-center gap-4 sm:contents">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ink/[0.06] font-display text-lg font-extrabold text-ink">0{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-display text-[17px] font-bold leading-snug text-ink">{row.task}</p>
                  <p className="mt-0.5 text-[13px] text-ink-500">
                    {data.beforeLabel}: <span className="font-semibold line-through decoration-ink/30 decoration-2">{row.before}</span>
                  </p>
                </div>
              </div>

              {/* «После» — в закруглённой плитке, как иконки в меню */}
              <div className="flex min-h-16 w-full flex-col justify-center rounded-2xl bg-dark px-5 py-3 text-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-200">{data.afterLabel}</p>
                <p className="font-display text-[17px] font-extrabold leading-tight">{row.after}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
