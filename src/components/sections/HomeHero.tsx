import { getPublicHeroData } from "@/data/public";
import { HomeHeroClient } from "./HomeHeroClient";

/** Hero главной (серверная часть): публичные данные карточек, преподавателя и эфира собираются здесь. */
export function HomeHero() {
  return <HomeHeroClient data={getPublicHeroData()} />;
}
