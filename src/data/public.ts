import "server-only";
/**
 * Серверная сборка публичных моделей (см. public-types.ts). Только отсюда данные попадают в клиентские компоненты.
 * Правила: фильтрация verified && consent выполняется здесь, до передачи; служебные поля не копируются;
 * dev-пометки (PublicDev, devSource) заполняются только при SHOW_PLACEHOLDERS (т.е. никогда в production-сборке).
 */
import { audiences, landingAudiences } from "./audiences";
import { company } from "./company";
import { courses } from "./courses";
import { getVisibleHeroResults, heroEvent, heroTeachers } from "./heroResults";
import { getHomeMetrics } from "./metrics";
import { formConfig } from "./forms";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { directions, lineup, lineupForWhom, lineupForWhomChips, pathTabs, resultsTabs } from "./lineup";
import { getVisiblePartners } from "./partners";
import {
  formatCohortDate,
  formatEntryLine,
  formatPriceParts,
  getEntryProducts,
  getEntrySubtitle,
  getNextCohort,
  catalogUrl,
  currentDate,
  getCurrentPrice,
  getDeliverables,
  getPartnerProjectStep,
  getProduct,
  getProductForCourse,
  products,
  STEP_LABELS,
  type Direction,
  type ProductId,
  type Step,
} from "./products";
import { GENERAL_PRODUCT } from "./product-ids";
import { vocabulary } from "./vocabulary";
import { SITE_URL, site } from "@/lib/site";
import { formatMonthYear, formatNumber, formatTenge, nameInSentence } from "@/lib/utils";
import { getVisibleStories, canShowStoryMedia, isStoryPublishable, stories as allStories } from "./stories";
import { team } from "./team";
import { getVisibleTestimonials } from "./testimonials";
import { getVisibleWorks } from "./works";
import type { Audience, Course, Partner, Review, Story, TeamMember } from "./types";
import type {
  PublicFooter,
  MenuAudience,
  MenuData,
  PublicDirectionPage,
  PublicProductPage,
  PublicPartner,
  PublicPathStep,
  PublicPaths,
  PublicResultsTabs,
  PublicBonuses,
  PublicDev,
  PublicHeroData,
  PublicLadder,
  PublicLadderStep,
  PublicLineup,
  PublicMetric,
  PublicReview,
  PublicStory,
  PublicTariff,
  PublicTeamMember,
  PublicTestimonial,
  PublicWork,
  FormConfig,
  ThanksPageData,
} from "./public-types";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

const devOf = (s: Pick<Story, "source" | "asOf" | "note" | "placeholder"> & { verified: boolean; consent: boolean }): PublicDev | undefined =>
  SHOW_PLACEHOLDERS
    ? {
        badge: s.verified && s.consent ? null : s.placeholder ? "placeholder" : "unverified",
        note: s.note,
        source: s.source,
        asOf: s.asOf,
      }
    : undefined;

// ───────────── Результаты учеников ─────────────

export function toPublicStory(s: Story): PublicStory {
  return {
    id: s.id,
    direction: s.direction,
    teacherProject: s.teacherProject,
    individualResult: s.individualResult,
    audiences: s.audiences,
    name: s.name,
    descriptor: s.descriptor,
    photo: s.photo ?? null,
    result: s.result,
    before: s.before,
    after: s.after,
    quote: s.quote?.verbatim ? s.quote.text : undefined,
    media:
      s.media && canShowStoryMedia(s)
        ? { type: s.media.type, src: s.media.src ?? null, embedUrl: s.media.embedUrl, caption: s.media.caption }
        : undefined,
    variant: s.variant ?? "default",
    dev: devOf(s),
  };
}

/** Карточки результатов: verified && consent (в dev — все), опционально по аудитории */
export function getPublicStories(audience?: Story["audiences"][number], direction?: Story["direction"], includeIndividual = false): PublicStory[] {
  return getVisibleStories()
    .filter((s) => includeIndividual || !s.individualResult)
    .filter((s) => !audience || s.audiences.includes(audience))
    .filter((s) => !direction || s.direction === direction)
    .map(toPublicStory);
}

