"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "./Modal";
import { MediaPlaceholder } from "./MediaPlaceholder";

export interface LightboxItem {
  id: string;
  src?: string | null;
  alt: string;
  caption?: string;
  kind?: "image" | "receipt" | "chat" | "video";
  /** Для видео: ссылка на embed (YouTube/Instagram) */
  embedUrl?: string;
  /** Для видео: локальный MP4 (вертикальный ролик) - родной плеер */
  videoSrc?: string;
  /** Вертикальный ролик 9:16 (embed): высота до 85vh, без автозапуска */
  vertical?: boolean;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}

/** Лайтбокс поверх Modal: стрелки, свайп-клавиши, подпись */
export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const open = index !== null;
  const item = index !== null ? items[index] : undefined;

  const prev = useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);
  const next = useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  return (
    // Вертикальный ролик: без прокрутки - панель не скроллится, высота плеера подогнана под экран
    <Modal open={open} onClose={onClose} size="full" bare title={item?.alt} className={item?.vertical || item?.videoSrc ? "overflow-visible" : undefined}>
      {item && (
        <div className="flex flex-col items-center gap-4 px-2 pb-6 pt-12 sm:px-14">
          <div className="relative w-full max-w-4xl">
            {item.videoSrc ? (
              <video
                key={item.id}
                src={item.videoSrc}
                poster={item.src ?? undefined}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={item.alt}
                className="mx-auto h-[calc(92dvh-5.5rem)] max-h-[calc(92dvh-5.5rem)] w-auto max-w-full rounded-[24px] bg-ink object-contain"
              />
            ) : item.embedUrl ? (
              <div
                className={item.vertical ? "mx-auto aspect-[9/16] max-w-full overflow-hidden rounded-[24px] bg-ink" : "aspect-video w-full overflow-hidden rounded-2xl bg-ink"}
                style={item.vertical ? { height: "min(calc(92dvh - 5.5rem), calc((100vw - 1rem) * 16 / 9))" } : undefined}
              >
                <iframe
                  src={item.embedUrl}
                  title={item.alt}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <MediaPlaceholder
                src={item.src}
                alt={item.alt}
                kind={item.kind === "video" ? "video" : (item.kind ?? "image")}
                aspect={item.kind === "chat" || item.kind === "receipt" ? "portrait" : "video"}
                className="mx-auto max-h-[70dvh] w-auto"
                rounded="rounded-2xl"
                sizes="100vw"
                caption={item.caption}
              />
            )}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Предыдущий"
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white sm:-left-14 sm:bg-white/15 sm:text-white sm:hover:bg-white/25"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Следующий"
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white sm:-right-14 sm:bg-white/15 sm:text-white sm:hover:bg-white/25"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
          {item.caption && !item.vertical && !item.videoSrc && <p className="max-w-2xl text-center text-sm text-white/80">{item.caption}</p>}
          {items.length > 1 && index !== null && !item.vertical && !item.videoSrc && (
            <p className="text-xs text-white/50 tabular-nums">
              {index + 1} / {items.length}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
