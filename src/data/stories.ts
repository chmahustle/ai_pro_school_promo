import "server-only";
import type { AudienceSlug, Story } from "./types";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/**
 * Результаты учеников для StoryCard.
 * Прод: verified && consent. Цитата — только verbatim. Receipt — только piiBlurred.
 *
 * TODO(клиент): согласия, фото, медиа-файлы, verbatim-цитаты, актуальные asOf.
 */
export const stories: Story[] = [
  {
    id: "alena",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Алёна Заярных",
    descriptor: "без опыта в AI-видео",
    photo: "/stories/case-alena.webp",
    result: { value: "500 000", unit: "₸", text: "· договор на 15 роликов" },
    before: "Нет опыта в AI-видео, первые ролики не залетали, думала сдаться.",
    after: "500+ AI-видео, миллионные просмотры, куратор AI Pro School.",
    quote: {
      text: "Несколько месяцев от первого видео до куратора школы",
      verbatim: true,
    },
    audiences: ["freelancers", "beginners", "business", "career"],
    source: "freelance.ai-pro-school.kz",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "Источник: https://freelance.ai-pro-school.kz/ #cases",
  },
  {
    id: "madina",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Мадина",
    descriptor: "мама двоих детей в декрете",
    photo: "/stories/case-madina.webp",
    result: { value: "", unit: "", text: "Школа сама заказывает у неё ролики" },
    before: "Мама двоих детей в декрете, без дохода и опыта в IT. Только телефон и желание.",
    after: "Работает с компаниями, постоянный клиент Казахтелеком, стабильный доход из дома.",
    quote: {
      text: "Я начала, имея только телефон. Сегодня Казахтелеком мой постоянный клиент",
      verbatim: true,
    },
    audiences: ["beginners", "freelancers", "business", "career"],
    source: "freelance.ai-pro-school.kz",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "Источник: https://freelance.ai-pro-school.kz/ #cases",
  },
  {
    id: "gulaiym",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Гульайым",
    descriptor: "ноль опыта в AI и монтаже",
    photo: "/stories/case-gulayym.webp",
    result: { value: "1 600 000", unit: "просмотров", text: "за 5 дней" },
    before: "Ноль опыта в AI и монтаже, пустой аккаунт, не знала, с чего начать.",
    after: "Ролики от 522 тыс. до 1,7 млн просмотров.",
    quote: {
      text: "Всему научилась за 3 дня · от нуля до 1 млн просмотров за 5 дней",
      verbatim: true,
    },
    audiences: ["beginners", "freelancers", "career", "business"],
    source: "freelance.ai-pro-school.kz",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "Источник: https://freelance.ai-pro-school.kz/ #cases",
  },
  {
    id: "guldaria",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Гульдария",
    descriptor: "мама двоих детей",
    photo: null,
    result: { value: "400 000", unit: "₸", text: "за 2 недели" },
    media: {
      type: "video",
      src: "/stories/video-guldaria.jpg",
      embedUrl: "https://www.youtube.com/embed/eyqVEf-2294",
      piiBlurred: false,
      caption: "Видеоотзыв Гульдарии",
    },
    audiences: ["beginners"],
    source: "ai-pro-school.kz/ai2026",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "Видео с https://ai-pro-school.kz/ai2026 · YouTube eyqVEf-2294",
  },
  {
    id: "shynar",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Шынар",
    descriptor: "43 года",
    photo: null,
    result: { value: "500 000", unit: "₸", text: "+ 150 000 ₸ в месяц · 8 часов" },
    media: {
      type: "video",
      src: "/stories/video-shynar.jpg",
      embedUrl: "https://www.youtube.com/embed/IsYI0XQy9A8",
      piiBlurred: false,
      caption: "Видеоотзыв Шынар",
    },
    audiences: ["beginners", "career"],
    source: "ai-pro-school.kz/ai2026",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "Видео с https://ai-pro-school.kz/ai2026 · YouTube IsYI0XQy9A8",
  },
  {
    id: "moldir",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Молдир",
    descriptor: "техспец",
    photo: null,
    result: { value: "1 000 000", unit: "₸", text: "в месяц" },
    media: {
      type: "video",
      src: "/stories/video-moldir.jpg",
      embedUrl: "https://www.youtube.com/embed/_vHOfJPFbUY",
      piiBlurred: false,
      caption: "Видеоотзыв Молдир",
    },
    audiences: ["freelancers", "career", "beginners"],
    source: "ai-pro-school.kz/ai2026",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "Видео с https://ai-pro-school.kz/ai2026 · YouTube _vHOfJPFbUY",
  },
  {
    id: "video-practicum-2_7m",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Ученица практикума",
    descriptor: "вирусный ИИ-ролик",
    photo: null,
    result: { value: "2,7 млн", unit: "просмотров", text: "на ролике" },
    media: {
      type: "video",
      src: "/stories/practicum/reel-2_7m.jpg",
      embedUrl: "https://www.youtube.com/embed/H9gsaBtulxQ",
      piiBlurred: false,
      caption: "Ролик ученицы · 2,7 млн просмотров",
    },
    audiences: ["beginners", "freelancers"],
    source: "ai-pro-school.kz/prakticum",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "https://ai-pro-school.kz/prakticum · YouTube H9gsaBtulxQ",
  },
  {
    id: "video-practicum-74y",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Ученик практикума",
    descriptor: "74 года",
    photo: null,
    result: { value: "74", unit: "года", text: "· первый ИИ-ролик" },
    media: {
      type: "video",
      src: "/stories/practicum/reel-74y.jpg",
      embedUrl: "https://www.youtube.com/embed/a6kI7H38uzU",
      piiBlurred: false,
      caption: "Ролик ученика, 74 года",
    },
    audiences: ["beginners", "career"],
    source: "ai-pro-school.kz/prakticum",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "https://ai-pro-school.kz/prakticum · YouTube a6kI7H38uzU",
  },
  {
    id: "video-practicum-1_9m",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Ученица практикума",
    descriptor: "вирусный ИИ-ролик",
    photo: null,
    result: { value: "1,9 млн", unit: "просмотров", text: "на ролике" },
    media: {
      type: "video",
      src: "/stories/practicum/reel-1_9m.jpg",
      embedUrl: "https://www.youtube.com/embed/rpQWe1Z3CQ4",
      piiBlurred: false,
      caption: "Ролик ученицы · 1,9 млн просмотров",
    },
    audiences: ["beginners", "freelancers"],
    source: "ai-pro-school.kz/prakticum",
    asOf: "2026-10",
    verified: true,
    consent: true,
    note: "https://ai-pro-school.kz/prakticum · YouTube rpQWe1Z3CQ4",
  },
  {
    id: "receipt-practicum-1",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Оплата за ролик",
    descriptor: "ученик практикума",
    photo: null,
    result: { value: "30 000", unit: "₸", text: "· средний чек за ролик" },
    media: {
      type: "receipt",
      src: "/stories/practicum/receipt-1.png",
      piiBlurred: true,
      caption: "Скриншот оплаты от заказчика, ученица практикума",
    },
    audiences: ["beginners", "freelancers"],
    source: "ai-pro-school.kz/prakticum",
    asOf: "2026-10",
    verified: true,
    consent: true,
    variant: "receipt",
    note: "Скрин оплаты с практикума; сумма в заголовке — средний чек со страницы, не привязка к конкретному чеку",
  },
  {
    id: "receipt-practicum-2",
    direction: "creator", // кейсы про ИИ-ролики; вайб-кодинг-кейсов пока нет
    name: "Оплата за ролик",
    descriptor: "ученик практикума",
    photo: null,
    result: { value: "", unit: "", text: "Реальная оплата за вирусный ролик" },
    media: {
      type: "receipt",
      src: "/stories/practicum/receipt-2.png",
      piiBlurred: true,
      caption: "Скриншот оплаты от заказчика, ученица практикума",
    },
    audiences: ["beginners", "freelancers"],
    source: "ai-pro-school.kz/prakticum",
    asOf: "2026-10",
    verified: true,
    consent: true,
    variant: "receipt",
    note: "https://ai-pro-school.kz/prakticum · блок оплат",
  },
];

/** Можно ли показать на проде */
export function isStoryPublishable(s: Story): boolean {
  return s.verified === true && s.consent === true;
}

/** Можно ли показать media-слот */
export function canShowStoryMedia(s: Story): boolean {
  if (!s.media) return false;
  if (s.media.type === "receipt" && s.media.piiBlurred !== true) return false;
  const hasFile = Boolean(s.media.src || s.media.embedUrl);
  // На проде без файла слот не рисуем; в dev — placeholder-медиа
  if (!hasFile && !SHOW_PLACEHOLDERS) return false;
  return true;
}

/**
 * Список для UI: на проде — только publishable;
 * в dev / SHOW_PLACEHOLDERS — все (с бейджами).
 */
export function getVisibleStories(): Story[] {
  if (SHOW_PLACEHOLDERS) return stories;
  return stories.filter(isStoryPublishable);
}

export function getStoriesForHome(limit = 6): Story[] {
  return getVisibleStories().slice(0, limit);
}

export function getStoriesForAudience(audience: AudienceSlug, limit?: number): Story[] {
  const list = getVisibleStories().filter((s) => s.audiences.includes(audience));
  return limit ? list.slice(0, limit) : list;
}

export { storyAudienceFilters } from "./story-filters";
