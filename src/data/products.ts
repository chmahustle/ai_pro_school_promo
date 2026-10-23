import { formatNumber } from "@/lib/utils";
import { vocabulary } from "./vocabulary";

/**
 * Единый конфиг продуктов школы: цены, даты, названия, CTA и ссылки — только отсюда.
 * Две линейки: creator и vibecoding; ступени: try → project → profession. Интенсив и VIP на сайте не упоминаем.
 * Ничего не выдумывать: неизвестное значение = null, и тогда оно на сайте не показывается.
 */
export type Direction = "creator" | "vibecoding";
export type Step = "try" | "project" | "profession";
export type ProductId = "practicum" | "ai-creator" | "efir" | "offline" | "course";

/** Изменение цены с даты. from: null — дата пока неизвестна, запись не действует. */
export interface PriceStep {
  /** ISO-дата начала действия цены (YYYY-MM-DD) или null */
  from: string | null;
  price: number;
}

export interface Product {
  id: ProductId;
  direction: Direction;
  step: Step;
  name: string;
  /** Название ещё не утверждено — в тексте помечать «на утверждении» */
  nameStatus: "approved" | "pending";
  resultLine: string;
  format: string;
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
  thanksUrl: string;
  leader: "Надира" | "Майдан";
  verified: boolean;
  source: string;
  asOf: string;
}

const SOURCE = "разбор сайта 22.10.2026";
const AS_OF = "2026-10-22";

/** Заготовка текста для WhatsApp и страницы «спасибо» — единая для всех продуктов */
const wa = (name: string) => `Здравствуйте! Хочу узнать про «${name}»`;
const thanks = (id: ProductId) => `/thanks?src=product-${id}&interest=${id}`;

export const products: Product[] = [
  {
    id: "practicum",
    direction: "creator",
    step: "try",
    name: vocabulary.practicum,
    nameStatus: "approved",
    resultLine: "Первый ИИ-ролик с телефона на бесплатных нейросетях",
    format: "онлайн, потоки дважды в неделю",
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
    nameStatus: "approved",
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
    nameStatus: "approved",
    resultLine: "Увидеть, как без кода собирается сайт с заявками",
    format: "онлайн, 1,5 часа",
    price: 0, // сейчас бесплатно
    pricePrefix: "",
    priceNote: "",
    installmentFromPerMonth: null,
    // Эфир станет платным (9 900 ₸), но дату не назвали: запись с from: null не действует, пока не появится дата.
    priceSchedule: [{ from: null, price: 9900 }],
    cohortWeekdays: null,
    cohortVerified: false,
    nextStart: null,
    ctaLabel: "Записаться на эфир",
    landingUrl: "/courses/vibecoding#efir",
    whatsappText: wa(vocabulary.efir),
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
    nameStatus: "approved",
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
    name: vocabulary.vibecodingCourseFull,
    nameStatus: "pending", // название на утверждении
    resultLine: "Магазин с CRM, Telegram-бот, ИИ-агент и проект для компании-партнёра",
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

/** Цена на момент now: базовая, затем последняя действующая запись расписания (записи с from: null игнорируются). */
export function getCurrentPrice(product: Product, now: Date = new Date()): number | null {
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
export function formatPriceParts(product: Product, now: Date = new Date()): PriceParts {
  const price = getCurrentPrice(product, now);
  if (price === null) return { prefix: "", amount: "", unit: "", text: "" };
  if (price === 0) return { prefix: "", amount: "бесплатно", unit: "", text: "бесплатно" };
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
export function formatPrice(product: Product, now: Date = new Date()): string {
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
export function getNextCohort(id: ProductId, now: Date = new Date()): Cohort | null {
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
