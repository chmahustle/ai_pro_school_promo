"use client";

import Image from "next/image";
import { ExternalLink, Play, Quote } from "lucide-react";
import { Avatar } from "./Avatar";
import { PlaceholderBadge } from "./PlaceholderBadge";
import type { PublicCase } from "@/data/public-types";
import { cn, nbspDash } from "@/lib/utils";

interface CaseCardProps {
  item: PublicCase;
  /** Открыть видео в модалке (по клику, без автозапуска); получает нажатую кнопку — вернуть на неё фокус после закрытия */
  onOpenVideo?: (trigger: HTMLButtonElement) => void;
  className?: string;
}

const PHOTO = "relative size-14 shrink-0 overflow-hidden rounded-full bg-lavender";

/**
 * Единая карточка кейса (flex-col, равная высота в сетке, футер прижат вниз): ряд автора (фото 56 px или миниатюра постера
 * с play) → метрика розовым с подписью → «До:» / «После:» (до 3 строк) → цитата (до 3 строк) → футер: источник и «Смотреть ролик».
 * Любое необязательное поле не рендерится, если пустое. Плеер до клика не грузится (embed только в модалке).
 */
export function CaseCard({ item, onOpenVideo, className }: CaseCardProps) {
  const alt = `${item.authorName}: ${item.metric} ${item.metricLabel}`;
  const hasVideo = Boolean(item.videoUrl && onOpenVideo);
  const thumb = item.photoSrc ?? item.posterSrc;
  const showThumbPlay = hasVideo && !item.photoSrc && Boolean(item.posterSrc);

  const avatar = thumb ? (
    <>
      <Image src={thumb} alt={item.photoSrc ? item.authorName : alt} fill sizes="56px" className="object-cover object-center" />
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
      {item.devNote && <PlaceholderBadge status="unverified" variant="note" note={item.devNote} className="right-3 top-3" />}

      {/* Автор */}
      <div className="flex items-center gap-3">
        {showThumbPlay ? (
          <button
            type="button"
            onClick={(e) => onOpenVideo?.(e.currentTarget)}
            aria-label={`Смотреть видео: ${alt}`}
            className={cn(PHOTO, "group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand")}
          >
            {avatar}
          </button>
        ) : (
          <div className={PHOTO}>{avatar}</div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[16px] font-bold leading-tight">{item.authorName}</p>
          <p className="truncate text-[13px] text-ink-500">{item.authorRole}</p>
        </div>
      </div>

      {/* Метрика */}
      <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
        <span className="whitespace-nowrap font-display text-[clamp(1.5rem,1.2rem+1vw,1.9rem)] font-extrabold leading-none tracking-[-0.02em] text-brand">{item.metric}</span>
        <span className="text-[clamp(0.85rem,0.8rem+0.2vw,0.95rem)] font-bold leading-tight text-ink">{item.metricLabel}</span>
      </p>

      {item.devTextNote && <PlaceholderBadge status="unverified" variant="note" note={item.devTextNote} className="relative left-auto right-auto top-auto mt-3 self-start" />}

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

      {/* Футер */}
      <footer className="mt-auto pt-5">
        <p className="text-[12px] leading-snug text-ink-500">{item.sourceCaption}</p>
        {hasVideo ? (
          <button
            type="button"
            onClick={(e) => onOpenVideo?.(e.currentTarget)}
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Смотреть ролик
            <ExternalLink className="size-3.5" aria-hidden />
          </button>
        ) : item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Смотреть ролик
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </footer>
    </article>
  );
}
