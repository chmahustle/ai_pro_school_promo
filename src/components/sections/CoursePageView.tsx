import { getFaq } from "@/data/faq";
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
import { getCourseTeachers, getNextStep, getRefundTerms } from "@/data/public";
import { RefundTerms } from "@/components/sections/RefundTerms";
import { getCourse } from "@/data/courses";
import { productForCourseSlug } from "@/data/product-ids";
import { getCurrentPrice, getProductForCourse } from "@/data/products";
import { getPublishedReviews } from "@/data/reviews";
import { youtubeIdFromUrl } from "@/lib/youtube";
import { getPracticumGets, getPracticumGuide, getPracticumTeacher, getPracticumGrowth, getPracticumResults, practicumVideo } from "@/data/courseContent";
import { PracticumGets, PracticumGuide, PracticumTeacher, PracticumGrowth, PracticumResults, PracticumVideo } from "@/components/sections/CourseBlocks";
import { team } from "@/data/team";
import { SITE_URL, site } from "@/lib/site";

/**
 * Страница курса-лендинга (практикум, AI Content Creator): минимальная шапка (логотип без ссылки + одна CTA) и футер, как у /for/*.
 */
export function CoursePageView({ slug }: { slug: "practicum" | "ai-creator" }) {
  const course = getCourse(slug);
  if (!course) notFound();

  const courseReviews = getPublishedReviews().filter((r) => r.course === course.slug).slice(0, 6);
  // Практикум: отдельные стены - рилсы (видео) и благодарности (переписки)
  const practicumAll = getPublishedReviews().filter((r) => r.course === "practicum");
  const practicumReels = practicumAll.filter((r) => r.kind === "video");
  // Цена для разметки - из products.ts (единственный источник)
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

  const isPracticum = course.slug === "practicum";
  const programBlock = (
    <Programs
      modules={course.program}
      title={isPracticum ? "Программа практикума" : "Программа курса"}
      description="Пошагово, без перегруза. Всё сразу применимо на практике"
    />
  );
  // Результаты учеников этой аудитории - тот же блок, что на главной (практикум: только кейсы про просмотры + рилсы учеников в той же ленте)
  const worksBlock = (
    <div className="mt-6 sm:mt-10">
      {isPracticum ? (
        <HomeStories
          audience={course.audiences[0]}
          limit={12}
          onlyViews
          description="Люди без технического образования, освоившие ИИ-ролики"
          extraVideos={practicumReels.flatMap((r) => {
            const id = youtubeIdFromUrl(r.embedUrl);
            // Ролик «7 дней мы даём» (wC3Iwmk_MTg) - это «Коротко о практикуме», в ленту работ не входит
            return id && id !== practicumVideo.youtubeId && r.src ? [{ id: r.id, poster: r.src, youtubeId: id }] : [];
          })}
        />
      ) : (
        <HomeStories audience={course.audiences[0]} limit={12} />
      )}
    </div>
  );

  return (
    <div className="calm-hover pt-[88px] sm:pt-[96px]">
      <LandingHeader ctaLabel={course.ctaLabel} interest={productForCourseSlug(course.slug)} formAnchor="lead" />
      <CourseHero course={course} />
      <CourseForWhom course={course} />
      {isPracticum ? (
        <>
          {/* Воронка практикума: узнал себя → быстро понял суть (видео) → что научится → как проходит и что входит →
              доказательства (работы, переписки) → что будет после (заказы) → кто ведёт и почему им верить → снять сомнения (FAQ) → мини-гайд → запись */}
          <PracticumVideo youtubeId={practicumVideo.youtubeId} posterSrc={practicumVideo.posterSrc} title={practicumVideo.title} />
          <CourseOutcomes course={course} />
          {programBlock}
          <PracticumGets items={getPracticumGets()} />
          {worksBlock}
          <PracticumResults results={getPracticumResults()} />
          <CourseMonetization course={course} />
          <PracticumTeacher teacher={getPracticumTeacher()} photo={getCourseTeachers().find((t) => t.id === "nadira")?.photo ?? null} />
          <PracticumGrowth growth={getPracticumGrowth()} />
        </>
      ) : (
        <>
          {programBlock}
          <CourseOutcomes course={course} />
          <CourseMonetization course={course} />
          {worksBlock}
          <Pricing course={course} />
        </>
      )}
      {product && <RefundTerms text={getRefundTerms(product.id)} />}
      {!isPracticum && courseReviews.length > 0 && (
        <ReviewsWall
          items={courseReviews}
          tone="bg"
          moreHref="/reviews"
          // Видео работ - без «скриншотов оплат» в подзаголовке
          {...(courseReviews.every((r) => r.kind === "video") ? { title: "Работы учеников", description: "Видео работ учеников курса." } : {})}
        />
      )}
      {!isPracticum && <Team items={team.filter((m) => m.id !== "maidan")} eyebrow="Кто ведёт" title="Кто ведёт курс" layout="grid" />}
      {product && <NextSteps id="next" title="Что дальше" steps={nextStep ? [nextStep] : []} />}
      <FAQ items={getFaq(course.slug)} />
      {isPracticum && getPracticumGuide() && <PracticumGuide guide={getPracticumGuide()!} />}
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
