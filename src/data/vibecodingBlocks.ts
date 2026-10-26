import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { efirPrep } from "./efir";
import { getProduct } from "./products";

/**
 * Содержательные блоки страниц вайб-кодинга (страница эфира, лендинг курса). Тексты — из прежней версии страницы
 * (courses.ts / faq.ts, git-история), переписаны без обещаний дохода и трудоустройства. У каждого пункта verified / source / asOf:
 * в проде показываются только verified:true, в dev остальные — с красной пометкой «не подтверждено».
 * Слово «эфир» в падежах и цена — только через efir.ts / products.ts; «бесплатно» руками не пишем.
 */
export interface VibeItem {
  id: string;
  title?: string;
  text: string;
  verified: boolean;
  /** Откуда текст (для проверки данных; посетителям не показывается) */
  source: string;
  asOf: string;
}

export interface VibeFaq {
  id: string;
  q: string;
  a: string;
  /** Ответ строится из products.ts при рендере (следующие ступени с ценой) — см. faq.ts */
  dynamic?: "after-efir";
  verified: boolean;
  source: string;
  asOf: string;
}

const AS_OF = "2026-10";
const SRC = "прежняя версия страницы вайб-кодинга (courses.ts, git-история)";

export interface PublicVibeItem {
  id: string;
  title?: string;
  text: string;
  /** Только dev */
  devNote?: string;
}

/** Прод: только verified; dev: остальные с пометкой */
function visible<T extends { verified: boolean }>(items: T[]): (T & { devNote?: string })[] {
  return items.flatMap((i) => (i.verified ? [i] : SHOW_PLACEHOLDERS ? [{ ...i, devNote: "не подтверждено" }] : []));
}

const forWhom = (): VibeItem[] => [
  { id: "business", title: "Предприниматель", text: "платите за сайты, ботов и автоматизацию", verified: true, source: SRC, asOf: AS_OF },
  { id: "freelance", title: "Фрилансер или специалист", text: "хотите добавить AI-продукты в услуги", verified: true, source: SRC, asOf: AS_OF },
  { id: "career", title: "Специалист в найме", text: "хотите забрать рутину у ИИ", verified: true, source: SRC, asOf: AS_OF },
  { id: "ai-user", title: "Уже используете AI", text: "хотите перейти от запросов к созданию продуктов", verified: true, source: SRC, asOf: AS_OF },
  // По запросу владельца: плитки про новичков; тексты — из подтверждённых ответов FAQ
  { id: "newbie", title: "Даже если вы новичок", text: "программировать не нужно: достаточно понимать свою работу и уметь поставить задачу", verified: true, source: "faq: «Нужно ли уметь программировать?»", asOf: AS_OF },
  { id: "no-ai", title: "Даже если вы не работали с ИИ", text: `на ${efirPrep()} покажем, как ставить задачу ИИ, чтобы получить работающий результат`, verified: true, source: "лендинг для бизнеса (faq)", asOf: AS_OF },
];

const outcomes = (): VibeItem[] => [
  { id: "what", text: "Понимать, что такое вайб-кодинг и как это работает на экране", verified: true, source: SRC, asOf: AS_OF },
  { id: "build", text: "Собирать сайты, лендинги и Telegram-ботов без программиста", verified: true, source: SRC, asOf: AS_OF },
  { id: "automate", text: "Автоматизировать заявки, отчёты, переписку и документы", verified: true, source: SRC, asOf: AS_OF },
  // Оценка стоимости на рынке — тот же вопрос, что FAQ «Сколько стоят такие услуги на рынке?» (ответ школы не получен)
  { id: "market", text: "Оценивать, сколько это стоит на рынке", verified: false, source: SRC, asOf: AS_OF },
  { id: "offer", text: "Предлагать AI-продукты клиентам и работодателю", verified: true, source: SRC, asOf: AS_OF },
];

