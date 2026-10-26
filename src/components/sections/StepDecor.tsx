"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PublicLadderStep } from "@/data/public-types";

const STAR = "M50 4C53.6 32.4 67.6 46.4 96 50C67.6 53.6 53.6 67.6 50 96C46.4 67.6 32.4 53.6 4 50C32.4 46.4 46.4 32.4 50 4Z";

/** Размер и позиция фигуры по роли карточки: уходит за правый край (и вниз), обрезается overflow карточки */
const place: Record<PublicLadderStep["tier"], string> = {
  try: "-right-[28%] top-[22%] w-[82%]",
  project: "-right-[36%] -bottom-[28%] w-[92%]",
  profession: "-right-[30%] -bottom-[22%] w-[88%]",
};

/**
 * Декор по роли карточки (не по позиции), по мотивам прежних карточек аудиторий: входная — крупная четырёхконечная звезда
 * (лавандовая на розовом, посреди правой половины), средняя — толстое кольцо с разрывом, флагман — плотный мягкий блоб;
 * рядом две маленькие звёздочки. Фигуры позади текста (-z-10 в isolate-карточке), обрезаются краем карточки.
 * Один раз плавно появляются при входе в экран; при reduced-motion — сразу. Движение при hover — в globals.css (.step-card).
 */
export function StepDecor({ tier }: { tier: PublicLadderStep["tier"] }) {
  const reduce = useReducedMotion();
  const spark = tier === "project" ? "#e8307e" : "#ffffff";
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute -z-10 aspect-square ${place[tier]}`}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 100 100" className={`step-fig step-fig-${tier} size-full overflow-visible`}>
        {tier === "try" && <path fill="#ece9ff" d={STAR} />}
        {tier === "project" && (
          <circle
            cx="50"
            cy="50"
            r="42"
            pathLength="100"
            strokeDasharray="90 10"
            fill="none"
            stroke="#e8307e"
            strokeOpacity="0.32"
            strokeWidth="13"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {tier === "profession" && (
          <path fill="#b8a6ff" fillOpacity="0.6" d="M52 3C77 4 97 24 97 48C97 74 77 97 51 97C26 97 3 78 3 52C3 26 28 2 52 3Z" />
        )}
      </svg>
      <svg viewBox="0 0 100 100" className="step-spark step-spark-a absolute left-[34%] top-[12%] w-[13%]">
        <path fill={spark} fillOpacity="0.95" d={STAR} />
      </svg>
      <svg viewBox="0 0 100 100" className="step-spark step-spark-b absolute left-[22%] top-[48%] w-[8%]">
        <path fill={spark} fillOpacity="0.95" d={STAR} />
      </svg>
    </motion.span>
  );
}
