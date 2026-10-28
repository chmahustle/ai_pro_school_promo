"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import type { PublicVideoReview } from "@/data/videoReviews";
import { track } from "@/lib/analytics";

/**
 * Видеоотзывы: горизонтальная лента вертикальных роликов. Видео не стартует само: постер и кнопка «Смотреть»,
 * по нажатию играет inline со звуком и элементами управления; одновременно играет один ролик.
 * preload="none" — пока не нажали, видеофайл не скачивается (только лёгкий постер WebP).
 */
export function VideoReviewsClient({ items }: { items: PublicVideoReview[] }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:px-0" aria-label="Видеоотзывы учеников">
      {items.map((v, i) => (
        <li key={v.id} className="w-[64vw] max-w-[260px] shrink-0 snap-start sm:w-[240px]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] bg-dark shadow-soft">
            {active === v.id ? (
              <video
                className="size-full object-cover"
                src={v.src}
                poster={v.poster}
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
                  setActive(v.id);
                  track({ name: "cta_click", params: { label: "video-review", location: `video-review-${i + 1}` } });
                }}
                aria-label={`Смотреть видеоотзыв ${i + 1}, ${v.duration}`}
                className="group absolute inset-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
              >
                <Image src={v.poster} alt="" fill sizes="(max-width: 640px) 64vw, 240px" className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-float transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                    <Play className="ml-0.5 size-5 fill-current" aria-hidden />
                  </span>
                </span>
                <span className="absolute bottom-3 left-3 rounded-pill bg-black/55 px-2.5 py-1 text-[12px] font-semibold text-white">{v.duration}</span>
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
