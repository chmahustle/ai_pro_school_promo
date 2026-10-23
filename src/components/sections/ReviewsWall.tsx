import { toPublicReview } from "@/data/public";
import type { Review } from "@/data/types";
import { ReviewsWallClient } from "./ReviewsWallClient";

type WallProps = Omit<React.ComponentProps<typeof ReviewsWallClient>, "items">;

/** Стена отзывов (серверная часть): в браузер уходят только публичные поля отзывов — без status, note и прочего. */
export function ReviewsWall({ items, ...rest }: WallProps & { items: Review[] }) {
  return <ReviewsWallClient items={items.map(toPublicReview)} {...rest} />;
}
