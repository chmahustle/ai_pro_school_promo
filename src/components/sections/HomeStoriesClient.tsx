"use client";

import { useMemo, useState } from "react";
import { ArrowLink, CaseCard, HomeSection, Lightbox, SectionIntro, type LightboxItem } from "@/components/ui";
import { storyAudienceFilters } from "@/data/story-filters";
import type { PublicCase } from "@/data/public-types";
import type { AudienceSlug } from "@/data/types";
import { cn, noBreakHyphen } from "@/lib/utils";

const HOME_LIMIT = 3;
type FilterId = "all" | AudienceSlug;
/** Меньше подтверждённых кейсов — блок скрывается */
const MIN_STORIES = 3;

interface HomeStoriesClientProps {
  /** Уже отфильтрованные на сервере (verified && consent) публичные карточки */
  stories: PublicCase[];
  /** Вкладки направлений (только те, где есть кейсы). Одна вкладка или фильтр по аудитории — полоса вкладок не рисуется */
  /** «projects» — проекты вайб-кодинга: другие подписи шапки */
  variant?: "results" | "projects";
  /** Подзаголовок шапки */
  description?: string;
  tabs?: { id: "creator" | "vibecoding"; label: string }[];
  /** Сколько карточек показать; null — все (страница /reviews) */
  limit?: number | null;
  /** Фильтр по аудитории над карточками */
  withFilters?: boolean;
  /** Ссылка «Все результаты» в шапке (на главной) */
  showAllLink?: boolean;
}

/**
 * «Результаты учеников»: тёмная панель с лентами. На главной — 3 карточки и ссылка на /reviews,
 * на /reviews — все карточки с фильтром по аудитории (тот же стиль).
 */
export function HomeStoriesClient({ stories: all, tabs = [], variant = "results", description, limit = HOME_LIMIT, withFilters = false, showAllLink = true }: HomeStoriesClientProps) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [direction, setDirection] = useState<"creator" | "vibecoding">(tabs[0]?.id ?? "creator");
  const showTabs = tabs.length > 1 && !withFilters;
  const stories = useMemo(() => {
    const byDirection = showTabs ? all.filter((s) => s.direction === direction) : all;
    const list = filter === "all" ? byDirection : byDirection.filter((s) => s.audiences.includes(filter));
    return limit == null ? list : list.slice(0, limit);
  }, [all, filter, limit, showTabs, direction]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Видео открывается по клику в модалке; embed подгружается только тогда, автозапуска нет
  const mediaItems: LightboxItem[] = useMemo(
    () =>
      stories.filter((c) => c.videoUrl).map((c) => ({
        id: c.id,
        src: c.posterSrc,
        alt: `${c.authorName}: ${c.metric} ${c.metricLabel}`,
        caption: `${c.authorName} · ${c.metric} ${c.metricLabel}`,
        kind: "video" as const,
        embedUrl: c.videoUrl ?? undefined,
      })),
    [stories],
  );

  const openMedia = (id: string) => {
    const idx = mediaItems.findIndex((m) => m.id === id);
    if (idx >= 0) setLightbox(idx);
  };

  if (all.length < MIN_STORIES) return null;

  return (
    <HomeSection id="results" labelledBy="stories-title" tone="dark" ribbon="pair" mobileCompact>
      <SectionIntro
        id="stories-title"
        tone="dark"
        align="left"
        eyebrow={variant === "projects" ? "Проекты" : "Результаты учеников"}
        title={variant === "projects" ? noBreakHyphen("Проекты вайб-кодинга") : "Работы учеников"}
        description={variant === "projects" ? undefined : (description ?? "Ролики и результаты учеников AI Pro School.")}
        action={
          showAllLink ? (
            <ArrowLink href="/reviews" tone="onDark">
              Все результаты
            </ArrowLink>
          ) : undefined
        }
      />

      {showTabs && (
        <div role="tablist" aria-label="Направление" className="-mt-4 mb-8 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === direction}
              onClick={() => setDirection(t.id)}
              className={cn(
                "inline-flex h-11 items-center rounded-pill px-5 text-sm font-semibold transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                t.id === direction ? "bg-white text-ink" : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white",
              )}
            >
              {noBreakHyphen(t.label)}
            </button>
          ))}
        </div>
      )}

      {withFilters && (
        <div role="tablist" aria-label="Фильтр по аудитории" className="-mt-4 mb-8 flex flex-wrap items-center gap-2">
          {storyAudienceFilters.map((f) => {
            const count = f.id === "all" ? all.length : all.filter((s) => s.audiences.includes(f.id as AudienceSlug)).length;
            if (count === 0) return null;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex h-10 items-center rounded-pill px-4 text-sm font-semibold transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  active ? "bg-white text-ink" : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Одинаковая высота карточек (items-stretch). ≥1024 — 3 колонки, ≥768 — 2; на мобильном горизонтальный scroll-snap, карточка 84% ширины.
          Меньше 3 карточек после фильтра: две — по 50%, одна — по центру с max-w, без пустых зон. */}
      <ul
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:snap-none md:items-stretch md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden",
          stories.length >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          stories.length === 2 && "md:grid-cols-2",
          stories.length === 1 && "md:mx-auto md:max-w-[420px] md:grid-cols-1",
        )}
      >
        {stories.map((c) => (
          <li key={c.id} className="flex w-[84%] shrink-0 snap-start md:w-auto md:shrink">
            <CaseCard item={c} onOpenVideo={c.videoUrl ? () => openMedia(c.id) : undefined} className="w-full" />
          </li>
        ))}
      </ul>

      <Lightbox items={mediaItems} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </HomeSection>
  );
}
