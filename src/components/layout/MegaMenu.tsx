"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PublicNavMenu } from "@/data/public-types";
import { Ribbon } from "@/components/ui";
import { NoBreakTerms } from "@/components/ui/NoBreakTerms";
import { useT } from "@/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { DirectionIcon } from "./DirectionIcon";
import { DirectionIllustration } from "./DirectionIllustration";
import { StartLine } from "./DirectionCard";

interface MegaMenuProps {
  /** Данные меню — собираются на сервере (data/navMenu.ts → getNavMenu) */
  menu: PublicNavMenu;
  open: boolean;
  onClose: () => void;
  id: string;
}

/**
 * Выпадающее «Направления»: слева две строки (иконка, название, подпись) → страницы направлений,
 * справа тёмная карточка с иллюстрацией выбранного направления (меняется при наведении и фокусе; по умолчанию — первое).
 * Кнопка карточки ведёт на входной продукт. Внизу «Все курсы».
 */
export function MegaMenu({ menu, open, onClose, id }: MegaMenuProps) {
  const t = useT();
  const [active, setActive] = useState<"creator" | "vibecoding">(menu.cards[0]?.direction ?? "creator");
  // При каждом новом открытии снова активно первое направление (AI-креаторство)
  useEffect(() => {
    if (!open) setActive(menu.cards[0]?.direction ?? "creator");
  }, [open, menu.cards]);
  const card = menu.cards.find((c) => c.direction === active) ?? menu.cards[0]!;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="region"
          aria-label={t.nav.directions}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: easeOut }}
          className="absolute left-1/2 top-[calc(100%+10px)] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 origin-top"
        >
          <div className="grid gap-3 rounded-3xl bg-white/60 p-3 shadow-float ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 md:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col">
              <ul className="flex flex-1 flex-col gap-1 rounded-2xl bg-ink/[0.06] p-1.5" role="list">
                {menu.cards.map((c) => {
                  const on = c.direction === active;
                  return (
                    <li key={c.direction}>
                      <Link
                        href={c.href}
                        onClick={onClose}
                        onMouseEnter={() => setActive(c.direction)}
                        onFocus={() => setActive(c.direction)}
                        className={cn(
                          "group relative flex items-center gap-4 rounded-2xl p-3 transition-[background-color,box-shadow] duration-200",
                          "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand",
                          on ? "bg-white shadow-soft ring-1 ring-ink/5" : "hover:bg-white/60",
                        )}
                      >
                        <DirectionIcon direction={c.direction} className="transition-transform duration-200 group-hover:scale-105" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-ink">
                            <NoBreakTerms text={c.title} />
                          </span>
                          <span className="block text-[13px] leading-snug text-ink-500">
                            <NoBreakTerms text={c.pitch} />
                          </span>
                        </span>
                        <ArrowRight className={cn("size-4 shrink-0 text-ink transition-opacity", on ? "opacity-100" : "opacity-0")} aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={menu.allCoursesHref}
                onClick={onClose}
                className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-ink-700 transition-[background-color,box-shadow,color] duration-200 hover:bg-white hover:text-ink hover:shadow-soft focus-visible:bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
              >
                {t.nav.allCourses}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="relative hidden overflow-hidden rounded-2xl md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={card.direction}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden bg-dark p-5 text-white"
                >
                  <Ribbon variant="card" tone="dark" opacity={0.18} />
                  <div className="relative z-10 h-[150px]">
                    <DirectionIllustration direction={card.direction} />
                  </div>
                  <div className="relative z-10">
                    <p className="font-display text-[18px] font-bold leading-tight">
                      <NoBreakTerms text={card.teaser} />
                    </p>
                    <p className="mt-2 text-[13px] font-semibold text-white/75">
                      <StartLine start={card.start} />
                    </p>
                    <Link
                      href={card.entry.href}
                      onClick={() => {
                        track({ name: "cta_click", params: { label: card.entry.ctaLabel, location: "header-menu" } });
                        onClose();
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {card.entry.ctaLabel}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
