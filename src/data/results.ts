import type { ResultCase } from "./types";
import { SHOW_PLACEHOLDERS, filterForPublish } from "@/lib/placeholders";

/**
 * Кейсы учеников «до / после». Источники: лендинги вайбкодинга (3 кейса, одинаковые на всех),
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
    after: "Ролики от 522 тыс. до 1,7 млн просмотров.",
    quote: "Всему научилась за 3 дня · от нуля до 1 млн просмотров за 5 дней",
    photo: "/stories/case-gulayym.webp",
    audiences: ["beginners", "freelancers", "career", "business"],
    course: "practicum",
    source: "https://freelance.ai-pro-school.kz/",
    status: "verified",
  },
  {
    id: "guldaria",
    name: "Гульдария",
    context: "мама двоих детей",
    headline: "400 000 ₸ за 2 недели",
    before: "Не зарабатывала на ИИ, искала удалённый формат.",
    after: "Заработала 400 000 ₸ за 2 недели.",
    photo: null,
    audiences: ["beginners"],
    course: "ai-creator",
    source: "https://ai-pro-school.kz/ai2026",
    status: "verified",
    note: "Видеоотзыв YouTube eyqVEf-2294. before — не с лендинга, не использовать как verbatim.",
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

/** Кейсы бизнесов (B2B). PLACEHOLDER: в источниках нет — заполнить реальными. */
export const businessCases: ResultCase[] = [
  {
    id: "biz-1",
    name: "Компания A",
    context: "сфера услуг · 12 сотрудников",
    headline: "Telegram-бот приёма заявок вместо менеджера",
    before: "Заявки терялись в WhatsApp, менеджер отвечал по 2–3 часа.",
    after: "Бот квалифицирует заявки и пишет в CRM за минуту. Экономия ~X ₸/мес на разработке.",
    beforeValue: "2–3 часа",
    afterValue: "за минуту",
    summary: "Бот пишет заявки в CRM за минуту.",
    keyResult: "за минуту",
    keyResultLabel: "заявка в CRM",
    photo: null,
    audiences: ["business"],
    course: "vibecoding",
    consent: false,
    status: "placeholder",
    note: "PLACEHOLDER: заменить реальным кейсом бизнеса.",
  },
  {
    id: "biz-2",
    name: "Компания B",
    context: "ритейл",
    headline: "Лендинг и CRM-интеграция за 3 дня",
    before: "Подрядчик оценил сайт + интеграцию в X ₸ и 6 недель.",
    after: "Собственник собрал вайбкодингом за 3 дня, запустил рекламу.",
    beforeValue: "6 недель",
    afterValue: "3 дня",
    summary: "Собрал вайбкодингом за 3 дня.",
    keyResult: "3 дня",
    keyResultLabel: "вместо 6 недель",
    photo: null,
    audiences: ["business"],
    course: "vibecoding",
    consent: false,
    status: "placeholder",
    note: "PLACEHOLDER: заменить реальным кейсом бизнеса.",
  },
  {
    id: "biz-3",
    name: "Эксперт C",
    context: "онлайн-школа",
    headline: "AI-ассистент отвечает ученикам 24/7",
    before: "Кураторы тратили 4 часа в день на типовые вопросы.",
    after: "RAG-ассистент закрывает 80% вопросов, кураторы занимаются разборами.",
    beforeValue: "4 часа/день",
    afterValue: "80%",
    summary: "Ассистент закрывает 80% вопросов.",
    keyResult: "80%",
    keyResultLabel: "вопросов закрывает ассистент",
    photo: null,
    audiences: ["business"],
    course: "vibecoding",
    consent: false,
    status: "placeholder",
    note: "PLACEHOLDER: заменить реальным кейсом.",
  },
];

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
