/**
 * Публичные модели данных — то, что можно отправлять в браузер.
 * Никаких служебных полей: note, status, priceStatus, verified, consent, source, asOf, piiBlurred, logoPermission.
 * Собираются на сервере функциями из data/public.ts; клиентские компоненты получают только эти объекты через props.
 */
import type { AccentTheme, AudienceSlug, ReviewKind, StoryMediaType } from "./types";

/** Пометки для dev-режима (бейджи PLACEHOLDER/UNVERIFIED). В production-сборке всегда undefined. */
export interface PublicDev {
  badge: "placeholder" | "unverified" | null;
  note?: string;
  source?: string;
  asOf?: string;
}

export interface PublicStory {
  id: string;
  direction: "creator" | "vibecoding";
  teacherProject?: boolean;
  individualResult?: boolean;
  audiences: AudienceSlug[];
  name: string;
  descriptor: string;
  photo: string | null;
  result: { value: string; unit: string; text: string };
  before?: string;
  after?: string;
  /** Только дословная цитата */
  quote?: string;
  /** Есть только если медиа можно показывать */
  media?: { type: StoryMediaType; src: string | null; embedUrl?: string; caption?: string };
  variant: "default" | "receipt";
  dev?: PublicDev;
}

export interface PublicMetric {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  hint?: string;
  decimals?: number;
  featured?: boolean;
  pills?: string[];
  /** Подпись источника — только в dev */
  devSource?: string;
  devUnverified?: boolean;
}

export interface PublicHeroResult {
  id: string;
  name: string;
  result: string;
  label: string;
  progress: number;
  photo: string | null;
}

export interface PublicTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  facts: string[];
  photo: string | null;
  socials: { key: "instagram" | "tiktok" | "youtube" | "linkedin" | "telegram"; href: string }[];
  devNeedsPhoto?: boolean;
}

export interface PublicHeroData {
  results: PublicHeroResult[];
  teacher: { name: string; role: string; emoji: string; photo: string | null } | null;
  teacherMember: PublicTeamMember | null;
  event: { title: string; duration: string; tags: string[]; dateText: string; modalDateText: string; href: string; ctaLabel: string };
  /** Подробности кейса для окна по клику (по id карточки); null — только то, что есть в самой карточке */
  details: Record<string, { descriptor: string; before?: string; after?: string; quote?: string; photo: string | null; dev?: PublicDev } | null>;
  business: { subtitle: string; outcomes: { title: string; text: string }[] } | null;
  /** Вход в направления: подзаголовок и подписи под кнопками (цены из products.ts) */
  entry: { subtitle: { before: string; price: string; after: string }; creator: string; vibecoding: string };
}

/** Ступень лестницы продуктов: карточка в блоке «Продуктовая линейка» */
export interface PublicLadderStep {
  id: string;
  direction: "creator" | "vibecoding";
  /** «Попробовать», «Сделать первый проект», «Освоить профессию» */
  stepLabel: string;
  name: string;
  /** Название ещё не утверждено — подпись только в dev */
  devNameNote?: string;
  resultLine: string;
  format: string;
  price: { prefix: string; amount: string; unit: string };
  /** Ближайший старт: только подтверждённый, иначе null */
  start: string | null;
  ctaLabel: string;
  href: string;
  /** Входная ступень («Начните с этого») */
  isEntry: boolean;
  /** Ступень лестницы: от неё зависит цвет карточки */
  tier: "try" | "project" | "profession";
}

export interface PublicLadder {
  direction: "creator" | "vibecoding";
  /** Строка «для кого» */
  forWhom: string;
  /** Чипы-ссылки «Для кого» (название и адрес из audiences.ts / products.ts) */
  forWhomLinks: { label: string; href: string }[];
  leader: { name: string; photo: string | null };
  steps: PublicLadderStep[];
}

export interface PublicLineup {
  id: string;
  title: string;
  subtitle: string;
  ladderSubtitle: Record<"creator" | "vibecoding", string>;
  tabs: { id: "creator" | "vibecoding"; label: string }[];
  help: { label: string; href: string };
  entryBadge: string;
}

export interface PublicAudienceCard {
  slug: AudienceSlug;
  title: string;
  titleNote?: string;
  pain: string;
  chips: [string, string];
  ctaLabel: string;
  href: string;
  /** Короткое доказательство — только подтверждённое */
  proofText: string | null;
  /** Первый шаг направления и его цена (из products.ts) */
  firstStep: { name: string; price: { prefix: string; amount: string; unit: string } } | null;
}

/** «Выберите свой путь»: шапка направления и карточки аудиторий под ней */
export interface PublicAudienceGroup {
  direction: "creator" | "vibecoding";
  title: string;
  cards: PublicAudienceCard[];
}

/** Шаг пути в «Как это работает» */
export interface PublicPathStep {
  n: string;
  title: string;
  text: string;
  /** Цена шага, если у шага есть продукт */
  price: { prefix: string; amount: string; unit: string } | null;
}

