"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MenuAudience } from "@/data/public-types";
import type { AccentTheme } from "@/data/types";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";
import { AudienceIcon, AudienceIllustration, Ribbon } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

/** Цвета превью совпадают с hero страниц: бизнес — чёрный, фриланс — персиково-розовый mesh, найм — сиреневый, новичкам — mesh главной */
const accentBg: Record<AccentTheme, string> = {
  ink: "bg-dark text-white",
  peach: "mesh-freelance text-ink",
  lavender: "bg-lavender text-ink",
  indigo: "mesh-home text-ink",
};

const accentChip: Record<AccentTheme, string> = {
  ink: "bg-white/10 text-white",
  peach: "bg-white/75 text-ink",
  lavender: "bg-white/75 text-brand-700",
  indigo: "bg-white/75 text-ink",
};

interface MegaMenuProps {
  /** Пункты меню — собираются на сервере (data/public.ts → getMenuData) */
  audiences: MenuAudience[];
  open: boolean;
  onClose: () => void;
  id: string;
}

/**
 * Mega-menu «Для кого» (референс ventorme): слева — список ЦА, справа — большая
 * превью-карточка выбранной ЦА, меняется при наведении/фокусе.
 */
export function MegaMenu({ audiences: items, open, onClose, id }: MegaMenuProps) {
  const t = useT();
  const [activeSlug, setActiveSlug] = useState<MenuAudience["slug"]>(items[0]!.slug);
  const active = items.find((a) => a.slug === activeSlug) ?? items[0]!;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="region"
          aria-label={t.nav.forWhom}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: easeOut }}
          className="absolute left-1/2 top-[calc(100%+10px)] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 origin-top"
          onMouseLeave={onClose}
        >
          <div className="grid gap-3 rounded-3xl bg-white/60 p-3 shadow-float ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 md:grid-cols-[1fr_1.1fr]">
            {/* Список ЦА */}
            <ul className="flex flex-col gap-1 rounded-2xl bg-ink/[0.06] p-1.5" role="list">
              {items.map((a, i) => {
                const isActive = a.slug === activeSlug;
                return (
                  <motion.li
                    key={a.slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 + i * 0.05, ease: easeOut }}
                  >
                    <Link
                      href={a.path}
                      onMouseEnter={() => setActiveSlug(a.slug)}
                      onFocus={() => setActiveSlug(a.slug)}
                      onClick={onClose}
                      className="group relative flex items-center gap-4 rounded-2xl p-3"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mega-active"
                          aria-hidden
                          className="absolute inset-0 rounded-2xl bg-white shadow-soft ring-1 ring-ink/5"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span
                        aria-hidden
                        className={cn(
                          "relative z-10 grid size-12 shrink-0 place-items-center rounded-xl text-2xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6",
                          isActive ? "bg-ink/[0.06]" : "bg-white/70",
                        )}
                      >
                        <AudienceIcon slug={a.slug} className="size-8" />
                      </span>
                      <span className="relative z-10 min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-ink">{a.menuTitle}</span>
                        <span className="block truncate text-[13px] text-ink-500">{a.menuSubtitle}</span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative z-10 grid size-8 shrink-0 place-items-center rounded-full transition-all duration-200",
                          isActive ? "translate-x-0 bg-dark text-white opacity-100" : "-translate-x-1 opacity-0",
                        )}
                      >
                        <ArrowUpRight className="size-4" />
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
              <li className="mt-1 pt-1">
                <Link
                  href="/courses"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-ink-700 transition-[background-color,box-shadow,color] duration-200 hover:bg-white hover:text-ink hover:shadow-soft"
                >
                  {t.nav.allCourses}
                  <ArrowUpRight className="size-4" />
                </Link>
              </li>
            </ul>

            {/* Превью выбранной ЦА */}
            <div className="relative hidden overflow-hidden rounded-2xl md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className={cn("relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden p-6", accentBg[active.accent])}
                >
                  {/* Фирменные линии за содержимым: тональные на тёмной карточке, светлые на цветных */}
                  <Ribbon variant="card" tone={active.accent === "ink" ? "dark" : "light"} opacity={active.accent === "ink" ? 0.18 : 0.55} />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <span className={cn("rounded-pill px-3 py-1 text-xs font-semibold", accentChip[active.accent])}>
                      {active.heroEyebrow}
                    </span>
                    <span aria-hidden className="leading-none">
                      <AudienceIcon slug={active.slug} className="size-10" />
                    </span>
                  </div>

                  <div className="relative z-10 my-4 flex-1">
                    <AudienceIllustration slug={active.slug} className="absolute inset-0" />
                  </div>

                  <div className="relative z-10">
                    <p className="font-display text-lg leading-tight">{active.heroTitle}</p>
                    <Link
                      href={active.path}
                      onClick={onClose}
                      className={cn(
                        "mt-4 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition-colors",
                        active.accent !== "ink"
                          ? "bg-ink text-white hover:bg-ink-700"
                          : "bg-white text-ink hover:bg-white/90",
                      )}
                    >
                      {t.common.learnMore}
                      <ArrowUpRight className="size-4" />
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
