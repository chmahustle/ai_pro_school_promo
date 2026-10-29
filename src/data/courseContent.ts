import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { nameInSentence } from "@/lib/utils";
import { speakers } from "./speakers";
import { vocabulary } from "./vocabulary";

/**
 * Содержание лендинга курса «Вайбкодинг с нуля» (/courses/vibecoding-course): программа, формат обучения, этапы результата,
 * расходы на сервисы, «кому подходит», преподаватели, FAQ. Тексты - своими словами по программе курса (внутренний документ
 * в репозиторий и сборку не попадает). Цены курса, названия и ссылки - только products.ts / vocabulary.ts.
 * В проде показываются только verified:true; в dev остальное - с красной пометкой.
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
  /** Часть программы: 1 - основная (модули 1–9 и доп. 2.2), 2 - «Месяц поддержки» (10–14) */
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
 * TODO(клиент): программа по 14 модулям (названия, цели, уроки). Источник - внутренний документ с описанием курса,
 * в репозитории его нет: пока пусто, блок «Программа» скрыт. Уже известно: модуль 12 - «по желанию»,
 * 13 - «Сайт для продукта и приём платежей», 14 - «Воронка продаж и публичный запуск».
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
  { id: "chat", title: "Чат курса", text: "Вопросы и обсуждение - в общем чате студентов.", verified: true, source: SOURCE, asOf: AS_OF },
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
  { id: "media", text: "Научитесь создавать программы для генерации видео и фото", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "tg-agent", text: "Сделаете и внедрите AI-агента в Telegram-бот", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "agent-team", text: "Минимум 5 разных ИИ-агентов, объединённых в команду", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "automation", text: "Автоматизация различных задач: n8n и другие инструменты", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "orders", text: "Выполните реальные заказы и научитесь интеграции WhatsApp, Instagram, Битрикс24 и других сервисов", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "server", text: "Научитесь правильно заливать проект на сервер", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "more", text: "+ более 20 проектов", highlight: true, verified: true, source: SOURCE, asOf: AS_OF },
];

// ───────────── Офлайн-урок: «Что вы получите» ─────────────

export const offlineMilestones: CourseMilestone[] = [
  { id: "what", text: "Поймёте, что такое вайб-кодинг: что с его помощью можно сделать по-настоящему, а что нельзя", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "cursor", text: "Установите Cursor и поймёте, как с ним работать: убедитесь, что это так же просто, как общаться с ChatGPT", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "idea", text: "Поймёте, как придумать и упаковать идею, и разработаете её прямо на уроке", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "cycle", text: "Научитесь работать с вайб-кодингом по специальному циклу", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "next", text: "Уйдёте домой, понимая, что делать дальше", highlight: true, verified: true, source: SOURCE, asOf: AS_OF },
];

/** Публичный список «Что вы получите» для страницы офлайн-урока: только verified (dev - с пометкой) */
export function getOfflineMilestones(): PublicCourseContent["milestones"] {
  return visible(offlineMilestones).map((m) => ({ id: m.id, text: m.text, highlight: Boolean(m.highlight), devNote: m.devNote }));
}

// ───────────── Офлайн-урок: «Один навык для любых задач» ─────────────

export interface OfflineSkillItem extends Checked {
  id: string;
  title: string;
  text: string;
}

/** Блок «Один навык для любых задач» (страница офлайн-урока): заголовок, вводный абзац и три примера. Тексты — как утвердил владелец */
export const offlineSkill = {
  title: "Один навык",
  titleAccent: "для любых задач",
  lead: "Вы описываете задачу словами, ИИ пишет код. Освойте это один раз и будете сами собирать инструменты под",
  leadAccent: "работу, своё дело и жизнь",
  items: [
    { id: "work", title: "В работе", text: "Отчёт по продажам собирается за минуту, вместо вечера в Excel.", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "business", title: "В своём деле", text: "Бот принимает заявки и записывает клиентов, даже когда вы спите.", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "life", title: "В жизни", text: "Помощник ведёт семейный бюджет, напоминает о платежах и составляет меню на неделю.", verified: true, source: SOURCE, asOf: AS_OF },
  ] as OfflineSkillItem[],
};