export interface PublicPaths {
  tabs: { id: "creator" | "vibecoding"; label: string }[];
  paths: Record<"creator" | "vibecoding", PublicPathStep[]>;
}

/** Логотип/название в полосе «Где нас видели» */
export interface PublicPartner {
  id: string;
  name: string;
  /** Файл логотипа; null — только в dev (в проде без логотипа записи нет) */
  logo: string | null;
  relationLabel: string;
  /** Только dev: чего не хватает для показа */
  devNote?: string;
}

/** Вкладки блока «Результаты учеников» */
export interface PublicResultsTabs {
  tabs: { id: "creator" | "vibecoding"; label: string }[];
}

export interface MenuAudience {
  slug: AudienceSlug;
  path: string;
  menuTitle: string;
  menuSubtitle: string;
  accent: AccentTheme;
  heroEyebrow: string;
  heroTitle: string;
}

export interface MenuCourse {
  slug: string;
  shortName: string;
}

export interface MenuData {
  audiences: MenuAudience[];
  courses: MenuCourse[];
}

export interface FooterLegal {
  legalName: string;
  bin: string;
  address: string;
}

export interface PublicTestimonial {
  id: string;
  type: "testimonial" | "receipt" | "chat";
  /** Подпись с именем — только при согласии автора */
  label: string | null;
  poster: string;
  imageSrc: string | null;
  embedUrl: string | null;
  alt: string;
}

export interface PublicWork {
  id: string;
  poster: string;
  platformUrl: string | null;
  label: string | null;
  /** Бейдж просмотров — только подтверждённый */
  badge: string | null;
}

export interface PublicReview {
  id: string;
  kind: ReviewKind;
  author: string;
  context?: string;
  text?: string;
  src: string | null;
  embedUrl?: string;
  amount?: number;
  rating?: number;
  photo: string | null;
  dev?: PublicDev;
}

export interface PublicTariff {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  /** Только dev: пометка о неподтверждённых данных тарифа */
  devNote?: string;
  installment?: number | null;
  installmentMonths?: number;
  description: string;
  features: string[];
  excluded?: string[];
  popular?: boolean;
  cta?: string;
}

export interface PublicBonuses {
  title: string;
  items: string[];
  /** Только dev: пометка о неподтверждённом бонусе */
  devNote?: string;
}

export interface FormConfig {
  /** Продукты из products.ts + «Не знаю, помогите выбрать» */
  productOptions: { value: string; label: string }[];
  /** Согласие под кнопкой: «before» + ссылка «linkText» */
  agreement: { before: string; linkText: string; href: string };
  /** Обещание под кнопкой («Ответим в WhatsApp в течение 5 минут») */
  responseNote: string;
}

/** Данные страницы /thanks/[productId] */
export interface ThanksPageData {
  productId: string;
  /** Название продукта для фразы «про …» (уже с нужными кавычками, nameInSentence); у «general» — null */
  productName: string | null;
  /** Ссылка wa.me с текстом сообщения */
  whatsappHref: string;
  /** Обещание ответа («Ответим в WhatsApp в течение 5 минут») */
  responseNote: string;
}

/** Страница направления (/courses/creator, /courses/vibecoding) */
export interface PublicDirectionPage {
  direction: "creator" | "vibecoding";
  name: string;
  tagline: string;
  path: string;
  forWhom: string;
  leader: { name: string; photo: string | null };
  /** Продукт, подставляемый в форму (входная ступень) */
  entryProduct: string;
  seo: { title: string; description: string };
}

/** Страница продукта (/courses/vibecoding-offline, /courses/vibecoding-course) */
export interface PublicProductPage {
  id: string;
  directionName: string;
  directionPath: string;
  name: string;
  resultLine: string;
  format: string;
  price: { prefix: string; amount: string; unit: string };
  /** «Рассрочка от … ₸ в месяц» — только если сумма задана */
  installment: string | null;
  ctaLabel: string;
  seatsLeft: number | null;
  venue: { address: string | null; schedule: string | null };
  modules: { title: string; items: string[] }[] | null;
  /** Условия возврата (текст школы); null — блок скрыт */
  refundTerms: string | null;
  /** Только dev: каких данных не хватает для скрытых блоков */
  devMissing: string[];
  seo: { title: string; description: string };
}

/** Меню «Направления» в шапке и мобильной панели (data/navMenu.ts): две крупные карточки направлений */
export interface PublicNavMenu {
  cards: {
    direction: "creator" | "vibecoding";
    title: string;
    pitch: string;
    forWhom: string;
    href: string;
    /** Текст тёмной карточки (результат входного продукта из products.ts) */
    teaser: string;
    /** Кнопка тёмной карточки: входной продукт */
    entry: { href: string; ctaLabel: string };
    /** «Начать с практикума за 9 900 ₸» / «Начать с эфира, бесплатно»: цена и «бесплатно» — из products.ts */
    start: { before: string; free: boolean; price: { prefix: string; amount: string; unit: string } };
  }[];
  allCoursesHref: string;
}
