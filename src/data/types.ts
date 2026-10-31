import type { Verifiable } from "@/lib/placeholders";

export type AudienceSlug = "business" | "freelancers" | "career" | "beginners";
export type CourseSlug = "ai-creator" | "practicum" | "vibecoding";

/** Акцентная тема ЦА - влияет на hero/карточки, остаётся в одной дизайн-системе */
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
  /** Краткий результат в чипе, напр. «3 дня» - только из существующих данных */
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
  /** Для video - embed (YouTube / Instagram) */
  embedUrl?: string;
  /** receipt: на проде показывать только при true */
  piiBlurred: boolean;
  /** Подпись под медиа (напр. «Данные скрыты») */
  caption?: string;
}

/**
 * Карточка «Результаты учеников» на главной /reviews.
 * Прод: только verified && consent; цитата - только quote.verbatim;
 * receipt - только при media.piiBlurred.
 */
export interface Story {
  id: string;
  /** Направление программы, после которой результат (для вкладок «Креаторство» / «Вайб-кодинг») */
  direction: "creator" | "vibecoding";
  /** Проект преподавателя (не ученика): на карточке подпись «проект преподавателя»; показывается только при verified && consent */
  teacherProject?: boolean;
  /** Результат с доходом: только отдельной историей с подписью «индивидуальный результат» (не в первом экране и не на главной/лендингах) */
  individualResult?: boolean;
  audiences: AudienceSlug[];
  name: string;
  /** Согласие автора на публикацию */
  consent: boolean;
  /** Короткое описание под именем */
  descriptor: string;
  photo?: string | null;
  result: {
    /** Число/сумма - brand */
    value: string;
    /** Единица («₸», «просмотров») - brand */
    unit: string;
    /** Остальной текст заголовка - ink */
    text: string;
  };
  /** Конкретные «до/после»; если нет - блок не рендерится */
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
  /** Для видео - embed-ссылка */
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

/** Связь с площадкой - показывается как подпись, не «партнёр/резидент» */
export type PartnerRelation = "graduate" | "winner" | "founders" | "speaker" | "partner";

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
  /** Показывать названием текстом (пока нет файла логотипа): в проде допустимо при verified && logoPermission */
  textOnly?: boolean;
  note?: string;
}

