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

/** Карточка кейса блока «Результаты учеников» (единый шаблон CaseCard) */
export interface PublicCase {
  id: string;
  /** «result» — результат ученика; «video» — видео-отзыв (нейтральный текст, без цифр) */
  kind: "result" | "video";
  /** video: «История {имя}» */
  title?: string;
  /** video: одна нейтральная строка вместо метрики */
  neutralLine?: string;
  /** video: «Видео опубликовано 8 июня 2025» */
  publishedLabel?: string;
  direction: "creator" | "vibecoding";
  audiences: AudienceSlug[];
  individualResult?: boolean;
  authorName: string;
  authorRole: string;
  metric: string;
  metricLabel: string;
  /** Заголовок вместо метрики (результат не числом) */
  headline?: string;
  photoSrc: string | null;
  posterSrc: string | null;
  /** id ролика YouTube: плеер открывается в браузере по клику (ссылок youtube.com в HTML нет) */
  youtubeId?: string;
  /** Публичный оригинал (не YouTube) для ссылки «Смотреть ролик» */
  sourceUrl: string | null;
  /** «Данные аккаунта ученицы, октябрь 2026» */
  sourceCaption: string;
  /** Дословные тексты; пустое поле не рендерится; неподтверждённые в prod сюда не попадают */
  before?: string;
  after?: string;
  quote?: string;
  /** Только dev: пометка у неподтверждённого кейса */
  devNote?: string;
  /** Только dev: тексты До/После/цитата не подтверждены */
  devTextNote?: string;
  /** Только dev: «доходная формулировка, не публикуем» + текст claims */
  devClaimsNote?: string;
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
  /** Подпись на карточке («Данные школы») */
  source?: string;
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
  resultLine: string;
  format: string;
  price: { prefix: string; amount: string; unit: string; /** зачёркнутая старая цена */ old?: string };
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
  /** role — одна строка из team.ts, только подтверждённая (status verified); иначе null */
  leader: { name: string; photo: string | null; role: string | null };
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

/** Шаг пути в «Как это работает» */
export interface PublicPathStep {
  n: string;
  title: string;
  text: string;
  /** Цена шага, если у шага есть продукт */
  price: { prefix: string; amount: string; unit: string; old?: string } | null;
  /** Входная ступень: розовая карточка с меткой entryBadge */
  isEntry: boolean;
}

export interface PublicPaths {
  /** Метка входной ступени («Начните с этого», как в линейке) */
  entryBadge: string;
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

export interface PublicFooter {
  description: string;
  /** Колонки направлений: заголовок-ссылка и продукты (названия и URL из products.ts) */
  directions: { id: string; title: string; href: string; links: { label: string; href: string }[] }[];
  audiences: { label: string; href: string }[];
  school: { label: string; href: string }[];
  contacts: {
    whatsapp: string | null;
    phone: { label: string; href: string } | null;
    socials: { id: "instagram" | "tiktok" | "youtube"; label: string; href: string }[];
  };
  /** «© 2026 AI Pro School» или «© 2026 {юрлицо}. Все права защищены.» (только подтверждённые реквизиты) */
  copyright: string;
  /** БИН, адрес — только подтверждённые */
  requisites: string[];
  /** Политика и оферта: только утверждённые и только на домене сайта */
  legalLinks: { label: string; href: string }[];
}

export interface PublicTestimonial {
  id: string;
  type: "testimonial" | "receipt" | "chat";
  /** Подпись с именем — только при согласии автора */
  label: string | null;
  poster: string;
  imageSrc: string | null;
  /** id ролика YouTube: адрес плеера собирается в браузере по клику (ссылок youtube.com в HTML нет) */
  youtubeId: string | null;
  /** Локальный MP4 (вертикальное видео): плеер в лайтбоксе */
  videoSrc?: string | null;
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
  youtubeId?: string;
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
  /** «Что соберёте»: пункты с иконками (неподтверждённый в проде заменён на «Итоговый проект») */
  deliverables: { id: string; title: string; icon: "store" | "send" | "bot" | "flag"; unverified: boolean }[];
  /** Курс: «Путь к курсу» — ступени направления, текущая выделена */
  path?: { id: string; stepLabel: string; name: string; href: string; current: boolean }[];
  /** Заголовок формы заявки (forms.ts) */
  formTitle: string;
  format: string;
  /** Только dev: пометка у неподтверждённого срока/формата */
  devFormatNote: string | null;
  /** Ближайший старт: только подтверждённый, иначе null */
  start: string | null;
  /** «Рассрочка Kaspi на 12 месяцев»: плашка в hero; null — не показываем */
  kaspi: string | null;
  price: { prefix: string; amount: string; unit: string; old?: string };
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
  /** Только dev: неподтверждённая старая цена и метка («старая цена не подтверждена») */
  devOldPrice: { amount: string; label: string; note: string } | null;
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
    start: { before: string; free: boolean; /** «бесплатно» (из products.ts), если free */ freeLabel: string; price: { prefix: string; amount: string; unit: string } };
  }[];
  allCoursesHref: string;
}
