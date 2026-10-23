import { getPublicHeroData, getPublicMetrics } from "@/data/public";
import { HomeMetricsClient } from "./HomeMetricsClient";

/**
 * «Школа в цифрах» (серверная часть): только публичные поля метрик и три примера результатов.
 * Меньше 3 подтверждённых цифр — блока нет.
 */
export function HomeMetrics() {
  const items = getPublicMetrics();
  if (items.length < 3) return null;
  const chips = getPublicHeroData().results.slice(0, 3).map(({ id, name, result }) => ({ id, name, result }));
  return <HomeMetricsClient items={items} chips={chips} />;
}
