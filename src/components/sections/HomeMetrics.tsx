import { getMetricsDescription, getPublicMetrics } from "@/data/public";
import { HomeMetricsClient } from "./HomeMetricsClient";

/**
 * «Школа в цифрах» (серверная часть): только публичные поля метрик. Меньше 3 подтверждённых цифр — блока нет.
 */
export function HomeMetrics() {
  const items = getPublicMetrics();
  if (items.length < 3) return null;
  return <HomeMetricsClient items={items} description={getMetricsDescription()} />;
}
