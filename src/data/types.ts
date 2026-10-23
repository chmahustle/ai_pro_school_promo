import type { Verifiable } from "@/lib/placeholders";

export type AudienceSlug = "business" | "freelancers" | "career" | "beginners";
export type CourseSlug = "ai-creator" | "practicum" | "vibecoding";

/** Акцентная тема ЦА — влияет на hero/карточки, остаётся в одной дизайн-системе */
/** peach = фрилансеры (персиковый mesh), indigo = новички/курс */
export type AccentTheme = "indigo" | "peach" | "lavender" | "ink";

export interface Metric extends Verifiable {
  id: string;
  value: number;
  /** "+" / "" */
  prefix?: string;
  /** "₸", "%", " млн" */
  suffix?: string;
  label: string;
  /** Короткое пояснение под цифрой */
  hint?: string;
  decimals?: number;
  /** Формат вывода: compact → 50 млн, plain → 50 000 000 */
  format?: "compact" | "plain";
}

export interface ResultCase extends Verifiable {
  id: string;
  name: string;
  /** Контекст: «мама двоих детей», «43 года», «SMM-специалист» */
  context?: string;
  headline: string;
  before: string;
  after: string;
  /** Короткая метрика «До» для пилюли (≤16 символов), только из данных */
  beforeValue?: string;
  /** Короткая метрика «После» для пилюли (≤16 символов), только из данных */
  afterValue?: string;
  /** Одно предложение-пояснение под сравнением */
  summary?: string;
  quote?: string;
  photo?: string | null;
  /** К каким ЦА относится кейс (для фильтрации на лендингах) */
  audiences: AudienceSlug[];
  /** Курс, после которого результат */
  course?: CourseSlug;
  /** Источник (URL страницы, откуда взят) */
  source?: string;
  /** Согласие на публикацию (прод: verified && consent) */
  consent?: boolean;
  /** Краткий результат в чипе, напр. «3 дня» — только из существующих данных */
  keyResult?: string;
  /** Подпись под keyResult */
  keyResultLabel?: string;
  /** Ссылка на подтверждение (отзыв / видео / скрин) */
  proofUrl?: string;
}

/** Медиа в карточке результата (StoryCard) */
export type StoryMediaType = "video" | "receipt" | "stats";

export interface StoryMedia {
  type: StoryMediaType;
  src?: string | null;
  /** Для video — embed (YouTube / Instagram) */
  embedUrl?: string;
  /** receipt: на проде показывать только при true */
  piiBlurred: boolean;
  /** Подпись под медиа (напр. «Данные скрыты») */
  caption?: string;
}

/**
 * Карточка «Результаты учеников» на главной /reviews.
 * Прод: только verified && consent; цитата — только quote.verbatim;
 * receipt — только при media.piiBlurred.
 */
export interface Story {
  id: string;
  /** Направление программы, после которой результат (для вкладок «Креаторство» / «Вайб-кодинг») */
  direction: "creator" | "vibecoding";
  audiences: AudienceSlug[];
  name: string;
  /** Согласие автора на публикацию */
  consent: boolean;
  /** Короткое описание под именем */
  descriptor: string;
  photo?: string | null;
  result: {
    /** Число/сумма — brand */
    value: string;
    /** Единица («₸», «просмотров») — brand */
    unit: string;
    /** Остальной текст заголовка — ink */
    text: string;
  };
  /** Конкретные «до/после»; если нет — блок не рендерится */
  before?: string;
  after?: string;
  quote?: { text: string; verbatim: boolean };
  media?: StoryMedia;
  /** Подпись источника в подвале (без сырого URL как CTA) */
  source: string;
  /** Дата актуальности, напр. «2025-03» */
  asOf: string;
  verified: boolean;
  /** Dev-бейдж PLACEHOLDER вместо UNVERIFIED */
  placeholder?: boolean;
  note?: string;
  /** Карточка-чек: крупный receipt без до/после */
  variant?: "default" | "receipt";
}

export type ReviewKind = "text" | "video" | "receipt" | "chat";

export interface Review extends Verifiable {
  id: string;
  kind: ReviewKind;
  author: string;
  context?: string;
  /** Текст отзыва (для text) или подпись (для медиа) */
  text?: string;
  /** Картинка: скриншот переписки / чек / превью видео */
  src?: string | null;
  /** Для видео — embed-ссылка */
  embedUrl?: string;
  /** Сумма на чеке (для receipt), в ₸ */
  amount?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  date?: string;
  audiences: AudienceSlug[];
  course?: CourseSlug;
  photo?: string | null;
}

