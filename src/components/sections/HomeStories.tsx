import { getPublicResultsTabs, getPublicStories } from "@/data/public";
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
  // Вкладки направлений: вайб-кодинг — только если есть подтверждённые кейсы этого направления
  const tabs = getPublicResultsTabs(stories).tabs;
  return <HomeStoriesClient stories={stories} tabs={tabs} limit={limit} withFilters={withFilters} showAllLink={showAllLink} />;
}
