import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Button, Pill, Section, SectionIntro } from "@/components/ui";
import { KaspiIcon } from "@/components/ui/KaspiIcon";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getCourseTeachers, getNextStep, getPublicProductPage } from "@/data/public";
import { cn, nbspDash } from "@/lib/utils";
import { getFaq } from "@/data/faq";
import { getCourseContent } from "@/data/courseContent";
import { ForWhomTiles } from "./BlockTiles";
import { courseHeroFormat, courseHeroLevel } from "@/data/courseContent";
import { CourseCosts, CourseDelivery, CourseMilestones, CourseProgram, CourseTeachers } from "./CourseBlocks";
import { FAQ } from "./FAQ";
import { VideoReviews } from "./VideoReviews";
import { LeadSection } from "./LeadSection";
import { NextSteps } from "./NextSteps";
import { RefundTerms } from "./RefundTerms";
import { PageHero } from "./PageHero";

/** Заголовок блока результата у офлайна */
const OFFLINE_RESULT_TITLE = "Что получите";

/**
 * Страница продукта вайб-кодинга (офлайн-урок, курс): hero с результатом, форматом и ценой,
 * блоки из products.ts (результат, «Где и когда», места, модули) и форма из двух полей. Нет данных — блок скрыт, в dev подписан.
 */
export function ProductLanding({ id }: { id: "offline" | "course" }) {
  const p = getPublicProductPage(id);
  const content = id === "course" ? getCourseContent() : null;
  const nextStep = getNextStep(id);
  const hasVenue = Boolean(p.venue.address || p.venue.schedule);

  return (
    <div className={cn("calm-hover pt-[88px] sm:pt-[96px]", id === "course" && "tight-sections")}>
      <LandingHeader ctaLabel={p.ctaLabel} interest={id} formAnchor="lead" />
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
          </>
        }
        aside={
          <div className="flex flex-col gap-4">
            {id === "course" ? (
              <ul className="grid grid-cols-2 gap-4" aria-label="Коротко о программе">
                <li className="col-span-2 rounded-[24px] bg-dark p-5 text-white">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/55">
                    <Clock className="size-4" aria-hidden /> Формат
                  </p>
                  <p className="mt-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{courseHeroFormat}</p>
                </li>
                <li className="rounded-[24px] bg-surface p-5 shadow-soft">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Уровень</p>
                  <p className="mt-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{courseHeroLevel}</p>
                </li>
                <li className="rounded-[24px] bg-lavender p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Срок</p>
                  <p className="mt-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">
                    {p.format}
                    {p.devFormatNote && <span className="ml-2 align-middle text-[12px] font-semibold text-danger">{p.devFormatNote}</span>}
                  </p>
                  {p.start && <p className="mt-1 text-[14px] text-ink-500">Старт: {p.start}</p>}
                </li>
              </ul>
            ) : (
              <div className="rounded-[24px] bg-dark p-5 text-white">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/55">
                  <Clock className="size-4" aria-hidden /> Формат
                </p>
                <p className="mt-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{nbspDash(p.format)}</p>
              </div>
            )}
            <div className="rounded-[24px] bg-surface p-5 shadow-soft">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Стоимость</p>
              <ProductPrice parts={p.price} className="mt-3 block font-display text-[34px] font-extrabold leading-none" />
              {p.devOldPrice && (
                <p className="mt-2 text-[13px] text-danger">
                  <span className="line-through">{p.devOldPrice.amount}</span> {p.devOldPrice.label} · {p.devOldPrice.note}
                </p>
              )}
              {p.kaspi && (
                <span className="mt-3 inline-flex items-center gap-2 rounded-pill bg-kaspi py-1.5 pl-1.5 pr-4 text-[14px] font-bold leading-none text-white">
                  <KaspiIcon className="size-6 shrink-0" />
                  {p.kaspi}
                </span>
              )}
              {p.installment && <p className="mt-2 text-[14px] text-ink-500">{p.installment}</p>}
              {p.seatsLeft !== null && (
                <Pill tone="brand" className="mt-3" icon={<Users />}>
                  Осталось мест: {p.seatsLeft}
                </Pill>
              )}
            </div>
          </div>
        }
      />

      {content ? (
        <CourseMilestones id="course-milestones-title" items={content.milestones} />
      ) : (
        <Section className="scroll-mt-24" aria-labelledby={`${id}-result-title`}>
          <SectionIntro id={`${id}-result-title`} align="left" eyebrow="Результат" title={OFFLINE_RESULT_TITLE} />
          <p className="max-w-[40ch] rounded-[28px] bg-lavender p-6 font-display text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-bold leading-snug sm:p-8">{nbspDash(p.resultLine)}</p>
        </Section>
      )}

      {content && <CourseProgram program={content.program} />}
      {content && <CourseDelivery items={content.delivery} />}
      {content && <CourseCosts costs={content.costs} />}
      {content && <ForWhomTiles id="course-forwhom-title" items={content.forWhom} title="Курс подойдёт, если вы" />}
      {content && <CourseTeachers teachers={getCourseTeachers()} />}

      {id === "course" && p.path && p.path.length > 1 && (
        <Section aria-labelledby="course-path-title">
          <SectionIntro id="course-path-title" align="left" eyebrow="Путь" title="Путь к курсу" />
          <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
            {p.path.map((s, i) => (
              <li key={s.id} className="flex flex-1 items-stretch gap-3">
                {i > 0 && <ArrowRight className="hidden size-5 shrink-0 self-center text-ink-300 lg:block" aria-hidden />}
                {s.current ? (
                  <div aria-current="step" className="flex-1 rounded-[24px] bg-dark p-5 text-white sm:p-6">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-white/60">{s.stepLabel}</p>
                    <p className="mt-2 font-display text-[19px] font-bold leading-snug">{nbspDash(s.name)}</p>
                    <p className="mt-2 text-[13px] font-semibold text-white/70">Вы здесь</p>
                  </div>
                ) : (
                  <Link
                    href={s.href}
                    className="group flex-1 rounded-[24px] bg-surface p-5 shadow-soft ring-1 ring-ink/5 transition-colors hover:bg-lavender focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand sm:p-6"
                  >
                    <p className="text-[12px] font-bold uppercase tracking-wider text-ink-500">{s.stepLabel}</p>
                    <p className="mt-2 font-display text-[19px] font-bold leading-snug">{nbspDash(s.name)}</p>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

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

      <RefundTerms text={p.refundTerms} />

      {id === "offline" && <VideoReviews page="vibecoding-offline" />}

      <FAQ items={getFaq(id === "offline" ? "vibecoding-offline" : "vibecoding-course")} />

      <NextSteps id="next" title="Что дальше" steps={nextStep ? [nextStep] : []} />

      <LeadSection
        className={id === "course" ? "mt-0" : "mt-10 sm:mt-16"}
        id="lead"
        formId={`product-${id}`}
        title={p.formTitle}
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
