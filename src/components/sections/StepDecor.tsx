"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PublicLadderStep } from "@/data/public-types";

const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";

function Spark({ fill, className }: { fill: string; className: string }) {
  return (
    <svg viewBox="0 0 100 100" fill={fill} className={`step-spark absolute ${className}`}>
      <path d={STAR} />
    </svg>
  );
}

/**
 * Декор карточки по её роли, живёт только в «зоне декора» (между описанием и ценой, см. LadderStepCard):
 * входная — крупная лавандовая четырёхконечная звезда; вторая — кольцо с толстой линией; флагман — мягкий блоб.
 * Рядом маленькие светлые звёздочки. Зона обрезает фигуры (overflow-hidden, по ширине — до края карточки),
 * поэтому они не заходят на текст ни в покое, ни при hover. Один раз плавно появляются при входе в экран,
 * при reduced-motion — сразу. Движение при hover — в globals.css (.step-card).
 */
export function StepDecor({ tier }: { tier: PublicLadderStep["tier"] }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {tier === "try" && (
        <>
          <svg viewBox="0 0 100 100" fill="#ece9ff" className="step-fig step-fig-try absolute -right-[22px] top-1/2 size-[88px] -translate-y-1/2 sm:-right-[26px] sm:size-[100px]">
            <path d={STAR} />
          </svg>
          <Spark fill="#ffffff" className="right-[46%] top-[22%] w-[14px]" />
          <Spark fill="#ffffff" className="right-[36%] bottom-[18%] w-[9px]" />
        </>
      )}
      {tier === "project" && (
        <>
          <svg viewBox="0 0 100 100" fill="none" className="step-fig step-fig-project absolute -right-[28px] top-1/2 size-[84px] -translate-y-1/2 overflow-visible sm:-right-[32px] sm:size-[96px]">
            <circle cx="50" cy="50" r="42" stroke="#e8307e" strokeOpacity="0.4" strokeWidth="13" vectorEffect="non-scaling-stroke" />
          </svg>
          <Spark fill="#cfc5ff" className="right-[46%] top-[22%] w-[14px]" />
          <Spark fill="#cfc5ff" className="right-[36%] bottom-[18%] w-[9px]" />
        </>
      )}
      {tier === "profession" && (
        <>
          <svg viewBox="0 0 100 100" fill="#b8a6ff" fillOpacity="0.6" className="step-fig step-fig-profession absolute -right-[24px] top-1/2 size-[84px] -translate-y-1/2 sm:-right-[28px] sm:size-[96px]">
            <path d="M52 3C77 4 97 24 97 48C97 74 77 97 51 97C26 97 3 78 3 52C3 26 28 2 52 3Z" />
          </svg>
          <Spark fill="#ffffff" className="right-[46%] top-[22%] w-[14px]" />
          <Spark fill="#ffffff" className="right-[36%] bottom-[18%] w-[9px]" />
        </>
      )}
    </motion.span>
  );
}
