"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/ui";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const ALLOWED = new Set(["testimonial", "receipt", "chat"]);

function useSaveData() {
  const [save, setSave] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    setSave(Boolean(nav.connection?.saveData));
  }, []);
  return save;
}

function slideLabel(item: Testimonial) {
  if (!item.consent) return null;
  const parts = [item.personName, item.caption].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

function MediaFrame({
  poster,
  children,
  className,
}: {
  poster?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-ink", className)}>
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          aria-hidden
          sizes="320px"
          className="scale-[1.2] object-cover object-center blur-2xl opacity-80"
        />
      ) : null}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export function TestimonialsCarousel({
  items,
  moreCount,
}: {
  items: Testimonial[];
  moreCount: number;
}) {
  const searchParams = useSearchParams();
  const motionForce = searchParams.get("motion") === "force";
  const reduce = useReducedMotion();
  const saveData = useSaveData();
  const noAuto = Boolean((reduce && !motionForce) || saveData);

  const hasCta = moreCount > 0;
  const ctaIndex = hasCta ? items.length : -1;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    for (const item of items) {
      if (!ALLOWED.has(item.type)) {
        console.error(
          `[TestimonialsCarousel] недопустимый type в карусели: ${item.id} type=${item.type}`,
        );
      }
    }
  }, [items]);

  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      stopOnLastSnap: false,
      playOnInit: !noAuto,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplay.current],
  );

  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const safePlay = useCallback(() => {
    if (noAuto || !emblaApi) return;
    try {
      autoplay.current.play();
    } catch {
      /* plugin not ready */
    }
  }, [emblaApi, noAuto]);

  const safeStop = useCallback(() => {
    if (!emblaApi) return;
    try {
      autoplay.current.stop();
    } catch {
      /* plugin not ready */
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || noAuto) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && lightbox === null) safePlay();
        else safeStop();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [noAuto, lightbox, safePlay, safeStop]);

  useEffect(() => {
    if (noAuto) safeStop();
  }, [noAuto, safeStop]);

  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      items.map((t) => {
        if (t.type === "testimonial") {
          return {
            id: t.id,
            src: t.poster,
            alt: slideLabel(t) || "Видеоотзыв",
            kind: "video" as const,
            embedUrl: t.embedUrl ?? undefined,
          };
        }
        return {
          id: t.id,
          src: t.imageSrc ?? t.poster,
          alt: t.personName ?? "Скриншот",
          caption: "Данные скрыты",
          kind: t.type === "receipt" ? ("receipt" as const) : ("chat" as const),
        };
      }),
    [items],
  );

  const openLightbox = (index: number) => {
    setLightbox(index);
    safeStop();
  };

  const closeLightbox = () => {
    setLightbox(null);
    safePlay();
  };

  const onSlideClick = (index: number, item: Testimonial) => {
    if (index !== selected) {
      scrollTo(index);
      return;
    }
    if (item.type === "testimonial" && (item.embedUrl || item.videoSrc)) {
      openLightbox(index);
      return;
    }
    if (item.type === "receipt" || item.type === "chat") {
      openLightbox(index);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root || lightbox !== null) return;
      if (!root.contains(document.activeElement) && document.activeElement !== root) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollPrev, scrollNext, lightbox]);

  if (items.length === 0) return null;

  const arrowBtn =
    "grid size-12 place-items-center rounded-full bg-surface text-ink shadow-soft hover:bg-soft-100";

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className="relative outline-none"
      aria-roledescription="carousel"
      aria-label="Отзывы учеников"
      aria-live="off"
    >
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {items.map((item, index) => {
              const active = index === selected;
              const isVideo = item.type === "testimonial";
              const label = slideLabel(item);
              const showViews = item.views?.verified === true;
              const canOpen =
                isVideo
                  ? Boolean(item.embedUrl || item.videoSrc)
                  : item.type === "receipt" || item.type === "chat";
              return (
                <div
                  key={item.id}
                  className="min-w-0 shrink-0 grow-0 basis-[80%] px-2 sm:basis-[clamp(240px,22vw,320px)]"
                  aria-roledescription="slide"
                  aria-label={label || `Слайд ${index + 1}`}
                  aria-hidden={!active}
                >
                  <button
                    type="button"
                    onClick={() => onSlideClick(index, item)}
                    className={cn(
                      "block w-full text-left transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
                      active ? "scale-100 opacity-100" : "scale-[0.88] opacity-60",
                    )}
                  >
                    <MediaFrame poster={item.poster}>
                      <Image
                        src={item.poster}
                        alt={label || ""}
                        fill
                        sizes="(max-width:768px) 80vw, 320px"
                        className="object-cover object-[center_top]"
                        loading={index < 3 ? "eager" : "lazy"}
                        priority={index < 2}
                      />
                      {showViews && (
                        <span className="absolute left-2 top-2 z-10 rounded-pill bg-ink/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                          {item.views!.value}
                        </span>
                      )}
                      {isVideo && canOpen && (
                        <span className="absolute inset-0 z-10 grid place-items-center">
                          <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-float">
                            <Play className="ml-0.5 size-5 fill-current" aria-hidden />
                          </span>
                        </span>
                      )}
                    </MediaFrame>
                    {label ? (
                      <p className="mt-3 text-center text-[13px] font-semibold text-ink">{label}</p>
                    ) : null}
                  </button>
                </div>
              );
            })}

            {hasCta && (
              <div
                className="min-w-0 shrink-0 grow-0 basis-[80%] px-2 sm:basis-[clamp(240px,22vw,320px)]"
                aria-roledescription="slide"
                aria-label={`Ещё ${moreCount} отзывов`}
                aria-hidden={selected !== ctaIndex}
              >
                <div
                  className={cn(
                    "transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
                    selected === ctaIndex ? "scale-100 opacity-100" : "scale-[0.88] opacity-60",
                  )}
                >
                  <MediaFrame className="bg-gradient-home">
                    <div className="flex size-full flex-col items-center justify-center gap-5 px-5 text-center">
                      <p className="font-display text-[clamp(22px,2.4vw,28px)] font-bold leading-tight tracking-[-0.02em] text-ink">
                        Ещё {moreCount} отзывов
                      </p>
                      {/* Светлая кнопка → при hover насыщенный brand */}
                      <Link
                        href="/reviews?tab=testimonials"
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 text-sm font-bold text-ink shadow-soft ring-1 ring-ink/10 transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-[#e8307e] hover:text-white hover:shadow-[0_8px_24px_rgba(232,48,126,0.4)] hover:ring-[#e8307e] active:scale-[0.98]"
                      >
                        Смотреть все
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </MediaFrame>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Предыдущий слайд"
          className={cn(arrowBtn, "absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 lg:grid")}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Следующий слайд"
          className={cn(arrowBtn, "absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:grid")}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 lg:hidden">
        <button type="button" onClick={scrollPrev} aria-label="Предыдущий слайд" className={arrowBtn}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={scrollNext} aria-label="Следующий слайд" className={arrowBtn}>
          <ChevronRight className="size-5" />
        </button>
      </div>

      <Lightbox
        items={lightboxItems}
        index={lightbox}
        onClose={closeLightbox}
        onChange={setLightbox}
      />
    </div>
  );
}
