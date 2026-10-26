import "server-only";
import { directions, lineupForWhom } from "./lineup";
import { catalogUrl, directionPages, formatPriceParts, FREE_WORD, getEntryProducts, getCurrentPrice } from "./products";
import { vocabulary } from "./vocabulary";
import type { PublicNavMenu } from "./public-types";

/** Родительный падеж входных продуктов для строки «Начать с …» */
const GEN: Record<string, string> = { practicum: vocabulary.practicumGen, efir: vocabulary.efirGen };

/**
 * Меню «Направления» в шапке (десктоп и мобильная панель): две крупные карточки направлений.
 * Строка старта — входной продукт направления и его цена из products.ts: платный — «Начать с практикума за 9 900 ₸»,
 * бесплатный — «Начать с эфира, бесплатно» (станет платным — строка поменяется сама). Обещаний дохода и «подарка» нет.
 */
export function getNavMenu(): PublicNavMenu {
  const cards = (["creator", "vibecoding"] as const).map((direction) => {
    const d = directions[direction];
    const entry = getEntryProducts().find((p) => p.direction === direction);
    const { prefix, amount, unit } = entry ? formatPriceParts(entry) : { prefix: "", amount: "", unit: "" };
    return {
      direction,
      title: d.name,
      pitch: d.pitch,
      forWhom: lineupForWhom[direction],
      href: directionPages[direction],
      teaser: entry?.resultLine ?? "",
      entry: { href: entry?.landingUrl ?? directionPages[direction], ctaLabel: entry?.ctaLabel ?? d.name },
      start: {
        before: `Начать с ${entry ? (GEN[entry.id] ?? entry.name) : d.name}`,
        free: entry ? getCurrentPrice(entry) === 0 : false,
        freeLabel: FREE_WORD,
        price: { prefix, amount, unit },
      },
    };
  });
  return { cards, allCoursesHref: catalogUrl };
}
