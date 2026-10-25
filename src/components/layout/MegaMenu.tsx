"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PublicNavMenu } from "@/data/public-types";
import { useT } from "@/i18n/LocaleProvider";
import { easeOut } from "@/lib/motion";
import { DirectionCard } from "./DirectionCard";

interface MegaMenuProps {
  /** Данные меню — собираются на сервере (data/navMenu.ts → getNavMenu) */
  menu: PublicNavMenu;
  open: boolean;
  onClose: () => void;
  id: string;
}

/** Выпадающее меню «Направления»: две крупные карточки (AI-креаторство, Вайб-кодинг) и ссылка «Все курсы» внизу. */
export function MegaMenu({ menu, open, onClose, id }: MegaMenuProps) {
  const t = useT();
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
          className="absolute left-1/2 top-[calc(100%+10px)] w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 origin-top"
        >
          <div className="rounded-3xl bg-white/60 p-3 shadow-float ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150">
            <ul className="grid gap-3 sm:grid-cols-2" role="list">
              {menu.cards.map((c) => (
                <li key={c.direction}>
                  <DirectionCard card={c} onNavigate={onClose} />
                </li>
              ))}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
