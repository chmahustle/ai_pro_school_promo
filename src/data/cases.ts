import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { formatMonthYear } from "@/lib/utils";
import type { AudienceSlug } from "./types";

/**
 * Кейсы блока «Результаты учеников» (главная, /for/*, страницы направлений, /reviews): единый шаблон карточки CaseCard.
 * Прод: только verified && consent. Dev: остальные — с красной пометкой.
 * Источник на карточке — не внутренний домен, а «Данные аккаунта ученицы/ученика, {месяц год}» или «Данные школы, {месяц год}» (sourceKind + asOf).
 * Ссылка «Смотреть ролик» — только на публичный оригинал (sourceUrl). Квитанции оплат сюда не входят (вкладка «Чеки и переписки» на /reviews).
 *
 * TODO(клиент): согласия учеников, постеры и скриншоты статистики для карточек без медиа, актуальные asOf.
 */
export interface Case {
  id: string;
  direction: "creator" | "vibecoding";
  audiences: AudienceSlug[];
  /** Доход/личная история: только на /reviews */
  individualResult?: boolean;
  /** Имя или «Ученица практикума» */
  authorName: string;
  /** Роль/описание одной строкой */
  authorRole: string;
  /** Число: «2,7 млн», «500 000 ₸» (обязательно с цифрой; нечисловые заголовки метрикой не считаются) */
  metric: string;
  /** Подпись к цифре: «просмотров на ролике» */
  metricLabel: string;
  /** Фото автора (56 px в ряду автора); нет — миниатюра постера видео, иначе инициалы */
  photoSrc: string | null;
  /** Постер видео (next/image): миниатюра 56 px с play */
  posterSrc: string | null;
  /** «До»: дословно из источника, без сокращений; необязательно */
  before?: string;
  /** «После»: дословно из источника; необязательно */
  after?: string;
  /** Цитата — только дословная; необязательно */
  quote?: string;
  /** Тексты before/after/quote подтверждены: false — в prod не показываются, в dev с красной пометкой */
  textsVerified: boolean;
  /** Embed-ссылка видео: открывается в модалке по клику */
  videoUrl: string | null;
  /** Публичный оригинал (ссылка «Смотреть ролик»); внутренние домены сюда не пишем */
  sourceUrl: string | null;
  /** Чьи данные: аккаунт ученицы / аккаунт ученика / школа */
  sourceKind: "student-f" | "student-m" | "school";
  asOf: string;
  verified: boolean;
  consent: boolean;
  /** Служебная заметка: только dev */
  note?: string;
}

const AS_OF = "2026-10";
const yt = (id: string) => ({ videoUrl: `https://www.youtube.com/embed/${id}`, sourceUrl: `https://www.youtube.com/watch?v=${id}` });

