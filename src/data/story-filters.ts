import type { AudienceSlug } from "./types";

/** Фильтры по аудитории над карточками результатов (только подписи, данных нет — можно в клиенте) */
export const storyAudienceFilters: { id: "all" | AudienceSlug; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "beginners", label: "Новички" },
  { id: "business", label: "Бизнес" },
  { id: "freelancers", label: "Фриланс" },
  { id: "career", label: "В найме" },
];