const efirAgenda = (): VibeItem[] => [
  { id: "demo", text: "Что такое вайб-кодинг — показываем на экране", verified: true, source: SRC, asOf: AS_OF },
  { id: "tasks", text: "Какие задачи уже автоматизируют: заявки, CRM, боты, сайты", verified: true, source: SRC, asOf: AS_OF },
  { id: "cost", text: "Сколько стоит разработка на рынке и как сделать дешевле", verified: false, source: SRC, asOf: AS_OF },
  { id: "guide", text: "Гайд в подарок после регистрации", verified: false, source: SRC, asOf: AS_OF },
];

/** Вопросы страницы эфира (общая модель FAQ — faq.ts подмешивает их с pages vibecoding / vibecoding-efir / vibecoding-course) */
export const vibeFaq: VibeFaq[] = [
  { id: "what", q: "Что такое вайб-кодинг?", a: "Способ создавать рабочие продукты — сайты, ботов, автоматизации — описывая задачу ИИ на обычном языке, без написания кода вручную.", verified: true, source: SRC, asOf: AS_OF },
  { id: "edu", q: "Нужно ли уметь программировать?", a: "Нет. Достаточно понимать свой бизнес или свою работу и уметь формулировать задачу. Остальное показываем.", verified: true, source: SRC, asOf: AS_OF },
  { id: "participation", q: "Что нужно для участия?", a: "Ноутбук и желание. Все инструменты — доступные.", verified: true, source: SRC, asOf: AS_OF },
  { id: "after", q: "Что после эфира?", a: "", dynamic: "after-efir", verified: true, source: "products.ts (следующие ступени)", asOf: AS_OF },
];

/** Факты hero страницы эфира: длительность, формат, уровень, старт (значения из products.ts / courses.ts) */
const heroFacts = (): { id: string; label: string; value: string; verified: boolean; source: string; asOf: string }[] => {
  const efir = getProduct("efir");
  // «онлайн, 1,5 часа» → формат и длительность отдельными карточками
  const [format = "онлайн", duration = "1,5 часа"] = efir.format.split(", ").map((x) => x.trim());
  return [
    { id: "duration", label: "Длительность", value: duration, verified: true, source: "products.ts → efir.format", asOf: AS_OF },
    { id: "format", label: "Формат", value: format.charAt(0).toUpperCase() + format.slice(1), verified: true, source: "products.ts → efir.format", asOf: AS_OF },
    { id: "level", label: "Уровень", value: "Без опыта в разработке", verified: true, source: "courses.ts → vibecoding.level", asOf: AS_OF },
    { id: "start", label: "Старт", value: "По регистрации", verified: true, source: "courses.ts → vibecoding.startNote", asOf: AS_OF },
  ];
};

/** Публичные блоки: только verified (dev — с пометкой) */
export function getVibecodingBlocks() {
  const pub = (x: VibeItem & { devNote?: string }): PublicVibeItem => ({ id: x.id, title: x.title, text: x.text, devNote: x.devNote });
  return {
    forWhom: visible(forWhom()).map(pub),
    outcomes: visible(outcomes()).map(pub),
    efirAgenda: visible(efirAgenda()).map(pub),
    heroFacts: visible(heroFacts()).map((f) => ({ id: f.id, label: f.label, value: f.value })),
  };
}

/** «Чему научитесь» на лендинге курса: из подтверждённых пунктов «Что соберёте» (products.ts → deliverables), без обещаний дохода и трудоустройства */
export function getCourseOutcomes(): PublicVibeItem[] {
  const verb: Record<string, string> = {
    shop: "Собрать магазин с CRM",
    "telegram-bot": "Сделать Telegram-бота",
    "ai-agent": "Создать ИИ-агента",
    "final-project": "Довести до конца итоговый проект",
  };
  return (getProduct("course").deliverables ?? []).flatMap((d) => {
    if (!d.verified && !SHOW_PLACEHOLDERS && !d.fallbackTitle) return [];
    const unverified = !d.verified;
    // Неподтверждённый «проект партнёра» в проде заменён на «итоговый проект» (fallbackTitle) — глагол общий
    return [{ id: d.id, text: verb[d.id] ?? d.title, devNote: unverified && SHOW_PLACEHOLDERS ? "не подтверждено" : undefined }];
  });
}
