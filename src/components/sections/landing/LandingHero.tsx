"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { Button, MeshBackdrop, Marquee, Pill, Ribbon, type MeshVariant } from "@/components/ui";
import type { Audience } from "@/data/types";
import { fadeUp, stagger } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { cn, nbspDash } from "@/lib/utils";

type PillTone = "brand" | "dark" | "white" | "peach" | "lavender";

interface HeroTheme {
  panel: string;
  /** Mesh-фон вместо сплошного цвета панели */
  mesh?: MeshVariant;
  ribbon: { tone: "dark" | "light"; opacity: number };
  eyebrow: PillTone;
  title: string;
  highlight: string;
  sub: string;
  primary: { variant: "white" | "dark"; fillTone?: "dark" };
  secondary: string;
  magnet: string;
  card: string;
  cardLabel: string;
  cardValue: string;
  cardSub: string;
  stripe: string;
  tag: string;
}

/** Цвета hero по аудитории: бизнес — чёрный, фрилансеры — светлый персиково-розовый mesh, специалисты в найме — сиреневый */
const themes: Record<"dark" | "brand" | "light", HeroTheme> = {
  dark: {
    panel: "bg-dark text-white",
    ribbon: { tone: "dark", opacity: 0.13 },
    eyebrow: "brand",
    title: "text-white",
    highlight: "text-brand",
    sub: "text-white/65",
    primary: { variant: "white" },
    secondary: "border-white/25 text-white hover:border-white",
    magnet: "bg-white/10 text-white/80 ring-white/10",
    card: "bg-white/[0.08] ring-white/15",
    cardLabel: "text-white/55",
    cardValue: "text-white",
    cardSub: "text-white/60",
    stripe: "border-white/10 bg-white/[0.04]",
    tag: "bg-white/10 text-white/90",
  },
  brand: {
    // Светлый персиково-розовый mesh (как hero главной): тёмный текст, тёмная основная кнопка
    panel: "text-ink",
    mesh: "freelance",
    ribbon: { tone: "light", opacity: 0.85 },
    eyebrow: "brand",
    title: "text-ink",
    highlight: "text-brand",
    sub: "text-ink-500",
    primary: { variant: "dark" },
    secondary: "",
    magnet: "bg-white/70 text-ink-700 ring-white",
    card: "bg-white/80 ring-white shadow-soft",
    cardLabel: "text-ink-500",
    cardValue: "text-ink",
    cardSub: "text-ink-500",
    stripe: "border-ink/5 bg-white/50",
    tag: "bg-white text-ink shadow-soft",
  },
  light: {
    panel: "bg-lavender text-ink",
    ribbon: { tone: "light", opacity: 0.9 },
    eyebrow: "brand",
    title: "text-ink",
    highlight: "text-brand",
    sub: "text-ink-500",
    primary: { variant: "dark" },
    secondary: "",
    magnet: "bg-white/70 text-ink-700 ring-white",
    card: "bg-white/80 ring-white shadow-soft",
    cardLabel: "text-ink-500",
    cardValue: "text-ink",
    cardSub: "text-ink-500",
    stripe: "border-ink/5 bg-white/50",
    tag: "bg-white text-ink shadow-soft",
  },
};

function themeFor(accent: Audience["accent"]): HeroTheme {
  if (accent === "peach") return themes.brand;
  if (accent === "lavender" || accent === "indigo") return themes.light;
  return themes.dark;
}

function Highlighted({ text, highlight, className }: { text: string; highlight?: string; className: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <span className={className}>{highlight}</span>
      {after}
    </>
  );
}

/** Позиции летающих карточек вне центральной колонки (≥ xl): слева сверху, справа сверху, слева снизу */
const cardSlots = [
  { pos: "left-[3%] top-[12%]", rotate: -3, from: -50, delay: 0.4, phase: 0 },
  { pos: "right-[3%] top-[14%]", rotate: 3, from: 50, delay: 0.55, phase: 2 },
  { pos: "left-[6%] bottom-[24%]", rotate: 2, from: -50, delay: 0.7, phase: 4 },
];

export type LandingHeroData = Pick<Audience, "slug" | "accent" | "hero" | "tags" | "leadMagnet">;

interface LandingHeroProps {
  audience: LandingHeroData;
  formAnchor: string;
}

/**
 * Hero ЦА-лендинга: компактная тёмная панель (#171717) с тональными лентами, белый заголовок с розовым акцентом,
 * кнопки со стрелками, бегущая строка тегов внизу. Тёмный — чтобы лендинг выглядел солидно, особенно для бизнеса.
 */
