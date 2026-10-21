"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Направления школы (названия курсов, без новых фактов): слово в предложном падеже «…на ___» → страница курса */
const WORDS = [
  { text: "ИИ-контенте", href: "/courses/ai-creator", label: "ИИ-креатор" },
  { text: "вайбкодинге", href: "/courses/vibecoding", label: "Вайбкодинг" },
  { text: "автоматизации", href: "/for/business", label: "Автоматизация для бизнеса" },
] as const;
const INTERVAL_MS = 3000;

const lineIn = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * H1 hero с меняющимся словом. Для скринридеров — статичный полный заголовок (sr-only);
 * Меняющееся слово — ссылка на соответствующий курс; смена стоит на паузе по hover/focus
 * (то есть пока пользователь целится кликом), при reduced-motion не крутится.
 */
export function HeroTitle({ hideCursor }: { hideCursor?: boolean }) {
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
        Учим зарабатывать на ИИ-контенте, вайбкодинге и автоматизации. Без техобразования. С результатом.
      </h1>

      <div
        className="flex w-full flex-col items-center font-display font-extrabold leading-[1.08] tracking-[-0.015em] text-ink"
        style={{ fontSize: "clamp(32px, 3.8vw, 52px)" }}
      >
        <motion.span aria-hidden className="block sm:whitespace-nowrap" {...lineIn(0)}>
          Учим зарабатывать на
        </motion.span>

        <motion.span className="relative block" {...lineIn(1)}>
          <Link
            href={word.href}
            aria-label={`Перейти к программе: ${word.label}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            onClick={() => track({ name: "cta_click", params: { label: word.label, location: "home-hero-word" } })}
            className="group relative inline-block rounded-xl"
          >
            {/* Ширина фиксирована по самому длинному слову — строка и кнопка не «прыгают» при смене */}
            <span className="relative inline-grid h-[1.3em] overflow-hidden text-center">
              {WORDS.map((w) => (
                <span key={w.text} aria-hidden className="invisible whitespace-nowrap [grid-area:1/1]">
                  {w.text}
                </span>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={word.text}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="block whitespace-nowrap text-gradient-brand [grid-area:1/1]"
                >
                  {word.text}
                </motion.span>
              </AnimatePresence>
            </span>

            {/* Обычный указатель мыши рядом со словом: подсказка, что можно кликнуть. Не влияет на центрирование */}
            <svg
              aria-hidden
              data-cursor-home
              viewBox="0 0 24 28"
              className={cn("pointer-events-none absolute left-full top-[58%] -ml-1 h-7 w-6 origin-top-left drop-shadow-[0_3px_4px_rgba(20,18,31,0.25)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:scale-90 sm:-ml-2 sm:h-9 sm:w-8", hideCursor ? "opacity-0" : "animate-cursor-nudge")}
            >
              <path
                d="M3.5 2.5v21l5.6-5.1 3.4 7.6 3.3-1.5-3.4-7.5h7.6z"
                fill="#fff"
                stroke="#14121F"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.span>

        <motion.span aria-hidden className="mt-1 block text-[0.62em] font-bold text-ink-500 sm:whitespace-nowrap" {...lineIn(2)}>
          Без техобразования. <span className="text-brand-700">С&nbsp;результатом.</span>
        </motion.span>
      </div>
    </div>
  );
}
