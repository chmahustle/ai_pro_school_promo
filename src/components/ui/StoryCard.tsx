"use client";

import { Play, Quote } from "lucide-react";
import { Avatar } from "./Avatar";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { PlaceholderBadge } from "./PlaceholderBadge";
import type { PublicStory } from "@/data/public-types";
import { cn, nbspDash } from "@/lib/utils";

export interface StoryCardProps {
  story: PublicStory;
  /** Открыть лайтбокс/видео по индексу медиа */
  onOpenMedia?: () => void;
  className?: string;
}

function ResultTitle({ result }: { result: PublicStory["result"] }) {
  const brand = [result.value, result.unit].filter(Boolean).join("\u00a0");
  return (
    <h3 className="font-display font-bold leading-[1.15] tracking-[-0.02em] text-ink [font-size:clamp(22px,2vw,28px)]">
      {brand ? <span className="text-brand">{brand}</span> : null}
      {result.text ? (
        <span className="text-ink">
          {nbspDash(brand ? ` ${result.text}` : result.text)}
        </span>
      ) : null}
    </h3>
  );
}

function formatAsOf(asOf: string) {
  // "2025-03" → "март 2025"; иначе как есть
  const m = /^(\d{4})-(\d{2})$/.exec(asOf);
  if (!m) return asOf;
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];
  const idx = Number(m[2]) - 1;
  return months[idx] ? `${months[idx]} ${m[1]}` : asOf;
}

function mediaCaption(story: PublicStory): string {
  if (story.media?.caption) return story.media.caption;
  if (story.media?.type === "receipt") return "Данные скрыты";
  if (story.media?.type === "stats") return "Скриншот статистики";
  return "Видео";
}

/**
 * Единая карточка результата ученика.
 */
export function StoryCard({ story, onOpenMedia, className }: StoryCardProps) {
  // Пометки проверки приходят только в dev (story.dev); в production-сборке их нет вовсе
  const badgeStatus = story.dev?.badge ?? null;
  const showBadge = badgeStatus !== null;
  const showBeforeAfter = Boolean(story.before && story.after);
  const showQuote = Boolean(story.quote);
  const showMedia = Boolean(story.media);
  const isReceipt = story.variant === "receipt" || story.media?.type === "receipt";
  const isVideo = story.media?.type === "video";

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[28px] bg-surface p-5 text-ink shadow-soft sm:p-6",
        className,
      )}
    >
      {showBadge && badgeStatus && (
        <PlaceholderBadge
          status={badgeStatus}
          note={story.dev?.note}
          className="left-auto right-2 top-2"
        />
      )}

      {story.teacherProject && (
        <p className="mb-3 inline-flex self-start rounded-pill bg-ink-100 px-3 py-1 text-[12px] font-semibold text-ink-700">проект преподавателя</p>
      )}

      {/* Шапка */}
      <header className="flex items-center gap-3 pr-16">
        <Avatar name={story.name} src={story.photo} size="md" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight">{story.name}</p>
          <p className="truncate text-[13px] text-ink-500">{story.descriptor}</p>
        </div>
      </header>

      {/* Заголовок результата */}
      <div className="mt-4">
        <ResultTitle result={story.result} />
      </div>

      {/* Медиа */}
      {showMedia && story.media && (
        <div className="mt-4">
          {(() => {
            const interactive = Boolean(onOpenMedia);
            const inner = (
              <>
                <div className="relative">
                  <MediaPlaceholder
                    src={story.media.src}
                    alt={mediaCaption(story)}
                    kind={isReceipt ? "receipt" : isVideo ? "video" : "image"}
                    aspect={isReceipt || isVideo ? "portrait" : "video"}
                    caption={!story.media.src ? mediaCaption(story) : undefined}
                    className={cn(
                      (isReceipt || isVideo) && "aspect-[4/5]",
                      isReceipt && !story.media.src && "blur-[2px]",
                    )}
                    rounded="rounded-2xl"
                  />
                  {isReceipt && !story.media.src && (
                    <div
                      className="pointer-events-none absolute inset-0 bg-white/30 backdrop-blur-[6px]"
                      aria-hidden
                    />
                  )}
                  {isVideo && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                        <Play className="ml-0.5 size-5 fill-current" aria-hidden />
                      </span>
                    </span>
                  )}
                </div>
                {(isReceipt || story.media.type === "stats") && (
                  <p className="mt-2 text-[12px] font-medium text-ink-500">{mediaCaption(story)}</p>
                )}
              </>
            );

            if (!interactive) return <div className="relative w-full">{inner}</div>;

            return (
              <button
                type="button"
                onClick={onOpenMedia}
                className="group relative block w-full overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={isVideo ? "Смотреть видео" : `Открыть: ${mediaCaption(story)}`}
              >
                {inner}
              </button>
            );
          })()}
        </div>
      )}

      {/* До → После */}
      {showBeforeAfter && !isReceipt && (
        <div className="mt-4 grid gap-1.5 text-[13px] leading-snug">
          <p className="line-clamp-2 text-ink-500">
            <span className="font-semibold text-ink-500">До:</span> {story.before}
          </p>
          <p className="line-clamp-2 text-ink">
            <span className="font-semibold text-brand">После:</span> {story.after}
          </p>
        </div>
      )}

      {/* Цитата */}
      {showQuote && (
        <p className="mt-4 flex gap-2 text-[14px] italic leading-relaxed text-ink-500">
          <Quote className="mt-0.5 size-4 shrink-0 opacity-40" aria-hidden />
          {story.quote}
        </p>
      )}

      {/* Подвал: источник и дата — метаданные проверки, только в dev */}
      {story.dev?.source && story.dev.asOf && (
        <footer className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-ink-500">
          <span>{story.dev.source}</span>
          <span aria-hidden>·</span>
          <time dateTime={story.dev.asOf}>{formatAsOf(story.dev.asOf)}</time>
        </footer>
      )}
    </article>
  );
}
