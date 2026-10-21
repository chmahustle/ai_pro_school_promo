"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type RibbonVariant = "pair" | "left" | "right" | "card";

interface RibbonProps {
  variant?: RibbonVariant;
  /** dark — тональная белая лента (12%) на тёмной панели, не сливается с фоном страницы и не режет текст; light — мягкий след на mesh */
  tone?: "dark" | "light";
  className?: string;
  /** Прорисовка линии при появлении (hero) */
  draw?: boolean;
  /** Своя непрозрачность линий (по умолчанию: dark 0.12, light 0.6) */
  opacity?: number;
  /** Цвет линий (по умолчанию белый); для светлых фонов — сиреневый и т.п. */
  color?: string;
}

/** Толстые S-кривые, выходящие за края панели (родитель — relative + overflow-hidden) */
const PATHS: Record<Exclude<RibbonVariant, "pair">, string[]> = {
  /** Для небольших карточек (~600×400): две пересекающие S-кривые */
  card: [
    "M-40 70C140 10 230 120 180 210C130 300 60 340 200 430",
    "M650 -30C470 40 400 150 460 230C520 310 640 330 560 430",
  ],
  left: ["M-180 -40C40 -20 160 140 130 300C90 500 -40 560 80 700C160 780 280 820 420 860"],
  right: ["M1580 -20C1260 40 1180 200 1220 360C1270 560 1420 600 1320 720C1240 800 1100 840 960 880"],
};

/**
 * Фоновая лента — слой за карточками. Лёгкий параллакс при скролле,
 * при prefers-reduced-motion статична. На мобильном тоньше (stroke в единицах viewBox).
 */
export function Ribbon({ variant = "pair", tone = "dark", className, draw, opacity, color }: RibbonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  const paths = variant === "pair" ? [...PATHS.left, ...PATHS.right] : PATHS[variant];
  const card = variant === "card";

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
      aria-hidden
    >
      <motion.svg
        className="absolute -inset-y-[4%] inset-x-0 h-[108%] w-full"
        style={reduce ? undefined : { y }}
        viewBox={card ? "0 0 600 400" : "0 0 1400 800"}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {paths.map((d) => (
          <motion.path
            key={d}
            d={d}
            {...(draw && !reduce
              ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.8, ease: "easeInOut" as const, delay: 0.2 } }
              : {})}
            stroke={color ?? "var(--color-surface)"}
            strokeOpacity={opacity ?? (tone === "dark" ? 0.12 : 0.6)}
            strokeWidth={card ? 44 : tone === "dark" ? 96 : 72}
            strokeLinecap="round"
          />
        ))}
      </motion.svg>
    </div>
  );
}