/** Публичная модель блока: только verified (dev - остальные с пометкой) */
export function getOfflineSkill() {
  return {
    title: offlineSkill.title,
    titleAccent: offlineSkill.titleAccent,
    lead: offlineSkill.lead,
    leadAccent: offlineSkill.leadAccent,
    items: visible(offlineSkill.items).map((i) => ({ id: i.id, title: i.title, text: i.text, devNote: i.devNote })),
  };
}

// ───────────── Офлайн-урок: «Что соберёте именно вы» ─────────────

export interface OfflineBuildMessage {
  text: string;
  time?: string;
  /** Подпись-разделитель перед сообщением («утром», «на следующий день») */
  gap?: string;
}

/** Карточка-сценарий: что сейчас («Сейчас») и что соберёте на уроке. Тексты — как на странице школы ai-pro-school.kz/newness */
export interface OfflineBuildCard extends Checked {
  id: string;
  /** Для кого: метка аудитории из vocabulary.audienceLabels (Бизнес / Фрилансеры / Специалисты в найме) */
  audience: string;
  /** Боль одной фразой */
  pain: string;
  now: { source: string; lines: OfflineBuildMessage[]; outcome: string };
  built: {
    title: string;
    badge?: string;
    lines: OfflineBuildMessage[];
    tags?: { label: string; value: string }[];
    /** Мини-график: высоты столбиков 0-100 (статичный SVG); данные вымышленные */
    chart?: number[];
    /** Строки с числами под графиком (вымышленные данные) */
    stats?: { label: string; value: string }[];
  };
}

const NB2 = "\u00a0";

export const offlineBuild: OfflineBuildCard[] = [
  {
    id: "business",
    audience: vocabulary.audienceLabels.business,
    pain: "Клиенты пишут ночью, а утром уже записаны к конкурентам",
    now: {
      source: "WhatsApp салона",
      lines: [
        { text: "Здравствуйте, можно завтра на 10:00?", time: "23:47" },
        { gap: "утром", text: "Доброе утро! Да, свободно", time: "09:30" },
        { text: "Спасибо, уже записалась в другой салон", time: "09:32" },
      ],
      outcome: "Клиент ушёл, пока все спали",
    },
    built: {
      title: "Бот записи",
      badge: "24/7",
      lines: [
        { text: "Можно завтра на 10:00?", time: "23:47" },
        { text: "Да, 10:00 свободно. Записала вас, Айгерим. Утром пришлю напоминание.", time: "23:47" },
        { text: `Новая запись, завтра 10:00 · 8${NB2}000${NB2}₸` },
      ],
    },
    verified: true,
    source: "ai-pro-school.kz/newness (блок «Что соберёте именно вы»)",
    asOf: AS_OF,
  },
  {
    id: "expert",
    audience: vocabulary.audienceLabels.freelancers,
    pain: "Клиенты не приходят, а предоплату приходится выпрашивать",
    now: {
      source: "Переписка с клиентом",
      lines: [
        { text: "Подтверждаете завтра 15:00? Скиньте, пожалуйста, предоплату на Kaspi", time: "18:10" },
        { text: "Да-да, вечером скину", time: "18:42" },
        { gap: "на следующий день", text: "Ой, сегодня не получится, давайте на следующей неделе", time: "14:40" },
      ],
      outcome: "Час пропал, предоплаты нет",
    },
    built: {
      title: "Ваша страница записи",
      lines: [{ text: "пт 12:00 · пт 15:00 · сб 11:00" }],
      tags: [
        { label: "Предоплата через Kaspi", value: "оплачено" },
        { label: "Напоминание клиенту за сутки", value: "включено" },
      ],
    },
    verified: true,
    source: "ai-pro-school.kz/newness (блок «Что соберёте именно вы»)",
    asOf: AS_OF,
  },
  {
    id: "employee",
    audience: vocabulary.audienceLabels.career,
    pain: "Каждый понедельник полдня уходит на отчёт из пяти таблиц",
    now: {
      source: "Понедельник 09:00",
      lines: [
        { text: "Продажи_Астана.xlsx · копировать" },
        { text: "Продажи_Алматы.xlsx · копировать" },
        { text: "Выгрузка_1С.xlsx · сверить" },
        { text: "Итог_v7_ФИНАЛ.xlsx · ошибка" },
      ],
      outcome: "Отчёт к обеду, если ничего не сломалось",
    },
    built: {
      title: "Дашборд продаж",
      badge: "обновлён в 09:01",
      lines: [{ text: "Отчёт ушёл руководителю в Telegram", time: "09:01" }],
      // Демо-данные (вымышленные): мини-график недели и две строки с числами
      chart: [42, 58, 51, 74, 66, 88, 95],
      stats: [
        { label: "Продажи за неделю", value: `1${NB2}240${NB2}000${NB2}₸` },
        { label: "Средний чек", value: `18${NB2}500${NB2}₸` },
      ],
    },
    verified: true,
    source: "ai-pro-school.kz/newness (блок «Что соберёте именно вы»)",
    asOf: AS_OF,
  },
  {
    id: "freelance",
    audience: vocabulary.audienceLabels.freelancers,
    pain: "Клиент просит сайт под рекламу, и вы отдаёте его агентству вместе с бюджетом",
    now: {
      source: "Чат с клиентом",
      lines: [
        { text: "Запускаем таргет. Нужен сайт под рекламу, сделаешь?", time: "11:05" },
        { text: "Сайты не делаю, могу посоветовать агентство", time: "11:20" },
        { text: "Ок, тогда и рекламу им отдадим", time: "11:24" },
      ],
      outcome: "Ушёл не только сайт, ушёл клиент",
    },
    built: {
      title: "Ваш ответ теперь",
      lines: [{ text: "Сделаю лендинг с формой, заявки будут сразу падать вам в Telegram", time: "11:20" }],
      tags: [
        { label: "Ведение соцсетей", value: "было" },
        { label: "Лендинг под рекламу", value: "новое" },
        { label: "Бот для заявок", value: "новое" },
      ],
    },
    verified: true,
    source: "ai-pro-school.kz/newness (блок «Что соберёте именно вы»)",
    asOf: AS_OF,
  },
];

