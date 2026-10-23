"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, X, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { LangSwitch } from "./LangSwitch";
import { mainNav, LOGIN_URL, PICK_PROGRAM_HREF } from "./nav";
import type { MenuAudience } from "@/data/public-types";
import { AudienceIcon, Button } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

interface MobileMenuProps {
  /** Пункты «Для кого» — собираются на сервере (getMenuData) */
  audiences: MenuAudience[];
  open: boolean;
  onClose: () => void;
}

/** Полноэкранное мобильное меню с аккордеоном «Для кого» */
export function MobileMenu({ audiences: items, open, onClose }: MobileMenuProps) {
  const t = useT();
  const [forWhomOpen, setForWhomOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col bg-bg lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-4 pt-3 sm:px-6">
            <Logo />
            <button
              type="button"
              aria-label={t.nav.close}
              onClick={onClose}
              className="grid size-10 place-items-center rounded-pill bg-ink/5 text-ink"
              data-autofocus
            >
              <X className="size-5" />
            </button>
          </div>

          <motion.nav
            aria-label="Мобильная навигация"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: easeOut, delay: 0.05 }}
            className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6"
          >
            <ul className="flex flex-col gap-2" role="list">
              <li className="rounded-2xl bg-surface shadow-soft">
                <button
                  type="button"
                  aria-expanded={forWhomOpen}
                  onClick={() => setForWhomOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-4 font-display text-lg"
                >
                  {t.nav.forWhom}
                  <ChevronDown className={cn("size-5 transition-transform", forWhomOpen && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {forWhomOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: easeOut }}
                      className="overflow-hidden"
                      role="list"
                    >
                      {items.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={a.path}
                            onClick={onClose}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-soft-100"
                          >
                            <span aria-hidden className="grid size-10 place-items-center rounded-xl bg-soft-100 text-xl">
                              <AudienceIcon slug={a.slug} className="size-7" />
                            </span>
                            <span>
                              <span className="block text-[15px] font-semibold">{a.menuTitle}</span>
                              <span className="block text-[13px] text-ink-500">{a.menuSubtitle}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li className="px-5 pb-4 pt-1" />
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {mainNav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-2xl bg-surface px-5 py-4 font-display text-lg shadow-soft hover:bg-soft-100"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contacts"
                  onClick={onClose}
                  className="block rounded-2xl bg-surface px-5 py-4 font-display text-lg shadow-soft hover:bg-soft-100"
                >
                  {t.nav.contacts}
                </Link>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="dark"
                size="lg"
                fullWidth
                href={PICK_PROGRAM_HREF}
                icon={<ArrowRight className="size-5" />}
                onClick={() => {
                  track({ name: "cta_click", params: { label: "pick_program", location: "mobile-menu" } });
                  onClose();
                }}
              >
                {t.nav.pickProgram}
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                href={site.whatsapp}
                icon={<MessageCircle className="size-5" />}
                iconPosition="left"
                onClick={() => track({ name: "messenger_click", params: { channel: "whatsapp" } })}
              >
                {t.common.whatsapp}
              </Button>
              <div className="flex items-center justify-between pt-2">
                <LangSwitch />
                <a
                  href={LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-ink-700 underline-offset-4 hover:underline"
                >
                  {t.nav.login}
                </a>
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
