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
