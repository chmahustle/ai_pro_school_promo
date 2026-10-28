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
  /** Цифра крупно: «2,7 млн», «500 000 ₸» */
  metric: string;
  /** Подпись к цифре: «просмотров на ролике» */
  metricLabel: string;
  /** Что сделано — одна строка */
  doneLine: string;
  /** Постер видео (next/image) */
  posterSrc: string | null;
  /** Скриншот статистики — если нет видео */
  statsSrc: string | null;
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
    doneLine: "500+ AI-видео, куратор AI Pro School",
    posterSrc: null,
    statsSrc: null,
    videoUrl: null,
    sourceUrl: null,
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
    doneLine: "Школа сама заказывает у неё ролики", // copy-check:ignore
    posterSrc: null,
    statsSrc: null,
    videoUrl: null,
    sourceUrl: null,
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
    doneLine: "ИИ-ролики с пустого аккаунта",
    posterSrc: null,
    statsSrc: null,
    videoUrl: null,
    sourceUrl: null,
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
    doneLine: "Видеоотзыв ученицы курса",
    posterSrc: "/stories/video-shynar.jpg",
    statsSrc: null,
    ...yt("IsYI0XQy9A8"),
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
    doneLine: "Видеоотзыв ученика курса",
    posterSrc: "/stories/video-moldir.jpg",
    statsSrc: null,
    ...yt("_vHOfJPFbUY"),
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
    authorRole: "ИИ-ролик",
    metric: "2,7 млн",
    metricLabel: "просмотров на ролике",
    doneLine: "Ролик ученицы практикума",
    posterSrc: "/stories/practicum/reel-2_7m.jpg",
    statsSrc: null,
    ...yt("H9gsaBtulxQ"),
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
    authorRole: "74 года",
    metric: "74 года",
    metricLabel: "первый ИИ-ролик",
    doneLine: "Ролик ученика практикума",
    posterSrc: "/stories/practicum/reel-74y.jpg",
    statsSrc: null,
    ...yt("a6kI7H38uzU"),
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
    authorRole: "ИИ-ролик",
    metric: "1,9 млн",
    metricLabel: "просмотров на ролике",
    doneLine: "Ролик ученицы практикума",
    posterSrc: "/stories/practicum/reel-1_9m.jpg",
    statsSrc: null,
    ...yt("rpQWe1Z3CQ4"),
    sourceKind: "student-f",
    asOf: AS_OF,
    verified: true,
    consent: true,
  },
];

/** Можно ли показать в проде */
export const isCasePublishable = (c: Case): boolean => c.verified && c.consent;

/** Подпись-источник: «Данные аккаунта ученицы, октябрь 2026» / «Данные школы, октябрь 2026» */
export function caseSourceCaption(c: Case): string {
  const who = c.sourceKind === "school" ? "Данные школы" : c.sourceKind === "student-f" ? "Данные аккаунта ученицы" : "Данные аккаунта ученика";
  return `${who}, ${formatMonthYear(c.asOf)}`;
}

/** Список для UI: прод — verified && consent; dev — все (неподтверждённые с пометкой) */
export function getVisibleCases(): Case[] {
  return SHOW_PLACEHOLDERS ? cases : cases.filter(isCasePublishable);
}