export interface Tariff extends Verifiable {
  id: string;
  name: string;
  price: number | null;
  /** Старая цена для зачёркивания */
  oldPrice?: number | null;
  /** Старая цена подтверждена школой. Не true - зачёркнутая цена скрыта в проде (в dev с пометкой) */
  oldPriceVerified?: boolean;
  /** Ежемесячный платёж в рассрочку */
  installment?: number | null;
  installmentMonths?: number;
  description: string;
  features: string[];
  /** Чего нет в тарифе */
  excluded?: string[];
  /** Пункты «что входит», не подтверждённые школой: в проде скрыты, в dev показываются */
  unverifiedFeatures?: string[];
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
  /** Шапка блока monetization (по умолчанию - «Как вы зарабатываете…») */
  monetizationHeading?: { eyebrow: string; title: string };
  tariffs: Tariff[];
  /** verified: false - бонус не подтверждён школой: в проде скрыт, в dev с пометкой (не задано - показывается) */
  bonuses?: { title: string; items: string[]; deadline?: string; verified?: boolean };
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
    /** Короткая подпись кнопки hero: рядом рисуется цена эфира в пилюле («Занять место 9 900 ₸») */
    ctaShort?: string;
    /** Строка под кнопкой hero («Онлайн, вживую · 1,5 часа») */
    ctaNote?: string;
    /** Плавающие карточки вокруг заголовка; label - необязательная мелкая надпись над value */
    floatingCards: { label?: string; value: string; sub?: string }[];
    /** Карточки утверждены владельцем: показываем и в проде (иначе только в dev) */
    floatingCardsPublic?: boolean;
  };

  /** Теги бегущей строки */
  tags?: string[];

  /** «Узнаёте себя?»: боли аудитории сразу после hero; нет - блока нет */
  pains?: { title: string; text: string }[];
  /** Заголовок блока болей; по умолчанию «Узнаёте себя?» */
  painsTitle?: string;

  /** «Что продать текущему клиенту» (фрилансеры): карточки услуг и пример связки; нет - блока нет */
  sellMore?: {
    eyebrow: string;
    title: string;
    cards: { title: string; text: string; tag: string }[];
    example: {
      label: string;
      title: string;
      parts: { kicker: string; title: string; price: string }[];
      total: { label: string; value: string; note: string };
    };
  };

  /** «Навайбкодить можно не только сайт» (фрилансеры): карточки задач и раскрывающийся список идей; нет - блока нет */
  buildMore?: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { title: string; text: string }[];
    ideasTitle: string;
    ideas: string[];
  };

  /** «Окупаемость» (бизнес): пример на одном боте и калькулятор потерь; нет - блока нет */
  payback?: {
    eyebrow: string;
    title: string;
    example: { title: string; rows: { label: string; value: string }[]; yearLabel: string; yearValue: string };
    calc: {
      title: string;
      fields: { id: "spend" | "missed" | "check"; label: string; initial: number }[];
      ownBotCost: number;
      weeksPerMonth: number;
      disclaimer: string;
    };
  };

  /** «Один заказ окупает эфир в N раз» (специалисты в найме): множитель считается из цены эфира; нет - блока нет */
  paybackOrder?: {
    eyebrow: string;
    /** Средний заказ, ₸ */
    orderValue: number;
    orderLabel: string;
    caption: string;
    schemeTitle: string;
    scheme: string[];
    note: string;
    /** Ряд карточек под блоком («Что можно предложить своим клиентам»); нет - ряда нет */
    offers?: { title: string; items: { kicker: string; title: string; text: string }[] };
  };

  /** «Что будет на эфире, по минутам» (фрилансеры): строки программы и кнопка записи; нет - блока нет */
  timeline?: {
    eyebrow: string;
    title: string;
    items: { time: string; title: string; text: string; chips?: string[]; highlight?: boolean }[];
    ctaLabel: string;
  };

  /** «С чем вы уйдёте после 1,5 часов» (бизнес): цветные плитки в стиле «Программа эфира»; нет - блока нет */
  takeaways?: { eyebrow: string; title: string; items: { title: string; text: string }[] };

  /** «Почему эфир платный» (фрилансеры): карточка с пояснением; цена в пилюле - из products.ts, у бесплатного эфира блока нет */
  whyPaid?: { title: string; text: string };

  /** «Ведущие эфира»: два ведущих (имя, роль, фото - из team.ts) с фактами и ряд цифр школы (из metrics.ts); нет - блока нет */
  hosts?: {
    eyebrow: string;
    title: string;
    people: { id: "maidan" | "nadira"; facts: { text: string; /** Дописывается к строке, только если резидентство показывается (astanaHub.show) */ astanaHub?: string }[] }[];
    stats: { id: "students" | "views" | "streams"; label: string }[];
    /** Подпись плитки «Astana Hub»; плитка только если astanaHub.show (в dev - всегда, с бейджем) */
    hubStat?: string;
  };

  /** «Ученики без опыта в коде уже сделали» (бизнес): карточки проектов. Прод - только verified && consent, меньше 3 - блока нет */
  studentWorks?: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string; /** Путь к скриншоту; нет файла - слот не рисуется */ image: string | null; verified: boolean; consent: boolean; source: string; asOf: string }[];
  };

  /** «Кому эфир не подойдёт»: честные ограничения; нет - блока нет */
  notFor?: { eyebrow: string; title: string; items: { title: string; text: string }[] };

  /** Тексты формы заявки (вместо обычных): шаги идут списком под описанием, маркер {price} в тексте шага заменяется ценой эфира */
  apply?: {
    /** Пилюля над заголовком */
    eyebrow: string;
    steps: { title: string; text: string }[];
    formTitle: string;
    formText: string;
    submitLabel: string;
    /** Строка под кнопкой формы */
    note: string;
  };

  /** «Что даёт вайбкодинг»: две колонки (экономия / доход) после болей; нет - блока нет */
  benefits?: {
    eyebrow: string;
    title: string;
    columns: { title: string; icon: "down" | "up" | "tenge" | "growth"; items: { title: string; text: string }[] }[];
  };

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

  /** Блок сравнения / чек-листа - уникальный для ЦА */
  comparison?: Verifiable & {
    title: string;
    description?: string;
    rows: { task: string; before: string; after: string }[];
    beforeLabel: string;
    afterLabel: string;
  };


  form: {
    title: string;
    description: string;
    submitLabel: string;
    interest: string;
  };

  seo: { title: string; description: string };
  source?: string;
}
