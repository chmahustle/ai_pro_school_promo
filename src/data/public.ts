import "server-only";
/**
 * Серверная сборка публичных моделей (см. public-types.ts). Только отсюда данные попадают в клиентские компоненты.
 * Правила: фильтрация verified && consent выполняется здесь, до передачи; служебные поля не копируются;
 * dev-пометки (PublicDev, devSource) заполняются только при SHOW_PLACEHOLDERS (т.е. никогда в production-сборке).
 */
import { audiences, getAudiencesForCards, landingAudiences } from "./audiences";
import { company } from "./company";
import { courses } from "./courses";
import { getVisibleHeroResults, heroEvent, heroTeachers } from "./heroResults";
import { getHomeMetrics } from "./metrics";
import { getProductForCourse } from "./products";
import { getVisibleStories, canShowStoryMedia, isStoryPublishable, stories as allStories } from "./stories";
import { team } from "./team";
import { getVisibleTestimonials } from "./testimonials";
import { getVisibleWorks } from "./works";
import type { Audience, Course, Review, Story, TeamMember } from "./types";
import type {
  FooterLegal,
  MenuAudience,
  MenuData,
  PublicAudienceCard,
  PublicBonuses,
  PublicDev,
  PublicHeroData,
  PublicMetric,
  PublicReview,
  PublicStory,
  PublicTariff,
  PublicTeamMember,
  PublicTestimonial,
  PublicWork,
  ThanksTarget,
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
export function getPublicStories(audience?: Story["audiences"][number]): PublicStory[] {
  return getVisibleStories()
    .filter((s) => !audience || s.audiences.includes(audience))
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
    devSource: SHOW_PLACEHOLDERS ? `Источник · ${m.source}${m.asOf ? ` · ${m.asOf}` : ""}` : undefined,
  }));
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
    business: business ? { subtitle: business.hero.subtitle, outcomes: business.outcomes.map((o) => ({ title: o.title, text: o.text })) } : null,
  };
}

// ───────────── Аудитории, меню, футер ─────────────

export function getPublicAudienceCards(): PublicAudienceCard[] {
  return getAudiencesForCards().map((a: Audience) => ({
    slug: a.slug,
    title: a.card.title,
    titleNote: a.card.titleNote,
    pain: a.card.pain,
    chips: a.card.chips,
    ctaLabel: a.card.ctaLabel,
    href: a.card.href,
    proofText: a.card.proof?.verified === true ? a.card.proof.text : null,
  }));
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

/** Футер: полный список ЦА с лендингами (включая бизнес) */
export function getFooterData(): { audiences: MenuAudience[]; courses: MenuData["courses"]; legal: FooterLegal } {
  return {
    audiences: landingAudiences.map(toMenuAudience),
    courses: courses.map((c) => ({ slug: c.slug, shortName: c.shortName })),
    legal: { legalName: company.legalName, bin: company.bin, address: company.address },
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
  return course.tariffs
    .filter((t): t is typeof t & { price: number } => t.price !== null)
    .map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      oldPrice: t.oldPrice,
      installment: t.installment,
      installmentMonths: t.installmentMonths,
      description: t.description,
      features: t.features,
      excluded: t.excluded,
      popular: t.popular,
      cta: t.cta,
    }));
}

export function getPublicBonuses(course: Course): PublicBonuses | null {
  return course.bonuses ? { title: course.bonuses.title, items: course.bonuses.items } : null;
}

/** Рассрочка включена, когда в products.ts заполнена цифра платежа */
export function isInstallmentEnabled(course: Course): boolean {
  const p = getProductForCourse(course.slug);
  return p?.installmentFromPerMonth != null;
}

// ───────────── Страница «Спасибо» ─────────────

export function getThanksTargets(): ThanksTarget[] {
  return [
    ...audiences.map((a) => ({
      kind: "audience" as const,
      slug: a.slug as string,
      isWebinar: a.path.startsWith("/for/"),
      guideTitle: a.leadMagnet?.title,
    })),
    ...courses.map((c) => ({ kind: "course" as const, slug: c.slug as string, isWebinar: false, courseShortName: c.shortName })),
  ];
}
