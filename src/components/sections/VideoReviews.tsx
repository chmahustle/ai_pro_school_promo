import { Section, SectionIntro } from "@/components/ui";
import { getVideoReviews, type VideoReviewPage } from "@/data/videoReviews";
import { VideoReviewsClient } from "./VideoReviewsClient";

/** «Отзывы учеников» (серверная часть): только verified && consent; нет роликов — блока нет */
export function VideoReviews({ page, id = "video-reviews", title = "Отзывы учеников", description = "Видеоотзывы тех, кто прошёл программу." }: { page: VideoReviewPage; id?: string; title?: string; description?: string }) {
  const items = getVideoReviews(page);
  if (items.length === 0) return null;
  return (
    <Section aria-labelledby={`${id}-title`}>
      <SectionIntro id={`${id}-title`} align="left" eyebrow="Отзывы" title={title} description={description} />
      <VideoReviewsClient items={items} />
    </Section>
  );
}
