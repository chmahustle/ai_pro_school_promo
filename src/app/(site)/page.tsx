import { buildMetadata } from "@/lib/seo";
import { site, SITE_URL } from "@/lib/site";
import { HomeHero } from "@/components/sections/HomeHero";
import { LogosMarquee } from "@/components/sections/LogosMarquee";
import { HomeMetrics } from "@/components/sections/HomeMetrics";
import { AudienceSwitcher } from "@/components/sections/AudienceSwitcher";
import { HomeStories } from "@/components/sections/HomeStories";
import { WantSameCta } from "@/components/sections/WantSameCta";
import { CoursesCatalog } from "@/components/sections/CoursesCatalog";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { generalFaq } from "@/data/faq";
/** В каталоге есть «ближайший старт» практикума — зависит от даты; обновляем раз в час. */
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: "/",
});

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: SITE_URL,
  description: site.description,
  address: { "@type": "PostalAddress", addressCountry: "KZ" },
  sameAs: Object.values(site.socials),
  contactPoint: { "@type": "ContactPoint", telephone: site.phones.primary, contactType: "customer service" },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <LogosMarquee />
      <HomeMetrics />
      <AudienceSwitcher />
      <HomeStories />
      <CoursesCatalog allHref="/courses" />
      <HowItWorks />
      <WantSameCta />
      <FAQ items={generalFaq.slice(0, 6)} description="Если не нашли ответ — напишите в WhatsApp, ответим лично." />
      <LeadSection
        id="webinar-form"
        formId="home-footer"
        title="Не знаете, с чего начать? Подберём программу"
        description="Оставьте заявку — расскажем, какой формат подходит под вашу цель, время и опыт. Без навязывания."
        bullets={["Ответим в течение рабочего дня", "Расскажем честно, подойдёт ли вам", "Поможем выбрать между практикумом, курсом и вайбкодингом"]}
        hint="Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности"
        tone="mesh"
        mesh="home"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
    </>
  );
}
