import "server-only";
import type { ResultCase } from "./types";
import { SHOW_PLACEHOLDERS, filterForPublish } from "@/lib/placeholders";

/**
 * Кейсы учеников «до / после». Источники: лендинги вайб-кодинга (3 кейса, одинаковые на всех),
 * ai2026 (3 коротких результата). Фото = null → placeholder.
 *
 * status "verified" = текст дословно с действующих страниц школы.
 * TODO(клиент): фото, разрешение на публикацию имён, актуальность сумм.
 */
export const results: ResultCase[] = [
  {
    id: "alena",
    name: "Алёна Заярных",
    context: "без опыта в AI-видео",
    headline: "Договор на 15 роликов: 500 000 ₸",
    before: "Нет опыта в AI-видео, первые ролики не залетали, думала сдаться.",
    after: "500+ AI-видео, миллионные просмотры, куратор AI Pro School.",
    quote: "Несколько месяцев от первого видео до куратора школы",
    photo: "/stories/case-alena.webp",
    audiences: ["freelancers", "beginners", "business", "career"],
    course: "ai-creator",
    source: "https://freelance.ai-pro-school.kz/",
    status: "verified",
  },
  {
    id: "madina",
    name: "Мадина",
    context: "мама двоих детей в декрете",
    headline: "Школа сама заказывает у неё ролики",
    before: "Мама двоих детей в декрете, без дохода и опыта в IT. Только телефон и желание.",
    after: "Работает с компаниями, постоянный клиент Казахтелеком, стабильный доход из дома.",
    quote: "Я начала, имея только телефон. Сегодня Казахтелеком мой постоянный клиент",
    photo: "/stories/case-madina.webp",
    audiences: ["beginners", "freelancers", "business", "career"],
    course: "ai-creator",
    source: "https://freelance.ai-pro-school.kz/",
    status: "verified",
  },
  {
    id: "gulaiym",
    name: "Гульайым",
    context: "ноль опыта в AI и монтаже",
    headline: "1 600 000 просмотров за 5 дней",
    before: "Ноль опыта в AI и монтаже, пустой аккаунт, не знала, с чего начать.",
    after: "1 600 000 просмотров за 5 дней",
    photo: "/stories/case-gulayym.webp",
    audiences: ["beginners", "freelancers", "career", "business"],
    course: "practicum",
    source: "https://freelance.ai-pro-school.kz/",
    status: "verified",
  },
  {
    id: "shynar",
    name: "Шынар",
    context: "43 года",
    headline: "500 000 ₸ + 150 000 ₸ в месяц",
    before: "Без технического образования и опыта в IT.",
    after: "Заработала 500 000 ₸ и получает по 150 000 ₸ в месяц, работая всего 8 часов.",
    photo: null,
    audiences: ["beginners", "career"],
    course: "ai-creator",
    source: "https://ai-pro-school.kz/ai2026",
    status: "verified",
    note: "Видеоотзыв YouTube IsYI0XQy9A8. before — не с лендинга.",
  },
  {
    id: "moldir",
    name: "Молдир",
    context: "техспец",
    headline: "1 000 000 ₸ в месяц",
    before: "Работала разово, без системы.",
    after: "Зарабатывает 1 000 000 ₸ в месяц, работая техспецом.",
    photo: null,
    audiences: ["freelancers", "career", "beginners"],
    course: "ai-creator",
    source: "https://ai-pro-school.kz/ai2026",
    status: "verified",
    note: "Видеоотзыв YouTube _vHOfJPFbUY. before — не с лендинга.",
  },
];

/**
 * Кейсы бизнесов (B2B). Пусто: прежние «Компания A/B», «Эксперт C» были выдуманными заглушками и удалены.
 * Добавлять только реальные кейсы с verified: true и consent: true — иначе блок не показывается
 * (в проде нужно минимум 3 подтверждённых).
 */
export const businessCases: ResultCase[] = [];

export function getPublishedResults() {
  return filterForPublish(results);
}

export function getPublishedBusinessCases() {
  return filterForPublish(businessCases);
}

/**
 * Кейсы для тёмной секции на главной.
 * Прод: только verified && consent; если меньше 3 — пустой массив (секция скрыта).
 * Dev / SHOW_PLACEHOLDERS: как filterForPublish (плейсхолдеры видны).
 */
export function getHomeBusinessCases(): ResultCase[] {
  if (SHOW_PLACEHOLDERS) {
    return filterForPublish(businessCases).slice(0, 3);
  }
  const ready = businessCases.filter(
    (c) => c.status === "verified" && c.consent === true,
  );
  return ready.length >= 3 ? ready.slice(0, 3) : [];
}

export function getResultsFor(audience: ResultCase["audiences"][number], limit?: number) {
  const list = filterForPublish(results).filter((r) => r.audiences.includes(audience));
  return limit ? list.slice(0, limit) : list;
}