/** «Ещё 68 идей, что можно собрать» — списки по группам, как на странице школы */
export const offlineIdeas: { id: string; title: string; items: string[] }[] = [
  { id: "business", title: "Для бизнеса", items: [
    "Сайт-визитка компании",
    "Лендинг под акцию или мероприятие",
    "Мини-CRM: клиенты и статусы сделок",
    "Telegram-бот для заявок и записи",
    "Онлайн-запись для салона, барбершопа, автосервиса",
    "Каталог с заказом в WhatsApp",
    "Калькулятор стоимости: ремонт, окна, доставка",
    "Складской учёт для магазина",
    "Учёт смен и зарплат",
    "Бот для сбора отзывов",
    "Программа лояльности и кэшбэк",
    "Меню кафе по QR-коду",
    "Бронирование столиков, бань, беседок",
    "Учёт заказов для кондитера, флориста, швеи",
    "Генератор КП и счетов",
    "Дашборд продаж",
    "Бот-напоминания клиентам",
  ] },
  { id: "ai", title: "AI-помощники на базе ChatGPT", items: [
    "AI-чат для сайта или WhatsApp",
    "AI-помощник продаж",
    "AI-финансист: бюджет и анализ трат",
    "AI-напоминания ИП о налогах",
    "AI-HR: разбор резюме",
    "AI-репетитор, подготовка к ЕНТ",
    "AI-рецепты из продуктов в холодильнике",
    "AI-программа тренировок",
    "AI-подбор квартир",
    "AI-планировщик поездок",
    "AI-копирайтер в стиле бренда",
    "AI-сказки и задания для детей",
    "AI-выжимка длинных документов",
    "AI-переводчик казахский, русский, английский",
    "Свой чат-бот с ролью и базой знаний",
  ] },
  { id: "experts", title: "Для экспертов и педагогов", items: [
    "Сайт эксперта с записью",
    "Бот-квиз для привлечения клиентов",
    "Тренажёр и тесты для учеников",
    "Электронный журнал оценок",
    "Генератор планов уроков",
    "Бот для домашних заданий",
    "Портфолио мастера или фотографа",
    "Калькулятор сметы для своей профессии",
    "Бот для приёма оплат и выдачи материалов",
  ] },
  { id: "marketing", title: "Маркетинг и контент", items: [
    "Генератор идей для Reels",
    "Контент-план с напоминаниями",
    "Генератор хуков и заголовков",
    "Бот-воронка: квиз, подарок, заявка",
    "Лендинг под рекламу",
    "Отчёты по рекламе",
    "Бот для розыгрышей",
  ] },
  { id: "routine", title: "Автоматизация рутины", items: [
    "Заявки с сайта в таблицу",
    "Бот для частых вопросов",
    "Отчёты из таблиц",
    "Рассылка счетов и напоминаний об оплате",
    "Обработка и сортировка файлов",
    "Сбор цен конкурентов",
    "Уведомления в Telegram о заказах",
  ] },
  { id: "family", title: "Для себя и семьи", items: [
    "Трекер привычек",
    "Планер задач и целей",
    "Семейный бюджет",
    "Трекер тренировок",
    "Дневник питания",
    "Общий список покупок",
    "Трекер чтения",
    "Органайзер рецептов",
    "Напоминалка о днях рождения",
    "Календарь кружков детей",
    "Расходы на машину",
    "Планировщик путешествий",
    "Личный сайт-резюме",
  ] },
];

