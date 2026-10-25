"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Avatar, MeshBackdrop, Pill, Ribbon } from "@/components/ui";
import { HeroTitle } from "./HeroTitle";
import { HeroInfoModal, type HeroModalTarget } from "./HeroInfoModal";
import type { PublicHeroData, PublicHeroResult } from "@/data/public-types";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Сдвиг слоёв за курсором (--px/--py задаёт HomeHero). Классы литеральные — Tailwind не видит динамические */
const SHIFT_BASE = "transition-transform duration-300 ease-out";
const SHIFT_MESH = `${SHIFT_BASE} [transform:translate3d(calc(var(--px,0)*-6px),calc(var(--py,0)*-4px),0)]`;
const SHIFT_RIBBON = `${SHIFT_BASE} [transform:translate3d(calc(var(--px,0)*10px),calc(var(--py,0)*6px),0)]`;
const SHIFT_CARDS = `${SHIFT_BASE} [transform:translate3d(calc(var(--px,0)*-14px),calc(var(--py,0)*-10px),0)]`;

/**
 * Текст — absolute inset-0 + flex center → геометрический центр hero.
 * Карточки — absolute по краям, вне потока текста.
 */
export function HomeHeroClient({ data }: { data: PublicHeroData }) {
  const results = data.results;
  const nadira = data.teacher;
  const nadiraPhoto = data.teacher?.photo ?? null;
  const heroRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<HeroModalTarget | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  /** Открыть окно из центра нажатого блока (анимация «как из Dock») */
  const openModal = (target: HeroModalTarget, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setModal(target);
  };

  // Лёгкий параллакс за курсором: только мышь и без reduced-motion; значения — через CSS-переменные, без ререндера
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
        el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="relative px-2 sm:px-4" aria-labelledby="hero-title">
      <div
        ref={heroRef}
        className={cn(
          "relative mx-auto overflow-hidden rounded-3xl",
          "flex min-h-[calc(100dvh-7.25rem)] flex-col sm:min-h-[calc(100dvh-7.75rem)]",
          "lg:block lg:h-[calc(100dvh-7.75rem)] lg:min-h-[560px] lg:max-h-[900px]",
        )}
      >
        <div className={cn("absolute -inset-5", SHIFT_MESH)} aria-hidden>
          <MeshBackdrop variant="home" rounded="rounded-none" />
        </div>
        <div className={cn("absolute -inset-5 hidden sm:block", SHIFT_RIBBON)} aria-hidden>
          <Ribbon variant="right" tone="light" draw />
        </div>

        {/* Летающие карточки: только края, ≥ lg */}
        <div className={cn("pointer-events-none absolute inset-0 z-10 hidden lg:block", SHIFT_CARDS)}>
          <Twinkle className="left-[23%] top-[16%]" size={18} delay={0} />
          <Twinkle className="right-[22%] top-[30%]" size={14} delay={1.2} tone="dark" />
          <Twinkle className="left-[25%] bottom-[18%]" size={12} delay={2.1} tone="dark" />
          <Twinkle className="right-[24%] bottom-[12%]" size={16} delay={0.7} />
          {results[0] && (
            <div className="absolute left-3 top-[10%] w-[200px] xl:left-5 xl:w-[220px] 2xl:left-8">
              <FloatCard rotate={-3} from="left" delay={0.5} phase={0} target="r0">
                <ResultCard result={results[0]} onOpen={(el) => openModal({ type: "result", result: results[0]! }, el)} delay={0.5} />
              </FloatCard>
            </div>
          )}
          {results[1] && (
            <div className="absolute right-3 top-[8%] w-[200px] xl:right-5 xl:w-[220px] 2xl:right-8">
              <FloatCard rotate={3} float="slow" from="right" delay={0.65} phase={2} target="r1">
                <ResultCard result={results[1]} onOpen={(el) => openModal({ type: "result", result: results[1]! }, el)} delay={0.65} />
              </FloatCard>
            </div>
          )}
          {results[2] && (
            <div className="absolute bottom-[11%] left-3 w-[200px] xl:left-5 xl:w-[220px] 2xl:left-8">
              <FloatCard rotate={2} float="slow" from="left" delay={0.95} phase={4} target="r2">
                <ResultCard result={results[2]} onOpen={(el) => openModal({ type: "result", result: results[2]! }, el)} delay={0.95} />
              </FloatCard>
            </div>
          )}
          {nadira && (
            <div className="absolute left-3 top-[46%] xl:left-5 2xl:left-8">
              <FloatCard rotate={-2} tone="dark" float="slow" from="left" delay={0.8} phase={1} target="teacher">
                <TeacherChip {...nadira} photo={nadiraPhoto} onOpen={(el) => openModal({ type: "teacher" }, el)} />
              </FloatCard>
            </div>
          )}
          <div className="pointer-events-auto absolute bottom-[8%] right-3 w-[190px] xl:right-5 xl:w-[210px] 2xl:right-8">
            <FloatCard rotate={4} float="slow" from="right" delay={1.1} phase={3} target="event">
              <EventCard event={data.event} onOpen={(el) => openModal({ type: "event" }, el)} />
            </FloatCard>
          </div>
        </div>

        {/* Текст: на ≥lg ровно по центру контейнера hero, на мобильных — обычный поток сверху */}
        <div className="relative z-20 px-4 pb-4 pt-8 sm:pt-12 lg:pointer-events-none lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-4">
          <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center lg:pointer-events-auto lg:max-w-[42rem]">
            <Pill tone="brand" dot className="mb-4">
              Онлайн-школа ИИ · Казахстан
            </Pill>

            <HeroTitle />

            <p className="mt-4 max-w-[40ch] text-center text-[14px] leading-relaxed text-ink-500 sm:text-[15px]">
              {data.entry.subtitle.before}
              <span className="whitespace-nowrap">{data.entry.subtitle.price}</span>
              {data.entry.subtitle.after}
            </p>

            <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:w-auto sm:grid-cols-2 sm:gap-5">
              <HeroChoice href="/#lineup?tab=creator" direction="creator" label="Делать ИИ-ролики" note={data.entry.creator} location="home-hero-creator" />
              <HeroChoice href="/#lineup?tab=vibecoding" direction="vibecoding" label="Собирать сайты и ботов" note={data.entry.vibecoding} location="home-hero-vibecoding" />
            </div>
          </div>
        </div>

        {/* Мобильный скролл карточек — под центром, внизу hero */}
        {results.length > 0 && (
          <ul
            className="relative z-20 mt-auto flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 no-scrollbar lg:hidden"
            aria-label="Результаты учеников"
          >
            {results.map((r) => (
              <li key={r.id} className="w-[240px] shrink-0 snap-start">
                <ResultCard result={r} onOpen={(el) => openModal({ type: "result", result: r }, el)} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <HeroInfoModal data={data} target={modal} origin={origin} onClose={() => setModal(null)} />
    </section>
  );
}

/**
 * Один из двух равных по весу входов: кнопка к вкладке блока «Продуктовая линейка» + мелкая строка с ценой входа.
 * Ссылка (не next/link) с href для открытия без JS; по клику URL меняется без перезагрузки и шлётся hashchange — LineupTabs открывает вкладку и скроллит к #lineup.
 */
function HeroChoice({ href, label, note, location, direction }: { href: string; label: string; note: string; location: string; direction: "creator" | "vibecoding" }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <a
        href={href}
        onClick={(e) => {
          track({ name: "cta_click", params: { label, location, direction } });
          // Без перезагрузки, даже если в адресе уже есть ?tab=…: меняем URL сами и сообщаем LineupTabs через hashchange
          if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          window.history.pushState(null, "", `${window.location.pathname}?tab=${direction}#lineup`);
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }}
        className="group inline-flex h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-pill bg-ink px-7 text-base font-semibold text-white shadow-pill transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-ink-700 hover:shadow-float active:scale-[0.98] motion-reduce:hover:translate-y-0 sm:w-auto"
      >
        {label}
        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden />
      </a>
      <span className="text-[12px] font-medium text-ink-500">{note}</span>
    </div>
  );
}

function FloatCard({
  children,
  className,
  rotate = 0,
  float = "normal",
  tone,
  from = "left",
  delay = 0,
  phase = 0,
  target,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  float?: "normal" | "slow" | "none";
  tone?: "dark";
  /** Откуда карточка влетает */
  from?: "left" | "right";
  /** Задержка появления, с */
  delay?: number;
  /** Сдвиг фазы парения, с — карточки не качаются в унисон */
  phase?: number;
  /** Метка для RoamingCursor */
  target?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("group pointer-events-auto", className)}
      data-hero-target={target}
            initial={reduce ? false : { opacity: 0, x: from === "left" ? -56 : 56, y: 28, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15, delay }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.04 }}
    >
      <div
        style={{
          ["--float-rotate" as string]: `${rotate}deg`,
          transform: `rotate(${rotate}deg)`,
          animationDelay: `-${phase}s`,
        }}
        className={cn(
          "rounded-xl shadow-float ring-1 ring-ink/5 transition-[box-shadow,--tw-ring-color] duration-300 group-hover:shadow-card group-hover:ring-brand/40 group-hover:[animation-play-state:paused]",
          tone === "dark" ? "bg-dark text-white" : "",
          float === "normal" && "animate-float",
          float === "slow" && "animate-float-slow",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

/** Мерцающая искра (форма из логотипа) рядом с карточками; при reduced-motion статична */
function Twinkle({ className, size, delay, tone = "brand" }: { className?: string; size: number; delay: number; tone?: "brand" | "dark" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("animate-twinkle absolute", tone === "brand" ? "fill-brand" : "fill-dark", className)}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden
    >
      <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
    </svg>
  );
}

function ResultLine({ text }: { text: string }) {
  const parts = text.split(/(\d[\d\s.,]*\s*₸)/g);
  return (
    <p className="mt-0.5 text-[13px] font-bold leading-snug text-ink">
      {parts.map((part, i) =>
        /₸/.test(part) ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

function ResultCard({ result, onOpen, delay = 0.8 }: { result: PublicHeroResult; onOpen: (el: HTMLElement) => void; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-haspopup="dialog"
      className="relative block w-full cursor-pointer rounded-xl bg-surface p-3.5 text-left text-ink shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="flex items-start gap-2.5">
        <Avatar name={result.name} src={result.photo} size="sm" className="ring-2 ring-brand-100" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-tight">{result.name}</p>
          <ResultLine text={result.result} />
        </div>
      </div>
      <div className="mt-2.5">
        <p className="mb-1 text-[11px] font-semibold text-ink-500">{result.label}</p>
        <div className="h-1.5 overflow-hidden rounded-pill bg-ink-100">
          <motion.div
            className="h-full rounded-pill bg-brand"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${result.progress}%` }}
            transition={{ duration: 1.1, delay: delay + 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </button>
  );
}

function TeacherChip({ name, role, emoji, photo, onOpen }: { name: string; role: string; emoji: string; photo?: string | null; onOpen: (el: HTMLElement) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-haspopup="dialog"
      className="relative flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {photo ? (
        <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
          <Image src={photo} alt="" fill sizes="36px" className="object-cover object-[50%_22%] scale-[1.6]" />
        </span>
      ) : (
        <span className="grid size-8 place-items-center rounded-full bg-white/15 text-base" aria-hidden>
          {emoji}
        </span>
      )}
      <div className="text-left">
        <p className="whitespace-nowrap text-[12px] font-semibold leading-tight">{name}</p>
        <p className="whitespace-nowrap text-[10px] text-white/70">{role}</p>
      </div>
    </button>
  );
}

function EventCard({ event, onOpen }: { event: PublicHeroData["event"]; onOpen: (el: HTMLElement) => void }) {
  return (
    <div className="w-full rounded-xl bg-brand p-3.5 text-left text-white shadow-float">
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        aria-haspopup="dialog"
        className="relative block w-full cursor-pointer rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-white" />
        </span>
        {event.duration}
      </p>
      <p className="mt-1 font-display text-[14px] font-bold leading-snug">{event.title}</p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {event.tags.map((t) => (
          <span key={t} className="rounded-pill bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/85">
        <Calendar className="size-3 shrink-0" aria-hidden />
        <span className="whitespace-nowrap">{event.dateText}</span>
      </div>
      </button>
      <Link
        href={event.href}
        className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-pill bg-ink px-3.5 text-[12px] font-semibold text-white transition-colors hover:bg-ink-700"
        onClick={() => track({ name: "cta_click", params: { label: "hero-event", location: "home-hero" } })}
      >
        {event.ctaLabel}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
