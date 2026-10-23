import { Clock, MapPin, Users } from "lucide-react";
import { Button, Pill, Section, SectionIntro } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getNextStep, getPublicProductPage } from "@/data/public";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { nbspDash } from "@/lib/utils";
import { LeadSection } from "./LeadSection";
import { NextSteps } from "./NextSteps";
import { PageHero } from "./PageHero";

/** Заголовок блока результата: у офлайна «Что получите», у курса «Что соберёте» */
const RESULT_TITLE = { offline: "Что получите", course: "Что соберёте" } as const;

/**
 * Страница продукта вайб-кодинга (офлайн-урок, курс): hero с результатом, форматом и ценой,
 * блоки из products.ts (результат, «Где и когда», места, модули) и форма из двух полей. Нет данных — блок скрыт, в dev подписан.
 */
export function ProductLanding({ id }: { id: "offline" | "course" }) {
  const p = getPublicProductPage(id);
  const nextStep = getNextStep(id);
  const hasVenue = Boolean(p.venue.address || p.venue.schedule);

  return (
    <div className="calm-hover">
      <PageHero
        id={`${id}-title`}
        eyebrow={p.directionName}
        title={p.name}
        description={p.resultLine}
        actions={
          <>
            <Button variant="dark" size="lg" fillTone="dark" href="#lead">
              {p.ctaLabel}
            </Button>
            <Button variant="white" size="lg" href={p.directionPath}>
              О направлении
            </Button>
          </>
        }
        aside={
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" aria-label="Коротко о программе">
            <li className="rounded-[24px] bg-dark p-5 text-white">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/55">
                <Clock className="size-4" aria-hidden /> Формат
              </p>
              <p className="mt-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{nbspDash(p.format)}</p>
            </li>
            <li className="rounded-[24px] bg-surface p-5 shadow-soft">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Стоимость</p>
              <ProductPrice parts={p.price} className="mt-3 block font-display text-[34px] font-extrabold leading-none" />
              {p.installment && <p className="mt-2 text-[14px] text-ink-500">{p.installment}</p>}
              {p.seatsLeft !== null && (
                <Pill tone="brand" className="mt-3" icon={<Users />}>
                  Осталось мест: {p.seatsLeft}
                </Pill>
              )}
            </li>
          </ul>
        }
      />

      <Section className="scroll-mt-24" aria-labelledby={`${id}-result-title`}>
        <SectionIntro id={`${id}-result-title`} align="left" eyebrow="Результат" title={RESULT_TITLE[id]} />
        <p className="max-w-[40ch] rounded-[28px] bg-lavender p-6 font-display text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-bold leading-snug sm:p-8">{nbspDash(p.resultLine)}</p>
      </Section>

      {id === "offline" && hasVenue && (
        <Section aria-labelledby="offline-venue-title">
          <SectionIntro id="offline-venue-title" align="left" eyebrow="Офлайн" title="Где и когда" />
          <ul className="grid max-w-[720px] gap-4 sm:grid-cols-2">
            {p.venue.address && (
              <li className="flex items-start gap-3 rounded-[24px] bg-surface p-5 shadow-soft">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <span className="text-[15px] font-semibold">{p.venue.address}</span>
              </li>
            )}
            {p.venue.schedule && (
              <li className="flex items-start gap-3 rounded-[24px] bg-surface p-5 shadow-soft">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <span className="text-[15px] font-semibold">{p.venue.schedule}</span>
              </li>
            )}
          </ul>
        </Section>
      )}

      {id === "course" && p.modules && (
        <Section aria-labelledby="course-modules-title">
          <SectionIntro id="course-modules-title" align="left" eyebrow="Программа" title="Программа по модулям" />
          <ol className="grid gap-4 md:grid-cols-2">
            {p.modules.map((m, i) => (
              <li key={m.title} className="rounded-[24px] bg-surface p-6 shadow-soft">
                <p className="font-display text-[34px] font-extrabold leading-none text-ink/20 tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-lg leading-tight">{nbspDash(m.title)}</h3>
                <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-ink-500">
                  {m.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {SHOW_PLACEHOLDERS && p.devMissing.length > 0 && (
        <div className="container-site my-4">
          <p className="rounded-2xl border border-dashed border-danger/50 bg-danger/5 p-4 text-[13px] font-semibold text-danger">
            Блоки скрыты, нет данных в products.ts: {p.devMissing.join(", ")}
          </p>
        </div>
      )}

      <NextSteps id="next" title="Что дальше" steps={nextStep ? [nextStep] : []} />

      <LeadSection
        className="mt-10 sm:mt-16"
        id="lead"
        formId={`product-${id}`}
        title={p.name}
        description={p.format}
        defaultProduct={id}
        lockProduct
        compact
        submitLabel={p.ctaLabel}
        tone="mesh"
        mesh="home"
        thanksPath={`/thanks/${id}`}
      />
    </div>
  );
}
