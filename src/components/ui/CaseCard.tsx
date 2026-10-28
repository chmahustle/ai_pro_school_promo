"use client";

import Image from "next/image";
import { ExternalLink, Play, Quote } from "lucide-react";
import { Avatar } from "./Avatar";
import { PlaceholderBadge } from "./PlaceholderBadge";
import type { PublicCase } from "@/data/public-types";
import { cn, nbspDash } from "@/lib/utils";

interface CaseCardProps {
  item: PublicCase;
  /** Открыть видео в модалке (по клику); получает нажатую кнопку — вернуть на неё фокус после закрытия */
  onOpenVideo?: (trigger: HTMLButtonElement) => void;
  className?: string;
}

const PHOTO = "relative size-14 shrink-0 overflow-hidden rounded-full bg-lavender";
const LINK = "mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

/**
 * Карточка без видео не растягивается по самой высокой в ряду, если рядом есть карточки с видео:
 * постер 16:9 (min 160 px) даёт разницу высот больше 120 px — пустота под текстом ни к чему.
 */
export const isCompactCase = (c: PublicCase, siblingsHaveVideo: boolean): boolean => siblingsHaveVideo && !c.youtubeId;

/**
 * Единая карточка кейса (flex-col, футер mt-auto). Ряд автора: фото 56 px или миниатюра постера с play, имя/«История {имя}», роль.
 * result: метрика розовым + подпись, До/После (до 3 строк), цитата (до 3 строк). video: нейтральная строка и дата публикации.
 * Нет До/После/цитаты, но есть видео — постер 16:9 на всё свободное место (min 160 px) с большой кнопкой play.
 * Любое необязательное поле не рендерится, если пустое. До клика запросов к YouTube нет: постер локальный, плеер — в модалке.
 * Dev-плашки — абсолютно по верхнему/нижнему краю карточки, вне потока текста (в prod их нет).
 */
export function CaseCard({ item, onOpenVideo, className }: CaseCardProps) {
  const isVideoKind = item.kind === "video";
  const heading = isVideoKind ? (item.title ?? item.authorName) : item.authorName;
  const alt = isVideoKind ? `Видео-отзыв: ${item.authorName}` : `${item.authorName}: ${item.metric} ${item.metricLabel}`;
  const hasVideo = Boolean(item.youtubeId && onOpenVideo);
  const hasTexts = Boolean(item.before || item.after || item.quote);
  const thumb = item.photoSrc ?? item.posterSrc;
  const showThumbPlay = hasVideo && !item.photoSrc && Boolean(item.posterSrc);
  const showBigPoster = hasVideo && !hasTexts && Boolean(item.posterSrc);
  const open = (e: React.MouseEvent<HTMLButtonElement>) => onOpenVideo?.(e.currentTarget);
  const devTop = [item.devNote, item.devTextNote].filter(Boolean).join(" · ");

  const avatar = thumb ? (
    <>
      <Image src={thumb} alt={item.photoSrc ? item.authorName : ""} fill sizes="56px" className="object-cover object-center" />
      {showThumbPlay && (
        <span className="absolute inset-0 grid place-items-center bg-ink/25">
          <span className="grid size-6 place-items-center rounded-full bg-white/90 text-ink">
            <Play className="ml-px size-3 fill-current" aria-hidden />
          </span>
        </span>
      )}
    </>
  ) : (
    <Avatar name={item.authorName} src={null} size="lg" className="size-full" />
  );

  return (
    <article className={cn("relative flex h-full flex-col rounded-[28px] bg-surface p-5 text-ink shadow-soft sm:p-6", className)}>
      {/* dev-плашки: на краях карточки, не перекрывают аватар, имя и текст */}
      {devTop && <PlaceholderBadge status="unverified" variant="note" note={devTop} className="left-4 top-0 max-w-[calc(100%-2rem)] -translate-y-1/2 truncate" />}
      {item.devClaimsNote && <PlaceholderBadge status="unverified" variant="note" note={item.devClaimsNote} className="bottom-0 left-4 max-w-[calc(100%-2rem)] translate-y-1/2 truncate" />}

      {/* Автор */}
      <div className="flex items-center gap-3">
        {showThumbPlay ? (
          <button type="button" onClick={open} aria-label={`Смотреть видео: ${alt}`} className={cn(PHOTO, "group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand")}>
            {avatar}
          </button>
        ) : (
          <div className={PHOTO}>{avatar}</div>
        )}
        <div className="min-w-0">
          {isVideoKind ? <h3 className="truncate text-[16px] font-bold leading-tight">{heading}</h3> : <p className="truncate text-[16px] font-bold leading-tight">{heading}</p>}
          {item.authorRole && <p className="truncate text-[13px] text-ink-500">{item.authorRole}</p>}
        </div>
      </div>

      {/* Метрика (result) или нейтральная строка (video) */}
      {isVideoKind ? (
        <div className="mt-4">
          {item.neutralLine && <p className="text-[15px] font-semibold leading-snug">{item.neutralLine}</p>}
          {item.publishedLabel && <p className="mt-1 text-[12px] text-ink-500">{item.publishedLabel}</p>}
        </div>
      ) : (
        <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
          <span className="whitespace-nowrap font-display text-[clamp(1.5rem,1.2rem+1vw,1.9rem)] font-extrabold leading-none tracking-[-0.02em] text-brand">{item.metric}</span>
          <span className="text-[clamp(0.85rem,0.8rem+0.2vw,0.95rem)] font-bold leading-tight text-ink">{item.metricLabel}</span>
        </p>
      )}

      {(item.before || item.after) && (
        <div className="mt-4 grid gap-1.5 text-[13px] leading-snug">
          {item.before && (
            <p className="line-clamp-3 text-ink-500">
              <span className="font-semibold">До:</span> {item.before}
            </p>
          )}
          {item.after && (
            <p className="line-clamp-3 text-ink">
              <span className="font-semibold text-brand">После:</span> {item.after}
            </p>
          )}
        </div>
      )}

      {item.quote && (
        <p className="mt-4 flex gap-2 text-[14px] italic leading-relaxed text-ink-500">
          <Quote className="mt-0.5 size-4 shrink-0 opacity-40" aria-hidden />
          <span className="line-clamp-3">{nbspDash(item.quote)}</span>
        </p>
      )}

      {/* Постер 16:9 вместо пустого места: заполняет всё свободное место, большая кнопка play открывает ту же модалку */}
      {showBigPoster && item.posterSrc && (
        <button
          type="button"
          onClick={open}
          aria-label={`Смотреть видео: ${alt}`}
          className="group relative mt-4 min-h-[160px] flex-1 overflow-hidden rounded-2xl bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Image src={item.posterSrc} alt="" fill sizes="(max-width:767px) 80vw, 380px" loading="lazy" className="object-cover object-center" />
          <span className="absolute inset-0 grid place-items-center bg-ink/20">
            <span className="grid size-16 place-items-center rounded-full bg-white/95 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
              <Play className="ml-1 size-7 fill-current" aria-hidden />
            </span>
          </span>
        </button>
      )}

      {/* Футер */}
      <footer className="mt-auto pt-5">
        {item.sourceCaption && <p className="text-[12px] leading-snug text-ink-500">{item.sourceCaption}</p>}
        {hasVideo ? (
          <button type="button" onClick={open} className={LINK}>
            Смотреть ролик
            <ExternalLink className="size-3.5" aria-hidden />
          </button>
        ) : item.sourceUrl ? (
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
            Смотреть ролик
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </footer>
    </article>
  );
}
