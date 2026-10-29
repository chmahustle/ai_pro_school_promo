"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Instagram, Maximize2, Youtube } from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface GrowthStat {
  id: string;
  platform: string;
  gain: string;
  period: string;
  beforeSrc: string;
  afterSrc: string;
  beforeRatio: number;
  afterRatio: number;
}

/**
 * Карточки роста площадок: цифра, период и два скриншота профиля («было» и «стало») целиком, без обрезки.
 * Клик по скриншоту открывает его в окне просмотра (стрелки листают все шесть, Esc/фон закрывают, фокус возвращается).
 */
export function GrowthGrid({ stats }: { stats: GrowthStat[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const shots = stats.flatMap((st) => [
    { st, cap: "Было", src: st.beforeSrc, ratio: st.beforeRatio },
    { st, cap: "Стало", src: st.afterSrc, ratio: st.afterRatio },
  ]);
  const items: LightboxItem[] = shots.map(({ st, cap, src, ratio }) => ({
    id: `${st.id}-${cap}`,
    src,
    ratio,
    alt: `${st.platform}: профиль школы, ${cap.toLowerCase()}`,
    caption: `${st.platform} · ${cap}`,
    kind: "image",
  }));
  const close = () => {
    setOpen(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };
  return (
    <>
      <ul className="mx-auto mt-12 grid max-w-[1180px] gap-4 sm:grid-cols-3">
        {stats.map((st, si) => {
          const Icon = st.id === "instagram" ? Instagram : st.id === "youtube" ? Youtube : null;
          return (
            <li key={st.id} className="flex">
              <div className="flex w-full flex-col items-center gap-2 rounded-[24px] bg-white/[0.07] p-5 text-center ring-1 ring-white/15">
                <span className="inline-flex items-center gap-2 rounded-pill bg-gradient-to-r from-brand-600 to-brand px-4 py-1.5 text-[14px] font-bold text-white">
                  {Icon ? <Icon className="size-4" aria-hidden /> : <span aria-hidden className="text-[13px] font-extrabold">♪</span>}
                  {st.platform}
                </span>
                <p className="whitespace-nowrap font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] font-extrabold leading-none text-white">{st.gain}</p>
                <p className="whitespace-nowrap text-[14px] text-white/70">{st.period}</p>
                <div className="mt-3 flex w-full flex-col gap-3">
                  {[0, 1].map((k) => {
                    const idx = si * 2 + k;
                    const sh = shots[idx]!;
                    return (
                      <figure key={sh.cap} className="m-0 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            triggerRef.current = e.currentTarget;
                            setOpen(idx);
                          }}
                          aria-label={`Открыть: ${items[idx]!.alt}`}
                          className="group relative block w-full overflow-hidden rounded-xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          style={{ aspectRatio: sh.ratio }}
                        >
                          <Image src={sh.src} alt="" fill sizes="(max-width:640px) 90vw, 360px" className="object-contain" />
                          <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-ink/70 text-white opacity-90 transition-opacity group-hover:opacity-100">
                            <Maximize2 className="size-4" aria-hidden />
                          </span>
                        </button>
                        <figcaption className={cn("text-[13px] font-semibold", sh.cap === "Стало" ? "text-brand-200" : "text-white/70")}>{sh.cap}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Lightbox items={items} index={open} onClose={close} onChange={setOpen} />
    </>
  );
}
