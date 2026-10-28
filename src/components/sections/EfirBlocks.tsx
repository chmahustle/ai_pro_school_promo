import { Check } from "lucide-react";
import { HomeSection, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { PublicVibeItem } from "@/data/vibecodingBlocks";
import { cn, nbspDash } from "@/lib/utils";

const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";

/** Цветные плитки в языке сайта (контраст текста ≥ AA): розовая (brand-600), тёмная, лавандовая, персиковая, белая, сиреневая */
const TONES = [
  { tile: "bg-brand-600 text-white", text: "text-white/85", icon: "bg-white/20 text-white", decor: "#ffffff", decorOpacity: 0.16 },
  { tile: "bg-dark text-white", text: "text-white/70", icon: "bg-brand text-white", decor: "#ffffff", decorOpacity: 0.1 },
  { tile: "bg-lavender text-ink", text: "text-ink-700", icon: "bg-surface text-brand-600", decor: "#ffffff", decorOpacity: 0.85 },
  { tile: "bg-peach text-ink", text: "text-ink-700", icon: "bg-surface text-brand-600", decor: "#ffffff", decorOpacity: 0.7 },
  { tile: "bg-surface text-ink shadow-soft", text: "text-ink-500", icon: "bg-brand-600 text-white", decor: "#ece9ff", decorOpacity: 0.9 },
  { tile: "bg-soft-200 text-ink", text: "text-ink-700", icon: "bg-surface text-brand-600", decor: "#ffffff", decorOpacity: 0.8 },
] as const;

function Decor({ tone, className }: { tone: (typeof TONES)[number]; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cn("pointer-events-none absolute -z-0 size-[120px]", className)} fill={tone.decor} fillOpacity={tone.decorOpacity}>
      <path d={STAR} />
    </svg>
  );
}

function DevNote({ note }: { note?: string }) {
  return note ? <p className="mb-1 text-[12px] font-semibold text-danger">{note}</p> : null;
}

/** «Кому подходит»: цветные карточки с фигурами (данные — vibecodingBlocks.ts) */
export function ColorfulForWhom({ id, items }: { id: string; items: PublicVibeItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Кому подходит" title="Это для вас, если вы" />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => {
          const t = TONES[i % TONES.length]!;
          return (
            <RevealItem as="li" key={f.id} className="flex">
              <div className={cn("audience-tile relative isolate flex min-h-[176px] w-full flex-col gap-4 overflow-hidden rounded-[28px] p-6", t.tile)}>
                <Decor tone={t} className="-bottom-8 -right-8" />
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", t.icon)}>
                  <Check className="size-4" aria-hidden />
                </span>
                <div className="relative">
                  <DevNote note={f.devNote} />
                  {f.title && <h3 className="font-display text-[20px] font-bold leading-snug">{nbspDash(f.title)}</h3>}
                  <p className={cn("mt-2 text-[14px] leading-relaxed", t.text)}>{nbspDash(f.text)}</p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

/** «Что будет на эфире»: тёмная панель, пункты повестки в стеклянных плитках с крупными номерами */
export function AgendaDark({ id, items }: { id: string; items: PublicVibeItem[] }) {
  if (items.length === 0) return null;
  return (
    <HomeSection labelledBy={id} tone="dark" compact>
      <SectionIntro id={id} tone="dark" align="left" eyebrow="Программа эфира" title="Что будет на эфире" />
      <RevealGroup as="ol" className={cn("audience-grid grid gap-4", items.length > 1 ? "md:grid-cols-2" : "")}>
        {items.map((a, i) => (
          <RevealItem as="li" key={a.id} className="flex">
            <div className="audience-tile relative isolate flex min-h-[150px] w-full items-start gap-5 overflow-hidden rounded-[28px] bg-white/[0.07] p-6 ring-1 ring-white/10 sm:p-7">
              <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -bottom-10 -right-10 -z-0 size-[160px]" fill="#e8307e" fillOpacity={0.35}>
                <path d={STAR} />
              </svg>
              <span className="font-display text-[44px] font-extrabold leading-none text-brand tabular-nums">0{i + 1}</span>
              <div className="relative">
                <DevNote note={a.devNote} />
                <p className="font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-bold leading-snug text-white">{nbspDash(a.text)}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </HomeSection>
  );
}

/** «Чему научитесь»: цветные плитки с крупными номерами */
export function ColorfulOutcomes({ id, items }: { id: string; items: PublicVibeItem[] }) {
  if (items.length === 0) return null;
  // Тёмную плитку в этом блоке пропускаем: после тёмной повестки нужен светлый ритм
  const tones = [TONES[3]!, TONES[2]!, TONES[0]!, TONES[5]!, TONES[4]!];
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Результат" title="Чему научитесь" />
      <RevealGroup as="ul" className={cn("audience-grid grid gap-4 sm:grid-cols-2", items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {items.map((o, i) => {
          const t = tones[i % tones.length]!;
          return (
            <RevealItem as="li" key={o.id} className="flex">
              <div className={cn("audience-tile relative isolate flex min-h-[150px] w-full flex-col justify-between gap-6 overflow-hidden rounded-[28px] p-6", t.tile)}>
                <Decor tone={t} className="-right-6 -top-6" />
                <span className="relative font-display text-[40px] font-extrabold leading-none tabular-nums opacity-40">0{i + 1}</span>
                <div className="relative">
                  <DevNote note={o.devNote} />
                  <p className="font-display text-[18px] font-bold leading-snug">{nbspDash(o.text)}</p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