// ───────────── Метрики ─────────────

export function getPublicMetrics(): PublicMetric[] {
  return getHomeMetrics().map((m) => ({
    id: m.id,
    value: m.value,
    prefix: m.prefix,
    suffix: m.suffix,
    label: m.label,
    hint: m.hint,
    decimals: m.decimals,
    featured: m.featured,
    pills: m.pills,
    // «Данные школы» — осознанная подпись на карточке; дата — в подзаголовке блока
    source: m.source,
    devSource: SHOW_PLACEHOLDERS ? `Источник · ${m.source}${m.asOf ? ` · ${m.asOf}` : ""}` : undefined,
    devUnverified: SHOW_PLACEHOLDERS && !m.verified ? true : undefined,
  }));
}

/** Подзаголовок «Школа в цифрах»: «Данные школы на октябрь 2026» — дата из asOf показанных метрик (самая поздняя) */
export function getMetricsDescription(): string {
  const dates = getHomeMetrics().map((m) => m.asOf).filter((d): d is string => Boolean(d)).sort();
  const last = dates[dates.length - 1];
  return last ? `Данные школы на ${formatMonthYear(last)}` : "Данные школы";
}

// ───────────── Команда и hero ─────────────

export function toPublicTeamMember(m: TeamMember): PublicTeamMember {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio,
    facts: m.facts,
    photo: m.photo ?? null,
    socials: (Object.entries(m.socials ?? {}) as [PublicTeamMember["socials"][number]["key"], string][]).map(([key, href]) => ({ key, href })),
  };
}

export function getPublicHeroData(): PublicHeroData {
  const nadira = team.find((m) => m.id === "nadira") ?? null;
  const results = getVisibleHeroResults();
  const storyFor = (name: string) => allStories.find((s) => s.name.startsWith(name));

  const details: PublicHeroData["details"] = {};
  for (const r of results) {
    const s = storyFor(r.name);
    // Подробности показываем только для подтверждённых кейсов (в dev — для всех, с пометкой)
    details[r.id] =
      s && (isStoryPublishable(s) || SHOW_PLACEHOLDERS)
        ? {
            descriptor: s.descriptor,
            before: s.before,
            after: s.after,
            quote: s.quote?.verbatim ? s.quote.text : undefined,
            photo: s.photo ?? null,
            dev: devOf(s),
          }
        : null;
  }

  const business = audiences.find((a) => a.slug === "business");
  const teacher = heroTeachers[0];
  return {
    results: results.map((r) => ({
      id: r.id,
      name: r.name,
      result: r.result,
      label: r.label,
      progress: r.progress,
      photo: r.photo ?? storyFor(r.name)?.photo ?? null,
    })),
    teacher: teacher ? { name: teacher.name, role: teacher.role, emoji: teacher.emoji, photo: nadira?.photo ?? null } : null,
    teacherMember: nadira ? toPublicTeamMember(nadira) : null,
    event: {
      title: heroEvent.title,
      duration: heroEvent.duration,
      tags: [...heroEvent.tags],
      // Дату не придумываем: нет даты — «по регистрации» (в dev — пометка)
      dateText: heroEvent.date ?? (SHOW_PLACEHOLDERS ? "Дата скоро · TODO" : "По регистрации"),
      modalDateText: heroEvent.date ?? (SHOW_PLACEHOLDERS ? "TODO — уточнить у клиента" : "сообщим после регистрации"),
      href: heroEvent.href,
      ctaLabel: heroEvent.ctaLabel,
    },
    details,
    entry: {
      subtitle: getEntrySubtitle(),
      creator: entryLineFor("creator"),
      vibecoding: entryLineFor("vibecoding"),
    },
    business: business ? { subtitle: business.hero.subtitle, outcomes: business.outcomes.map((o) => ({ title: o.title, text: o.text })) } : null,
  };
}

