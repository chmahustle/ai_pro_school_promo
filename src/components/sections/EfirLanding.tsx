import { Calendar, Clock, Signal, MonitorPlay } from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Button } from "@/components/ui";
import { getFaq } from "@/data/faq";
import { formConfig } from "@/data/forms";
import { getPublicLadder } from "@/data/public";
import { getVibecodingBlocks } from "@/data/vibecodingBlocks";
import { cn } from "@/lib/utils";
import { OutcomeTiles } from "./BlockTiles";
import { AgendaDark, ColorfulForWhom } from "./EfirBlocks";
import { FAQ } from "./FAQ";
import { LeaderCard } from "./LeaderCard";
import { LeadSection } from "./LeadSection";
import { NextSteps } from "./NextSteps";
import { PageHero } from "./PageHero";

/** Иконки и цвета плиток фактов (как в hero курсов) */
const FACT_ICONS = { duration: Clock, format: MonitorPlay, level: Signal, start: Calendar } as const;
const FACT_TILES = ["bg-brand text-white", "bg-dark text-white", "bg-lavender text-ink", "bg-surface text-ink shadow-soft"];

/**
 * Нейтральная страница эфира «Вайб-кодинг вживую» (шаблон лендинга /for/*: минимальная шапка, одна главная кнопка, форма →
 * /thanks/efir). Блоки - vibecodingBlocks.ts (только verified); цена и слово «бесплатно» (если появится) - products.ts / efir.ts.
 * Без обещаний дохода.
 */
export function EfirLanding() {
  const ladder = getPublicLadder("vibecoding");
  const efir = ladder.steps.find((s) => s.isEntry);
  if (!efir) return null;
  const blocks = getVibecodingBlocks();
  const next = ladder.steps.filter((s) => !s.isEntry);

  return (
    <div className="calm-hover tight-sections pt-[88px] sm:pt-[96px]">
      <LandingHeader ctaLabel={efir.ctaLabel} interest="efir" formAnchor="lead" />
      <PageHero
        id="efir-title"
        eyebrow="Вайб-кодинг"
        title={efir.name}
        description={efir.resultLine}
        actions={
          <Button variant="dark" size="lg" fillTone="dark" href="#lead">
            {efir.ctaLabel}
          </Button>
        }
        aside={
          <ul className="grid grid-cols-2 gap-4" aria-label="Коротко об эфире">
            {blocks.heroFacts.map((f, i) => {
              const Icon = FACT_ICONS[f.id as keyof typeof FACT_ICONS] ?? Clock;
              return (
                <li key={f.id} className={cn("flex min-h-[130px] flex-col justify-between gap-3 rounded-[24px] p-5", FACT_TILES[i % FACT_TILES.length])}>
                  <p className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider opacity-70">
                    {f.label}
                    <Icon className="size-4" aria-hidden />
                  </p>
                  <p className="font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{f.value}</p>
                </li>
              );
            })}
          </ul>
        }
      />

      <ColorfulForWhom id="efir-forwhom-title" items={blocks.forWhom} />

      <AgendaDark id="efir-agenda-title" items={blocks.efirAgenda} />

      <OutcomeTiles id="efir-outcomes-title" items={blocks.outcomes} title="Чему научитесь" />

      <LeaderCard id="efir-leader-title" leader={ladder.leader} />

      <FAQ items={getFaq("vibecoding-efir")} />

      <NextSteps id="next" title="Что дальше после эфира" steps={next} />

      <LeadSection
        className="mt-0"
        id="lead"
        formId="product-efir"
        title={formConfig.productLeadTitle}
        description={efir.format}
        defaultProduct="efir"
        lockProduct
        compact
        submitLabel={efir.ctaLabel}
        tone="mesh"
        mesh="home"
        thanksPath="/thanks/efir"
      />
    </div>
  );
}
