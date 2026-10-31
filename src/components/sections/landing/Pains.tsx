import { Container, RevealGroup, RevealItem, SectionIntro } from "@/components/ui";
import { nbspDash } from "@/lib/utils";

interface PainsProps {
  items: { title: string; text: string }[];
  title?: string;
  eyebrow?: string;
}

/**
 * «Узнаёте себя?» - блок на фоне страницы, без цветной панели: шапка и карточки; компактные белые карточки: розовый номер слева, заголовок и текст справа. Идёт сразу после hero.
 */
export function Pains({ items, title = "Узнаёте себя?", eyebrow = "Боли" }: PainsProps) {
  if (items.length === 0) return null;
  return (
    <section id="pains" aria-labelledby="pains-title" className="mt-4 scroll-mt-24 px-2 sm:px-4">
      <div className="py-14 sm:py-16">
        <Container>
          <SectionIntro id="pains-title" align="left" eyebrow={eyebrow} title={title} />
          <RevealGroup as="ol" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <RevealItem as="li" key={p.title} className="flex">
                <div className="flex w-full items-start gap-3 rounded-[20px] bg-surface p-4 ring-1 ring-ink-100 sm:p-5">
                  <span className="mt-0.5 font-display text-[18px] font-extrabold leading-none tabular-nums text-brand">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-[17px] font-bold leading-snug text-ink">{nbspDash(p.title)}</h3>
                    <p className="mt-1 text-[14px] leading-snug text-ink-500">{nbspDash(p.text)}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </div>
    </section>
  );
}
