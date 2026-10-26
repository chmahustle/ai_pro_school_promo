import { Check } from "lucide-react";
import { RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { PublicVibeItem } from "@/data/vibecodingBlocks";
import { nbspDash } from "@/lib/utils";

/** Красная dev-пометка у неподтверждённого пункта (приходит только в dev) */
function DevNote({ note }: { note?: string }) {
  return note ? <p className="mb-1 text-[12px] font-semibold text-danger">{note}</p> : null;
}

/** «Кому подходит»: карточки с галочкой (данные — vibecodingBlocks.ts) */
export function ForWhomTiles({ id, items, title = "Это для вас, если вы" }: { id: string; items: PublicVibeItem[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Кому подходит" title={title} />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2">
        {items.map((f) => (
          <RevealItem as="li" key={f.id} className="flex">
            <div className="audience-tile flex w-full gap-4 rounded-[24px] bg-surface p-5 shadow-soft sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                <Check className="size-4" aria-hidden />
              </span>
              <div>
                <DevNote note={f.devNote} />
                {f.title && <h3 className="font-sans text-[16px] font-bold leading-snug">{nbspDash(f.title)}</h3>}
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{nbspDash(f.text)}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** «Чему научитесь»: нумерованные плитки */
export function OutcomeTiles({ id, items, title = "За время обучения вы научитесь" }: { id: string; items: PublicVibeItem[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Результат" title={title} />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((o, i) => (
          <RevealItem as="li" key={o.id} className="flex">
            <div className="audience-tile flex w-full items-start gap-4 rounded-[24px] bg-surface p-5 shadow-soft">
              <span className="font-display text-[28px] font-extrabold leading-none text-brand/40 tabular-nums">0{i + 1}</span>
              <div>
                <DevNote note={o.devNote} />
                <p className="text-[15px] font-medium leading-snug">{nbspDash(o.text)}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
