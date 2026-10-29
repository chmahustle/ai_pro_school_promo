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
import { Section, SectionIntro } from "@/components/ui";
import { VideoCarousel } from "@/components/sections/VideoCarousel";
import { youtubeIdFromUrl } from "@/lib/youtube";
import { getPracticumFormats, getPracticumGets, getPracticumGuide, getPracticumTeacher, getPracticumGrowth, getPracticumResults, practicumVideo } from "@/data/courseContent";
import { PracticumFormats, PracticumGets, PracticumGuide, PracticumTeacher, PracticumGrowth, PracticumResults, PracticumVideo } from "@/components/sections/CourseBlocks";
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

  return (
    <div className="calm-hover pt-[88px] sm:pt-[96px]">
      <LandingHeader ctaLabel={course.ctaLabel} interest={productForCourseSlug(course.slug)} formAnchor="lead" />
      <CourseHero course={course} />
      <CourseForWhom course={course} />
      <Programs
        modules={course.program}
        title={course.slug === "practicum" ? "Программа практикума" : "Программа курса"}
        description="Пошагово, без перегруза. Всё сразу применимо на практике"
      />
      {course.slug === "practicum" && <PracticumGets items={getPracticumGets()} />}
      {course.slug === "practicum" && <PracticumTeacher teacher={getPracticumTeacher()} photo={getCourseTeachers().find((t) => t.id === "nadira")?.photo ?? null} />}
      {course.slug === "practicum" && <PracticumVideo youtubeId={practicumVideo.youtubeId} posterSrc={practicumVideo.posterSrc} title={practicumVideo.title} />}
      <CourseOutcomes course={course} />
      <CourseMonetization course={course} />
      {/* Результаты учеников этой аудитории - тот же блок, что на главной */}
      <div className="mt-6 sm:mt-10">
        {course.slug === "practicum" ? (
          // Практикум: только кейсы про просмотры, без доходов и личных историй (Мадина - только на странице курса AI Content Creator)
          <HomeStories audience={course.audiences[0]} limit={12} onlyViews description="Люди без технического образования, освоившие ИИ-ролики" />
        ) : (
          <HomeStories audience={course.audiences[0]} limit={12} />
        )}
      </div>
      {course.slug === "practicum" && (
        <Section aria-labelledby="practicum-reels-title">
          <SectionIntro id="practicum-reels-title" align="left" eyebrow="Результаты" title="Как залетают рилсы наших учеников" description="Видео работ учеников практикума." />
          <VideoCarousel
            label="Рилсы учеников практикума"
            items={practicumReels.flatMap((r) => {
              const id = youtubeIdFromUrl(r.embedUrl);
              return id && r.src ? [{ id: r.id, poster: r.src, youtubeId: id }] : [];
            })}
          />
        </Section>
      )}
      {course.slug === "practicum" && <PracticumGrowth growth={getPracticumGrowth()} />}
      {/* Практикум: блок «Что входит» убран по решению владельца (состав - в «Что вы получаете», цена - в hero и форме) */}
      {course.slug !== "practicum" && <Pricing course={course} />}
      {product && <RefundTerms text={getRefundTerms(product.id)} />}
      {course.slug === "practicum" ? (
        <>
          {/* Практикум: рилсы учеников и переписки-благодарности (отзывы со страницы школы, из reviews.ts) */}
          <PracticumResults results={getPracticumResults()} />
          <PracticumFormats formats={getPracticumFormats()} />
        </>
      ) : courseReviews.length > 0 && (
        <ReviewsWall
          items={courseReviews}
          tone="bg"
          moreHref="/reviews"
          // Видео работ - без «скриншотов оплат» в подзаголовке
          {...(courseReviews.every((r) => r.kind === "video") ? { title: "Работы учеников", description: "Видео работ учеников курса." } : {})}
        />
      )}
      {course.slug === "practicum" ? null : (
        <Team items={team.filter((m) => m.id !== "maidan")} eyebrow="Кто ведёт" title="Кто ведёт курс" layout="grid" />
      )}
      {product && <NextSteps id="next" title="Что дальше" steps={nextStep ? [nextStep] : []} />}
      <FAQ items={getFaq(course.slug)} />
      {course.slug === "practicum" && getPracticumGuide() && <PracticumGuide guide={getPracticumGuide()!} />}
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
