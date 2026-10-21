"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Pill } from "@/components/ui";
import { getHomeTestimonials, getTestimonialsMoreCount } from "@/data/testimonials";
import { getHomeWorks } from "@/data/works";

const TestimonialsCarousel = dynamic(
  () => import("./TestimonialsCarousel").then((m) => m.TestimonialsCarousel),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-[420px] max-w-md animate-pulse rounded-2xl bg-ink/5" />
    ),
  },
);

const WorksMarquee = dynamic(
  () => import("./WorksMarquee").then((m) => m.WorksMarquee),
  {
    ssr: false,
    loading: () => <div className="h-[280px] animate-pulse rounded-2xl bg-ink/5" />,
  },
);

function SectionHeadCentered({
  pill,
  titleId,
  title,
  description,
}: {
  pill: string;
  titleId: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-10 flex max-w-[640px] flex-col items-center text-center sm:mb-12">
      <Pill tone="brand" dot>
        {pill}
      </Pill>
      <h2 id={titleId} className="mt-4 text-display-md text-ink">
        {title}
      </h2>
      <p className="mt-3 max-w-[640px] text-base text-ink-500 [text-wrap:balance] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export function ReviewsSections() {
  const testimonials = getHomeTestimonials();
  const moreCount = getTestimonialsMoreCount();
  const works = getHomeWorks();

  return (
    <>
      {testimonials.length > 0 && (
        <section
          id="testimonials"
          aria-labelledby="testimonials-title"
          className="bg-bg py-24"
        >
          <div className="container-site">
            <SectionHeadCentered
              pill="Отзывы"
              titleId="testimonials-title"
              title="Что говорят ученики"
              description="Видеоотзывы, оплаты и переписки учеников"
            />
          </div>
          <Suspense
            fallback={
              <div className="mx-auto h-[420px] max-w-md animate-pulse rounded-2xl bg-ink/5" />
            }
          >
            <TestimonialsCarousel items={testimonials} moreCount={moreCount} />
          </Suspense>
        </section>
      )}

      {works.length > 0 && (
        <section
          id="student-works"
          aria-labelledby="works-title"
          className="px-2 pt-0 sm:px-4"
        >
          <div className="rounded-2xl bg-bg py-24 sm:rounded-3xl">
            <div className="container-site">
              <SectionHeadCentered
                pill="Работы"
                titleId="works-title"
                title="Ролики, которые сняли ученики"
                description="Вирусные ИИ-ролики с практикума — охваты и результаты."
              />
            </div>
            <WorksMarquee items={works} />
            <div className="mt-8 flex justify-center px-4">
              <Button
                variant="outline"
                href="/reviews?tab=works"
                icon={<ArrowRight className="size-4" />}
              >
                Больше роликов
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
