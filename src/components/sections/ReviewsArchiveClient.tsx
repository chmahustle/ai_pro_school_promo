"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Button, HomeSection, Lightbox, Pill, type LightboxItem } from "@/components/ui";
import type { PublicTestimonial, PublicWork } from "@/data/public-types";
import { cn } from "@/lib/utils";

type Tab = "testimonials" | "receipts" | "works";

const TABS: { id: Tab; label: string }[] = [
  { id: "testimonials", label: "Отзывы" },
  { id: "receipts", label: "Чеки и переписки" },
  { id: "works", label: "Работы учеников" },
];

const GRID_CLASS =
  "grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6";

function parseTab(value: string | null): Tab {
  if (value === "receipts" || value === "works" || value === "testimonials") return value;
  return "testimonials";
}

/** Сколько карточек в двух рядах при текущей ширине */
function useTwoRowsPageSize() {
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const cols = w >= 1280 ? 6 : w >= 1024 ? 5 : w >= 640 ? 4 : 3;
      setPageSize(cols * 2);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return pageSize;
}

function MediaTile({
  poster,
  label,
  onClick,
  badge,
}: {
  poster: string;
  label?: string | null;
  onClick?: () => void;
  badge?: string;
}) {
  const inner = (
    <>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink sm:rounded-2xl">
        <Image
          src={poster}
          alt=""
          fill
          aria-hidden
          sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 16vw"
          className="scale-[1.2] object-cover object-center blur-2xl opacity-70"
        />
        <Image
          src={poster}
          alt={label ?? ""}
          fill
          sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 16vw"
          loading="lazy"
          className="object-cover object-[center_top]"
        />
        {badge && (
          <span className="absolute left-1.5 top-1.5 rounded-pill bg-ink/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm sm:left-2 sm:top-2 sm:text-[11px]">
            {badge}
          </span>
        )}
      </div>
      {label ? (
        <p className="mt-1.5 truncate text-center text-[11px] font-semibold text-ink sm:mt-2 sm:text-[12px]">
          {label}
        </p>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {inner}
      </button>
    );
  }
  return <div>{inner}</div>;
}

export function ReviewsArchiveClient({ testimonials: allT, works }: { testimonials: PublicTestimonial[]; works: PublicWork[] }) {
  const searchParams = useSearchParams();
  const pageSize = useTwoRowsPageSize();
  const [tab, setTab] = useState<Tab>(() => parseTab(searchParams.get("tab")));
  const [visible, setVisible] = useState(pageSize);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    setTab(parseTab(searchParams.get("tab")));
  }, [searchParams]);

  // Сброс при смене вкладки или размера страницы (2 ряда)
  useEffect(() => {
    setVisible(pageSize);
  }, [tab, pageSize]);

  const videoItems = useMemo(() => allT.filter((t) => t.type === "testimonial"), [allT]);
  const proofItems = useMemo(
    () => allT.filter((t) => t.type === "receipt" || t.type === "chat"),
    [allT],
  );

  const labelOf = (t: PublicTestimonial) => t.label;

  const currentListLength =
    tab === "testimonials"
      ? videoItems.length
      : tab === "receipts"
        ? proofItems.length
        : works.length;

  const showMore = () => setVisible((n) => Math.min(n + pageSize, currentListLength));
  const hasMore = visible < currentListLength;

  const lightboxItems: LightboxItem[] = useMemo(() => {
    const source = tab === "testimonials" ? videoItems : proofItems;
    return source.map((t) => ({
      id: t.id,
      src: t.imageSrc ?? t.poster,
      alt: t.alt,
      caption: t.type === "receipt" || t.type === "chat" ? "Данные скрыты" : (labelOf(t) ?? undefined),
      kind: t.type === "receipt" ? "receipt" : t.type === "chat" ? "chat" : "video",
      embedUrl: t.embedUrl ?? undefined,
    }));
  }, [tab, videoItems, proofItems]);

  const openById = (id: string) => {
    const idx = lightboxItems.findIndex((m) => m.id === id);
    if (idx >= 0) setLightbox(idx);
  };

  return (
    <HomeSection id="reviews-archive" labelledBy="archive-title">
      <div className="mx-auto mb-10 flex max-w-[640px] flex-col items-center text-center sm:mb-12">
        <Pill tone="brand" dot>
          Архив
        </Pill>
        <h2 id="archive-title" className="mt-4 text-display-md text-ink">
          Все отзывы и результаты
        </h2>
        <p className="mt-3 max-w-[640px] text-base text-ink-500 [text-wrap:balance] sm:text-lg">
          Видеоотзывы, оплаты, переписки и ролики учеников.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Тип материалов"
        className="mb-8 flex flex-wrap items-center justify-center gap-2"
      >
        {TABS.map((t) => {
          const count =
            t.id === "testimonials"
              ? videoItems.length
              : t.id === "receipts"
                ? proofItems.length
                : works.length;
          if (count === 0) return null;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors",
                active ? "bg-ink text-white" : "bg-surface text-ink-700 shadow-soft hover:bg-soft-100",
              )}
            >
              {t.label}
              <span className={cn("text-[12px]", active ? "text-white/70" : "text-ink-500")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "testimonials" && (
        <ul className={GRID_CLASS}>
          {videoItems.slice(0, visible).map((t) => (
            <li key={t.id}>
              <MediaTile
                poster={t.poster}
                label={labelOf(t)}
                onClick={t.embedUrl ? () => openById(t.id) : undefined}
              />
            </li>
          ))}
        </ul>
      )}

      {tab === "receipts" && (
        <ul className={GRID_CLASS}>
          {proofItems.slice(0, visible).map((t) => (
            <li key={t.id}>
              <MediaTile
                poster={t.poster}
                label={labelOf(t)}
                onClick={() => openById(t.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {tab === "works" && (
        <ul className={GRID_CLASS}>
          {works.slice(0, visible).map((w) => (
            <li key={w.id}>
              <WorkArchiveCard work={w} />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button type="button" variant="outline" onClick={showMore}>
            Показать ещё
          </Button>
        </div>
      )}

      <Lightbox
        items={lightboxItems}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    </HomeSection>
  );
}

function WorkArchiveCard({ work }: { work: PublicWork }) {
  const label = work.label;
  const badge = work.badge ?? undefined;
  const body = (
    <>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink sm:rounded-2xl">
        <Image
          src={work.poster}
          alt={label ?? ""}
          fill
          sizes="(max-width:640px) 33vw, (max-width:1024px) 25vw, 16vw"
          loading="lazy"
          className="object-cover object-[center_top]"
        />
        {badge && (
          <span className="absolute left-1.5 top-1.5 rounded-pill bg-ink/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm sm:left-2 sm:top-2 sm:text-[11px]">
            {badge}
          </span>
        )}
        {work.platformUrl && (
          <span className="absolute bottom-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-ink/60 text-white sm:bottom-2 sm:right-2 sm:size-8">
            <ExternalLink className="size-3 sm:size-3.5" aria-hidden />
          </span>
        )}
      </div>
      {label ? (
        <p className="mt-1.5 truncate text-center text-[11px] font-semibold text-ink sm:mt-2 sm:text-[12px]">
          {label}
        </p>
      ) : null}
    </>
  );

  if (work.platformUrl) {
    return (
      <a
        href={work.platformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={label ? `Открыть оригинал: ${label}` : "Открыть оригинал"}
      >
        {body}
      </a>
    );
  }
  return <div>{body}</div>;
}
