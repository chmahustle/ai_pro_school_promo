"use client";

import { useMemo, useState } from "react";
import { ArrowLink, HomeSection, Lightbox, SectionIntro, StoryCard, type LightboxItem } from "@/components/ui";
import { storyAudienceFilters } from "@/data/story-filters";
import type { PublicStory } from "@/data/public-types";
import type { AudienceSlug } from "@/data/types";
import { cn, noBreakHyphen } from "@/lib/utils";

const HOME_LIMIT = 3;
type FilterId = "all" | AudienceSlug;
/** Меньше подтверждённых кейсов — блок скрывается */
const MIN_STORIES = 3;

interface HomeStoriesClientProps {
  /** Уже отфильтрованные на сервере (verified && consent) публичные карточки */
  stories: PublicStory[];
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

  const mediaItems: LightboxItem[] = useMemo(
    () =>
      stories.filter((s) => s.media).map((s) => ({
        id: s.id,
        src: s.media!.src,
        alt: s.media!.caption ?? s.name,
        caption: [s.name, s.media!.caption].filter(Boolean).join(" · "),
        kind: s.media!.type === "video" ? "video" : s.media!.type === "receipt" ? "receipt" : "image",
        embedUrl: s.media!.embedUrl,
      })),
    [stories],
  );

  const openMedia = (story: PublicStory) => {
    const idx = mediaItems.findIndex((m) => m.id === story.id);
    if (idx >= 0) setLightbox(idx);
  };

  if (all.length < MIN_STORIES) return null;

  return (
    <HomeSection id="results" labelledBy="stories-title" tone="dark" ribbon="pair">
      <SectionIntro
        id="stories-title"
        tone="dark"
        align="left"
        eyebrow={variant === "projects" ? "Проекты" : "Результаты учеников"}
        title={variant === "projects" ? noBreakHyphen("Проекты вайб-кодинга") : "Они начали с нуля — вот что получилось"}
        description={variant === "projects" ? undefined : (description ?? "Люди без технического образования, которые освоили ИИ.")}
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

      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <li key={story.id}>
            <StoryCard
              story={story}
              className="h-full"
              onOpenMedia={story.media ? () => openMedia(story) : undefined}
            />
          </li>
        ))}
      </ul>

      <Lightbox items={mediaItems} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </HomeSection>
  );
}
