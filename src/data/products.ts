import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { formatNumber, nameInSentence } from "@/lib/utils";
import type { ProductId } from "./product-ids";
import { vocabulary } from "./vocabulary";

/**
 * Единый конфиг продуктов школы: цены, даты, названия, CTA и ссылки — только отсюда.
 * Две линейки: creator и vibecoding; ступени: try → project → profession. Интенсив и VIP на сайте не упоминаем.
 * Ничего не выдумывать: неизвестное значение = null, и тогда оно на сайте не показывается.
 */
export type Direction = "creator" | "vibecoding";
export type Step = "try" | "project" | "profession";
export type { ProductId } from "./product-ids";

/** Изменение цены с даты. from: null — дата пока неизвестна, запись не действует. */
export interface PriceStep {
  /** ISO-дата начала действия цены (YYYY-MM-DD) или null */
  from: string | null;
  price: number;
}

/** Пункт «Что соберёте» (иконка — ключ из ProductLanding). Не подтверждённый пункт в проде заменяется на fallbackTitle или скрывается */
export interface Deliverable {
  id: string;
  title: string;
  icon: "store" | "send" | "bot" | "flag";
  verified: boolean;
  /** Что показывать в проде вместо неподтверждённого пункта */
  fallbackTitle?: string;
}

export interface Product {
  id: ProductId;
  direction: Direction;
  step: Step;
  name: string;
  /**
   * Название утверждено. false — в проде показывается короткое название (`name`), полное рабочее — только в dev
   * (см. resolveName); утвердят — поставить true и убрать из vocabulary лишнее.
   */
  nameApproved: boolean;
  resultLine: string;
  /** Рабочее название-уточнение (подпись под H1): в проде только если nameApproved, в dev — с пометкой */
  workingTitle?: string;
  /** Пункты «Что соберёте» (страница продукта) */
  deliverables?: Deliverable[];
  format: string;
  /**
   * Формат (число эфиров, дни недели) подтверждён школой. false — в проде только «онлайн, живые эфиры, 7 дней»,
   * детали (3 эфира, Пн/Вт/Ср, потоки) скрыты. Пока только у практикума.
   */
  formatVerified?: boolean;
  /** Текущая цена, ₸. 0 — бесплатно. null — не задана (не показываем) */
  price: number | null;
  pricePrefix: "от" | "";
  /** Условия оплаты кратко («есть рассрочка») */
  priceNote: string;
  /** Платёж в рассрочку ₸/мес. null — цифры нет, блок скрыт */
  installmentFromPerMonth: number | null;
  /** Будущие изменения цены; записи с from: null пока не действуют */
  priceSchedule: PriceStep[];
  /** Дни потока, 0 = вс … 6 = сб (как Date.getDay). null — потоков по расписанию нет */
  cohortWeekdays: number[] | null;
  /** Подтверждены ли дни потока */
  cohortVerified: boolean;
  /** Дата ближайшего старта (ISO) — только если известна */
  nextStart: string | null;
  ctaLabel: string;
  landingUrl: string;
  whatsappText: string;
  /**
   * Ключевое слово для WhatsApp («УРОК», «VIBE») — пока null и нигде не используется: школа не подтвердила,
   * какое слово к какому продукту относится.
   */
  whatsappKeyword: string | null;
  thanksUrl: string;
  /** Сколько мест осталось (офлайн-формат). null — счётчик скрыт; «до 8 мест» в формате — вместимость, не остаток */
  seatsLeft: number | null;
  /** Адрес проведения (офлайн). null — блок «Где и когда» скрыт */
  address: string | null;
  /** Даты проведения (офлайн). null — блок «Где и когда» скрыт */
  schedule: string | null;
  /** Условия возврата — только текст школы; null — блок скрыт (на страницах курсов) */
  refundTerms: string | null;
  /** Программа по модулям; null — блок скрыт (данных в проекте нет) */
  modules: { title: string; items: string[] }[] | null;
  leader: "Надира" | "Майдан";
  verified: boolean;
  source: string;
  asOf: string;
}

