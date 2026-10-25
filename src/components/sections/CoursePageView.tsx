import { notFound } from "next/navigation";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { CourseHero } from "@/components/sections/CourseHero";
import { CourseForWhom, CourseOutcomes, CourseMonetization } from "@/components/sections/CourseDetails";
import { Programs } from "@/components/sections/Programs";
import { Pricing } from "@/components/sections/Pricing";
import { HomeStories } from "@/components/sections/HomeStories";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { Team } from "@/components/sections/Team";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { NextSteps } from "@/components/sections/NextSteps";
import { getNextStep } from "@/data/public";
import { getCourse } from "@/data/courses";
import { productForCourseSlug } from "@/data/product-ids";
import { getCurrentPrice, getProductForCourse } from "@/data/products";
import { getPublishedReviews } from "@/data/reviews";
import { team } from "@/data/team";
import { SITE_URL, site } from "@/lib/site";

/**
 * Страница курса-лендинга (практикум, ИИ-креатор): минимальная шапка (логотип без ссылки + одна CTA) и футер, как у /for/*.
 */
export function CoursePageView({ slug }: { slug: "practicum" | "ai-creator" }) {
  const course = getCourse(slug);
  if (!course) notFound();

  const courseReviews = getPublishedReviews().filter((r) => r.course === course.slug).slice(0, 6);
  // Цена для разметки — из products.ts (единственный источник)
  const product = getProductForCourse(course.slug);
  const offerPrice = product ? getCurrentPrice(product) : null;
  // Следующая ступень лестницы (у последней ступени блока нет)
  const nextStep = product ? getNextStep(product.id) : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: { "@type": "EducationalOrganization", name: site.name, url: SITE_URL },
    url: `${SITE_URL}/courses/${course.slug}`,
    ...(offerPrice !== null
      ? {
          offers: {
            "@type": "Offer",
            price: offerPrice,
            priceCurrency: "KZT",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <div className="calm-hover pt-[88px] sm:pt-[96px]">
      <LandingHeader ctaLabel={course.ctaLabel} interest={productForCourseSlug(course.slug)} formAnchor="lead" />
      <CourseHero course={course} />
      <CourseForWhom course={course} />
      <Programs
        modules={course.program}
        title="Программа курса"
        description="Пошагово, без перегруза. Всё сразу применимо для заработка."
      />
      <CourseOutcomes course={course} />
      <CourseMonetization course={course} />
      {/* Результаты учеников этой аудитории — тот же блок, что на главной */}
      <div className="mt-6 sm:mt-10">
        <HomeStories audience={course.audiences[0]} limit={3} />
      </div>
      <Pricing course={course} />
      {product && <NextSteps id="next" title="Что дальше" steps={nextStep ? [nextStep] : []} />}
      {courseReviews.length > 0 && <ReviewsWall items={courseReviews} tone="bg" moreHref="/reviews" />}
      <Team
        items={team.filter((m) => m.id !== "maidan")}
        eyebrow="Кто ведёт"
        title="Кто ведёт курс"
        layout="grid"
      />
      <FAQ items={course.faq} />
      <LeadSection
        className="mt-10 sm:mt-16"
        formId={`course-${course.slug}`}
        title={`Записаться: ${course.shortName}`}
        description={`Ответим на вопросы, расскажем про тарифы${product?.installmentFromPerMonth != null ? " и рассрочку" : ""}, пришлём ссылку на оплату.`}
        defaultProduct={productForCourseSlug(course.slug)}
        lockProduct
        compact
        submitLabel={course.ctaLabel}
        tone="mesh"
        mesh="home"
        thanksPath={`/thanks/${productForCourseSlug(course.slug)}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