// ───────────── Аудитории, меню, футер ─────────────

// ───────────── «Как это работает»: пути ─────────────

const toPrice = (p: (typeof products)[number]) => {
  const { prefix, amount, unit } = formatPriceParts(p);
  return amount ? { prefix, amount, unit } : null;
};

/** Два пути: креаторство (практикум → курс) и вайб-кодинг (эфир → офлайн → курс; четвёртый шаг «проект для партнёра» — только при verified) */
export function getPublicPaths(): PublicPaths {
  const build = (direction: Direction): PublicPathStep[] => {
    const steps = products
      .filter((p) => p.direction === direction)
      .sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step))
      .map((p) => ({ title: p.name, text: p.resultLine, price: toPrice(p), isEntry: p.step === "try" }));
    const partner = direction === "vibecoding" ? getPartnerProjectStep() : null;
    if (partner) steps.push({ title: partner.title, text: "", price: null, isEntry: false });
    return steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), ...s }));
  };
  return { entryBadge: lineup.entryBadge, tabs: pathTabs.map((t) => ({ id: t.id, label: t.label })), paths: { creator: build("creator"), vibecoding: build("vibecoding") } };
}

// ───────────── Где нас видели ─────────────

const RELATION_LABEL: Record<Partner["relation"], string> = {
  graduate: "Выпускница программы",
  winner: "Победитель",
  founders: "Основатели платформы",
  speaker: "Спикер",
};

/** Партнёры для полосы: в проде только verified && logoPermission && есть файл логотипа */
export function getPublicPartners(): PublicPartner[] {
  return getVisiblePartners().map((p) => ({
    id: p.id,
    name: p.name,
    logo: p.logo ?? null,
    relationLabel: RELATION_LABEL[p.relation],
    devNote: SHOW_PLACEHOLDERS && !(p.verified && p.logoPermission && p.logo) ? (p.note ?? "Нужны verified + logoPermission + логотип") : undefined,
  }));
}

/** Вкладки «Результаты учеников»: вайб-кодинг — только если есть подтверждённые кейсы этого направления */
export function getPublicResultsTabs(stories: { direction: Direction }[]): PublicResultsTabs {
  return { tabs: resultsTabs.filter((t) => stories.some((s) => s.direction === t.id)).map((t) => ({ id: t.id, label: t.label })) };
}

const toMenuAudience = (a: Audience): MenuAudience => ({
  slug: a.slug,
  path: a.path,
  menuTitle: a.menuTitle,
  menuSubtitle: a.menuSubtitle,
  accent: a.accent,
  heroEyebrow: a.hero.eyebrow,
  heroTitle: a.hero.title,
});

/** Меню «Для кого» в шапке: без бизнеса (его ссылку из шапки убрали), плюс «Новичкам» */
export function getMenuData(): MenuData {
  return {
    audiences: [...landingAudiences.filter((a) => a.slug !== "business"), ...audiences.filter((a) => a.slug === "beginners")].map(toMenuAudience),
    courses: courses.map((c) => ({ slug: c.slug, shortName: c.shortName })),
  };
}

/** Ссылка принадлежит домену сайта: относительная («/offer») или абсолютная на хост SITE_URL */
function isOwnDomainUrl(url: string): boolean {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    return new URL(url).hostname === new URL(SITE_URL).hostname;
  } catch {
    return false;
  }
}

/**
 * Ссылки «Политика конфиденциальности» и «Оферта» для футеров: только утверждённые (company.ts → privacyApproved / offerApproved)
 * и только на страницы домена сайта. Иначе ссылки нет.
 */
export function getLegalLinks(): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (company.privacyApproved) links.push({ label: "Политика конфиденциальности", href: "/privacy" });
  if (company.offerApproved && company.offerUrl && isOwnDomainUrl(company.offerUrl)) links.push({ label: "Публичная оферта", href: company.offerUrl });
  return links;
}

/**
 * Футер: колонки направлений (названия и URL из products.ts), «Для кого», «Школа», контакты и юридическая строка.
 * Реквизиты — только подтверждённые; пустые соцсети/телефон не отдаются (иконки нет).
 */