/**
 * «Сейчас» для расчёта цен. Только для проверки смены цены эфира (check-copy --at): APS_TEST_NOW подменяет дату,
 * APS_TEST_EFIR_PAID_FROM задаёт дату начала платной цены эфира. check-env запрещает их в боевой сборке.
 */
export const currentDate = (): Date => (process.env.APS_TEST_NOW ? new Date(process.env.APS_TEST_NOW) : new Date());

/** Слово «бесплатно» живёт только здесь и в efir.ts: остальной код берёт строки из efirPriceLabel() и efir.ts */
export const FREE_WORD = "бесплатно";

const SOURCE = "разбор сайта 22.10.2026";
const AS_OF = "2026-10-22";

/** Заготовка текста для WhatsApp и страницы «спасибо» — единая для всех продуктов */
const wa = (name: string) => `Здравствуйте! Хочу узнать про ${nameInSentence(name)}`;
const thanks = (id: ProductId) => `/thanks/${id}`;

/** Название продукта с неутверждённой частью: в проде — публичное, в dev — полное рабочее (с пометкой в UI) */
function resolveName(publicName: string, fullWorkingName: string): string {
  return SHOW_PLACEHOLDERS ? fullWorkingName : publicName;
}

/**
 * Адреса страниц направлений и каталога — единственный источник для меню, лестниц и sitemap
 * (адреса самих продуктов — поле landingUrl у каждого продукта ниже).
 */
export const directionPages: Record<Direction, string> = { creator: "/courses/creator", vibecoding: "/courses/vibecoding" };
export const catalogUrl = "/courses";