export const offlineIdeasNote = "На уроке собираете первую версию одной идеи. Остальные дома, тем же способом.";

/** Публичная модель блока: только verified (dev - остальные с пометкой) */
export function getOfflineBuild() {
  return {
    cards: visible(offlineBuild).map(({ id, audience, pain, now, built, devNote }) => ({ id, audience, pain, now, built, devNote })),
    ideas: offlineIdeas,
    ideasNote: offlineIdeasNote,
    ideasCount: offlineIdeas.reduce((n, g) => n + g.items.length, 0),
  };
}

// ───────────── Офлайн-урок: «3 часа на уроке» ─────────────

export interface OfflineTimelineItem extends Checked {
  id: string;
  /** Время начала: «12:00» */
  time: string;
  title: string;
  text: string;
}

/** Расписание урока по блокам; дата и общее время — из products.ts (lessonDate, lessonTime). Тексты — как на странице школы ai-pro-school.kz/newness */
export const offlineTimeline = {
  title: "3 часа на уроке",
  items: [
    { id: "tools", time: "12:00", title: "Инструменты и подход", text: "Что такое вайб-кодинг, работа в Cursor, как ставить задачу ИИ.", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "spec", time: "12:30", title: "Ваша идея становится ТЗ", text: "Упаковываем задачу в понятное ТЗ и пошаговые промпты.", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "build", time: "13:00", title: "Сборка продукта", text: "Интерфейс и логика сайта, бота или помощника. Разработчик рядом.", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "fix", time: "14:15", title: "Починка ошибок", text: "Учимся заставлять ИИ найти и исправить баг.", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "link", time: "14:40", title: "Ссылка и план", text: "Публикуем продукт по ссылке и составляем план на 7 дней.", verified: true, source: SOURCE, asOf: AS_OF },
  ] as OfflineTimelineItem[],
  outcomePrefix: "Итог:",
  outcomeAccent: "продукт по ссылке",
  outcomeRest: ", которым пользуются, и навык собирать следующие",
};

export function getOfflineTimeline() {
  return {
    title: offlineTimeline.title,
    items: visible(offlineTimeline.items).map(({ id, time, title, text, devNote }) => ({ id, time, title, text, devNote })),
    outcomePrefix: offlineTimeline.outcomePrefix,
    outcomeAccent: offlineTimeline.outcomeAccent,
    outcomeRest: offlineTimeline.outcomeRest,
  };
}

// ───────────── Практикум: «Что вы получаете, присоединившись», видео и «Мы сами выросли» ─────────────
// Тексты - со страницы школы ai-pro-school.kz/prakticum (подтверждены владельцем 2026-10-29)