export const cases: Case[] = [
  {
    id: "alena",
    direction: "creator",
    audiences: ["freelancers", "beginners", "business", "career"],
    individualResult: true,
    authorName: "Алёна Заярных",
    authorRole: "без опыта в AI-видео",
    metric: "500 000 ₸",
    metricLabel: "договор на 15 роликов",
    photoSrc: "/stories/case-alena.webp",
    posterSrc: null,
    videoUrl: null,
    sourceUrl: null,
    before: "Нет опыта в AI-видео, первые ролики не залетали, думала сдаться.",
    after: "500+ AI-видео, миллионные просмотры, куратор AI Pro School.",
    quote: "Несколько месяцев от первого видео до куратора школы",
    textsVerified: true,
    sourceKind: "student-f",
    asOf: AS_OF,
    verified: true,
    consent: true,
    note: "нужен скриншот статистики или видео", // TODO(клиент)
  },
  {
    // Не публикуем: формулировки про заказчиков и доход не подтверждены (verified:false) — в prod карточки нет
    id: "madina",
    direction: "creator",
    audiences: ["beginners", "freelancers", "business", "career"],
    authorName: "Мадина",
    authorRole: "мама двоих детей в декрете",
    metric: "Клиенты-компании", // copy-check:ignore
    metricLabel: "постоянный клиент Казахтелеком", // copy-check:ignore
    photoSrc: "/stories/case-madina.webp",
    posterSrc: null,
    videoUrl: null,
    sourceUrl: null,
    before: "Мама двоих детей в декрете, без дохода и опыта в IT. Только телефон и желание.", // copy-check:ignore
    after: "Работает с компаниями, постоянный клиент Казахтелеком, стабильный доход из дома.", // copy-check:ignore
    quote: "Я начала, имея только телефон. Сегодня Казахтелеком мой постоянный клиент", // copy-check:ignore
    textsVerified: false,
    sourceKind: "student-f",
    asOf: AS_OF,
    verified: false,
    consent: true,
    note: "не публикуем: формулировки не подтверждены",
  },
  {
    id: "gulaiym",
    direction: "creator",
    audiences: ["beginners", "freelancers", "career", "business"],
    authorName: "Гульайым",
    authorRole: "ноль опыта в AI и монтаже",
    metric: "1 600 000",
    metricLabel: "просмотров за 5 дней",
    photoSrc: "/stories/case-gulayym.webp",
    posterSrc: null,
    videoUrl: null,
    sourceUrl: null,
    before: "Ноль опыта в AI и монтаже, пустой аккаунт, не знала, с чего начать.",
    textsVerified: true,
    sourceKind: "student-f",
    asOf: AS_OF,
    verified: true,
    consent: true,
    note: "нужен скриншот статистики или видео", // TODO(клиент)
  },
  {
    id: "shynar",
    direction: "creator",
    audiences: ["beginners", "career"],
    individualResult: true,
    authorName: "Шынар",
    authorRole: "43 года",
    metric: "500 000 ₸",
    metricLabel: "+ 150 000 ₸ в месяц · 8 часов",
    photoSrc: null,
    posterSrc: "/stories/video-shynar.jpg",
    ...yt("IsYI0XQy9A8"),
    textsVerified: true,
    sourceKind: "school",
    asOf: AS_OF,
    verified: true,
    consent: true,
  },
  {
    id: "moldir",
    direction: "creator",
    audiences: ["freelancers", "career", "beginners"],
    individualResult: true,
    authorName: "Молдир",
    authorRole: "техспец",
    metric: "1 000 000 ₸",
    metricLabel: "в месяц",
    photoSrc: null,
    posterSrc: "/stories/video-moldir.jpg",
    ...yt("_vHOfJPFbUY"),
    textsVerified: true,
    sourceKind: "school",
    asOf: AS_OF,
    verified: true,
    consent: true,
  },
  {
    id: "practicum-2_7m",
    direction: "creator",
    audiences: ["beginners", "freelancers"],
    authorName: "Ученица практикума",
    authorRole: "Вирусные ИИ-ролики",
    metric: "2,7 млн",
    metricLabel: "просмотров на ролике",
    photoSrc: null,
    posterSrc: "/stories/practicum/reel-2_7m.jpg",
    ...yt("H9gsaBtulxQ"),
    textsVerified: true,
    sourceKind: "student-f",
    asOf: AS_OF,
    verified: true,
    consent: true,
  },
  {
    id: "practicum-74y",
    direction: "creator",
    audiences: ["beginners", "career"],
    authorName: "Ученик практикума",
    authorRole: "Вирусные ИИ-ролики",
    metric: "74 года",
    metricLabel: "первый ИИ-ролик",
    photoSrc: null,
    posterSrc: "/stories/practicum/reel-74y.jpg",
    ...yt("a6kI7H38uzU"),
    textsVerified: true,
    sourceKind: "student-m",
    asOf: AS_OF,
    verified: true,
    consent: true,
  },
  {
    id: "practicum-1_9m",
    direction: "creator",
    audiences: ["beginners", "freelancers"],
    authorName: "Ученица практикума",
    authorRole: "Вирусные ИИ-ролики",
    metric: "1,9 млн",
    metricLabel: "просмотров на ролике",
    photoSrc: null,
    posterSrc: "/stories/practicum/reel-1_9m.jpg",
    ...yt("rpQWe1Z3CQ4"),
    textsVerified: true,
    sourceKind: "student-f",
    asOf: AS_OF,
    verified: true,
    consent: true,
  },
];

/** Можно ли показать в проде */
export const isCasePublishable = (c: Case): boolean => c.verified && c.consent;

/** Метрика — число с подписью: есть хотя бы одна цифра */
export const isNumericMetric = (metric: string): boolean => /\d/.test(metric);

/** Подпись-источник: «Данные аккаунта ученицы, октябрь 2026» / «Данные школы, октябрь 2026» */
export function caseSourceCaption(c: Case): string {
  const who = c.sourceKind === "school" ? "Данные школы" : c.sourceKind === "student-f" ? "Данные аккаунта ученицы" : "Данные аккаунта ученика";
  return `${who}, ${formatMonthYear(c.asOf)}`;
}

/** Список для UI: прод — verified && consent; dev — все (неподтверждённые с пометкой) */
export function getVisibleCases(): Case[] {
  return SHOW_PLACEHOLDERS ? cases : cases.filter(isCasePublishable);
}
