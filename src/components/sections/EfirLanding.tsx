import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Button, Section, SectionIntro } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getCourse } from "@/data/courses";
import { getFaq } from "@/data/faq";
import { formConfig } from "@/data/forms";
import { getPublicLadder } from "@/data/public";
import { CourseForWhom } from "./CourseDetails";
import { FAQ } from "./FAQ";
import { LeaderCard } from "./LeaderCard";
import { LeadSection } from "./LeadSection";
import { NextSteps } from "./NextSteps";
import { PageHero } from "./PageHero";
import { Programs } from "./Programs";

/**
 * Нейтральная страница эфира «Вайб-кодинг вживую» (шаблон лендинга /for/*: минимальная шапка, одна главная кнопка, форма →
 * /thanks/efir). Тексты общие — из courses.ts, products.ts и faq.ts; цена и слово «бесплатно» (если появится) — только из products.ts / efir.ts.
 * Без обещаний дохода.
 */
export function EfirLanding() {
  const ladder = getPublicLadder("vibecoding");
  const efir = ladder.steps.find((s) => s.isEntry);
  const course = getCourse("vibecoding");
  if (!efir || !course) return null;
  const next = ladder.steps.filter((s) => !s.isEntry);

  return (
    <div className="calm-hover pt-[88px] sm:pt-[96px]">
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" aria-label="Коротко об эфире">
            <li className="rounded-[24px] bg-dark p-5 text-white">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/55">
                <Clock className="size-4" aria-hidden /> Формат
              </p>
              <p className="mt-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{efir.format}</p>
            </li>
            <li className="rounded-[24px] bg-surface p-5 shadow-soft">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Стоимость</p>
              <ProductPrice parts={efir.price} className="mt-3 block font-display text-[34px] font-extrabold leading-none" />
            </li>
          </ul>
        }
      />

      <CourseForWhom course={course} />

      {ladder.forWhomLinks.length > 0 && (
        <Section aria-labelledby="efir-forwhom-title" className="-mt-8">
          <SectionIntro id="efir-forwhom-title" align="left" eyebrow="Для кого" title="Эфир для вашей задачи" />
          <ul className="flex flex-wrap gap-3" role="list">
            {ladder.forWhomLinks.map((c) => (
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

      <Programs modules={course.program} title="Что будет на эфире" eyebrow="Программа эфира" />

      <LeaderCard id="efir-leader-title" leader={ladder.leader} />

      <FAQ items={getFaq("vibecoding-efir")} />

      <NextSteps id="next" title="Что дальше после эфира" steps={next} />

      <LeadSection
        className="mt-10 sm:mt-16"
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