export const products: Product[] = [
  {
    id: "practicum",
    direction: "creator",
    step: "try",
    name: vocabulary.practicum,
    nameApproved: true,
    resultLine: "Первый ИИ-ролик с телефона на бесплатных нейросетях",
    // TODO(клиент): подтвердить формат (3 эфира по 90 минут, Пн/Вт/Ср, потоки пн/чт) → formatVerified: true, формат вернуть на подробный
    formatVerified: false,
    format: "онлайн, живые эфиры, 7 дней",
    price: 9900,
    pricePrefix: "",
    priceNote: "",
    installmentFromPerMonth: null,
    priceSchedule: [],
    cohortWeekdays: [1, 4], // пн, чт
    cohortVerified: false, // TODO(клиент): подтвердить дни потоков
    nextStart: null,
    ctaLabel: "Записаться на практикум",
    landingUrl: "/courses/practicum",
    whatsappText: wa(vocabulary.practicum),
    whatsappKeyword: null,
    seatsLeft: null,
    address: null, // TODO(клиент): адрес проведения
    schedule: null, // TODO(клиент): даты проведения
    modules: null, // TODO(клиент): программа по модулям
    refundTerms: null, // TODO(клиент): условия возврата (текст школы)
    thanksUrl: thanks("practicum"),
    leader: "Надира",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "ai-creator",
    direction: "creator",
    step: "profession",
    name: vocabulary.creatorCourse,
    nameApproved: true,
    resultLine: "Портфолио, упакованный профиль и прайс",
    format: "онлайн, куратор проверяет работы",
    price: 249000,
    pricePrefix: "от",
    priceNote: "есть рассрочка",
    installmentFromPerMonth: null, // цифру пока не дали — не показываем
    priceSchedule: [],
    cohortWeekdays: null,
    cohortVerified: false,
    nextStart: null,
    ctaLabel: "Узнать про курс",
    landingUrl: "/courses/ai-creator",
    whatsappText: wa(vocabulary.creatorCourse),
    whatsappKeyword: null,
    seatsLeft: null,
    address: null, // TODO(клиент): адрес проведения
    schedule: null, // TODO(клиент): даты проведения
    modules: null, // TODO(клиент): программа по модулям
    refundTerms: null, // TODO(клиент): условия возврата (текст школы)
    thanksUrl: thanks("ai-creator"),
    leader: "Надира",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "efir",
    direction: "vibecoding",
    step: "try",
    name: vocabulary.efir,
    nameApproved: true,
    resultLine: "Увидеть, как без кода собирается сайт с заявками",
    format: "онлайн, 1,5 часа",
    price: 0, // сейчас бесплатно
    pricePrefix: "",
    priceNote: "",
    installmentFromPerMonth: null,
    // Эфир станет платным (9 900 ₸), но дату не назвали: запись с from: null не действует, пока не появится дата.
    priceSchedule: [{ from: process.env.APS_TEST_EFIR_PAID_FROM ?? null, price: 9900 }],
    cohortWeekdays: null,
    cohortVerified: false,
    nextStart: null,
    ctaLabel: "Записаться на эфир",
    landingUrl: "/courses/vibecoding#lead",
    whatsappText: wa(vocabulary.efir),
    whatsappKeyword: null,
    seatsLeft: null,
    address: null, // TODO(клиент): адрес проведения
    schedule: null, // TODO(клиент): даты проведения
    modules: null, // TODO(клиент): программа по модулям
    refundTerms: null, // TODO(клиент): условия возврата (текст школы)
    thanksUrl: thanks("efir"),
    leader: "Майдан",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "offline",
    direction: "vibecoding",
    step: "project",
    name: vocabulary.offline,
    nameApproved: true,
    resultLine: "Демо сайта, бота или агента под свою задачу за 3 часа",
    format: "Астана, сб и вс, 3 часа, до 8 мест",
    price: 35000,
    pricePrefix: "",
    priceNote: "",
    installmentFromPerMonth: null,
    priceSchedule: [],
    cohortWeekdays: null, // сб и вс указаны в формате текстом; расписание потоков не задавали
    cohortVerified: false,
    nextStart: null,
    ctaLabel: "Забронировать место",
    landingUrl: "/courses/vibecoding-offline",
    whatsappText: wa(vocabulary.offline),
    whatsappKeyword: null,
    seatsLeft: null,
    address: null, // TODO(клиент): адрес проведения
    schedule: null, // TODO(клиент): даты проведения
    modules: null, // TODO(клиент): программа по модулям
    refundTerms: null, // TODO(клиент): условия возврата (текст школы)
    thanksUrl: thanks("offline"),
    leader: "Майдан",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
  {
    id: "course",
    direction: "vibecoding",
    step: "profession",
    name: resolveName(vocabulary.vibecodingCourse, vocabulary.vibecodingCourseFull),
    nameApproved: false, // «(Junior AI Developer)» — рабочее название на утверждении, только в dev
    // Пункт «проект для компании-партнёра» не подтверждён (deliverables → verified: false): в проде — «итоговый проект»
    resultLine: "Магазин с CRM, Telegram-бот, ИИ-агент и итоговый проект",
    workingTitle: "Junior AI Developer",
    deliverables: [
      { id: "shop", title: "Магазин с CRM", icon: "store", verified: true },
      { id: "telegram-bot", title: "Telegram-бот", icon: "send", verified: true },
      { id: "ai-agent", title: "ИИ-агент", icon: "bot", verified: true },
      { id: "final-project", title: "Проект для компании-партнёра", icon: "flag", verified: false, fallbackTitle: "Итоговый проект" },
    ],
    format: "3 месяца",
    price: 400000,
    pricePrefix: "",
    priceNote: "есть рассрочка",
    installmentFromPerMonth: null,
    priceSchedule: [],
    cohortWeekdays: null,
    cohortVerified: false,
    nextStart: null,
    ctaLabel: "Узнать про курс",
    landingUrl: "/courses/vibecoding-course",
    whatsappText: wa(vocabulary.vibecodingCourse),
    whatsappKeyword: null,
    seatsLeft: null,
    address: null, // TODO(клиент): адрес проведения
    schedule: null, // TODO(клиент): даты проведения
    modules: null, // TODO(клиент): программа по модулям
    refundTerms: null, // TODO(клиент): условия возврата (текст школы)
    thanksUrl: thanks("course"),
    leader: "Майдан",
    verified: true,
    source: SOURCE,
    asOf: AS_OF,
  },
];

export function getProduct(id: ProductId): Product {
  const p = products.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown product: ${id}`);
  return p;
}

/**
 * Пункты «Что соберёте» для показа: подтверждённые — как есть; неподтверждённый в проде заменяется на fallbackTitle
 * (или пропускается), в dev показывается с пометкой unverified.
 */
export function getDeliverables(product: Product): { id: string; title: string; icon: Deliverable["icon"]; unverified: boolean }[] {
  type Shown = { id: string; title: string; icon: Deliverable["icon"]; unverified: boolean };
  return (product.deliverables ?? []).flatMap((d): Shown[] => {
    if (d.verified) return [{ id: d.id, title: d.title, icon: d.icon, unverified: false }];
    if (SHOW_PLACEHOLDERS) return [{ id: d.id, title: d.title, icon: d.icon, unverified: true }];
    return d.fallbackTitle ? [{ id: d.id, title: d.fallbackTitle, icon: d.icon, unverified: false }] : [];
  });
}

/** Подпись последнего шага пути вайб-кодинга: «Проект для компании-партнёра» только когда он подтверждён, иначе «Итоговый проект» */
export function getFinalProjectTitle(): string {
  return getDeliverables(getProduct("course")).find((d) => d.id === "final-project")?.title ?? "Итоговый проект";
}

/** Цена на момент now: базовая, затем последняя действующая запись расписания (записи с from: null игнорируются). */
export function getCurrentPrice(product: Product, now: Date = currentDate()): number | null {
  let price = product.price;
  const active = product.priceSchedule
    .filter((s): s is { from: string; price: number } => s.from !== null && new Date(s.from).getTime() <= now.getTime())
    .sort((a, b) => a.from.localeCompare(b.from));
  for (const s of active) price = s.price;
  return price;
}

export interface PriceParts {
  /** «от» или пусто */
  prefix: string;
  /** «9 900» (неразрывные пробелы) — пусто у «бесплатно» */
  amount: string;
  /** «₸» — пусто у «бесплатно» */
  unit: string;
  /** Текст целиком для случаев, где разметка не нужна */
  text: string;
}

const NBSP = " ";

/** Составные части цены для вёрстки (единица мельче и в nowrap — см. ProductPrice). null-цена → пустые части. */
export function formatPriceParts(product: Product, now: Date = currentDate()): PriceParts {
  const price = getCurrentPrice(product, now);
  if (price === null) return { prefix: "", amount: "", unit: "", text: "" };
  if (price === 0) return { prefix: "", amount: FREE_WORD, unit: "", text: FREE_WORD };
  const prefix = product.pricePrefix;
  const amount = formatNumber(price);
  return {
    prefix,
    amount,
    unit: "₸",
    text: `${prefix ? `${prefix}${NBSP}` : ""}${amount}${NBSP}₸`,
  };
}

/** «9 900 ₸», «от 249 000 ₸», «бесплатно» — с неразрывными пробелами. Пустая строка, если цены нет. */
export function formatPrice(product: Product, now: Date = currentDate()): string {
  return formatPriceParts(product, now).text;
}

export interface Cohort {
  /** Ближайший день потока, ISO (YYYY-MM-DD, по Астане) */
  date: string;
  /** 0 = вс … 6 = сб */
  weekday: number;
  /** Подтверждены ли дни потока — пока нет, UI не должен подавать дату как факт */
  verified: boolean;
}

const ALMATY_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC+5

/**
 * Ближайший день потока по cohortWeekdays (включая сегодня, время суток не учитывается). Календарь — по Астане.
 * null, если у продукта нет расписания потоков — тогда дату не показываем.
 */
export function getNextCohort(id: ProductId, now: Date = currentDate()): Cohort | null {
  const p = getProduct(id);
  if (!p.cohortWeekdays || p.cohortWeekdays.length === 0) return null;
  const local = new Date(now.getTime() + ALMATY_OFFSET_MS);
  const today = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  for (let i = 0; i < 7; i++) {
    const d = new Date(today + i * 86_400_000);
    if (p.cohortWeekdays.includes(d.getUTCDay())) {
      return { date: d.toISOString().slice(0, 10), weekday: d.getUTCDay(), verified: p.cohortVerified };
    }
  }
  return null;
}

/** Какой продукт стоит за страницей курса (цены и даты на страницах курсов берём из него) */
export const courseProductId: Record<string, ProductId> = {
  "ai-creator": "ai-creator",
  practicum: "practicum",
  vibecoding: "efir",
};

export function getProductForCourse(slug: string): Product | null {
  const id = courseProductId[slug];
  return id ? getProduct(id) : null;
}

const WEEKDAYS_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

/** «26 октября» — дата потока по-русски; withWeekday: «пн, 26 октября» */
export function formatCohortDate(cohort: Cohort, withWeekday = false): string {
  const [, m, d] = cohort.date.split("-").map(Number);
  const text = `${d} ${MONTHS_GEN[(m ?? 1) - 1]}`;
  return withWeekday ? `${WEEKDAYS_SHORT[cohort.weekday]}, ${text}` : text;
}

// ───────────── Вход в направления ─────────────

/** Подписи ступеней лестницы */
export const STEP_LABELS: Record<Step, string> = {
  try: "Попробовать",
  project: "Сделать первый проект",
  profession: "Освоить профессию",
};

/** Входные продукты (ступень «Попробовать») — по одному на направление */
export function getEntryProducts(): Product[] {
  return products.filter((p) => p.step === "try");
}

/** Короткое название входного продукта для подписи («Практикум», «Эфир») */
const entryShortName: Partial<Record<ProductId, string>> = { practicum: vocabulary.practicumShort, efir: vocabulary.efirShort };

/** Строка под кнопкой входа: «Практикум от 9 900 ₸», «Эфир бесплатно». Цена — из конфига, не хардкод. */
export function formatEntryLine(product: Product, now: Date = currentDate()): string {
  const price = getCurrentPrice(product, now);
  const name = entryShortName[product.id] ?? product.name;
  if (price === null) return name;
  if (price === 0) return `${name} ${FREE_WORD}`;
  return `${name}${NBSP}${formatNumber(price)}${NBSP}₸`;
}

/**
 * Эфир сейчас бесплатный? Считается по priceSchedule эфира (дата, с которой он платный, пока неизвестна — запись не действует).
 */
export function efirIsFree(now: Date = currentDate()): boolean {
  return getCurrentPrice(getProduct("efir"), now) === 0;
}

/**
 * Цена эфира строкой для любых текстов сайта: «бесплатно» пока цена 0, иначе «9 900 ₸» (неразрывные пробелы).
 * Пустая строка, если цены нет. Руками «бесплатно» про эфир нигде не писать — только эта функция и efir.ts.
 */
export function efirPriceLabel(now: Date = currentDate()): string {
  return formatPriceParts(getProduct("efir"), now).text;
}

/**
 * Подзаголовок первого экрана: «Без техобразования. Начать можно с {минимальная платная входная цена} или с эфира».
 * Слово «бесплатного» — только пока эфир бесплатный (цена 0 в priceSchedule), потом «с эфира».
 */
export function getEntrySubtitle(now: Date = currentDate()): { before: string; price: string; after: string } {
  const entries = getEntryProducts();
  const priced = entries.map((p) => getCurrentPrice(p, now));
  const paid = priced.filter((v): v is number => v !== null && v > 0);
  const hasFree = priced.some((v) => v === 0);
  const hasEfir = entries.some((p) => p.id === "efir");
  const min = paid.length ? Math.min(...paid) : null;
  const before = "Без техобразования. Начать можно с ";
  const efirWord = hasFree ? "бесплатного эфира" : "эфира";
  if (min === null) return { before: hasEfir ? `${before}${efirWord}` : "Без техобразования", price: "", after: "" };
  return { before, price: `${formatNumber(min)}${NBSP}₸`, after: hasEfir ? ` или с ${efirWord}` : "" };
}

/** Первый шаг направления для карточек: короткое название и цена (из конфига) */
export function getEntryStep(direction: Direction, now: Date = currentDate()): { name: string; price: PriceParts } | null {
  const p = getEntryProducts().find((x) => x.direction === direction);
  if (!p) return null;
  return { name: entryShortName[p.id] ?? p.name, price: formatPriceParts(p, now) };
}

/** Условия оплаты для страниц курсов: сумма рассрочки, если задана, иначе короткая заметка из конфига («есть рассрочка») */
export function getPaymentNote(product: Product): string | null {
  if (product.installmentFromPerMonth) return `Рассрочка от ${formatNumber(product.installmentFromPerMonth)}${NBSP}₸ в месяц`;
  return product.priceNote || null;
}
