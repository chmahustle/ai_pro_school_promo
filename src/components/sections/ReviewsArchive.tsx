import { getPublicTestimonials, getPublicWorks } from "@/data/public";
import { ReviewsArchiveClient } from "./ReviewsArchiveClient";

/** Архив отзывов (серверная часть): публичные подписи и бейджи считаются здесь, согласие авторов учтено до передачи. */
export function ReviewsArchive() {
  return <ReviewsArchiveClient testimonials={getPublicTestimonials()} works={getPublicWorks()} />;
}