export function getFooterData(): PublicFooter {
  const order: Step[] = ["try", "project", "profession"];
  const directionColumn = (d: Direction) => ({
    id: d,
    title: directions[d].name,
    href: directions[d].path,
    links: products
      .filter((p) => p.direction === d)
      .sort((a, b) => order.indexOf(a.step) - order.indexOf(b.step))
      .map((p) => ({ label: p.id === "practicum" ? vocabulary.practicumShort : p.name, href: p.landingUrl })),
  });
  const beginners = audiences.find((a) => a.slug === "beginners");
  const c = company.contacts;
  const legalOk = company.legal.verified && company.legal.name.trim() !== "" && company.legal.bin.trim() !== "";
  const year = currentDate().getFullYear();
  return {
    description: company.description,
    directions: [directionColumn("creator"), directionColumn("vibecoding")],
    audiences: [
      ...landingAudiences.map((a) => ({ label: a.menuTitle, href: a.path })),
      { label: beginners?.menuTitle ?? "Новичкам в ИИ", href: getProduct("practicum").landingUrl },
    ],
    school: [
      { label: "О нас", href: "/about" },
      { label: "Результаты и отзывы", href: "/reviews" },
      { label: "Контакты", href: "/contacts" },
      { label: "Все курсы", href: catalogUrl },
    ],
    contacts: {
      whatsapp: c.whatsapp.trim() || null,
      phone: c.phone.trim() && c.phoneRaw.trim() ? { label: c.phone, href: `tel:+${c.phoneRaw}` } : null,
      socials: (
        [
          { id: "instagram", label: "Instagram", href: c.social.instagram },
          { id: "tiktok", label: "TikTok", href: c.social.tiktok },
          { id: "youtube", label: "YouTube", href: c.social.youtube },
        ] as const
      ).filter((x) => x.href.trim() !== "").map((x) => ({ ...x, href: x.href.trim() })),
    },
    copyright: legalOk ? `© ${year} ${company.legal.name.trim()}. Все права защищены.` : `© ${year} AI Pro School`,
    requisites: legalOk ? [`БИН ${company.legal.bin.trim()}`, company.legal.address.trim()].filter(Boolean) : [],
    legalLinks: getLegalLinks(),
  };
}

// ───────────── Отзывы и работы ─────────────

export function getPublicTestimonials(): PublicTestimonial[] {
  return getVisibleTestimonials().map((t) => ({
    id: t.id,
    type: t.type,
    // Имя автора показываем только с согласием
    label: t.consent ? ([t.personName, t.caption].filter(Boolean).join(" · ") || null) : null,
    poster: t.poster,
    imageSrc: t.imageSrc ?? null,
    embedUrl: t.embedUrl ?? null,
    alt: t.consent && t.personName ? t.personName : "Скриншот",
  }));
}

export function getPublicWorks(): PublicWork[] {
  return getVisibleWorks().map((w) => ({
    id: w.id,
    poster: w.poster,
    platformUrl: w.platformUrl ?? null,
    label: w.consent && (w.personName || w.ageNote) ? [w.personName, w.ageNote].filter(Boolean).join(" · ") : null,
    badge: w.views?.verified ? w.views.value : null,
  }));
}

export function toPublicReview(r: Review): PublicReview {
  return {
    id: r.id,
    kind: r.kind,
    author: r.author,
    context: r.context,
    text: r.text,
    src: r.src ?? null,
    embedUrl: r.embedUrl,
    amount: r.amount,
    rating: r.rating,
    photo: r.photo ?? null,
    dev: SHOW_PLACEHOLDERS && r.status !== "verified" ? { badge: r.status === "placeholder" ? "placeholder" : "unverified", note: r.note } : undefined,
  };
}

// ───────────── Курсы: тарифы ─────────────