export interface PracticumGet extends Checked {
  id: string;
  /** Крупная розовая метка: «3 эфира», «30 дней» */
  label: string;
  text: string;
  /** Часть text, выделяемая жирным (должна входить в text) */
  bold?: string;
}

export const practicumGets: PracticumGet[] = [
  { id: "live", label: "3 эфира", text: "без воды по 90 минут", bold: "по 90 минут", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "chat", label: "7 дней", text: "чат с обратной связью в тг", bold: "чат", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "records", label: "30 дней", text: "доступ к записям", bold: "доступ", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "ideas", label: "Идеи", text: "для любой ниши даже сложной", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "prompts", label: "Промпты", text: "для создания сценариев", bold: "сценариев", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "docs", label: "Инструкции", text: "в отдельном документе", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "clients", label: "Способы", text: "быстрого поиска клиентов", verified: true, source: SOURCE, asOf: AS_OF },
];

export function getPracticumGets() {
  return visible(practicumGets).map(({ id, label, text, bold, devNote }) => ({ id, label, text, bold, devNote }));
}

/** «Коротко о практикуме»: видео на YouTube (плеер по клику), превью - локальный файл (до клика запросов к YouTube нет) */
export const practicumVideo = {
  youtubeId: "wC3Iwmk_MTg",
  posterSrc: "/cases/yt-wC3Iwmk_MTg.jpg",
  title: "Коротко о практикуме",
  verified: true,
  source: SOURCE,
  asOf: AS_OF,
};

/** «Мы сами выросли благодаря роликам через ИИ»: рост площадок школы */
export interface PracticumGrowthStat extends Checked {
  id: "instagram" | "tiktok" | "youtube";
  platform: string;
  /** «+75 000» */
  gain: string;
  period: string;
  /** Скриншоты профиля «было» и «стало» (public/growth/, со страницы школы ai-pro-school.kz/prakticum) */
  beforeSrc: string;
  afterSrc: string;
  /** Соотношение сторон скриншотов (ширина / высота) */
  beforeRatio: number;
  afterRatio: number;
}

const NBS = "\u00a0";

export const practicumGrowth = {
  title: "Мы сами выросли",
  titleAccent: "благодаря роликам",
  titleTail: "через ИИ",
  lead: "Мы используем ровно ту же систему, которую передаём вам на практикуме",
  highlight: "И самое главное:",
  highlightText: "этот же ролик можно выкладывать везде",
  stats: [
    { id: "instagram", platform: "Instagram", gain: `+75${NBS}000`, period: `за 6${NBS}месяцев`, beforeSrc: "/growth/instagram-before.webp", afterSrc: "/growth/instagram-after.webp", beforeRatio: 720 / 514, afterRatio: 720 / 518, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "tiktok", platform: "TikTok", gain: `+12${NBS}000`, period: `за 3${NBS}месяца`, beforeSrc: "/growth/tiktok-before.webp", afterSrc: "/growth/tiktok-after.webp", beforeRatio: 720 / 514, afterRatio: 720 / 590, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "youtube", platform: "YouTube", gain: `+10${NBS}000`, period: `за 2${NBS}месяца`, beforeSrc: "/growth/youtube-before.webp", afterSrc: "/growth/youtube-after.webp", beforeRatio: 720 / 514, afterRatio: 720 / 470, verified: true, source: SOURCE, asOf: AS_OF },
  ] as PracticumGrowthStat[],
};

export function getPracticumGrowth() {
  return { ...practicumGrowth, stats: visible(practicumGrowth.stats).map(({ id, platform, gain, period, beforeSrc, afterSrc, beforeRatio, afterRatio, devNote }) => ({ id, platform, gain, period, beforeSrc, afterSrc, beforeRatio, afterRatio, devNote })) };
}

// ───────────── Практикум: «Результаты наших учеников после практикума» ─────────────

export interface PracticumShot extends Checked {
  id: string;
  /** Скриншот переписки (public/practicum-results/, со страницы школы ai-pro-school.kz/prakticum) */
  src: string;
  /** Соотношение сторон (ширина / высота) */
  ratio: number;
}

