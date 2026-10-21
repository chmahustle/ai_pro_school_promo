import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CourseHero } from "@/components/sections/CourseHero";
import { CourseForWhom, CourseOutcomes, CourseMonetization } from "@/components/sections/CourseDetails";
import { Programs } from "@/components/sections/Programs";
import { Pricing } from "@/components/sections/Pricing";
import { HomeStories } from "@/components/sections/HomeStories";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { Team } from "@/components/sections/Team";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { CTA } from "@/components/sections/CTA";
import { courses, getCourse } from "@/data/courses";
import { getPublishedReviews } from "@/data/reviews";
import { team, webinarSpeakers } from "@/data/team";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL, site } from "@/lib/site";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourse(slug);
  if (!c) return {};
  return buildMetadata({
    title: c.seo.title,
    description: c.seo.description,
    path: `/courses/${c.slug}`,
    image: null, // file-based opengraph-image.tsx в этом сегменте
  });
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const courseReviews = getPublishedReviews().filter((r) => r.course === course.slug).slice(0, 6);
  const isWebinarCourse = course.slug === "vibecoding";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: { "@type": "EducationalOrganization", name: site.name, url: SITE_URL },
    url: `${SITE_URL}/courses/${course.slug}`,
    ...(course.priceFrom !== null
      ? {
          offers: {
            "@type": "Offer",
            price: course.priceFrom,
            priceCurrency: "KZT",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <div className="calm-hover">
      <CourseHero course={course} />
      <CourseForWhom course={course} />
      <Programs
        modules={course.program}
        title={isWebinarCourse ? "Как устроено обучение" : "Программа курса"}
        description={isWebinarCourse ? "Начинаем с бесплатного эфира — дальше полная программа." : "Пошагово, без перегруза. Всё сразу применимо для заработка."}
      />
      <CourseOutcomes course={course} />
      <CourseMonetization course={course} />
      {/* Результаты учеников этой аудитории — тот же блок, что на главной */}
      <div className="mt-6 sm:mt-10">
        <HomeStories audience={course.audiences[0]} limit={3} />
      </div>
      <Pricing course={course} />
      {courseReviews.length > 0 && <ReviewsWall items={courseReviews} tone="bg" moreHref="/reviews" />}
      <Team
        items={isWebinarCourse ? webinarSpeakers : team.filter((m) => m.id !== "maidan")}
        eyebrow={isWebinarCourse ? "Спикеры" : "Кто ведёт"}
        title={isWebinarCourse ? "Кто проведёт эфир" : "Кто ведёт курс"}
        layout={isWebinarCourse ? "wide" : "grid"}
      />
      <FAQ items={course.faq} />
      {isWebinarCourse && (
        <CTA
          title="Выберите свой эфир"
          description="У каждой аудитории — свой разбор задач и свой гайд в подарок."
          primaryLabel="Для бизнеса"
          primaryHref="/for/business"
          secondaryLabel="Для фрилансеров"
          secondaryHref="/for/freelancers"
          tone="mesh"
          mesh="home"
          source="course-vibecoding-cta"
        />
      )}
      <LeadSection
        className="mt-10 sm:mt-16"
        formId={`course-${course.slug}`}
        title={isWebinarCourse ? "Записаться на бесплатный эфир" : `Записаться: ${course.shortName}`}
        description={isWebinarCourse ? "Оставьте имя и WhatsApp — пришлём ссылку на ближайший эфир и гайд." : "Ответим на вопросы, расскажем про тарифы и рассрочку, пришлём ссылку на оплату."}
        defaultInterest={course.slug}
        lockInterest
        compact
        submitLabel={course.ctaLabel}
        hint="Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности"
        tone="mesh"
        mesh="home"
        thanksPath={`/thanks?src=course-${course.slug}&interest=${course.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
