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
 * Декор карточки по её роли — те же фигуры и приёмы, что в плитках «Хотите так же?» (WantSameCta):
 * входная — крупная лавандовая четырёхконечная звезда у правого края; вторая — толстая изогнутая линия;
 * флагман — контурный круг (белая обводка) с двумя искрами. Фигуры позади текста (-z-10 в isolate-карточке),
 * обрезаются краем карточки. Один раз плавно появляются при входе в экран, при reduced-motion — сразу.
 * Движение при hover (подъём карточки, поворот/сдвиг фигур) — в globals.css (.step-card), только для мыши.
 */
export function StepDecor({ tier }: { tier: PublicLadderStep["tier"] }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {tier === "try" && (
        <>
          <svg viewBox="0 0 100 100" fill="#ece9ff" className="step-fig step-fig-try absolute -right-[14%] top-1/2 aspect-square w-[62%] max-w-[230px] -translate-y-1/2 opacity-90">
            <path d={STAR} />
          </svg>
          <Spark fill="#ffffff" className="right-[8%] top-[16%] w-[7%]" />
        </>
      )}
      {tier === "project" && (
        <>
          <svg viewBox="0 0 200 140" fill="none" className="step-fig step-fig-project absolute -bottom-[6%] -right-[12%] w-[92%] max-w-[340px] overflow-visible">
            <path d="M0 128C60 132 130 104 196 14" stroke="#e8307e" strokeOpacity="0.32" strokeWidth="16" strokeLinecap="round" />
          </svg>
          <Spark fill="#e8307e" className="right-[12%] top-[40%] w-[7%]" />
          <Spark fill="#ffffff" className="right-[34%] top-[47%] w-[5%]" />
        </>
      )}
      {tier === "profession" && (
        <>
          <svg viewBox="0 0 200 200" fill="none" className="step-fig step-fig-profession absolute -bottom-[14%] -right-[14%] aspect-square w-[92%] max-w-[310px] opacity-90">
            <circle cx="100" cy="100" r="78" stroke="#ffffff" strokeWidth="10" />
          </svg>
          <Spark fill="#14121f" className="right-[28%] top-[44%] w-[10%]" />
          <Spark fill="#e8307e" className="right-[8%] top-[38%] w-[7%]" />
        </>
      )}
    </motion.span>
  );
}
