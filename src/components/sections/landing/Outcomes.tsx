import { Gift } from "lucide-react";
import { RevealGroup, RevealItem, Section, SectionIntro, TileDecor, type TileDecorTone } from "@/components/ui";
import type { Audience } from "@/data/types";
import { cn } from "@/lib/utils";

interface OutcomesProps {
  audience: Audience;
  title?: string;
  eyebrow?: string;
}

/** Цвета плиток как на главной: розовая, тёмная, сиреневая (дальше по кругу) */
const tones: { tile: string; text: string; num: string; decor: TileDecorTone }[] = [
  { tile: "bg-brand text-white", text: "text-white/80", num: "text-white/30", decor: "brand" },
  { tile: "bg-dark text-white", text: "text-white/65", num: "text-white/25", decor: "dark" },
  { tile: "bg-lavender text-ink", text: "text-ink-500", num: "text-ink/20", decor: "lavender" },
];

/** «За 1,5 часа вы поймёте» — цветные нумерованные плитки + плашка лид-магнита */
export function Outcomes({ audience, title = "За 1,5 часа вы поймёте", eyebrow = "Программа эфира" }: OutcomesProps) {
  return (
    <Section id="program" className="scroll-mt-24">
      <SectionIntro id="program-title" align="left" eyebrow={eyebrow} title={title} />
      <RevealGroup as="ol" className="audience-grid grid gap-5 md:grid-cols-3">
        {audience.outcomes.map((o, i) => {
          const t = tones[i % tones.length]!;
          return (
            <RevealItem as="li" key={o.title} className="flex">
              <div className={cn("audience-tile relative flex min-h-[260px] w-full flex-col overflow-hidden rounded-[28px] p-6 sm:p-7", t.tile)}>
                <TileDecor tone={t.decor} />
                <span className={cn("relative font-display text-[48px] font-extrabold leading-none tabular-nums", t.num)}>0{i + 1}</span>
                <h3 className="relative mt-auto pt-8 font-display text-[21px] font-bold leading-tight">{o.title}</h3>
                <p className={cn("relative mt-2 text-[14px] leading-snug", t.text)}>{o.text}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {audience.leadMagnet && (
        <RevealItem className="mt-5 flex items-start gap-4 rounded-[28px] bg-surface p-5 shadow-soft sm:items-center sm:p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-white">
            <Gift className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Бонус</p>
            <p className="font-display text-lg leading-tight">{audience.leadMagnet.title}</p>
            <p className="mt-1 text-[14px] text-ink-500">{audience.leadMagnet.description}</p>
          </div>
        </RevealItem>
      )}
    </Section>
  );
}
