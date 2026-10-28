"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { PlaceholderBadge } from "./PlaceholderBadge";
import type { PublicCase } from "@/data/public-types";
import { cn, nbspDash } from "@/lib/utils";

interface CaseCardProps {
  item: PublicCase;
  /** Открыть видео в модалке (по клику, без автозапуска); получает кнопку play — вернуть на неё фокус после закрытия */
  onOpenVideo?: (trigger: HTMLButtonElement) => void;
  className?: string;
}

const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";
const TOP_ZONE = "relative block h-[180px] w-full shrink-0 overflow-hidden md:h-[220px]";
const IMG_SIZES = "(max-width:767px) 84vw, (max-width:1023px) 45vw, 420px";

/**
 * Единая карточка кейса (одинаковая высота в сетке): верхняя зона во всю ширину фикс. высоты (220 px десктоп, 180 px мобильный)
 * → цифра и подпись → что сделано (одна строка) → автор и роль → источник → «Смотреть ролик» (только публичный оригинал).
 * Верхняя зона: постер видео с play, иначе скриншот статистики, иначе лавандовый фон с одной брендовой фигурой (без текста).
 * Цифра — один раз, в текстовой части. Плеер до клика не грузится (embed только в модалке).
 */
export function CaseCard({ item, onOpenVideo, className }: CaseCardProps) {
  const alt = `${item.authorName}: ${item.metric} ${item.metricLabel}`;
  const hasVideo = Boolean(item.videoUrl && item.posterSrc);
  const image = item.posterSrc ?? item.statsSrc;

  const media = image ? (
    <>
      <Image src={image} alt={alt} fill sizes={IMG_SIZES} loading="lazy" className="object-cover object-center" />
      {hasVideo && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
            <Play className="ml-0.5 size-5 fill-current" aria-hidden />
          </span>
        </span>
      )}
    </>
  ) : (
    <>
      <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -bottom-10 -right-6 size-[190px] fill-brand opacity-90">
        <path d={STAR} />
      </svg>
      <span className="sr-only">{alt}</span>
    </>
  );

  return (
    <article className={cn("relative flex h-full flex-col overflow-hidden rounded-[28px] bg-surface text-ink shadow-soft", className)}>
      {item.devNote && <PlaceholderBadge status="unverified" variant="note" note={item.devNote} className="left-3 top-3" />}

      {hasVideo && onOpenVideo ? (
        <button
          type="button"
          onClick={(e) => onOpenVideo(e.currentTarget)}
          aria-label={`Смотреть видео: ${alt}`}
          className={cn(TOP_ZONE, "group bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand")}
        >
          {media}
        </button>
      ) : (
        <div className={cn(TOP_ZONE, image ? "bg-ink" : "bg-lavender")}>{media}</div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="flex min-h-[4rem] flex-wrap content-start items-baseline gap-x-2 gap-y-1">
          <span className="whitespace-nowrap font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] font-extrabold leading-none tracking-[-0.02em] text-brand">{item.metric}</span>
          <span className="text-[clamp(0.9rem,0.8rem+0.3vw,1.05rem)] font-bold leading-tight text-ink">{item.metricLabel}</span>
        </p>
        <p className="mt-3 truncate text-[14px] font-medium leading-snug text-ink-700">{nbspDash(item.doneLine)}</p>

        <div className="mt-auto pt-6">
          <p className="truncate text-[15px] font-bold leading-tight">{item.authorName}</p>
          <p className="truncate text-[13px] text-ink-500">{item.authorRole}</p>
          <p className="mt-2 text-[12px] leading-snug text-ink-500">{item.sourceCaption}</p>
          <div className="mt-3 min-h-6">
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Смотреть ролик
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
