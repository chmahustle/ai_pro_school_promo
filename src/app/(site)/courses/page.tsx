import { buildMetadata } from "@/lib/seo";
import { CoursesHero } from "@/components/sections/CoursesHero";
import { CatalogSection } from "@/components/sections/CatalogSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { getFaq } from "@/data/faq";
import { getPublicCatalog } from "@/data/public";

/** В каталоге есть «ближайший старт» практикума — зависит от даты; обновляем раз в час. */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Курсы по ИИ",
  description: `${getPublicCatalog().steps.map((s) => s.name).join(", ")}. Два направления: AI-креаторство и вайб-кодинг, у каждого своя лестница программ.`,
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CatalogSection />
      <HowItWorks />
      <FAQ items={getFaq("courses", { limit: 5 })} />
      <LeadSection
        formId="courses-footer"
        title="Поможем выбрать программу"
        description="Напишите, какая у вас цель — подскажем, с чего начать и сколько это займёт."
      />
    </>
  );
}
