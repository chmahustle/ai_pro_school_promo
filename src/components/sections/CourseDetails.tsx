import { Check, X } from "lucide-react";
import { HomeSection, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { Course } from "@/data/types";
import { cn, nbspDash } from "@/lib/utils";

/** «Кому подходит / кому нет» */
export function CourseForWhom({ course }: { course: Course }) {
  if (course.forWhom.length === 0) return null;
  return (
    <Section>
      <SectionIntro id="for-whom-title" align="left" eyebrow="Кому подходит" title="Курс для вас, если вы" />
      <div className={cn("grid gap-5", course.notForWhom ? "lg:grid-cols-[1.6fr_1fr]" : "")}>
        <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2">
          {course.forWhom.map((f) => (
            <RevealItem as="li" key={f.title} className="flex">
              <div className="audience-tile flex w-full gap-4 rounded-[24px] bg-surface p-5 shadow-soft sm:p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <Check className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="font-sans text-[16px] font-bold leading-snug">{nbspDash(f.title)}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{nbspDash(f.text)}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        {course.notForWhom && (
          <RevealItem className="flex flex-col gap-4 rounded-[28px] bg-dark p-6 text-white sm:p-7">
            <p className="font-display text-xl">Важно сразу сказать честно</p>
            <p className="text-[14px] text-white/65">Это не пассивный доход и не «кнопка бабло». Курс не подойдёт:</p>
            <ul className="flex flex-col gap-2.5">
              {course.notForWhom.map((n) => (
                <li key={n} className="flex items-start gap-2.5 text-[15px]">
                  <X className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-auto rounded-2xl bg-brand p-4 text-[14px] font-semibold text-white">
              Зато результат — реальный доход и понятный рост, а не случайные заказы.
            </p>
          </RevealItem>
        )}
      </div>
    </Section>
  );
}

/** «Чему научитесь» — нумерованные плитки */
export function CourseOutcomes({ course }: { course: Course }) {
  if (course.outcomes.length === 0) return null;
  return (
    <Section>
      <SectionIntro id="outcomes-title" align="left" eyebrow="Результат" title="За время обучения вы научитесь" />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {course.outcomes.map((o, i) => (
          <RevealItem as="li" key={o} className="flex">
            <div className="audience-tile flex w-full items-start gap-4 rounded-[24px] bg-surface p-5 shadow-soft">
              <span className="font-display text-[28px] font-extrabold leading-none text-brand/40 tabular-nums">0{i + 1}</span>
              <p className="text-[15px] font-medium leading-snug">{o}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** «Как вы зарабатываете» — тёмная панель главной со стеклянными плитками */
export function CourseMonetization({ course }: { course: Course }) {
  if (!course.monetization || course.monetization.length === 0) return null;
  return (
    <HomeSection id="monetization" labelledBy="monetization-title" tone="dark" compact className="mt-4">
      <SectionIntro
        id="monetization-title"
        tone="dark"
        align="left"
        eyebrow="Как вы зарабатываете"
        title="Курс — это не только навыки. Мы показываем, как превращать ИИ в деньги"
      />
      <RevealGroup as="ul" className={cn("audience-grid grid gap-4", course.monetization.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2")}>
        {course.monetization.map((m, i) => (
          <RevealItem as="li" key={m.title} className="flex">
            <div className="audience-tile flex w-full flex-col gap-4 rounded-[24px] bg-white/[0.07] p-6 ring-1 ring-white/10">
              <span className="font-display text-[40px] font-extrabold leading-none text-white/20 tabular-nums">0{i + 1}</span>
              <h3 className="font-display text-lg leading-tight text-white">{m.title}</h3>
              <ul className="flex flex-col gap-2">
                {m.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[14px] text-white/70">
                    <span className="mt-[8px] size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </HomeSection>
  );
}
