import { ArrowDown, ArrowRight, Quote } from "lucide-react";
import { Avatar, Button, Pill, PlaceholderBadge, RevealGroup, RevealItem, Section, SectionHead } from "@/components/ui";
import type { ResultCase } from "@/data/types";
import { cn } from "@/lib/utils";

interface ResultsGridProps {
  items: ResultCase[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender" | "dark";
  /** Ссылка «Все результаты» */
  moreHref?: string;
  /** Без обёртки Section (для встраивания) */
  bare?: boolean;
  /** Первая карточка — большая (bento) */
  featured?: boolean;
}

/**
 * Кейсы «до / после». На главной — bento (первая карточка крупнее), на лендингах — ровная сетка.
 */
export function ResultsGrid({
  items,
  eyebrow = "Результаты учеников",
  title = "Они начали с нуля — вот что получилось",
  description = "Люди без технического образования, которые освоили ИИ.",
  tone = "bg",
  moreHref,
  bare,
  featured = true,
}: ResultsGridProps) {
  if (items.length === 0) return null;
  const invert = tone === "dark";

  const grid = (
    <RevealGroup as="ul" className={cn("grid gap-3 sm:gap-4", "md:grid-cols-2 lg:grid-cols-3")}>
      {items.map((r, i) => {
        const isFeatured = featured && i === 0;
        return (
          <RevealItem
            as="li"
            key={r.id}
            className={cn(isFeatured && "md:col-span-2 lg:col-span-2 lg:row-span-1")}
          >
            <ResultCard item={r} featured={isFeatured} invert={invert} />
          </RevealItem>
        );
      })}
    </RevealGroup>
  );

  if (bare) return grid;

  return (
    <Section tone={tone} rounded={tone === "dark" || tone === "lavender"}>
      <SectionHead
        eyebrow={eyebrow}
        title={title}
        description={description}
        invert={invert}
        eyebrowTone={invert ? "brand" : "brand"}
        aside={
          moreHref ? (
            <Button variant={invert ? "white" : "outline"} href={moreHref} icon={<ArrowRight className="size-4" />}>
              Все результаты
            </Button>
          ) : undefined
        }
      />
      {grid}
    </Section>
  );
}

export function ResultCard({ item, featured, invert }: { item: ResultCase; featured?: boolean; invert?: boolean }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-5 rounded-2xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card sm:p-7",
        invert ? "bg-white/5 text-white ring-1 ring-white/10" : "bg-surface text-ink shadow-soft",
        featured && "lg:flex-row lg:gap-8",
      )}
    >
      {item.status !== "verified" && (
        <PlaceholderBadge status={item.status === "placeholder" ? "placeholder" : "unverified"} note={item.note} />
      )}

      <div className={cn("flex flex-col gap-5", featured && "lg:flex-1")}>
        <header className="flex items-center gap-3">
          <Avatar name={item.name} src={item.photo} size="md" placeholder={!item.photo} />
          <div className="min-w-0">
            <h3 className="font-sans text-[15px] font-bold leading-tight">{item.name}</h3>
            {item.context && <p className={cn("text-[13px]", invert ? "text-white/60" : "text-ink-500")}>{item.context}</p>}
          </div>
        </header>

        <p className={cn("font-display leading-tight", featured ? "text-display-sm sm:text-display-md" : "text-xl")}>{item.headline}</p>

        {item.quote && (
          <p className={cn("flex gap-2 text-[15px] italic leading-relaxed", invert ? "text-white/70" : "text-ink-500")}>
            <Quote className="mt-1 size-4 shrink-0 opacity-50" aria-hidden />
            {item.quote}
          </p>
        )}
      </div>

      <div className={cn("flex flex-col gap-2", featured && "lg:w-[46%]")}>
        <div className={cn("rounded-xl p-4", invert ? "bg-white/5" : "bg-bg")}>
          <Pill tone={invert ? "outline" : "neutral"} size="sm" className={cn("mb-2", invert && "border-white/20 text-white/70")}>
            До
          </Pill>
          <p className={cn("text-[14px] leading-snug", invert ? "text-white/70" : "text-ink-500")}>{item.before}</p>
        </div>
        <ArrowDown className={cn("mx-auto size-4", invert ? "text-white/40" : "text-ink-300")} aria-hidden />
        <div className={cn("rounded-xl p-4", invert ? "bg-brand-50 text-ink" : "bg-brand-50")}>
          <Pill tone={invert ? "dark" : "brand"} size="sm" className="mb-2">
            После
          </Pill>
          <p className="text-[14px] font-medium leading-snug">{item.after}</p>
        </div>
      </div>
    </article>
  );
}
