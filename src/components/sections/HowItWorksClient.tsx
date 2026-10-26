"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal, Section, SectionIntro } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import type { PublicPaths, PublicPathStep } from "@/data/public-types";
import { cn, nbspDash, noBreakHyphen } from "@/lib/utils";

type Direction = "creator" | "vibecoding";

interface HowItWorksClientProps {
  data: PublicPaths;
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender" | "dark";
}

/**
 * Линия пути (viewBox 1200×400) по числу шагов: проходит через центры колонок (x = (i+0.5)·1200/n) на высоте 200px,
 * между узлами плавно изгибается вверх и вниз. Карточки чередуются: ниже линии / выше линии.
 */
function buildPath(n: number): string {
  const col = 1200 / n;
  const xs = Array.from({ length: n }, (_, i) => (i + 0.5) * col);
  let d = `M0,200 C${xs[0]! * 0.4},200 ${xs[0]! * 0.6},200 ${xs[0]},200`;
  for (let i = 1; i < n; i++) {
    const a = xs[i - 1]!;
    const b = xs[i]!;
    const y = i % 2 === 1 ? 155 : 245;
    d += ` C${a + (b - a) * 0.37},${y} ${a + (b - a) * 0.63},${y} ${b},200`;
  }
  return `${d} C${xs[n - 1]! + col * 0.2},222 ${xs[n - 1]! + col * 0.4},214 1200,206`;
}

/**
 * Путь ученика на толстой линии слева направо, переключатель «Креаторство / Вайб-кодинг». Розовым выделена только входная ступень (метка «Начните с этого»), остальные — белые или лавандовые, одинаково в обеих вкладках.
 * Линия прорисовывается по мере прокрутки, узлы-номера загораются, когда линия до них доходит; карточки чередуются
 * сверху и снизу (≥lg), на мобильном — вертикальная линия слева. Оба пути лежат стопкой в одной ячейке сетки (неактивный скрыт visibility + inert),
 * поэтому высота блока по максимуму из путей и не прыгает при переключении вкладок.
 */
export function HowItWorksClient({
  data,
  eyebrow = "Как это работает",
  title = "Как устроен путь: шаг за шагом",
  description = "Каждый шаг про конкретный навык",
  tone = "lavender",
}: HowItWorksClientProps) {
  const [direction, setDirection] = useState<Direction>(data.tabs[0]?.id ?? "creator");
  const invert = tone === "dark";
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 70%", "end 55%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(draw, "change", setProgress);

  const card = (st: PublicPathStep, i: number, n: number) => {
    const last = i === n - 1 && !st.isEntry;
    return (
      <div
        className={cn(
          "rounded-[24px] p-5",
          st.isEntry ? "bg-brand-100 text-ink" : last ? "bg-soft-100 text-ink ring-1 ring-[#d3cdf7]" : invert ? "bg-white/5 ring-1 ring-white/10" : "bg-surface shadow-soft",
        )}
      >
        {st.isEntry && (
          <span className="mb-2 inline-flex h-7 items-center rounded-pill bg-brand-600 px-3 text-[12px] font-semibold text-white">{data.entryBadge}</span>
        )}
        <h3 className={cn("font-display text-[17px] leading-tight", invert && !st.isEntry && !last && "text-white")}>{nbspDash(st.title)}</h3>
        {st.text && (
          <p className={cn("mt-1.5 text-[13.5px] leading-snug", st.isEntry || last ? "text-ink-700" : invert ? "text-white/65" : "text-ink-500")}>{nbspDash(st.text)}</p>
        )}
        {st.price && <ProductPrice parts={st.price} className={cn("mt-2 block font-display text-[18px] font-extrabold", invert && !st.isEntry && !last ? "text-white" : "text-ink")} />}
      </div>
    );
  };

  return (
    <Section tone={tone} rounded className="relative">
      <SectionIntro id="how-title" align="left" tone={invert ? "dark" : "light"} eyebrow={eyebrow} title={title} description={description} />

      <div role="tablist" aria-label="Путь по направлению" className="-mt-4 mb-8 flex flex-wrap gap-2">
        {data.tabs.map((t) => {
          const on = t.id === direction;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setDirection(t.id)}
              className={cn(
                "inline-flex h-11 items-center rounded-pill px-5 text-[14px] font-semibold transition-colors duration-200",
                "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand",
                on ? "bg-ink text-white" : invert ? "bg-white/10 text-white/80 hover:bg-white/20" : "bg-surface text-ink-700 hover:bg-soft-100",
              )}
            >
              {noBreakHyphen(t.label)}
            </button>
          );
        })}
      </div>

      {/* Оба пути в одной ячейке сетки: высота блока — по самому высокому, переключение вкладок без прыжка */}
      <div ref={trackRef} className="relative grid">
        {data.tabs.map((tab) => {
          const steps = data.paths[tab.id];
          const active = tab.id === direction;
          const path = buildPath(steps.length);
          const reached = (i: number) => reduce || progress >= (i + 0.5) / steps.length - 0.04;
          return (
            <div key={tab.id} aria-hidden={!active || undefined} inert={!active || undefined} className={cn("relative [grid-area:1/1]", !active && "invisible pointer-events-none")}>
              {/* Линия: на ≥lg горизонтальная через центры колонок, на мобильном — вертикальная слева (декор, без содержимого) */}
              <svg aria-hidden viewBox="0 0 1200 400" preserveAspectRatio="none" className="pointer-events-none absolute left-0 top-0 hidden h-[400px] w-full overflow-visible lg:block">
                <path d={path} fill="none" stroke={invert ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.85)"} strokeWidth="26" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <motion.path d={path} fill="none" stroke="#B8A6FF" strokeWidth="26" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : draw }} />
              </svg>
              <div aria-hidden className={cn("absolute bottom-6 left-6 top-6 w-3 -translate-x-1/2 rounded-full lg:hidden", invert ? "bg-white/10" : "bg-white/85")} />
              <motion.div
                aria-hidden
                className="absolute bottom-6 left-6 top-6 w-3 origin-top -translate-x-1/2 rounded-full bg-[#B8A6FF] lg:hidden"
                style={{ scaleY: reduce ? 1 : draw }}
              />

              {/* Список шагов: на мобильном колонка с узлом слева, на ≥lg — колонки по числу шагов, карточки выше/ниже линии */}
              <ol className="relative flex flex-col gap-4 lg:grid lg:h-[400px] lg:gap-0" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                {steps.map((st, i) => {
                  const above = i % 2 === 1;
                  return (
                    <li key={st.n} className="relative pl-16 lg:px-2 lg:pl-2" style={{ gridColumn: i + 1, gridRow: 1 }}>
                      <div className="absolute left-0 top-1.5 z-10 lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
                        <span
                          className={cn(
                            "grid size-12 place-items-center rounded-full font-display text-[15px] ring-8 transition-colors duration-500",
                            st.isEntry
                              ? "bg-brand-600 text-white ring-brand/20"
                              : reached(i)
                                ? "bg-ink text-white ring-[#B8A6FF]/40"
                                : invert
                                  ? "bg-white/15 text-white ring-white/10"
                                  : "bg-surface text-ink ring-lavender",
                          )}
                        >
                          {st.n}
                        </span>
                      </div>
                      <Reveal className={cn("lg:absolute lg:inset-x-2", above ? "lg:bottom-[calc(50%+40px)]" : "lg:top-[calc(50%+40px)]")}>{card(st, i, steps.length)}</Reveal>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