export function LandingHero({ audience, formAnchor }: LandingHeroProps) {
  const { hero } = audience;
  const th = themeFor(audience.accent);

  useEffect(() => {
    track({ name: "view_landing", params: { audience: audience.slug } });
  }, [audience.slug]);

  return (
    <section className="px-2 pt-[76px] sm:px-4 sm:pt-[88px]" aria-labelledby="landing-hero-title">
      <div className={cn("relative overflow-hidden rounded-3xl", th.panel)}>
        {th.mesh && <MeshBackdrop variant={th.mesh} rounded="rounded-3xl" />}
        <Ribbon variant="pair" tone={th.ribbon.tone} opacity={th.ribbon.opacity} />

        {/* Летающие карточки с утверждениями: пока данные не подтверждены — только в dev, и только на широких экранах */}
        {SHOW_PLACEHOLDERS && (
          <div className="pointer-events-none absolute inset-0 z-10 hidden xl:block">
            {hero.floatingCards.slice(0, cardSlots.length).map((c, i) => {
              const slot = cardSlots[i]!;
              return (
                <motion.div
                  key={c.label}
                  className={cn("pointer-events-auto absolute w-[210px]", slot.pos)}
                  initial={{ opacity: 0, x: slot.from, y: 24, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15, delay: slot.delay }}
                  whileHover={{ y: -6, scale: 1.04 }}
                >
                  <div
                    style={{ ["--float-rotate" as string]: `${slot.rotate}deg`, transform: `rotate(${slot.rotate}deg)`, animationDelay: `-${slot.phase}s` }}
                    className={cn("rounded-[22px] p-4 ring-1 backdrop-blur-md", th.card, i % 2 ? "animate-float-slow" : "animate-float")}
                  >
                    <p className={cn("flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide", th.cardLabel)}>
                      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                      {c.label}
                    </p>
                    <p className={cn("mt-2 font-display text-[26px] font-extrabold leading-none", th.cardValue)}>{c.value}</p>
                    {c.sub && <p className={cn("mt-1.5 text-[12px] leading-snug", th.cardSub)}>{c.sub}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          animate="show"
          className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-4 pb-10 pt-12 text-center sm:px-6 sm:pb-12 sm:pt-14"
        >
          <motion.div variants={fadeUp}>
            <Pill tone={th.eyebrow} dot>
              {hero.eyebrow}
            </Pill>
          </motion.div>

          <motion.h1
            id="landing-hero-title"
            variants={fadeUp}
            className={cn("mt-4 font-display text-[clamp(1.875rem,1.2rem+2.6vw,3.25rem)] font-extrabold leading-[1.06] tracking-[-0.015em] [text-wrap:balance]", th.title)}
          >
            <Highlighted text={nbspDash(hero.title)} highlight={hero.highlight} className={th.highlight} />
          </motion.h1>

          <motion.p variants={fadeUp} className={cn("mt-4 max-w-[54ch] text-[14px] leading-relaxed sm:text-[15px]", th.sub)}>
            {nbspDash(hero.subtitle)}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Button
              variant={th.primary.variant}
              fillTone={th.primary.fillTone}
              size="md"
              href={`#${formAnchor}`}
              icon={<ArrowRight className="size-4" />}
              className="w-full sm:w-auto"
              onClick={() => track({ name: "cta_click", params: { label: hero.primaryCta, location: "landing-hero" } })}
            >
              {hero.primaryCta}
            </Button>
          </motion.div>

          {audience.leadMagnet && (
            <motion.p variants={fadeUp} className={cn("mt-5 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[13px] font-medium ring-1", th.magnet)}>
              <Gift className="size-4 text-brand" aria-hidden />
              {audience.leadMagnet.title} — в подарок
            </motion.p>
          )}

          {hero.floatingCards.length > 0 && (
            <motion.ul variants={fadeUp} className="mt-6 grid w-full grid-cols-3 gap-2 text-left lg:hidden" aria-label="Коротко">
              {hero.floatingCards.map((c) => (
                <li key={c.label} className={cn("rounded-2xl p-3 ring-1", th.card)}>
                  <p className={cn("font-display text-base leading-none", th.cardValue)}>{c.value}</p>
                  <p className={cn("mt-1 text-[11px] leading-tight", th.cardSub)}>{c.label}</p>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {audience.tags && (
          <div className={cn("relative z-10 border-t py-3", th.stripe)}>
            <Marquee durationSec={audience.tags.length * 6} pauseOnHover repeat={Math.max(1, Math.ceil(14 / audience.tags.length))} gap="gap-3">
              {audience.tags.map((tag) => (
                <span key={tag} className={cn("rounded-pill px-4 py-1.5 text-[13px] font-semibold", th.tag)}>
                  {tag}
                </span>
              ))}
            </Marquee>
          </div>
        )}
      </div>
    </section>
  );
}
