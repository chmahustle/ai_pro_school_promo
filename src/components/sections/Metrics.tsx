import { Counter, PlaceholderBadge, RevealGroup, RevealItem, Section, SectionHead } from "@/components/ui";
import { getPublishedMetrics } from "@/data/metrics";
import type { Metric } from "@/data/types";
import { cn, compactNumber } from "@/lib/utils";

interface MetricsProps {
  /** Переопределить набор метрик (для ЦА-лендингов) */
  items?: Metric[];
  title?: string;
  eyebrow?: string;
  description?: string;
  tone?: "bg" | "white" | "dark" | "lavender";
  columns?: 3 | 4;
  compact?: boolean;
}

/**
 * Блок ключевых метрик со счётчиками. По умолчанию показывает только опубликованные
 * (verified; unverified — по флагу; placeholder — только в dev и с бейджем).
 */
export function Metrics({
  items,
  title = "Школа в цифрах",
  eyebrow = "Факты",
  description,
  tone = "bg",
  columns = 4,
  compact,
}: MetricsProps) {
  const list = items ?? getPublishedMetrics();
  if (list.length === 0) return null;
  const invert = tone === "dark";

  const content = (
    <>
      {!compact && (
        <SectionHead eyebrow={eyebrow} title={title} description={description} invert={invert} eyebrowTone={invert ? "brand" : "brand"} />
      )}
      <RevealGroup as="ul" className={cn("grid gap-3 sm:gap-4", columns === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3")}>
        {list.map((m) => (
          <RevealItem
            as="li"
            key={m.id}
            className={cn(
              "relative flex flex-col justify-between gap-6 rounded-2xl p-5 sm:p-7",
              invert ? "bg-white/5 ring-1 ring-white/10" : "bg-surface shadow-soft",
            )}
          >
            {m.status !== "verified" && (
              <PlaceholderBadge status={m.status === "placeholder" ? "placeholder" : "unverified"} note={m.note} />
            )}
            <p className={cn("font-display text-3xl sm:text-4xl lg:text-[44px] leading-none", invert ? "text-white" : "text-ink")}>
              <Counter
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals}
                format={m.format === "compact" ? compactNumber : undefined}
              />
            </p>
            <div>
              <p className={cn("text-[15px] font-semibold leading-snug", invert ? "text-white" : "text-ink")}>{m.label}</p>
              {m.hint && <p className={cn("mt-1 text-[13px] leading-snug", invert ? "text-white/55" : "text-ink-500")}>{m.hint}</p>}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );

  if (compact) return <div>{content}</div>;
  return (
    <Section tone={tone} rounded={tone === "dark" || tone === "lavender"}>
      {content}
    </Section>
  );
}
