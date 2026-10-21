"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui";
import type { Work } from "@/data/works";
import { cn } from "@/lib/utils";

function WorkCard({ work, onOpenVideo }: { work: Work; onOpenVideo: (w: Work) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const label =
    work.consent && (work.personName || work.ageNote)
      ? [work.personName, work.ageNote].filter(Boolean).join(" · ")
      : null;
  const showViews = work.views?.verified === true;

  const playHover = () => {
    if (!work.videoSrc || !videoRef.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    void videoRef.current.play().catch(() => {});
  };

  const stopHover = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const frame = (
    <div className="relative aspect-[9/16] w-full">
      <Image
        src={work.poster}
        alt=""
        fill
        aria-hidden
        sizes="200px"
        className="scale-[1.2] object-cover object-center blur-2xl opacity-70"
      />
      <Image
        src={work.poster}
        alt={label ?? ""}
        fill
        sizes="200px"
        loading="lazy"
        className="object-cover object-[center_top]"
      />
      {work.videoSrc && (
        <video
          ref={videoRef}
          src={work.videoSrc}
          poster={work.poster}
          muted
          loop
          playsInline
          preload="none"
          className="pointer-events-none absolute inset-0 size-full object-cover object-[center_top] opacity-0 transition-opacity [@media(pointer:fine)]:group-hover:opacity-100 [@media(pointer:fine)]:group-focus-within:opacity-100"
        />
      )}
      {showViews && (
        <span className="absolute left-2 top-2 rounded-pill bg-ink/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
          {work.views!.value}
        </span>
      )}
      {!work.videoSrc && work.platformUrl && (
        <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-ink/60 text-white backdrop-blur-sm">
          <ExternalLink className="size-3.5" aria-hidden />
        </span>
      )}
    </div>
  );

  const className =
    "group relative w-[160px] shrink-0 overflow-hidden rounded-2xl bg-ink text-left sm:w-[200px]";

  if (work.videoSrc) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => onOpenVideo(work)}
        onMouseEnter={playHover}
        onMouseLeave={stopHover}
        onFocus={playHover}
        onBlur={stopHover}
        aria-label={label ? `Смотреть: ${label}` : "Смотреть ролик"}
      >
        {frame}
        {label ? (
          <p className="truncate px-2 py-2 text-center text-[11px] font-medium text-white/80">{label}</p>
        ) : null}
      </button>
    );
  }

  if (work.platformUrl) {
    return (
      <a
        href={work.platformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label ? `Открыть оригинал: ${label}` : "Открыть оригинал"}
        title="Открыть оригинал"
      >
        {frame}
        {label ? (
          <p className="truncate px-2 py-2 text-center text-[11px] font-medium text-white/80">{label}</p>
        ) : null}
      </a>
    );
  }

  return null;
}

export function WorksMarquee({ items }: { items: Work[] }) {
  const reduce = useReducedMotion();
  const [modal, setModal] = useState<Work | null>(null);

  const playable = items.filter((w) => {
    const ok = Boolean(w.videoSrc || w.platformUrl);
    if (!ok && process.env.NODE_ENV !== "production") {
      console.warn(`[WorksMarquee] ${w.id}: нет videoSrc и platformUrl`);
    }
    return ok;
  });

  if (playable.length === 0) return null;

  const cards = playable.map((w) => (
    <WorkCard key={w.id} work={w} onOpenVideo={setModal} />
  ));

  return (
    <>
      {reduce ? (
        <div className="flex gap-3 overflow-x-auto px-2 pb-2 sm:px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards}
        </div>
      ) : (
        <div className="group/marquee relative overflow-hidden">
          <div
            className={cn(
              "flex w-max gap-3 animate-works-marquee",
              "group-hover/marquee:[animation-play-state:paused]",
              "group-focus-within/marquee:[animation-play-state:paused]",
            )}
          >
            {playable.map((w) => (
              <WorkCard key={`a-${w.id}`} work={w} onOpenVideo={setModal} />
            ))}
            {playable.map((w) => (
              <WorkCard key={`b-${w.id}`} work={w} onOpenVideo={setModal} />
            ))}
          </div>
        </div>
      )}

      <Modal
        open={Boolean(modal?.videoSrc)}
        onClose={() => setModal(null)}
        title={
          modal?.consent
            ? [modal.personName, modal.ageNote].filter(Boolean).join(" · ") || "Ролик"
            : "Ролик ученика"
        }
        size="lg"
        bare
      >
        {modal?.videoSrc && (
          <video
            key={modal.id}
            src={modal.videoSrc}
            poster={modal.poster}
            controls
            autoPlay
            playsInline
            className="mx-auto max-h-[80dvh] w-full max-w-md rounded-2xl bg-ink"
            data-autofocus
          />
        )}
      </Modal>
    </>
  );
}
