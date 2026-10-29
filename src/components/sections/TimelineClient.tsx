"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Check } from "lucide-react";
import { cn, nbspDash } from "@/lib/utils";

export interface TimelineClientProps {
  title: string;
  date: string | null;
  time: string | null;
  items: { id: string; time: string; title: string; text: string; devNote?: string }[];
  outcomePrefix: string;
  outcomeAccent: string;
  outcomeRest: string;
}

/**
 * «3 часа на уроке»: слева заголовок и дата/время урока (липкие на десктопе), справа карточка с вертикальным путём:
 * линия прорисовывается по мере прокрутки, а метки времени загораются, когда линия до них доходит (как «Путь» на главной).
 * При reduced-motion линия сразу полная.
 */
export function TimelineClient({ title, date, time, items, outcomePrefix, outcomeAccent, outcomeRest }: TimelineClientProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 70%", "end 60%"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);
  const reached = (i: number) => reduce || progress >= i / Math.max(1, items.length - 1) - 0.04;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 id="offline-timeline-title" className="font-display text-[clamp(1.875rem,1.3rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink">
          {title}
        </h2>
        {(date || time) && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {date && <p className="font-display text-[20px] font-bold">Урок, {date}</p>}
            {time && <span className="rounded-pill bg-brand-100 px-3.5 py-1.5 text-[14px] font-bold tabular-nums text-brand-700">{time}</span>}
          </div>
        )}
      </div>

      <div>
        <div className="rounded-[28px] bg-surface p-5 shadow-soft sm:p-7">
          <ol ref={trackRef} className="relative flex flex-col">
            {/* Дорожка и прорисовывающаяся линия: от центра первой метки до центра последней */}
            <span aria-hidden className="absolute bottom-4 left-[34px] top-4 w-1 -translate-x-1/2 rounded-full bg-brand-100" />
            <motion.span
              aria-hidden
              className="absolute bottom-4 left-[34px] top-4 w-1 origin-top -translate-x-1/2 rounded-full bg-brand-600"
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
            />
            {items.map((it, i) => (
              <li key={it.id} className="relative flex gap-4 pb-7 last:pb-0">
                <span
                  className={cn(
                    "z-10 h-8 w-[68px] shrink-0 rounded-xl text-center text-[14px] font-bold leading-8 tabular-nums transition-colors duration-500 motion-reduce:transition-none",
                    reached(i) ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700",
                  )}
                >
                  {it.time}
                </span>
                <div>
                  {it.devNote && <p className="text-[12px] font-semibold text-danger">{it.devNote}</p>}
                  <h3 className="font-display text-[19px] font-bold leading-snug">{it.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-700">{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-[24px] bg-surface p-5 ring-2 ring-brand/25">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
            <Check className="size-6" aria-hidden />
          </span>
          <p className="text-[17px] font-bold leading-snug">
            {outcomePrefix} <span className="text-brand">{outcomeAccent}</span>
            {nbspDash(outcomeRest)}
          </p>
        </div>
      </div>
    </div>
  );
}
