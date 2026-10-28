import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { nameInSentence } from "@/lib/utils";
import { speakers } from "./speakers";
import { vocabulary } from "./vocabulary";

/**
 * Содержание лендинга курса «Вайбкодинг с нуля» (/courses/vibecoding-course): программа, формат обучения, этапы результата,
 * расходы на сервисы, «кому подходит», преподаватели, FAQ. Тексты — своими словами по программе курса (внутренний документ
 * в репозиторий и сборку не попадает). Цены курса, названия и ссылки — только products.ts / vocabulary.ts.
 * В проде показываются только verified:true; в dev остальное — с красной пометкой.
 */
interface Checked {
  verified: boolean;
  /** Откуда взято (для проверки данных; посетителям не показывается) */
  source: string;
  asOf: string;
}

const SOURCE = "программа курса и приветствие студентам";
const AS_OF = "2026-10";

// ───────────── Программа ─────────────

export interface CourseModule extends Checked {
  id: string;
  /** Часть программы: 1 — основная (модули 1–9 и доп. 2.2), 2 — «Месяц поддержки» (10–14) */
  part: 1 | 2;
  /** Номер модуля как в программе: «1», «2.2», «12» */
  number: string;
  title: string;
  /** Цель модуля одной строкой */
  goal: string;
  /** Короткие названия уроков */
  lessons: string[];
  /** Модуль «по желанию» (12) */
  optional?: boolean;
}

export const coursePartTitles: Record<1 | 2, string> = {
  1: "Часть 1",
  2: "Месяц поддержки: финальный проект и запуск",
};

/**
 * TODO(клиент): программа по 14 модулям (названия, цели, уроки). Источник — внутренний документ с описанием курса,
 * в репозитории его нет: пока пусто, блок «Программа» скрыт. Уже известно: модуль 12 — «по желанию»,
 * 13 — «Сайт для продукта и приём платежей», 14 — «Воронка продаж и публичный запуск».
 */
export const courseProgram: CourseModule[] = [];

// ───────────── Как проходит обучение ─────────────

export interface CourseDeliveryItem extends Checked {
  id: "online" | "recorded" | "calls" | "support" | "chat" | "offline";
  title: string;
  text: string;
}

