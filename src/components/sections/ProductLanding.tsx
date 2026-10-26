import Link from "next/link";
import { ArrowRight, Bot, Clock, Flag, MapPin, Send, Store, Users } from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Button, Pill, Section, SectionIntro } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getNextStep, getPublicProductPage } from "@/data/public";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { cn, nbspDash } from "@/lib/utils";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { getFaq } from "@/data/faq";
import { getCourseOutcomes, getVibecodingBlocks } from "@/data/vibecodingBlocks";
import { ForWhomTiles, OutcomeTiles } from "./BlockTiles";
import { FAQ } from "./FAQ";
import { LeaderCard } from "./LeaderCard";
import { LeadSection } from "./LeadSection";
import { NextSteps } from "./NextSteps";
import { RefundTerms } from "./RefundTerms";
import { PageHero } from "./PageHero";

/** Заголовок блока результата: у офлайна «Что получите», у курса «Что соберёте» */
const RESULT_TITLE = { offline: "Что получите", course: "Что соберёте" } as const;

/** Иконки пунктов «Что соберёте» (ключи — из products.ts → deliverables) */
const DELIVERABLE_ICONS = { store: Store, send: Send, bot: Bot, flag: Flag } as const;

/**
 * Страница продукта вайб-кодинга (офлайн-урок, курс): hero с результатом, форматом и ценой,
 * блоки из products.ts (результат, «Где и когда», места, модули) и форма из двух полей. Нет данных — блок скрыт, в dev подписан.
 */
export function ProductLanding({ id }: { id: "offline" | "course" }) {
  const p = getPublicProductPage(id);
  const nextStep = getNextStep(id);
  const hasVenue = Boolean(p.venue.address || p.venue.schedule);

  return (
    <div className={cn("calm-hover pt-[88px] sm:pt-[96px]", id === "course" && "tight-sections")}>
      <LandingHeader ctaLabel={p.ctaLabel} interest={id} formAnchor="lead" />
      <PageHero
        id={`${id}-title`}
        eyebrow={p.directionName}
        title={p.name}
        titleCaption={
          p.workingTitle ? (
            <>
              {p.workingTitle}
              {p.workingTitleDevNote && <span className="ml-3 align-middle text-[12px] font-semibold text-danger">{p.workingTitleDevNote}</span>}
            </>
          ) : undefined
        }
        description={p.resultLine}
        actions={
          <>
            <Button variant="dark" size="lg" fillTone="dark" href="#lead">
              {p.ctaLabel}
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
              {p.devOldPrice && (
                <p className="mt-2 text-[13px] text-danger">
                  <span className="line-through">{p.devOldPrice.amount}</span> {p.devOldPrice.label} · {p.devOldPrice.note}
                </p>
              )}
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
        {id === "course" && p.deliverables.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.deliverables.map((d) => {
              const Icon = DELIVERABLE_ICONS[d.icon];
              return (
                <li key={d.id} className="relative flex items-start gap-4 rounded-[24px] bg-lavender p-5 sm:p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-brand-600">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-display text-[18px] font-bold leading-snug">{nbspDash(d.title)}</span>
                  {d.unverified && <PlaceholderBadge status="unverified" note="Пункт не подтверждён клиентом: в проде вместо него «Итоговый проект»" />}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="max-w-[40ch] rounded-[28px] bg-lavender p-6 font-display text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] font-bold leading-snug sm:p-8">{nbspDash(p.resultLine)}</p>
        )}
      </Section>

      {/* Лендинг курса: «Кому подходит» и «Чему научитесь» — без обещаний дохода и трудоустройства */}
      {id === "course" && <ForWhomTiles id="course-forwhom-tiles-title" items={getVibecodingBlocks().forWhom} />}
      {id === "course" && <OutcomeTiles id="course-outcomes-title" items={getCourseOutcomes()} title="Чему научитесь на курсе" />}

      {id === "course" && p.forWhomLinks && p.forWhomLinks.length > 0 && (
        <Section aria-labelledby="course-forwhom-title">
          <SectionIntro id="course-forwhom-title" align="left" eyebrow="Кому подходит" title="Для кого этот курс" />
          <ul className="flex flex-wrap gap-3" role="list">
            {p.forWhomLinks.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-surface px-5 py-2.5 text-[15px] font-semibold text-ink shadow-soft ring-1 ring-ink/5 transition-colors hover:bg-lavender focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {c.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

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

      {id === "course" && p.leader && <LeaderCard id="course-leader-title" leader={p.leader} />}

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

      <RefundTerms text={p.refundTerms} />

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
