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
  /** Только кейсы про просмотры (страница практикума: без доходов и личных историй) */
  onlyViews?: boolean;
  /** Подзаголовок шапки (по умолчанию — общий) */
  description?: string;
  /** Истории с доходом («индивидуальный результат»): только на /reviews */
  includeIndividual?: boolean;
}

/**
 * «Результаты учеников» (серверная часть): отбор verified && consent и сборка публичных карточек —
 * здесь, до передачи в браузер. Меньше 3 подтверждённых кейсов — блок скрыт.
 */
export function HomeStories({ limit, withFilters, showAllLink, audience, direction, variant, includeIndividual, onlyViews, description }: HomeStoriesProps = {}) {
  const all = getPublicStories(audience, direction, includeIndividual);
  const stories = onlyViews ? all.filter((s) => s.result.unit.includes("просмотр")) : all;
  if (stories.length < 3) return null;
  // Вкладки направлений: вайб-кодинг — только если есть подтверждённые кейсы этого направления
  const tabs = getPublicResultsTabs(stories).tabs;
  return <HomeStoriesClient stories={stories} tabs={tabs} variant={variant} description={description} limit={limit} withFilters={withFilters} showAllLink={showAllLink} />;
}
