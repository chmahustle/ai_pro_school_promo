"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { PlaceholderBadge } from "./PlaceholderBadge";
import type { PublicCase } from "@/data/public-types";
import { cn, nbspDash } from "@/lib/utils";

interface CaseCardProps {
  item: PublicCase;
  /** Открыть видео в модалке (по клику, без автозапуска) */
  onOpenVideo?: () => void;
  className?: string;
}

const MEDIA_ZONE = "relative aspect-[4/5] w-full overflow-hidden rounded-2xl";
const IMG_SIZES = "(max-width:767px) 84vw, (max-width:1023px) 45vw, 380px";

/**
 * Единая карточка кейса (одинаковая высота в сетке): медиа 4:5 → цифра крупно → что сделано (одна строка) → автор и роль →
 * подпись-источник → «Смотреть ролик» (только на публичный оригинал). Медиа обязательно: постер видео с play,
 * иначе скриншот статистики, иначе плитка с градиентом и той же цифрой. Плеер до клика не грузится (в модалке).
 */
export function CaseCard({ item, onOpenVideo, className }: CaseCardProps) {
  const alt = `${item.authorName}: ${item.metric} ${item.metricLabel}`;
  const hasVideo = Boolean(item.videoUrl && item.posterSrc);
  const image = item.posterSrc ?? item.statsSrc;

  const media = image ? (
    <>
      <Image src={image} alt={alt} fill sizes={IMG_SIZES} loading="lazy" className="object-cover object-[center_top]" />
      {hasVideo && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
            <Play className="ml-0.5 size-5 fill-current" aria-hidden />
          </span>
        </span>
      )}
    </>
  ) : (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-peach via-lavender to-soft-200 p-6 text-center text-ink"
    >
      <span className="whitespace-nowrap font-display text-[clamp(2rem,1.4rem+2vw,3rem)] font-extrabold leading-none tracking-[-0.02em]">{item.metric}</span>
      <span className="text-[14px] font-semibold text-ink-700">{item.metricLabel}</span>
    </div>
  );

  return (
    <article className={cn("relative flex h-full flex-col rounded-[28px] bg-surface p-4 text-ink shadow-soft sm:p-5", className)}>
      {item.devNote && <PlaceholderBadge status="unverified" note={item.devNote} className="left-auto right-3 top-3" />}

      {hasVideo && onOpenVideo ? (
        <button
          type="button"
          onClick={onOpenVideo}
          aria-label={`Смотреть видео: ${alt}`}
          className={cn(MEDIA_ZONE, "group block bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand")}
        >
          {media}
        </button>
      ) : (
        <div className={cn(MEDIA_ZONE, "bg-ink")}>{media}</div>
      )}

      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="whitespace-nowrap font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] font-extrabold leading-none tracking-[-0.02em] text-brand">{item.metric}</span>
        <span className="text-[clamp(0.9rem,0.8rem+0.3vw,1.05rem)] font-bold leading-tight text-ink">{item.metricLabel}</span>
      </p>
      <p className="mt-2 truncate text-[14px] font-semibold leading-snug text-ink">{nbspDash(item.doneLine)}</p>

      <div className="mt-auto pt-4">
        <p className="truncate text-[15px] font-bold leading-tight">{item.authorName}</p>
        <p className="truncate text-[13px] text-ink-500">{item.authorRole}</p>
        <p className="mt-2 text-[12px] leading-snug text-ink-500">{item.sourceCaption}</p>
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Смотреть ролик
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
