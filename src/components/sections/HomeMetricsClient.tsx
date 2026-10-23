"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Counter, HomeSection, SectionIntro } from "@/components/ui";
import type { PublicHeroResult, PublicMetric } from "@/data/public-types";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * «Школа в цифрах» — бенто на тёмной панели с тонкими лентами (как в референсе): высокая розовая плитка,
 * тёмные и белая плитки разной ширины и нижняя полоса-пилюли с регионами. Скрыта, пока подтверждено меньше 3 цифр.
 */
export function HomeMetricsClient({ items, chips }: { items: PublicMetric[]; chips: Pick<PublicHeroResult, "id" | "name" | "result">[] }) {
  const reduce = useReducedMotion();

  if (items.length < 3) return null;

  const featured = items.find((m) => m.featured) ?? items[0]!;
  const [views, followers, check, geo] = items.filter((m) => m.id !== featured.id);
  const item = (children: ReactNode, className: string) => (
    <motion.div className={cn("min-h-0", className)} variants={cardVariants(reduce)}>
      {children}
    </motion.div>
  );

  return (
    <HomeSection labelledBy="metrics-title" tone="dark" ribbon="pair" compact className="pt-10 sm:pt-12">
      <SectionIntro
        id="metrics-title"
        tone="dark"
        align="left"
        eyebrow="Факты"
        title="Школа в цифрах"
        description="Только то, что можем подтвердить."
      />

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
      >
        {item(<FeaturedCard metric={featured} chips={chips} />, "sm:col-span-2 lg:col-span-5 lg:row-span-2")}
        {views && item(<StatCard metric={views} tone="glass" />, "lg:col-span-4")}
        {followers && item(<StatCard metric={followers} tone="white" />, "lg:col-span-3")}
        {check && item(<StatCard metric={check} tone="white" />, geo ? "lg:col-span-4" : "lg:col-span-7")}
        {geo && item(<StatCard metric={geo} tone="glass" />, "lg:col-span-3")}
      </motion.div>
    </HomeSection>
  );
}

function cardVariants(reduce: boolean | null) {
  return {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: easeOut } },
  };
}

type Tone = "pink" | "white" | "glass" | "lavender" | "brand";

/** Плитки в языке референса: светло-розовая, белая, тёмная (стекло), сиреневая, магента */
const TONES: Record<Tone, { tile: string; num: string; unit: string; label: string; hint: string }> = {
  pink: { tile: "bg-brand-100 text-ink", num: "text-ink", unit: "text-brand-700", label: "text-ink", hint: "text-ink-700/70" },
  white: { tile: "bg-surface text-ink", num: "text-ink", unit: "text-brand", label: "text-ink", hint: "text-ink-500" },
  glass: { tile: "bg-white/[0.07] text-white ring-1 ring-white/10", num: "text-white", unit: "text-brand", label: "text-white", hint: "text-white/60" },
  lavender: { tile: "bg-lavender text-ink", num: "text-ink", unit: "text-brand-700", label: "text-ink", hint: "text-ink-500" },
  brand: { tile: "bg-brand text-white", num: "text-white", unit: "text-brand-100", label: "text-white", hint: "text-white/80" },
};

const tileBase = "relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:p-6";

/** Число + единица: baseline, nowrap, единица мельче */
function MetricValue({ metric, size, tone }: { metric: PublicMetric; size: "lg" | "sm"; tone: Tone }) {
  const t = TONES[tone];
  const label = `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""}`;
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-baseline whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.015em]",
        size === "lg" ? "text-[clamp(44px,4.2vw,64px)]" : "text-[clamp(32px,3vw,44px)]",
      )}
      aria-label={label}
    >
      {metric.prefix ? <span className={cn("text-[0.4em] font-bold", t.unit)}>{metric.prefix}</span> : null}
      <Counter value={metric.value} duration={1200} decimals={metric.decimals} className={t.num} />
      {metric.suffix ? (
        <span className={cn("ml-[0.08em] whitespace-nowrap text-[0.4em] font-bold", t.unit)}>{metric.suffix.trimStart()}</span>
      ) : null}
    </span>
  );
}

/** Подпись источника — приходит только в dev (metric.devSource) */
function SourceLine({ metric, className }: { metric: PublicMetric; className?: string }) {
  if (!metric.devSource) return null;
  return <p className={cn("mt-auto pt-3 text-[12px] leading-snug opacity-50", className)}>{metric.devSource}</p>;
}

function FeaturedCard({ metric, chips }: { metric: PublicMetric; chips: Pick<PublicHeroResult, "id" | "name" | "result">[] }) {
  const t = TONES.brand;
  return (
    <article className={cn(tileBase, t.tile, "p-6 sm:p-7")}>
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <MetricValue metric={metric} size="lg" tone="brand" />
          <p className={cn("mt-3 text-base font-bold leading-snug sm:text-lg", t.label)}>{metric.label}</p>
          {metric.hint && <p className={cn("mt-1 max-w-[34ch] text-[14px] leading-snug", t.hint)}>{metric.hint}</p>}
        </div>

        {chips.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2" aria-label="Примеры результатов">
            {chips.map((c) => (
              <li key={c.id} className="flex items-center gap-2 rounded-pill bg-dark py-1 pl-3.5 pr-1 text-[12px] font-semibold text-white">
                {c.name}
                <span className="whitespace-nowrap rounded-pill bg-brand-100 px-2.5 py-1 text-[12px] font-bold text-brand-700">{c.result}</span>
              </li>
            ))}
          </ul>
        )}
        <SourceLine metric={metric} className="pt-0" />
      </div>
    </article>
  );
}

function StatCard({ metric, tone }: { metric: PublicMetric; tone: Tone }) {
  const t = TONES[tone];
  const isGeo = metric.id === "geo" && metric.pills?.length;
  return (
    <article className={cn(tileBase, t.tile)}>
      <MetricValue metric={metric} size="sm" tone={tone} />
      <p className={cn("mt-3 text-[15px] font-bold leading-snug", t.label)}>{metric.label}</p>
      {metric.hint && !isGeo && <p className={cn("mt-1 text-[13px] leading-snug", t.hint)}>{metric.hint}</p>}
      {isGeo && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {metric.pills!.map((p) => (
            <span key={p} className="rounded-pill bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-white/90">
              {p}
            </span>
          ))}
        </div>
      )}
      <SourceLine metric={metric} />
    </article>
  );
}