export const courseDelivery: CourseDeliveryItem[] = [
  { id: "online", title: "Онлайн", text: "Курс проходит полностью онлайн.", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "recorded", title: "Уроки в записи", text: "Смотрите в удобное время и возвращайтесь к сложным темам.", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "calls", title: "Онлайн-созвоны каждую неделю", text: "Живые встречи с преподавателем проходят каждую неделю.", verified: true, source: SOURCE, asOf: AS_OF },
  {
    id: "support",
    title: "Персональная поддержка от разработчика",
    text: "Пишите ему напрямую: он ответит, поможет разобраться и подключится к вашей задаче.",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  { id: "chat", title: "Чат курса", text: "Вопросы и обсуждение — в общем чате студентов.", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "offline", title: "Офлайн-урок раз в месяц", text: "Один раз в месяц проходит офлайн-урок.", verified: true, source: SOURCE, asOf: AS_OF },
];

/** Строка формата для hero */
export const courseHeroFormat = "Онлайн, уроки в записи";
export const courseHeroLevel = "Без опыта";

// ───────────── Что получится по этапам ─────────────

export interface CourseMilestone extends Checked {
  id: string;
  text: string;
  /** Плитка-акцент: другой фон, без порядкового номера */
  highlight?: boolean;
}

export const courseMilestones: CourseMilestone[] = [
  { id: "shop", text: "Собственный магазин с ИИ-консультантом", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "crm", text: "CRM-система для работы с заказами и клиентами", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "server", text: "Научитесь правильно заливать проект на сервер", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "tg-agent", text: "Сделаете и внедрите AI-агента в Telegram-бот", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "agent-team", text: "Минимум 5 разных ИИ-агентов, объединённых в команду", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "automation", text: "Автоматизация различных задач: n8n и другие инструменты", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "orders", text: "Выполните реальные заказы и научитесь интеграции WhatsApp, Instagram, Битрикс24 и других сервисов", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "publish", text: "Публикация проекта на своём домене и сервере", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "more", text: "+ более 20 проектов", highlight: true, verified: true, source: SOURCE, asOf: AS_OF },
];

// ───────────── Что понадобится кроме курса ─────────────

export interface CourseCost extends Checked {
  id: "cursor" | "openai";
  name: string;
  /** Сумма с неразрывными пробелами: «около $20 в месяц» */
  amount: string;
  hint?: string;
}

const NB = " ";

export const courseCosts: { payer: string; items: CourseCost[] } = {
  payer: "Сервисы оплачивает студент",
  items: [
    { id: "cursor", name: "Cursor", amount: `около${NB}$30${NB}в${NB}месяц`, verified: true, source: SOURCE, asOf: "2026-09-29" },
    { id: "openai", name: "API OpenAI", amount: `около${NB}$15`, hint: `хватает на${NB}1–2${NB}месяца, а${NB}начать можно даже с${NB}$5`, verified: true, source: SOURCE, asOf: "2026-09-29" },
  ],
};

/** Цены сервисов меняются: пометка только в dev */
const COST_DEV_NOTE = "уточнить актуальность"; // copy-check:ignore

// ───────────── Кому подходит ─────────────

export interface CourseForWhom extends Checked {
  id: string;
  title: string;
  text: string;
}

export const courseForWhom: CourseForWhom[] = [
  { id: "no-code", title: "Без опыта программирования", text: "курс идёт с нуля, писать код вручную не нужно", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "business", title: "Предприниматель", text: "хотите сами собирать сайты, ботов и автоматизации для своего дела", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "manager", title: "Руководитель", text: "хотите понимать, как делаются AI-продукты, и разгружать команду от рутины", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "specialist", title: "Специалист", text: "хотите добавить в свою работу навык создавать продукты с ИИ", verified: true, source: SOURCE, asOf: AS_OF },
];

// ───────────── Что пока не подтверждено (в проде не показывается совсем) ─────────────

export interface CourseUnverified extends Checked {
  id: string;
  label: string;
}

const pending = (id: string, label: string): CourseUnverified => ({ id, label, verified: false, source: "внутренний документ: формулировка требует подтверждения школой", asOf: AS_OF });

export const courseUnverified: CourseUnverified[] = [
  pending("certificate", "сертификат"),
  pending("hours", "число часов и уроков"),
  pending("partner-project", "«проект от партнёра школы»"),
  pending("maidan-wins", "победы и проекты Майдана"),
  pending("astana-hub", "«резидент Astana Hub»"),
  pending("reply-time", "время ответа преподавателя"),
  pending("cohort-size", "размеры потоков"),
];

// ───────────── FAQ ─────────────

export interface CourseFaq extends Checked {
  id: string;
  q: string;
  a: string;
}

const creatorShort = vocabulary.creatorCourse.replace(/^Курс /, "");

export const courseFaq: CourseFaq[] = [
  {
    id: "experience",
    q: "Нужен ли опыт?",
    a: "Нет. Курс идёт с нуля: программировать не нужно, достаточно понимать свою задачу и уметь её сформулировать.",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "extra-costs",
    q: "Что понадобится кроме курса и сколько это стоит?",
    a: `Ноутбук и два сервиса, которые оплачивает студент: ${courseCosts.items
      .map((c) => `${c.name} — ${c.amount}${c.hint ? ` (${c.hint})` : ""}`)
      .join("; ")}.`,
    verified: true,
    source: SOURCE,
    asOf: "2026-09-29",
  },
  {
    id: "recorded",
    q: "Почему уроки в записи?",
    a: "Запись можно смотреть в удобное время и пересматривать сложные темы. Вопросы разбираем вживую на онлайн-созвонах каждую неделю и в чате курса, а разработчику можно написать лично.",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "opening",
    q: "Как открываются уроки?",
    a: "Новые уроки открываются каждую неделю. Программа может корректироваться по обратной связи студентов.",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "vs-creator",
    q: `Чем ${nameInSentence(vocabulary.vibecodingCourse)} отличается от курса ${creatorShort}?`,
    a: `Курс ${creatorShort} — про контент: ИИ-ролики, портфолио и прайс. ${vocabulary.vibecodingCourse} — про продукт: вы собираете магазин, Telegram-бота и ИИ-агента и запускаете свой проект.`,
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
];

// ───────────── Публичная модель ─────────────

export interface PublicCourseContent {
  program: { part: 1 | 2; partTitle: string; modules: { id: string; number: string; title: string; goal: string; lessons: string[]; optional: boolean; devNote?: string }[] }[];
  delivery: { id: string; title: string; text: string; devNote?: string }[];
  milestones: { id: string; text: string; highlight: boolean; devNote?: string }[];
  costs: { payer: string; items: { id: string; name: string; amount: string; hint?: string; devNote?: string }[]; devNote?: string };
  forWhom: { id: string; text: string; title: string; devNote?: string }[];
  /** Только dev: что скрыто как неподтверждённое */
  devUnverified: string[];
  /** Только dev: чего не хватает */
  devMissing: string[];
}

const DEV_NOTE = "не подтверждено";

/** Прод: только verified; dev: остальные с пометкой */
function visible<T extends Checked>(items: T[]): (T & { devNote?: string })[] {
  return items.flatMap((i) => (i.verified ? [i] : SHOW_PLACEHOLDERS ? [{ ...i, devNote: DEV_NOTE }] : []));
}

export function getCourseContent(): PublicCourseContent {
  const modules = visible(courseProgram);
  const program = ([1, 2] as const).flatMap((part) => {
    const list = modules.filter((m) => m.part === part);
    return list.length === 0
      ? []
      : [{ part, partTitle: coursePartTitles[part], modules: list.map((m) => ({ id: m.id, number: m.number, title: m.title, goal: m.goal, lessons: m.lessons, optional: Boolean(m.optional), devNote: m.devNote })) }];
  });
  const costItems = visible(courseCosts.items);
  return {
    program,
    delivery: visible(courseDelivery).map((d) => ({ id: d.id, title: d.title, text: d.text, devNote: d.devNote })),
    milestones: visible(courseMilestones).map((m) => ({ id: m.id, text: m.text, highlight: Boolean(m.highlight), devNote: m.devNote })),
    costs: {
      payer: courseCosts.payer,
      items: costItems.map((c) => ({ id: c.id, name: c.name, amount: c.amount, hint: c.hint, devNote: c.devNote })),
      devNote: SHOW_PLACEHOLDERS ? COST_DEV_NOTE : undefined,
    },
    forWhom: visible(courseForWhom).map((f) => ({ id: f.id, title: f.title, text: f.text, devNote: f.devNote })),
    devUnverified: SHOW_PLACEHOLDERS ? courseUnverified.map((u) => u.label) : [],
    devMissing: SHOW_PLACEHOLDERS && program.length === 0 ? ["программа по модулям (courseContent.ts → courseProgram)"] : [],
  };
}

/** Преподаватели курса (единый источник — speakers.ts): только подтверждённые строки */
export function getCourseTeacherIds(): ("maidan" | "nadira")[] {
  return speakers.filter((s) => s.verified).map((s) => s.id);
}