export const practicumResults = {
  title: "Результаты наших учеников",
  titleTail: "после практикума",
  shots: [
    { id: "t01", src: "/practicum-results/01.webp", ratio: 320 / 400, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t02", src: "/practicum-results/02.webp", ratio: 320 / 400, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t03", src: "/practicum-results/03.webp", ratio: 650 / 1014, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t04", src: "/practicum-results/04.webp", ratio: 320 / 400, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t05", src: "/practicum-results/05.webp", ratio: 720 / 948, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t06", src: "/practicum-results/06.webp", ratio: 720 / 914, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t07", src: "/practicum-results/07.webp", ratio: 720 / 878, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t08", src: "/practicum-results/08.webp", ratio: 320 / 400, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t09", src: "/practicum-results/09.webp", ratio: 320 / 400, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t10", src: "/practicum-results/10.webp", ratio: 720 / 974, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t11", src: "/practicum-results/11.webp", ratio: 320 / 400, verified: true, source: SOURCE, asOf: AS_OF },
    { id: "t12", src: "/practicum-results/12.webp", ratio: 720 / 924, verified: true, source: SOURCE, asOf: AS_OF },
  ] as PracticumShot[],
};

export function getPracticumResults() {
  return { title: practicumResults.title, titleTail: practicumResults.titleTail, shots: visible(practicumResults.shots).map(({ id, src, ratio }) => ({ id, src, ratio })) };
}

// ───────────── Практикум: «Какие ролики вы можете создавать» ─────────────

export interface PracticumRoleVideo extends Checked {
  id: string;
  /** Подпись под роликом (как на странице школы) */
  label: string;
  /** id ролика YouTube: адрес плеера собирается в браузере по клику (ссылок youtube.com в HTML нет) */
  youtubeId: string;
  /** Локальный постер (до клика запросов к YouTube нет) */
  poster: string;
}

export const practicumFormats = {
  title: "Какие ролики вы",
  titleAccent: "можете создавать,",
  titleTail: "обучившись нашим ИИ",
  videos: [
    { id: "experts", label: "Ролики для экспертов/специалистов", youtubeId: "YJGNvYglvuE", poster: "/stories/practicum/reel-extra-3.jpg", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "business", label: "Ролик для бизнесов/компаний", youtubeId: "Uac29_nlknA", poster: "/stories/practicum/reel-extra-4.jpg", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "lovestory", label: "Lovestory/поздравительные ролики", youtubeId: "0lHtMeAnbrg", poster: "/stories/practicum/reel-extra-5.jpg", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "photos", label: "Оживление старых фотографий", youtubeId: "IGaH0pRQAcs", poster: "/stories/practicum/reel-extra-6.jpg", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "kids", label: "Обучающие видео для детей", youtubeId: "DraOftA9sdY", poster: "/stories/practicum/reel-extra-7.jpg", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "brands", label: "Ролики для брендов", youtubeId: "bGeHiczDroc", poster: "/stories/practicum/reel-extra-8.jpg", verified: true, source: SOURCE, asOf: AS_OF },
    { id: "topics", label: "Визуализация сложных тем", youtubeId: "G58GV--LEYU", poster: "/stories/practicum/reel-extra-9.jpg", verified: true, source: SOURCE, asOf: AS_OF },
  ] as PracticumRoleVideo[],
};

export function getPracticumFormats() {
  return { ...practicumFormats, videos: visible(practicumFormats.videos).map(({ id, label, youtubeId, poster }) => ({ id, label, youtubeId, poster })) };
}

// ───────────── Практикум: «Меня зовут Надира Батырбаева» ─────────────

export interface PracticumTeacherFact extends Checked {
  id: string;
  /** Части строки: accent - розовым */
  parts: { text: string; accent?: boolean }[];
}

const NB3 = "\u00a0";

