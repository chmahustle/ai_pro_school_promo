import { CheckCircle2 } from "lucide-react";
import { Accordion, Reveal, Section, SectionIntro } from "@/components/ui";
import type { ProgramModule } from "@/data/types";

interface ProgramsProps {
  modules: ProgramModule[];
  title?: string;
  eyebrow?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender";
}

/** Программа курса по неделям/эфирам — аккордеон */
export function Programs({ modules, title = "Программа", eyebrow = "Что внутри", description, tone = "bg" }: ProgramsProps) {
  // Нет модулей с содержанием — блока нет (никаких пустых рамок)
  if (modules.filter((m) => m.lessons.length > 0).length === 0) return null;
  return (
    <Section id="program" tone={tone} className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionIntro id="program-title" align="left" eyebrow={eyebrow} title={title} description={description} />
        </div>
        <Reveal>
          <Accordion
            tone={tone === "white" ? "lavender" : "white"}
            defaultOpen={modules[0] ? [modules[0].id] : []}
            items={modules.map((m) => ({
              id: m.id,
              eyebrow: m.eyebrow,
              title: m.title,
              content: (
                <div className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2">
                    {m.lessons.map((l) => (
                      <li key={l} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                        <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
                        {l}
                      </li>
                    ))}
                  </ul>
                  {m.outcome && (
                    <p className="rounded-xl bg-surface px-4 py-3 text-[14px] font-medium text-ink">
                      <span className="mr-2 text-xs font-bold uppercase tracking-wide text-brand-700">Итог</span>
                      {m.outcome}
                    </p>
                  )}
                </div>
              ),
            }))}
          />
        </Reveal>
      </div>
    </Section>
  );
}
