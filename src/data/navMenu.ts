import "server-only";
import { directions } from "./lineup";
import { getPublicLadder } from "./public";
import type { PublicNavMenu } from "./public-types";

/**
 * Меню «Направления» в шапке (десктоп и мобильная панель): две колонки с продуктами из products.ts
 * (название, цена через formatPriceParts, ссылка на лендинг), заголовок колонки — страница направления.
 * Тёмная карточка справа — эфир: название, результат и формат из конфига; «Бесплатный эфир» и «гайд в подарок» не пишем,
 * дата — только подтверждённая (cohortVerified), обещаний дохода нет.
 */
export function getNavMenu(): PublicNavMenu {
  const columns = (["creator", "vibecoding"] as const).map((direction) => {
    const ladder = getPublicLadder(direction);
    return {
      direction,
      title: directions[direction].name,
      href: directions[direction].path,
      leaderName: ladder.leader.name,
      items: ladder.steps.map((s) => ({ id: s.id, name: s.name, href: s.href, price: s.price })),
    };
  });
  const efir = getPublicLadder("vibecoding").steps.find((s) => s.id === "efir") ?? null;
  return {
    columns,
    card: efir && {
      eyebrow: directions.vibecoding.name,
      name: efir.name,
      resultLine: efir.resultLine,
      format: efir.format,
      price: efir.price,
      start: efir.start,
      ctaLabel: efir.ctaLabel,
      href: efir.href,
    },
    allCoursesHref: "/courses",
  };
}
