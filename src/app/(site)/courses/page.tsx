import { buildMetadata } from "@/lib/seo";
import { CoursesHero } from "@/components/sections/CoursesHero";
import { CoursesCatalog } from "@/components/sections/CoursesCatalog";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { generalFaq } from "@/data/faq";

/** В каталоге есть «ближайший старт» практикума — зависит от даты; обновляем раз в час. */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Курсы по ИИ",
  description: "Практикум по вирусным роликам, курс «ИИ-креатор» и вайбкодинг. Практические программы для заработка на ИИ без технического образования.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CoursesCatalog bare={false} title="Выберите программу" eyebrow="Курсы" description={undefined} />
      <HowItWorks />
      <FAQ items={generalFaq.slice(0, 5)} />
      <LeadSection
        formId="courses-footer"
        title="Поможем выбрать программу"
        description="Напишите, какая у вас цель — подскажем, с чего начать и сколько это займёт."
      />
    </>
  );
}
