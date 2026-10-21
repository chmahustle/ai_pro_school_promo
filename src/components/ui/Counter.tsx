"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface CounterProps {
  /** Целевое значение */
  value: number;
  /** Префикс/суффикс: "+", " ₸", "%" */
  prefix?: string;
  suffix?: string;
  /** Длительность в мс */
  duration?: number;
  /** Знаков после запятой (для 4.9) */
  decimals?: number;
  className?: string;
  /** Форматер (по умолчанию — разряды через тонкий пробел) */
  format?: (n: number) => string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
/** Высота ячейки цифры, em: чуть больше 1, чтобы не срезались выносные элементы глифов */
const CELL_EM = 1.08;

/**
 * Анимированный счётчик в виде одометра: каждая цифра — вертикальная лента 0–9, которая прокручивается до нужной
 * при появлении в viewport (один раз), цифры по очереди слева направо. При reduced-motion число сразу итоговое.
 */
export function Counter({ value, prefix = "", suffix = "", duration = 1600, decimals = 0, className, format }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const fmt = (n: number) => {
    if (format) return format(n);
    if (decimals > 0) return n.toFixed(decimals).replace(".", ",");
    return formatNumber(Math.round(n));
  };
  const text = fmt(value);
  const chars = Array.from(text);
  const roll = inView || reduce;

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${text}${suffix}`}>
      <span aria-hidden className="inline-flex items-baseline tabular-nums">
        {prefix}
        {chars.map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="inline-block align-baseline [clip-path:inset(0)]" style={{ height: `${CELL_EM}em`, lineHeight: `${CELL_EM}em` }}>
              <span
                className="flex flex-col"
                style={{
                  transform: `translateY(${roll ? -Number(ch) * CELL_EM : 0}em)`,
                  transition: reduce ? "none" : `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms`,
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d} style={{ height: `${CELL_EM}em` }}>
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
        {suffix}
      </span>
    </span>
  );
}