/** Тарифы только с ценой (без цены тариф не показываем) и без служебных полей */
export function getPublicTariffs(course: Course): PublicTariff[] {
  // Цена единственного тарифа — из products.ts (единый источник; в courses.ts она только для сверки)
  const product = getProductForCourse(course.slug);
  const productPrice = product && course.tariffs.length === 1 ? getCurrentPrice(product) : null;
  return course.tariffs
    .map((t) => ({ ...t, price: productPrice ?? t.price }))
    .filter((t): t is typeof t & { price: number } => t.price !== null)
    .map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      // Старая цена — только подтверждённая; в dev показывается с пометкой
      oldPrice: t.oldPrice && (t.oldPriceVerified !== false || SHOW_PLACEHOLDERS) ? t.oldPrice : null,
      devNote: SHOW_PLACEHOLDERS && t.oldPrice && t.oldPriceVerified === false ? "старая цена не подтверждена" : undefined,
      installment: t.installment,
      installmentMonths: t.installmentMonths,
      description: t.description,
      // Неподтверждённые пункты — только в dev
      features: SHOW_PLACEHOLDERS ? [...t.features, ...(t.unverifiedFeatures ?? [])] : t.features,
      excluded: t.excluded,
      popular: t.popular,
      cta: t.cta,
    }));
}

export function getPublicBonuses(course: Course): PublicBonuses | null {
  const b = course.bonuses;
  if (!b) return null;
  // Неподтверждённый бонус: в проде скрыт, в dev с пометкой
  if (b.verified === false && !SHOW_PLACEHOLDERS) return null;
  return { title: b.title, items: b.items, devNote: b.verified === false ? "бонус не подтверждён" : undefined };
}

/** Рассрочка включена, когда в products.ts заполнена цифра платежа */
export function isInstallmentEnabled(course: Course): boolean {
  const p = getProductForCourse(course.slug);
  return p?.installmentFromPerMonth != null;
}

// ───────────── Формы и страница «Спасибо» ─────────────

/** Настройки формы заявки для клиента: список продуктов, согласие, обещание — всё из data-файлов */
export function getFormConfig(): FormConfig {
  return {
    productOptions: [...products.map((p) => ({ value: p.id as string, label: p.name })), { value: formConfig.generalOption.value, label: formConfig.generalOption.label }],
    agreement: { before: company.privacyConsent.before, linkText: company.privacyConsent.linkText, href: company.privacyConsent.href },
    responseNote: formConfig.responseNote.text,
  };
}

/** Идентификаторы страниц /thanks/[productId] */
export function getThanksProductIds(): string[] {
  return [...products.map((p) => p.id as string), GENERAL_PRODUCT];
}

/** Страница «Спасибо»: ссылка WhatsApp с текстом из products.ts (для «general» — из forms.ts) */
export function getThanksPage(productId: string): ThanksPageData | null {
  const waBase = site.whatsapp;
  if (productId === GENERAL_PRODUCT) {
    return { productId, productName: null, responseNote: formConfig.responseNote.text, whatsappHref: `${waBase}?text=${encodeURIComponent(formConfig.generalWhatsappText)}` };
  }
  const p = products.find((x) => x.id === productId);
  if (!p) return null;
  return { productId, productName: nameInSentence(p.name), responseNote: formConfig.responseNote.text, whatsappHref: `${waBase}?text=${encodeURIComponent(p.whatsappText)}` };
}

// ───────────── Продуктовая линейка ─────────────

function entryLineFor(direction: Direction): string {
  const p = getEntryProducts().find((x) => x.direction === direction);
  return p ? formatEntryLine(p) : "";
}

const STEP_ORDER: Step[] = ["try", "project", "profession"];
const LEADER_MEMBER = { "Надира": "nadira", "Майдан": "maidan" } as const;

/** Фото показываем, только если файл есть в public/ */
function photoIfExists(photo: string | null | undefined): string | null {
  if (!photo) return null;
  return existsSync(join(process.cwd(), "public", photo)) ? photo : null;
}

