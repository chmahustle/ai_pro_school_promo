"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** После какой прокрутки (px) появляется кнопка «наверх» */
const SHOW_AFTER = 800;

/**
 * Одна кнопка «наверх» у правого края: появляется после прокрутки на 800px и стоит над плавающей кнопкой WhatsApp
 * с зазором 12px (WhatsApp: 48px на мобильных, 56px на lg; отступы снизу — как в FloatingMessenger).
 * При reduced-motion прокрутка мгновенная.
 */
export function ScrollControls() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <button
      type="button"
      aria-label="Наверх"
      aria-hidden={!visible || undefined}
      tabIndex={visible ? undefined : -1}
      onClick={toTop}
      className={cn(
        // bottom = отступ WhatsApp + его высота + 12px
        "fixed bottom-[76px] right-4 z-40 grid size-11 place-items-center rounded-full bg-white text-ink shadow-pill ring-1 ring-ink/5 sm:bottom-[84px] sm:right-6 lg:bottom-[92px] lg:right-[30px]",
        "transition-[transform,opacity,background-color,color] duration-300 hover:bg-brand hover:text-white active:scale-95 motion-reduce:transition-none",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