export interface TeamMember extends Verifiable {
  id: string;
  name: string;
  role: string;
  bio: string;
  facts: string[];
  photo?: string | null;
  socials?: Partial<Record<"instagram" | "tiktok" | "youtube" | "linkedin" | "telegram", string>>;
}

/** Связь с площадкой — показывается как подпись, не «партнёр/резидент» */
export type PartnerRelation = "graduate" | "winner" | "founders" | "speaker";

export interface Partner {
  id: string;
  name: string;
  /** Путь к логотипу (svg/png). null → текстовое название */
  logo?: string | null;
  url?: string;
  relation: PartnerRelation;
  verified: boolean;
  /** Право показывать логотип на сайте */
  logoPermission: boolean;
  note?: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface Tariff extends Verifiable {
  id: string;
  name: string;
  price: number | null;
  /** Старая цена для зачёркивания */
  oldPrice?: number | null;
  /** Ежемесячный платёж в рассрочку */
  installment?: number | null;
  installmentMonths?: number;
  description: string;
  features: string[];
  /** Чего нет в тарифе */
  excluded?: string[];
  popular?: boolean;
  cta?: string;
}

export interface ProgramModule {
  id: string;
  eyebrow: string; // «Неделя 1»
  title: string;
  lessons: string[];
  outcome?: string;
}

export interface Course {
  slug: CourseSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Для карточек каталога */
  cover?: string | null;
  accent: AccentTheme;
  format: string;
  duration: string;
  level: string;
  startNote?: string;
  /** Цена «от» для карточек. null → «по запросу / уточняется» */
  priceFrom: number | null;
  priceStatus: Verifiable["status"];
  priceNote?: string;
  /** Кому подходит */
  forWhom: { title: string; text: string }[];
  /** Кому не подходит (честный антиоффер) */
  notForWhom?: string[];
  /** Чему научитесь */
  outcomes: string[];
  program: ProgramModule[];
  /** Что продаёте после курса / как зарабатываете */
  monetization?: { title: string; items: string[] }[];
  tariffs: Tariff[];
  bonuses?: { title: string; items: string[]; deadline?: string };
  faq: FaqItem[];
  audiences: AudienceSlug[];
  seo: { title: string; description: string };
  /** Какой CTA в hero */
  ctaLabel: string;
  /** Ссылка на оригинальную страницу-источник */
  source?: string;
}

/** Карточка в блоке «Выберите свой путь» на главной */
export interface AudienceCard {
  /** Короткий заголовок карточки (Unbounded) */
  title: string;
  /** Уточнение под названием (Manrope 14px), напр. «и специалистам» */
  titleNote?: string;
  /** Строка боли */
  pain: string;
  /** [уникальный чип, общий чип] */
  chips: [string, string];
  ctaLabel: string;
  /** Куда ведёт карточка (может отличаться от path меню) */
  href: string;
  /** Mesh-пятно в углу: home | business | freelance | career */
  mesh: "home" | "business" | "freelance" | "career";
  /** Только при verified === true */
  proof?: { text: string; verified: boolean };
}

export interface Audience {
  slug: AudienceSlug;
  /** Короткое имя для меню */
  menuTitle: string;
  menuSubtitle: string;
  /** Эмодзи-аватар для меню (временно, вместо иллюстраций) */
  emoji: string;
  /** Иллюстрация/аватар для mega-menu и hero */
  illustration?: string | null;
  accent: AccentTheme;
  path: string;
  /** Контент карточки на главной */
  card: AudienceCard;

  hero: {
    eyebrow: string;
    title: string;
    /** Акцентированная часть заголовка */
    highlight?: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta?: string;
    /** Плавающие карточки вокруг заголовка */
    floatingCards: { label: string; value: string; sub?: string }[];
  };

  /** Теги бегущей строки */
  tags?: string[];

  /** «За 1,5 часа вы поймёте» / «Что получите» */
  outcomes: { title: string; text: string }[];

  /** «Этот эфир для вас, если вы» */
  forWhom: { title: string; text: string }[];
  forWhomFootnote?: string;

  /** Лид-магнит */
  leadMagnet?: { title: string; description: string };

  /** Форматный блок: эфир / курс */
  format: {
    kind: "webinar" | "course";
    title: string;
    items: { label: string; value: string }[];
  };

  /** Блок сравнения / чек-листа — уникальный для ЦА */
  comparison?: Verifiable & {
    title: string;
    description?: string;
    rows: { task: string; before: string; after: string }[];
    beforeLabel: string;
    afterLabel: string;
  };

  faq: FaqItem[];

  form: {
    title: string;
    description: string;
    submitLabel: string;
    interest: string;
  };

  seo: { title: string; description: string };
  source?: string;
}