function startLabel(p: (typeof products)[number]): string | null {
  if (p.nextStart) {
    const [y, m, d] = p.nextStart.split("-").map(Number);
    const weekday = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay();
    return formatCohortDate({ date: p.nextStart, weekday, verified: true });
  }
  const cohort = getNextCohort(p.id);
  return cohort && cohort.verified ? formatCohortDate(cohort) : null;
}

/** Лестница продуктов направления: ступени по порядку try → project → profession, пустые не дорисовываются */
export function getPublicLadder(direction: Direction): PublicLadder {
  const steps = products
    .filter((p) => p.direction === direction)
    .sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step));
  const leaderName = steps[0]?.leader ?? (direction === "creator" ? "Надира" : "Майдан");
  const member = team.find((m) => m.id === LEADER_MEMBER[leaderName]);
  return {
    direction,
    forWhom: lineupForWhom[direction],
    forWhomLinks: lineupForWhomChips[direction].flatMap((c) => {
      if ("product" in c) return [{ label: c.label, href: getProduct(c.product).landingUrl }];
      const a = audiences.find((x) => x.slug === c.audience);
      return a ? [{ label: a.menuTitle, href: a.path }] : [];
    }),
    leader: { name: leaderName, photo: photoIfExists(member?.photo) },
    steps: steps.map(toLadderStep),
  };
}

/** Ступень лестницы для карточки (общая для лестницы, каталога и блоков «Что дальше») */
function toLadderStep(p: (typeof products)[number]): PublicLadderStep {
  const { prefix, amount, unit } = formatPriceParts(p);
  return {
    id: p.id,
    direction: p.direction,
    stepLabel: STEP_LABELS[p.step],
    name: p.name,
    devNameNote: SHOW_PLACEHOLDERS && !p.nameApproved ? "название на утверждении" : undefined,
    resultLine: p.resultLine,
    format: p.format,
    price: { prefix, amount, unit },
    start: startLabel(p),
    ctaLabel: p.ctaLabel,
    href: p.landingUrl,
    isEntry: p.step === "try",
    tier: p.step,
  };
}

/** Карточки продуктов по списку id (для блоков «Что дальше») */
export function getPublicSteps(ids: ProductId[]): PublicLadderStep[] {
  return ids.map((id) => toLadderStep(getProduct(id)));
}

/** Следующая ступень лестницы после продукта (в том же направлении); null — продукт последний */
export function getNextStep(id: ProductId): PublicLadderStep | null {
  const p = getProduct(id);
  const list = products.filter((x) => x.direction === p.direction).sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step));
  const next = list[list.findIndex((x) => x.id === id) + 1];
  return next ? toLadderStep(next) : null;
}

/** Каталог: все продукты по порядку направлений и ступеней */
export function getPublicCatalog(): { directions: { id: Direction; name: string }[]; steps: PublicLadderStep[] } {
  const dirs = (Object.keys(directions) as Direction[]).map((id) => ({ id, name: directions[id].name }));
  const steps = dirs.flatMap((d) => products.filter((p) => p.direction === d.id).sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step)).map(toLadderStep));
  return { directions: dirs, steps };
}


export function getPublicLineup(): PublicLineup {
  return {
    id: lineup.id,
    title: lineup.title,
    subtitle: lineup.subtitle,
    ladderSubtitle: lineup.ladderSubtitle,
    tabs: lineup.tabs.map((t) => ({ id: t.id, label: t.label })),
    help: { label: lineup.help.label, href: `${site.whatsapp}?text=${encodeURIComponent(lineup.help.whatsappText)}` },
    entryBadge: lineup.entryBadge,
  };
}

// ───────────── Страницы направлений и продуктов (шаг 5a) ─────────────

