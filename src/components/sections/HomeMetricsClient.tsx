"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Counter, HomeSection, SectionIntro } from "@/components/ui";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import type { PublicMetric } from "@/data/public-types";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * «Школа в цифрах» — бенто на тёмной панели с лентами: большая карточка «Учеников» слева, справа две средние
 * (просмотры, подписчики) и широкая нижняя «Потоков практикума». Карточка без подтверждения (подписчики) в проде не приходит —
 * тогда просмотры занимают всю верхнюю строку и дыры нет (4 → 3 карточки). Скрыта, пока подтверждено меньше 3 цифр.
 */
export function HomeMetricsClient({ items, description }: { items: PublicMetric[]; description: string }) {
  const reduce = useReducedMotion();

  if (items.length < 3) return null;

  const featured = items.find((m) => m.featured) ?? items[0]!;
  const byId = (id: string) => items.find((m) => m.id === id && m.id !== featured.id);
  const views = byId("views");
  const followers = byId("followers");
  const streams = byId("streams");
  // Остальные метрики (если добавят новые) — обычными карточками после широкой
  const rest = items.filter((m) => ![featured.id, "views", "followers", "streams"].includes(m.id));
  const item = (children: ReactNode, className: string) => (
    <motion.div className={cn("min-h-0", className)} variants={cardVariants(reduce)}>
      {children}
    </motion.div>
  );

  return (
    <HomeSection labelledBy="metrics-title" tone="dark" ribbon="pair" compact className="pt-10 sm:pt-12">
      <SectionIntro id="metrics-title" tone="dark" align="left" eyebrow="Факты" title="Школа в цифрах" description={description} />

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
      >
        {item(<FeaturedCard metric={featured} />, "sm:col-span-2 lg:col-span-5 lg:row-span-2")}
        {views && item(<StatCard metric={views} tone="glass" />, followers ? "lg:col-span-4" : "sm:col-span-2 lg:col-span-7")}
        {followers && item(<StatCard metric={followers} tone="white" />, views ? "lg:col-span-3" : "sm:col-span-2 lg:col-span-7")}
        {streams && item(<StatCard metric={streams} tone="lavender" wide />, "sm:col-span-2 lg:col-span-7")}
        {rest.map((m) => item(<StatCard key={m.id} metric={m} tone="white" />, "lg:col-span-4"))}
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

/** Подпись источника на карточке («Данные школы»); в dev — с датой проверки */
function SourceLine({ metric, className }: { metric: PublicMetric; className?: string }) {
  const text = metric.devSource ?? metric.source;
  if (!text) return null;
  return <p className={cn("mt-auto pt-3 text-[12px] leading-snug opacity-60", className)}>{text}</p>;
}

function FeaturedCard({ metric }: { metric: PublicMetric }) {
  const t = TONES.brand;
  return (
    <article className={cn(tileBase, t.tile, "p-6 sm:p-7")}>
      {metric.devUnverified && <PlaceholderBadge status="unverified" />}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <MetricValue metric={metric} size="lg" tone="brand" />
          <p className={cn("mt-3 text-base font-bold leading-snug sm:text-lg", t.label)}>{metric.label}</p>
          {metric.hint && <p className={cn("mt-1 max-w-[34ch] text-[14px] leading-snug", t.hint)}>{metric.hint}</p>}
        </div>
        <SourceLine metric={metric} />
      </div>
    </article>
  );
}

function StatCard({ metric, tone, wide = false }: { metric: PublicMetric; tone: Tone; wide?: boolean }) {
  const t = TONES[tone];
  return (
    <article className={cn(tileBase, t.tile, wide && "sm:flex-row sm:items-end sm:justify-between sm:gap-6")}>
      {metric.devUnverified && <PlaceholderBadge status="unverified" />}
      <div>
        <MetricValue metric={metric} size="sm" tone={tone} />
        <p className={cn("mt-3 text-[15px] font-bold leading-snug", t.label)}>{metric.label}</p>
        {metric.hint && <p className={cn("mt-1 text-[13px] leading-snug", t.hint)}>{metric.hint}</p>}
      </div>
      <SourceLine metric={metric} className={wide ? "sm:mt-0 sm:pt-0" : undefined} />
    </article>
  );
}
