"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PublicLadderStep } from "@/data/public-types";

const STAR = "M50 6C53.4 32.6 67.4 46.6 94 50C67.4 53.4 53.4 67.4 50 94C46.6 67.4 32.6 53.4 6 50C32.6 46.6 46.6 32.6 50 6Z";

/**
 * Декор по роли карточки (не по позиции): входная — большая четырёхконечная звезда, средняя — кольцо с толстой линией,
 * флагман — плотный мягкий блоб; рядом две маленькие звёздочки. Фигура ~60% ширины карточки, уходит за правый нижний угол
 * (обрезается overflow карточки), лежит позади текста (-z-10 в isolate-карточке), верх — не выше начала блока цены.
 * Один раз плавно появляется при входе в экран; при reduced-motion — сразу, без анимации.
 * Движение при hover — в globals.css (.step-card), только для мыши (hover + fine pointer).
 */
export function StepDecor({ tier }: { tier: PublicLadderStep["tier"] }) {
  const reduce = useReducedMotion();
  const spark = tier === "project" ? "#e8307e" : "#ffffff";
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -right-[30%] top-6 -z-10 aspect-square w-[70%]"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 100 100" className={`step-fig step-fig-${tier} size-full overflow-visible`}>
        {tier === "try" && <path fill="#ffffff" fillOpacity="0.85" d={STAR} />}
        {tier === "project" && (
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e8307e" strokeOpacity="0.4" strokeWidth="3.5" vectorEffect="non-scaling-stroke" />
        )}
        {tier === "profession" && (
          <path fill="#b8a6ff" fillOpacity="0.55" d="M52 3C76 4 97 24 97 48C97 74 77 97 51 97C26 97 3 78 3 52C3 26 28 2 52 3Z" />
        )}
      </svg>
      <svg viewBox="0 0 100 100" className="step-spark step-spark-a absolute -left-[2%] top-[14%] w-[16%]">
        <path fill={spark} fillOpacity="0.9" d={STAR} />
      </svg>
      <svg viewBox="0 0 100 100" className="step-spark step-spark-b absolute left-[14%] top-[0%] w-[10%]">
        <path fill={spark} fillOpacity="0.9" d={STAR} />
      </svg>
    </motion.span>
  );
}