/** Страница направления: названия и «для кого» из lineup.ts, ведущий и входной продукт — из products.ts */
export function getPublicDirectionPage(direction: Direction): PublicDirectionPage {
  const d = directions[direction];
  const entry = getEntryProducts().find((p) => p.direction === direction);
  const ladder = getPublicLadder(direction);
  return {
    direction,
    name: d.name,
    tagline: d.tagline,
    path: d.path,
    forWhom: lineupForWhom[direction],
    leader: ladder.leader,
    entryProduct: entry?.id ?? "general",
    seo: {
      title: `${d.name}: ${d.tagline}`,
      description: `${d.name}: ${d.tagline}. Лестница программ: ${ladder.steps.map((s) => s.name).join(" → ")}. Ведёт ${ladder.leader.name}.`,
    },
  };
}

const NBSP_ = "\u00a0";

/** Страница продукта: цена, рассрочка (если сумма задана), места и «Где и когда» (если данные есть) */
export function getPublicProductPage(id: "offline" | "course"): PublicProductPage {
  const p = getProduct(id);
  const { prefix, amount, unit } = formatPriceParts(p);
  const d = directions[p.direction];
  const missing: string[] = [];
  if (id === "offline") {
    if (!p.address) missing.push("адрес проведения");
    if (!p.schedule) missing.push("даты проведения");
  }
  if (id === "course" && !p.modules) missing.push("программа по модулям");
  if (!p.refundTerms) missing.push("условия возврата");
  return {
    id: p.id,
    directionName: d.name,
    directionPath: d.path,
    // H1 — короткое название; рабочее уточнение («Junior AI Developer») идёт отдельной подписью
    name: id === "course" ? vocabulary.vibecodingCourse : p.name,
    workingTitle: p.workingTitle && (p.nameApproved || SHOW_PLACEHOLDERS) ? p.workingTitle : null,
    workingTitleDevNote: SHOW_PLACEHOLDERS && Boolean(p.workingTitle) && !p.nameApproved ? "название на утверждении" : null,
    resultLine: p.resultLine,
    deliverables: getDeliverables(p),
    ...(id === "course" ? courseExtras() : {}),
    formTitle: formConfig.productLeadTitle,
    format: p.format,
    price: { prefix, amount, unit },
    installment: p.installmentFromPerMonth ? `Рассрочка от ${formatNumber(p.installmentFromPerMonth)}${NBSP_}₸ в месяц` : null,
    ctaLabel: p.ctaLabel,
    seatsLeft: p.seatsLeft,
    venue: { address: p.address, schedule: p.schedule },
    modules: p.modules,
    refundTerms: p.refundTerms,
    devMissing: SHOW_PLACEHOLDERS ? missing : [],
    // Старая цена и метка не подтверждены: только в dev с пометкой, в проде null
    devOldPrice:
      SHOW_PLACEHOLDERS && p.oldPrice && p.oldPriceVerified !== true
        ? { amount: formatTenge(p.oldPrice), label: p.priceLabel ?? "", note: "старая цена не подтверждена" }
        : null,
    seo: { title: id === "course" ? vocabulary.vibecodingCourse : p.name, description: `${p.resultLine}. ${p.format}.` },
  };
}

/** Блоки страницы курса из существующих данных: «Для кого» (чипы на /for/*), «Путь к курсу» (эфир → офлайн → курс), «Ведёт …» */
function courseExtras() {
  const ladder = getPublicLadder("vibecoding");
  return {
    forWhomLinks: ladder.forWhomLinks,
    path: ladder.steps.map((s) => ({ id: s.id, stepLabel: s.stepLabel, name: s.name, href: s.href, current: s.id === "course" })),
    leader: ladder.leader,
  };
}

/** Ссылки на новые страницы для меню и футера */
export function getCatalogLinks(): { label: string; href: string }[] {
  return [
    { label: directions.creator.name, href: directions.creator.path },
    { label: directions.vibecoding.name, href: directions.vibecoding.path },
    ...(["offline", "course"] as const).map((id) => ({ label: getProduct(id).name, href: getProduct(id).landingUrl })),
  ];
}

/** Условия возврата продукта: только текст школы из products.ts; нет — null (блок скрыт) */
export function getRefundTerms(id: ProductId): string | null {
  return getProduct(id).refundTerms;
}
