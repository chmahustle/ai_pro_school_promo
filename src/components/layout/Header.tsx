"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import type { PublicNavMenu } from "@/data/public-types";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { LangSwitch } from "./LangSwitch";
import { mainNav, PICK_PROGRAM_HREF } from "./nav";
import { Button } from "@/components/ui";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * Плавающий хедер-«пилюля» (референс ventorme / mindset health).
 * Desktop: лого · [Направления ▾ · Результаты · О нас] · RU/KZ · CTA «Подобрать программу» (→ /#lineup)
 * Mobile: лого · CTA · бургер → MobileMenu (две карточки направлений).
 */
export function Header({ menu }: { menu: PublicNavMenu }) {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const megaId = useId();
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Закрываем меню при смене маршрута
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Esc закрывает mega-menu; клик вне — тоже
  useEffect(() => {
    if (!megaOpen) return;
    // Esc закрывает меню и возвращает фокус на кнопку «Направления»
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      triggerRef.current?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  // После открытия меню с клавиатуры фокус переходит на первую ссылку (меню стоит в DOM после списка пунктов)
  const focusFirstLink = () => {
    setTimeout(() => document.getElementById(megaId)?.querySelector<HTMLElement>("a")?.focus(), 60);
  };

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const directionsActive = pathname.startsWith("/courses") || pathname.startsWith("/for/");
  const activeKey = directionsActive ? "directions" : (mainNav.find((i) => isActive(i.href))?.key ?? null);
  // Плашка-подсветка едет за курсором, а без наведения стоит на текущем пункте
  const highlighted = hovered ?? (megaOpen ? "directions" : activeKey);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="container-site relative flex h-16 items-center justify-between gap-3 rounded-pill px-3 pl-4 sm:px-4 sm:pl-5">
          {/* Стеклянный фон — отдельным слоем: меню «Для кого» не вложено в backdrop-filter и блюрит страницу само */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 -z-10 rounded-pill ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-300",
              scrolled || megaOpen ? "bg-white/70 shadow-pill" : "bg-white/45",
            )}
          />
          <Logo />

          {/* Desktop nav */}
          <nav ref={navRef} aria-label="Основная навигация" className="relative hidden items-center lg:flex">
            <ul className="flex items-center gap-1 rounded-pill bg-ink/[0.06] p-1" role="list" onMouseLeave={() => setHovered(null)}>
              <li
                className="relative"
                onMouseEnter={() => { openMega(); setHovered("directions"); }}
                onMouseLeave={scheduleClose}
                // фокус ушёл за пределы пункта и меню — закрываем (навигация с клавиатуры)
                onBlur={(e) => { if (!e.currentTarget.parentElement?.parentElement?.contains(e.relatedTarget as Node | null)) setMegaOpen(false); }}
              >
                <NavPill show={highlighted === "directions"} />
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls={megaId}
                  aria-haspopup="true"
                  onClick={(e) => {
                    // при наведении меню уже открыто hover-ом: клик не должен его закрывать
                    setMegaOpen((v) => (window.matchMedia("(hover: hover)").matches ? true : !v));
                    // с клавиатуры (Enter/Space) — сразу в меню
                    if (e.detail === 0) focusFirstLink();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setMegaOpen(true);
                      focusFirstLink();
                    }
                  }}
                  className={cn(
                    "relative z-10 flex h-10 items-center gap-1 rounded-pill px-4 text-[14px] font-semibold transition-colors duration-200",
                    highlighted === "directions" ? "text-ink" : "text-ink-700",
                  )}
                >
                  {t.nav.directions}
                  <ChevronDown className={cn("size-4 transition-transform duration-200", megaOpen && "rotate-180")} />
                </button>
              </li>
              {mainNav.map((item) => (
                <li key={item.key} className="relative" onMouseEnter={() => setHovered(item.key)}>
                  <NavPill show={highlighted === item.key} />
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative z-10 flex h-10 items-center rounded-pill px-4 text-[14px] font-semibold transition-colors duration-200",
                      highlighted === item.key ? "text-ink" : "text-ink-700",
                    )}
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>

            <div onMouseEnter={openMega} onMouseLeave={scheduleClose}>
              <MegaMenu menu={menu} open={megaOpen} onClose={() => setMegaOpen(false)} id={megaId} />
            </div>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <LangSwitch className="hidden md:inline-flex" />
            <Button
              variant="dark"
              size="sm"
              href={PICK_PROGRAM_HREF}
              icon={<ArrowRight className="size-4" />}
              className="h-10 px-4 text-[14px]"
              onClick={() => track({ name: "cta_click", params: { label: "pick_program", location: "header" } })}
            >
              <span className="hidden sm:inline">{t.nav.pickProgram}</span>
              <span className="sm:hidden">Подобрать</span>
            </Button>
            <button
              type="button"
              aria-label={t.nav.menu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-pill bg-ink/5 text-ink hover:bg-ink/10 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu menu={menu} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

/** Плавающая плашка под пунктом меню: общий layoutId — перетекает между пунктами за курсором */
function NavPill({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      layoutId="nav-pill"
      aria-hidden
      className="absolute inset-0 rounded-pill bg-white shadow-soft ring-1 ring-ink/5"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    />
  );
}
