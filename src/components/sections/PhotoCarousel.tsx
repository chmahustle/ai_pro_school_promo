"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/ui";

export interface PhotoShot {
  id: string;
  src: string;
  /** Соотношение сторон (ширина / высота) */
  ratio: number;
}

/**
 * Карусель фото-скриншотов: горизонтальная лента со scroll-snap (свайп, колёсико, стрелки), все фото одной высоты, без обрезки.
 * Клик открывает фото целиком в окне просмотра (стрелки листают, Esc и фон закрывают, фокус возвращается, без прокрутки).
 * Автопрокрутки нет. Стрелки показываются, только если есть переполнение.
 */
export function PhotoCarousel({ shots, label, altPrefix, tone = "dark" }: { shots: PhotoShot[]; label: string; altPrefix: string; tone?: "dark" | "light" }) {
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
  const btn = tone === "light"
    ? "grid size-11 place-items-center rounded-full bg-white text-ink shadow-soft transition-colors hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    : "grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  const items: LightboxItem[] = shots.map((s, i) => ({ id: s.id, src: s.src, ratio: s.ratio, alt: `${altPrefix} ${i + 1}`, caption: `${i + 1} / ${shots.length}`, kind: "image" }));
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
      <ul ref={listRef} aria-label={label} className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 items-start gap-3 overflow-x-auto px-4 pb-3 no-scrollbar sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:-mx-8 lg:scroll-pl-8 lg:px-8">
        {shots.map((s, i) => (
          <li key={s.id} className="shrink-0 snap-start">
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Открыть: ${altPrefix} ${i + 1}`}
              className="group relative block h-[320px] overflow-hidden rounded-[20px] bg-white shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-[400px]"
              style={{ aspectRatio: s.ratio }}
            >
              <Image src={s.src} alt="" fill sizes="(max-width:640px) 70vw, 340px" className="object-cover" />
              <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-ink/70 text-white opacity-90 transition-opacity group-hover:opacity-100">
                <Maximize2 className="size-4" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {overflow && <p className={tone === "light" ? "mt-1 text-[12px] text-ink-500" : "mt-1 text-[12px] text-white/70"}>Листайте вправо</p>}
      <Lightbox items={items} index={open} onClose={close} onChange={setOpen} />
    </div>
  );
}
