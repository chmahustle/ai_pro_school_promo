"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Две стрелки у правого края вместо скрытой полосы прокрутки: вверх / вниз на ~80% экрана с плавной прокруткой.
 * Крайние положения гасят соответствующую стрелку. При reduced-motion прокрутка мгновенная.
 */
export function ScrollControls() {
  const reduce = useReducedMotion();
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      setAtBottom(y + window.innerHeight >= document.documentElement.scrollHeight - 8);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) =>
    window.scrollBy({ top: dir * window.innerHeight * 0.8, behavior: reduce ? "auto" : "smooth" });

  const btn =
    "grid size-11 place-items-center rounded-full bg-white/75 text-ink shadow-pill ring-1 ring-white/70 backdrop-blur-xl transition-[transform,background-color,color,opacity] duration-200 hover:bg-brand hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <div className="fixed bottom-24 right-4 z-40 hidden flex-col gap-2 sm:flex">
      <button type="button" aria-label="Прокрутить вверх" onClick={() => step(-1)} disabled={atTop} className={cn(btn, "hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-30")}>
        <ChevronUp className="size-5" aria-hidden />
      </button>
      <button type="button" aria-label="Прокрутить вниз" onClick={() => step(1)} disabled={atBottom} className={cn(btn, "hover:translate-y-0.5 disabled:pointer-events-none disabled:opacity-30")}>
        <ChevronDown className="size-5" aria-hidden />
      </button>
    </div>
  );
}