/** Тексты - со страницы школы ai-pro-school.kz/prakticum (подтверждены владельцем 2026-10-30) */
export const practicumTeacher = {
  speakerId: "nadira" as const,
  greeting: "Меня зовут",
  name: "Надира Батырбаева",
  lead: [{ text: "Я " }, { text: "основатель AI Pro School", accent: true }, { text: " и больше 2-х лет в ИИ." }],
  facts: [
    { id: "followers", parts: [{ text: "мы набрали " }, { text: `+90${NB3}000 подписчиков`, accent: true }, { text: " в инсте, тикток и ютюб" }], verified: true, source: SOURCE, asOf: AS_OF },
    { id: "views", parts: [{ text: "мы собрали " }, { text: `+50${NB3}000${NB3}000 просмотров`, accent: true }, { text: " всего за полгода" }], verified: true, source: SOURCE, asOf: AS_OF },
    { id: "students", parts: [{ text: "обучили " }, { text: "+2000 человек ИИ", accent: true }, { text: " по всему миру" }], verified: true, source: SOURCE, asOf: AS_OF },
    { id: "platform", parts: [{ text: "разработали " }, { text: "собственную платформу ИИ-креаторов", accent: true }, { text: " при поддержке Astana Hub" }], verified: true, source: SOURCE, asOf: AS_OF },
    { id: "speaker", parts: [{ text: "спикер " }, { text: "Astana Hub", accent: true }], verified: true, source: SOURCE, asOf: AS_OF },
    { id: "itayel", parts: [{ text: "тренер проекта " }, { text: "ITAyel", accent: true }], verified: true, source: SOURCE, asOf: AS_OF },
    { id: "mom", parts: [{ text: "многодетная мама, предприниматель, лектор" }], verified: true, source: SOURCE, asOf: AS_OF },
  ] as PracticumTeacherFact[],
};

export function getPracticumTeacher() {
  const { speakerId, greeting, name, lead } = practicumTeacher;
  return { speakerId, greeting, name, lead, facts: visible(practicumTeacher.facts).map(({ id, parts, devNote }) => ({ id, parts, devNote })) };
}

// ───────────── Практикум: мини-гайд (скачивается в Telegram школы, не бонус за оплату) ─────────────

/** Тексты и ссылка - со страницы школы ai-pro-school.kz/prakticum (публичный пост Telegram) */
export const practicumGuide = {
  eyebrow: "Мини-гайд",
  title: "Заберите бонус от AI Pro School",
  lead: "Мы подготовили для вас мини-гайд",
  guideTitle: "«7 видов вирусных роликов, которые работают в 26-м году»",
  text: "В нём — самые сильные форматы, которые дают охваты и помогают выделиться в ленте.",
  action: "Скачайте гайд в нашем Telegram и используйте готовые идеи уже сегодня.",
  cta: "Скачать мини-гайд",
  href: "https://t.me/ai_pro_school/255",
  cover: "/practicum-guide.webp",
  verified: true,
  source: SOURCE,
  asOf: AS_OF,
};

export function getPracticumGuide() {
  return practicumGuide.verified || SHOW_PLACEHOLDERS ? practicumGuide : null;
}

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
      .map((c) => `${c.name} - ${c.amount}${c.hint ? ` (${c.hint})` : ""}`)
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
    a: `Курс ${creatorShort} - про контент: ИИ-ролики, портфолио и прайс. ${vocabulary.vibecodingCourse} - про продукт: вы собираете магазин, Telegram-бота и ИИ-агента и запускаете свой проект.`,
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
  costs: { payer: string; items: { id: string; name: string; amount: string; hint?: string; devNote?: string }[] };
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
    },
    forWhom: visible(courseForWhom).map((f) => ({ id: f.id, title: f.title, text: f.text, devNote: f.devNote })),
    devUnverified: SHOW_PLACEHOLDERS ? courseUnverified.map((u) => u.label) : [],
    devMissing: SHOW_PLACEHOLDERS && program.length === 0 ? ["программа по модулям (courseContent.ts → courseProgram)"] : [],
  };
}

/** Преподаватели курса (единый источник - speakers.ts): только подтверждённые строки */
export function getCourseTeacherIds(): ("maidan" | "nadira")[] {
  return speakers.filter((s) => s.verified).map((s) => s.id);
}
