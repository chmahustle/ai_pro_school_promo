"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui";
import { track } from "@/lib/analytics";
import { nbspDash } from "@/lib/utils";

export interface StudentWorkCard {
  id: string;
  title: string;
  text: string;
  video: { src: string; poster: string; duration: string } | null;
  image: string | null;
  /** Только dev: нет ни видео, ни скриншота - полосатая заглушка с жёлтой подписью */
  placeholder: boolean;
}

/**
 * Карточки проектов учеников: вертикальный ролик (постер и кнопка «Смотреть», по нажатию играет в карточке со звуком и
 * элементами управления; preload="none" - файл не качается, пока не нажали; одновременно играет один), скриншот или заглушка,
 * под ними название и описание.
 */
export function StudentWorksGrid({ items }: { items: StudentWorkCard[] }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <RevealGroup as="ul" className="audience-grid grid gap-4 md:grid-cols-3">
      {items.map((it, i) => (
        <RevealItem as="li" key={it.id} className="flex">
          <div className="flex w-full flex-col rounded-[28px] bg-surface p-4 ring-1 ring-ink-100 sm:p-5">
            {it.video ? (
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[250px] overflow-hidden rounded-[20px] bg-dark">
                {active === it.id ? (
                  <video
                    className="size-full object-cover"
                    src={it.video.src}
                    poster={it.video.poster}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onEnded={() => setActive(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActive(it.id);
                      track({ name: "cta_click", params: { label: "student-work-video", location: `student-work-${i + 1}` } });
                    }}
                    aria-label={`Смотреть видео: ${it.title}, ${it.video.duration}`}
                    className="group absolute inset-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
                  >
                    <Image src={it.video.poster} alt="" fill sizes="(min-width: 768px) 250px, 70vw" className="object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                        <Play className="ml-0.5 size-5 fill-current" aria-hidden />
                      </span>
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-pill bg-black/55 px-2.5 py-1 text-[12px] font-semibold text-white">{it.video.duration}</span>
                  </button>
                )}
              </div>
            ) : it.image ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink-100">
                <Image src={it.image} alt={it.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
              </div>
            ) : (
              it.placeholder && (
                <div className="grid aspect-[16/9] w-full place-items-center rounded-2xl bg-[repeating-linear-gradient(135deg,#ece9ff_0_14px,#f3f1ff_14px_28px)]" aria-hidden>
                  <span className="rounded-md bg-[#ffe08a] px-2.5 py-1 text-[12px] font-bold text-ink">видео или скриншот проекта</span>
                </div>
              )
            )}
            <h3 className="mt-4 px-1 font-display text-[19px] font-bold leading-tight text-ink">{nbspDash(it.title)}</h3>
            <p className="mt-2 px-1 pb-1 text-[15px] leading-relaxed text-ink-500">{nbspDash(it.text)}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
