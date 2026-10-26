import "server-only";
import { currentDate, efirIsFree, efirPriceLabel, FREE_WORD } from "./products";

/**
 * Тексты про цену эфира «Вайб-кодинг вживую»: единственное место (вместе с products.ts), где слова «бесплатно/бесплатный» про эфир
 * написаны руками. Все остальные страницы, меню, метаданные и лендинги /for/* берут строки отсюда, а значит меняются сами,
 * когда в products.ts → efir.priceSchedule появится действующая запись с новой ценой.
 * Функции вызывать во время рендера (не в константах модуля), иначе строка «застынет» на момент старта сервера.
 */

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** «Бесплатный эфир» пока цена 0, иначе «Эфир» */
export function efirTitle(now: Date = currentDate()): string {
  return efirIsFree(now) ? "Бесплатный эфир" : "Эфир";
}

/** «бесплатный эфир» / «эфир» (винительный: «на бесплатный эфир», «на эфир») */
export function efirLow(now: Date = currentDate()): string {
  return efirIsFree(now) ? "бесплатный эфир" : "эфир";
}

/** «бесплатного эфира» / «эфира» (родительный: «Начинаем с …») */
export function efirGenitive(now: Date = currentDate()): string {
  return efirIsFree(now) ? "бесплатного эфира" : "эфира";
}

/** «эфире» / «бесплатном эфире» (предложный: «на эфире покажем…») */
export function efirPrep(now: Date = currentDate()): string {
  return efirIsFree(now) ? "бесплатном эфире" : "эфире";
}

/** «бесплатного » (с пробелом) пока эфир бесплатный, иначе пустая строка: «с {…}1,5-часового эфира» */
export function efirFreeGenPrefix(now: Date = currentDate()): string {
  return efirIsFree(now) ? "бесплатного " : "";
}

/** Значение «Стоимость» в таблицах формата: «Бесплатно» или «9 900 ₸» */
export function efirCostValue(now: Date = currentDate()): string {
  return capitalize(efirPriceLabel(now));
}

/** «Записаться на эфир бесплатно» / «Записаться на эфир за 9 900 ₸»; при лид-магните — «Записаться на эфир и получить гайд» */
export function efirSignupCta(hasGift: boolean, now: Date = currentDate()): string {
  if (hasGift) return "Записаться на эфир и получить гайд";
  return efirIsFree(now) ? `Записаться на эфир ${FREE_WORD}` : `Записаться на эфир за ${efirPriceLabel(now)}`;
}

/** Заголовок формы регистрации на эфир: «…получите гайд бесплатно» только пока эфир бесплатный */
export function efirRegisterTitle(now: Date = currentDate()): string {
  return efirIsFree(now) ? `Зарегистрируйтесь и получите гайд ${FREE_WORD}` : "Зарегистрируйтесь и получите гайд";
}

/** Пункт под формой: «Бесплатно, без скрытых условий» / «Без скрытых условий» */
export function efirNoHiddenConditions(now: Date = currentDate()): string {
  return efirIsFree(now) ? "Бесплатно, без скрытых условий" : "Без скрытых условий";
}

/** Метка формата эфира: «Бесплатный эфир · 1,5 часа» / «Эфир · 1,5 часа» */
export function efirFormatBadge(now: Date = currentDate()): string {
  return `${efirTitle(now)} · 1,5 часа`;
}
