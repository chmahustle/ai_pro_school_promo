"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Меняющееся слово после «Учим создавать с ИИ» (не кликабельное) */
const WORDS = ["ролики", "сайты", "ботов", "автоматизации"] as const;
const INTERVAL_MS = 3000;

const lineIn = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * H1 hero с меняющимся словом. Для скринридеров — статичный полный заголовок (sr-only);
 * смена стоит на паузе по hover, при reduced-motion не крутится.
 */
export function HeroTitle() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const word = WORDS[index] ?? WORDS[0];
  const running = !reduce && !hovered;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setIndex((v) => (v + 1) % WORDS.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [running]);

  return (
    <div className="relative w-full">
      <h1 id="hero-title" className="sr-only">
        Учим создавать с ИИ ролики, сайты, ботов и автоматизации. Без техобразования. С результатом.
      </h1>

      <div
        className="flex w-full flex-col items-center font-display font-extrabold leading-[1.08] tracking-[-0.015em] text-ink"
        style={{ fontSize: "clamp(32px, 3.8vw, 52px)" }}
      >
        <motion.span aria-hidden className="block sm:whitespace-nowrap" {...lineIn(0)}>
          Учим создавать с ИИ
        </motion.span>

        <motion.span aria-hidden className="relative block" {...lineIn(1)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          {/* Ширина фиксирована по самому длинному слову — строка не «прыгает» при смене */}
          <span className="relative inline-grid h-[1.3em] overflow-hidden text-center">
            {WORDS.map((w) => (
              <span key={w} className="invisible whitespace-nowrap [grid-area:1/1]">
                {w}
              </span>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={word}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="block whitespace-nowrap text-gradient-brand [grid-area:1/1]"
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.span>

        <motion.span aria-hidden className="mt-1 block text-[0.62em] font-bold text-ink-500 sm:whitespace-nowrap" {...lineIn(2)}>
          Без техобразования. <span className="text-brand-700">С&nbsp;результатом.</span>
        </motion.span>
      </div>
    </div>
  );
}
