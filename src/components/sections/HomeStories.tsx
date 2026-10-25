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
  /** Показывать только кейсы этого направления (страницы направлений) */
  direction?: "creator" | "vibecoding";
  /** «projects» — блок проектов вайб-кодинга (лендинги): свои подписи вместо «Они начали с нуля» */
  variant?: "results" | "projects";
  /** Истории с доходом («индивидуальный результат»): только на /reviews */
  includeIndividual?: boolean;
}

/**
 * «Результаты учеников» (серверная часть): отбор verified && consent и сборка публичных карточек —
 * здесь, до передачи в браузер. Меньше 3 подтверждённых кейсов — блок скрыт.
 */
export function HomeStories({ limit, withFilters, showAllLink, audience, direction, variant, includeIndividual }: HomeStoriesProps = {}) {
  const stories = getPublicStories(audience, direction, includeIndividual);
  if (stories.length < 3) return null;
  // Вкладки направлений: вайб-кодинг — только если есть подтверждённые кейсы этого направления
  const tabs = getPublicResultsTabs(stories).tabs;
  return <HomeStoriesClient stories={stories} tabs={tabs} variant={variant} limit={limit} withFilters={withFilters} showAllLink={showAllLink} />;
}
