import type { Course } from "@/data/types";
import { getPublicBonuses, getPublicTariffs, isInstallmentEnabled } from "@/data/public";
import { PricingClient } from "./PricingClient";

interface PricingProps {
  course: Course;
  title?: string;
  eyebrow?: string;
}

/**
 * Тарифы курса (серверная часть). В браузер уходят только публичные поля: без status, note, priceStatus.
 * Тариф без цены не передаётся; нет ни одного тарифа с ценой — блока нет.
 */
export function Pricing({ course, title, eyebrow }: PricingProps) {
  const tariffs = getPublicTariffs(course);
  if (tariffs.length === 0) return null;
  return (
    <PricingClient
      course={{
        slug: course.slug,
        shortName: course.shortName,
        tariffs,
        bonuses: getPublicBonuses(course),
        installmentEnabled: isInstallmentEnabled(course),
      }}
      title={title}
      eyebrow={eyebrow}
    />
  );
}
