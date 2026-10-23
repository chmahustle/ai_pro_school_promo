import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LeadButton } from "@/components/ui/LeadButton";
import { PageHero } from "@/components/sections/PageHero";
import { HomeMetrics } from "@/components/sections/HomeMetrics";
import { HomeStories } from "@/components/sections/HomeStories";
import { ReviewsArchive } from "@/components/sections/ReviewsArchive";
import { LeadSection } from "@/components/sections/LeadSection";

export const metadata = buildMetadata({
  title: "Результаты и отзывы учеников",
  description:
    "Кейсы «до / после», видеоотзывы, скриншоты оплат и переписок учеников AI Pro School.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        id="reviews-hero-title"
        eyebrow="Доказательства"
        title={
          <>
            Результаты и <span className="text-gradient-brand">отзывы</span>
          </>
        }
        description="Мы показываем не обещания, а то, что уже получилось у учеников: кейсы, видео, переписки и оплаты."
        actions={
          <>
            <LeadButton variant="dark" size="md" source="reviews-hero" icon={<ArrowUpRight className="size-4" />}>
              Хочу так же
            </LeadButton>
            <Link href="#archive" className="inline-flex h-12 items-center rounded-pill px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-white/70">
              Смотреть отзывы
            </Link>
          </>
        }
      />
      <HomeMetrics />
      <div className="mt-4">
        <HomeStories limit={null} withFilters showAllLink={false} />
      </div>
      <div id="archive" className="scroll-mt-24">
        <Suspense fallback={null}>
          <ReviewsArchive />
        </Suspense>
      </div>
      <LeadSection
        className="mt-10 sm:mt-16"
        formId="reviews-footer"
        title="Хотите такой же результат?"
        description="Расскажите о своей цели — подскажем, с какой программы начать."
        hint="Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности"
      />
    </>
  );
}
