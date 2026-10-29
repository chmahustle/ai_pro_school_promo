"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/ui";
import { youtubeEmbedUrl } from "@/lib/youtube";

export interface VideoShot {
  id: string;
  /** Локальный постер (до клика запросов к YouTube нет) */
  poster: string;
  youtubeId: string;
  label?: string;
}

/**
 * Горизонтальная карусель вертикальных роликов (рилсы): постеры 9:16 одной высоты, scroll-snap, стрелки при переполнении.
 * Клик открывает ролик в окне просмотра (youtube-nocookie, вертикальный формат, без прокрутки, Esc/фон закрывают, фокус возвращается).
 */
export function VideoCarousel({ items, label }: { items: VideoShot[]; label: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const measure = useCallback(() => {
    const el = listRef.current;
    if (el) setOverflow(el.scrollWidth > el.clientWidth + 2);
  }, []);
  useEffect(() => {
    measure();
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const scrollBy = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.8), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const btn = "grid size-11 place-items-center rounded-full bg-ink/[0.06] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  const lb: LightboxItem[] = items.map((v, i) => ({ id: v.id, src: v.poster, alt: v.label ?? `Ролик ученика практикума ${i + 1}`, kind: "video", embedUrl: youtubeEmbedUrl(v.youtubeId), vertical: true }));
  const close = () => {
    setOpen(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div>
      {overflow && (
        <div className="mb-4 flex justify-end gap-2">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Назад" className={btn}>
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Вперёд" className={btn}>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
      <ul ref={listRef} aria-label={label} className="-mx-4 -mt-3 flex snap-x snap-mandatory scroll-pl-4 items-start gap-3 overflow-x-auto px-4 pb-4 pt-3 no-scrollbar sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:-mx-8 lg:scroll-pl-8 lg:px-8">
        {items.map((v, i) => (
          <li key={v.id} className="w-[44vw] max-w-[230px] shrink-0 snap-start sm:w-[220px]">
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={v.label ? `Смотреть: ${v.label}` : `Смотреть ролик ${i + 1}`}
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-dark shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Image src={v.poster} alt="" fill sizes="(max-width:640px) 44vw, 220px" className="object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-ink/15">
                <span className="grid size-14 place-items-center rounded-full bg-white/95 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <Play className="ml-0.5 size-6 fill-current" aria-hidden />
                </span>
              </span>
            </button>
            {v.label && <p className="mt-3 text-[15px] font-semibold leading-snug text-ink">{v.label}</p>}
          </li>
        ))}
      </ul>
      {overflow && <p className="mt-1 text-[12px] text-ink-500">Листайте вправо</p>}
      <Lightbox items={lb} index={open} onClose={close} onChange={setOpen} />
    </div>
  );
}
