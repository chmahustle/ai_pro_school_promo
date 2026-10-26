import { Section, SectionIntro } from "@/components/ui";
import type { PublicLadderStep } from "@/data/public-types";
import { cn } from "@/lib/utils";
import { LadderStepCard } from "./LadderStepCard";

/**
 * Блок «Что дальше»: одна или несколько карточек продуктов (лендинги после эфира, страницы продуктов — следующая ступень).
 * Нет шагов — блока нет. Одна карточка — по центру (как «Что входит» в тарифах), несколько — слева в две колонки. Данные — PublicLadderStep из products.ts.
 */
export function NextSteps({ id, eyebrow = "Дальше", title, description, steps }: { id: string; eyebrow?: string; title: string; description?: string; steps: PublicLadderStep[] }) {
  if (steps.length === 0) return null;
  return (
    <Section id={id} className="scroll-mt-24" aria-labelledby={`${id}-title`}>
      <SectionIntro id={`${id}-title`} align={steps.length === 1 ? "center" : "left"} eyebrow={eyebrow} title={title} description={description} />
      <ul className={cn("grid gap-5", steps.length === 1 ? "mx-auto max-w-xl" : "md:grid-cols-2")}>
        {steps.map((s) => (
          <li key={s.id} className="flex">
            <LadderStepCard step={s} showEntry={false} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
