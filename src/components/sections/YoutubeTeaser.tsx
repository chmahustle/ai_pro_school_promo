"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/ui";
import { youtubeEmbedUrl } from "@/lib/youtube";

/**
 * Превью видео YouTube: локальный постер и кнопка play; по клику - плеер youtube-nocookie.com в модалке (вертикальный формат,
 * без прокрутки, Esc/фон закрывают, фокус возвращается на кнопку). До клика запросов к YouTube и Google нет.
 */
export function YoutubeTeaser({ youtubeId, posterSrc, title }: { youtubeId: string; posterSrc: string; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const items: LightboxItem[] = [{ id: youtubeId, src: posterSrc, alt: `Видео: ${title}`, kind: "video", embedUrl: youtubeEmbedUrl(youtubeId), vertical: true }];
  const close = () => {
    setOpen(null);
    requestAnimationFrame(() => btnRef.current?.focus());
  };
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(0)}
        aria-label={`Смотреть видео: ${title}`}
        className="group relative mx-auto block aspect-video w-full max-w-[760px] overflow-hidden rounded-[28px] bg-white/10 shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <Image src={posterSrc} alt="" fill sizes="(max-width:768px) 92vw, 760px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        <span className="absolute inset-0 grid place-items-center bg-ink/20">
          <span className="grid size-20 place-items-center rounded-full bg-white/95 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Play className="ml-1 size-8 fill-current" aria-hidden />
          </span>
        </span>
      </button>
      <Lightbox items={items} index={open} onClose={close} onChange={setOpen} />
    </>
  );
}
