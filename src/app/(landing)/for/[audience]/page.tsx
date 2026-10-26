import { efirNoHiddenConditions } from "@/data/efir";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingHero } from "@/components/sections/landing/LandingHero";
import { Outcomes } from "@/components/sections/landing/Outcomes";
import { ForWhom } from "@/components/sections/landing/ForWhom";
import { Comparison } from "@/components/sections/landing/Comparison";
import { FormatBlock } from "@/components/sections/landing/FormatBlock";
import { Team } from "@/components/sections/Team";
import { HomeStories } from "@/components/sections/HomeStories";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { HomeMetrics } from "@/components/sections/HomeMetrics";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { landingAudiences, getAudience } from "@/data/audiences";
import { webinarSpeakers } from "@/data/team";
import { NextSteps } from "@/components/sections/NextSteps";
import { getPublicSteps } from "@/data/public";
import { getReviewsFor } from "@/data/reviews";
import type { Audience, AudienceSlug } from "@/data/types";
import { buildMetadata } from "@/lib/seo";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { meshForAudience } from "@/lib/mesh";

const FORM_ID = "landing-form";

export function generateStaticParams() {
  return landingAudiences.map((a) => ({ audience: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }): Promise<Metadata> {
  const { audience: slug } = await params;
  const a = getAudience(slug);
  if (!a) return {};
  return buildMetadata({
    title: a.seo.title,
    description: a.seo.description,
    path: a.path,
    image: null, // file-based opengraph-image.tsx в этом сегменте
  });
}

type Block =
  | "comparison"
  | "outcomes"
  | "forWhom"
  | "speakers"
  | "results"
  | "reviews"
  | "metrics"
  | "format"
  | "faq"
  | "next";

/**
 * Порядок блоков под каждую ЦА — одни компоненты, разные акценты:
 *  business   — сначала деньги (сравнение с подрядчиком), потом программа
 *  freelancers — сначала рост чека, потом программа; дополнительно метрики школы
 *  career     — сначала чек-лист рутины, затем программа; кейсы выше спикеров
 */
const blockOrder: Record<Exclude<AudienceSlug, "beginners">, Block[]> = {
  business: ["comparison", "outcomes", "forWhom", "speakers", "results", "format", "next", "faq"],
  freelancers: ["comparison", "outcomes", "forWhom", "metrics", "speakers", "results", "format", "next", "faq"],
  career: ["comparison", "outcomes", "forWhom", "results", "speakers", "reviews", "format", "next", "faq"],
};

export default async function AudienceLandingPage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience: slug } = await params;
  const a = getAudience(slug);
  if (!a || !a.path.startsWith("/for/")) notFound();

  const order = blockOrder[a.slug as keyof typeof blockOrder] ?? blockOrder.business;
  // Тёмная шапка только над чёрным hero (бизнес); над светлыми (фриланс, специалисты) — светлая

  return (
    <>
      <LandingHeader ctaLabel={a.hero.primaryCta} interest="efir" formAnchor={FORM_ID} />
      <LandingHero
        audience={{
          slug: a.slug,
          accent: a.accent,
          hero: a.hero,
          tags: a.tags,
          leadMagnet: a.leadMagnet,
        }}
        formAnchor={FORM_ID}
      />
      {order.map((b) => (
        <LandingBlock key={b} block={b} audience={a} />
      ))}
      <LeadSection
        className="mt-10 sm:mt-16"
        id={FORM_ID}
        formId={`landing-${a.slug}`}
        eyebrow="Регистрация"
        title={a.form.title}
        description={a.form.description}
        tone="mesh"
        mesh={meshForAudience(a.slug)}
        defaultProduct="efir"
        lockProduct
        compact
        submitLabel={a.form.submitLabel}
        hint="Ссылка на эфир и гайд придут в WhatsApp"
        thanksPath="/thanks/efir"
        bullets={a.leadMagnet ? [a.leadMagnet.title, "Ссылка на эфир — в WhatsApp", efirNoHiddenConditions()] : undefined}
      />
    </>
  );
}

function LandingBlock({ block, audience }: { block: Block; audience: Audience }) {
  const slug = audience.slug;
  switch (block) {
    case "comparison":
      // placeholder-сравнения (ориентировочные суммы) не публикуем без явного флага
      if (!audience.comparison) return null;
      if (audience.comparison.status === "placeholder" && !SHOW_PLACEHOLDERS) return null;
      return <Comparison data={audience.comparison} accent={audience.accent} />;
    case "outcomes":
      return <Outcomes audience={audience} />;
    case "forWhom":
      return <ForWhom items={audience.forWhom} footnote={audience.forWhomFootnote} />;
    case "speakers":
      return (
        <Team
          items={webinarSpeakers}
          eyebrow="Спикеры"
          title="Кто проведёт эфир"
          description="Практики, которые создают AI-решения и обучают их применять."
          layout="wide"
        />
      );
    case "results":
      // Кейсы ИИ-видео на лендингах не показываем; вместо них — проекты вайб-кодинга (verified && consent, меньше 3 — блока нет)
      return (
        <div className="mt-6 sm:mt-10">
          <HomeStories audience={slug} direction="vibecoding" variant="projects" limit={3} />
        </div>
      );
    case "reviews":
      return <ReviewsWall items={getReviewsFor(slug)} limit={3} tone="lavender" />;
    case "metrics":
      return <HomeMetrics />;
    case "format":
      return <FormatBlock format={audience.format} formAnchor={FORM_ID} ctaLabel={audience.hero.primaryCta} />;
    case "next":
      // «Что дальше после эфира»: офлайн-урок и курс (карточки из products.ts)
      return <NextSteps id="after-efir" title="Что дальше после эфира" steps={getPublicSteps(["offline", "course"])} />;
    case "faq":
      return <FAQ items={audience.faq} title="Частые вопросы" />;
    default:
      return null;
  }
}
