"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { PublicNavMenu } from "@/data/public-types";
import { Ribbon } from "@/components/ui";
import { NoBreakTerms } from "@/components/ui/NoBreakTerms";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { useT } from "@/i18n/LocaleProvider";
import { easeOut } from "@/lib/motion";
import { track } from "@/lib/analytics";

interface MegaMenuProps {
  /** Данные меню — собираются на сервере (data/navMenu.ts → getNavMenu) */
  menu: PublicNavMenu;
  open: boolean;
  onClose: () => void;
  id: string;
}

const linkCls =
  "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-soft focus-visible:bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand";

/**
 * Выпадающее меню «Направления»: две колонки (AI-креаторство, Вайб-кодинг) с продуктами и ценами из products.ts,
 * справа тёмная карточка эфира. Заголовок колонки — страница направления; внизу «Все курсы».
 */
export function MegaMenu({ menu, open, onClose, id }: MegaMenuProps) {
  const t = useT();
  const card = menu.card;

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
          className="absolute left-1/2 top-[calc(100%+10px)] w-[min(960px,calc(100vw-2rem))] -translate-x-1/2 origin-top"
        >
          <div className="grid gap-3 rounded-3xl bg-white/60 p-3 shadow-float ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 lg:grid-cols-[1fr_1fr_0.9fr]">
            {menu.columns.map((col) => (
              <section key={col.direction} aria-labelledby={`${id}-${col.direction}`} className="flex flex-col rounded-2xl bg-ink/[0.06] p-2">
                <Link
                  id={`${id}-${col.direction}`}
                  href={col.href}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
                >
                  <span>
                    <span className="block font-display text-[17px] font-bold leading-tight text-ink">
                      <NoBreakTerms text={col.title} />
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-500">Ведёт {col.leaderName}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
                <ul className="mt-1 flex flex-col" role="list">
                  {col.items.map((item) => (
                    <li key={item.id}>
                      <Link href={item.href} onClick={onClose} className={linkCls}>
                        <span className="min-w-0 text-[14px] font-semibold leading-snug text-ink">
                          <NoBreakTerms text={item.name} />
                        </span>
                        <ProductPrice parts={item.price} className="shrink-0 text-[13px] font-bold text-ink-700" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {card && (
              <div className="relative hidden min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl bg-dark p-5 text-white lg:flex">
                <Ribbon variant="card" tone="dark" opacity={0.18} />
                <div className="relative z-10">
                  <span className="inline-flex rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold">
                    <NoBreakTerms text={card.eyebrow} />
                  </span>
                  <p className="mt-4 font-display text-[19px] font-bold leading-tight">
                    <NoBreakTerms text={card.name} />
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-white/70">{card.resultLine}</p>
                </div>
                <div className="relative z-10 mt-4">
                  <p className="text-[13px] text-white/70">
                    {card.format}
                    {card.start && <> · {card.start}</>}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <ProductPrice parts={card.price} className="font-display text-[22px] font-extrabold" />
                    <Link
                      href={card.href}
                      onClick={() => {
                        track({ name: "cta_click", params: { label: "menu-efir", location: "header-menu" } });
                        onClose();
                      }}
                      className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {card.ctaLabel}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="lg:col-span-3">
              <Link
                href={menu.allCoursesHref}
                onClick={onClose}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-ink-700 transition-[background-color,box-shadow,color] duration-200 hover:bg-white hover:text-ink hover:shadow-soft focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
              >
                {t.nav.allCourses}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
