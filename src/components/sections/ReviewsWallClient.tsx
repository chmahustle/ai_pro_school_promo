"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Play, Star } from "lucide-react";
import {
  Avatar,
  Button,
  Lightbox,
  MediaPlaceholder,
  Pill,
  PlaceholderBadge,
  RevealGroup,
  RevealItem,
  Section,
  SectionHead,
  type LightboxItem,
} from "@/components/ui";
import { reviewKindLabels } from "@/data/review-labels";
import type { PublicReview } from "@/data/public-types";
import type { ReviewKind } from "@/data/types";
import { cn, formatTenge } from "@/lib/utils";

interface ReviewsWallProps {
  items: PublicReview[];
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Показать табы-фильтры по типу */
  filters?: boolean;
  moreHref?: string;
  moreLabel?: string;
  tone?: "bg" | "white" | "lavender";
  bare?: boolean;
  limit?: number;
  /** Компактнее карточки — для главной */
  compact?: boolean;
}

/**
 * Стена отзывов: masonry-сетка из видео, текста, чеков и скриншотов переписок.
 */
export function ReviewsWallClient({
  items,
  eyebrow = "Отзывы",
  title = "Что говорят ученики",
  description = "Видео, скриншоты переписок и оплат — всё, что присылают нам после обучения.",
  filters = false,
  moreHref,
  moreLabel = "Смотреть все результаты",
  tone = "bg",
  bare,
  limit,
  compact = false,
}: ReviewsWallProps) {
  const [kind, setKind] = useState<ReviewKind | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const list = kind === "all" ? items : items.filter((r) => r.kind === kind);
    return limit ? list.slice(0, limit) : list;
  }, [items, kind, limit]);

  const mediaItems: LightboxItem[] = useMemo(
    () =>
      filtered
        .filter((r) => r.kind !== "text")
        .map((r) => ({
          id: r.id,
          src: r.src,
          alt: r.text ?? r.author,
          caption: [r.author, r.context].filter(Boolean).join(" · "),
          kind: r.kind === "video" ? "video" : (r.kind as "receipt" | "chat"),
          embedUrl: r.embedUrl,
        })),
    [filtered],
  );

  const openMedia = (id: string) => {
    const idx = mediaItems.findIndex((m) => m.id === id);
    if (idx >= 0) setLightbox(idx);
  };

  const kinds: (ReviewKind | "all")[] = ["all", "video", "text", "receipt", "chat"];

  const body = (
    <>
      {filters && (
        <div role="tablist" aria-label="Тип отзывов" className="mb-8 flex flex-wrap gap-2">
          {kinds.map((k) => {
            const count = k === "all" ? items.length : items.filter((r) => r.kind === k).length;
            if (count === 0) return null;
            const active = kind === k;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors",
                  active ? "bg-ink text-white" : "bg-surface text-ink-700 shadow-soft hover:bg-soft-100",
                )}
              >
                {k === "all" ? "Все" : reviewKindLabels[k]}
                <span className={cn("rounded-pill px-1.5 text-xs", active ? "bg-white/15" : "bg-ink/5")}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <RevealGroup
        as="ul"
        className={cn(
          "[&>li]:break-inside-avoid",
          compact
            ? "columns-2 gap-3 sm:columns-3 lg:columns-4 [&>li]:mb-3"
            : "columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4",
        )}
      >
        {filtered.map((r) => (
          <RevealItem as="li" key={r.id}>
            <ReviewCard item={r} onOpen={() => openMedia(r.id)} compact={compact} />
          </RevealItem>
        ))}
      </RevealGroup>

      {moreHref && compact && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" href={moreHref} icon={<ArrowRight className="size-4" />}>
            {moreLabel}
          </Button>
        </div>
      )}

      <Lightbox items={mediaItems} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </>
  );

  if (bare) return body;

  return (
    <Section tone={tone} rounded={tone === "lavender"}>
      <SectionHead
        eyebrow={eyebrow}
        title={title}
        description={description}
        aside={
          moreHref && !compact ? (
            <Button variant="outline" href={moreHref} icon={<ArrowRight className="size-4" />}>
              {moreLabel}
            </Button>
          ) : undefined
        }
      />
      {body}
    </Section>
  );
}

function ReviewCard({
  item,
  onOpen,
  compact,
}: {
  item: PublicReview;
  onOpen: () => void;
  compact?: boolean;
}) {
  // Пометка приходит только в dev (item.dev); в production её нет
  const badge = item.dev?.badge ? <PlaceholderBadge status={item.dev.badge} note={item.dev.note} /> : null;

  if (item.kind === "text") {
    return (
      <article
        className={cn(
          "relative flex flex-col gap-3 rounded-2xl bg-surface shadow-soft",
          compact ? "p-4" : "gap-4 p-6",
        )}
      >
        {badge}
        {item.rating && (
          <div className="flex gap-0.5 text-brand" aria-label={`Оценка ${item.rating} из 5`}>
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" aria-hidden />
            ))}
          </div>
        )}
        <p className={cn("leading-relaxed text-ink-700", compact ? "text-[13px]" : "text-[15px]")}>{item.text}</p>
        <footer className="mt-auto flex items-center gap-2.5">
          <Avatar name={item.author} src={item.photo} size="sm" placeholder={!item.photo} />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{item.author}</p>
            {item.context && <p className="truncate text-xs text-ink-500">{item.context}</p>}
          </div>
        </footer>
      </article>
    );
  }

  const isVideo = item.kind === "video";
  const isTall = item.kind === "chat" || item.kind === "receipt";

  return (
    <article className="relative overflow-hidden rounded-2xl bg-surface shadow-soft">
      {badge}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Открыть: ${item.text ?? item.author}`}
        className="group block w-full text-left"
      >
        <div className="relative">
          <MediaPlaceholder
            src={item.src}
            alt={item.text ?? item.author}
            kind={isVideo ? "video" : item.kind === "receipt" ? "receipt" : "chat"}
            aspect={isVideo || isTall ? "portrait" : "video"}
            rounded="rounded-none"
            caption={
              isVideo ? "Видео / ролик" : item.kind === "receipt" ? "Скриншот оплаты" : "Скриншот"
            }
            className={cn(
              isVideo && (compact ? "aspect-[3/4]" : "aspect-[4/5]"),
              isTall && !isVideo && (compact ? "aspect-[3/4]" : "aspect-[4/5]"),
            )}
          />
          {isVideo && (
            <span className="absolute inset-0 grid place-items-center">
              <span
                className={cn(
                  "grid place-items-center rounded-full bg-white/90 text-ink shadow-float transition-transform duration-300 group-hover:scale-110",
                  compact ? "size-11" : "size-16",
                )}
              >
                <Play className={cn("fill-current", compact ? "ml-0.5 size-4" : "ml-1 size-6")} />
              </span>
            </span>
          )}
          <span className="absolute left-2 top-2 flex gap-1">
            <Pill tone={isVideo ? "dark" : item.kind === "receipt" ? "peach" : "white"} size="sm">
              {reviewKindLabels[item.kind]}
            </Pill>
            {item.amount && (
              <Pill tone="white" size="sm">
                {formatTenge(item.amount)}
              </Pill>
            )}
          </span>
        </div>
        <div className={cn("flex items-center gap-2.5", compact ? "p-2.5" : "gap-3 p-4")}>
          {!compact && <Avatar name={item.author} src={item.photo} size="sm" placeholder={!item.photo} />}
          <div className="min-w-0">
            <p className={cn("truncate font-semibold", compact ? "text-[12px]" : "text-sm")}>{item.author}</p>
            {(item.context ?? item.text) && (
              <p className="truncate text-[11px] text-ink-500">{item.context ?? item.text}</p>
            )}
          </div>
        </div>
      </button>
    </article>
  );
}
