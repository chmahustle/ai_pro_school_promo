import { getPublicStories } from "@/data/public";
import type { AudienceSlug } from "@/data/types";
import { HomeStoriesClient } from "./HomeStoriesClient";

interface HomeStoriesProps {
  /** Сколько карточек показать; null — все (страница /reviews) */
  limit?: number | null;
  /** Фильтр по аудитории над карточками */
  withFilters?: boolean;
  /** Ссылка «Все результаты» в шапке (на главной) */
  showAllLink?: boolean;
  /** Показывать только кейсы этой аудитории (лендинги) */
  audience?: AudienceSlug;
}

/**
 * «Результаты учеников» (серверная часть): отбор verified && consent и сборка публичных карточек —
 * здесь, до передачи в браузер. Меньше 3 подтверждённых кейсов — блок скрыт.
 */
export function HomeStories({ limit, withFilters, showAllLink, audience }: HomeStoriesProps = {}) {
  const stories = getPublicStories(audience);
  if (stories.length < 3) return null;
  return <HomeStoriesClient stories={stories} limit={limit} withFilters={withFilters} showAllLink={showAllLink} />;
}
