"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar, Signal, MonitorPlay } from "lucide-react";
import { MeshBackdrop, Pill, Ribbon } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { LeadButton } from "@/components/ui/LeadButton";
import { productForCourseSlug } from "@/data/product-ids";
import type { PriceParts } from "@/data/products";
import type { AccentTheme } from "@/data/types";
import { fadeUp, stagger } from "@/lib/motion";
import { meshForAccent } from "@/lib/mesh";
import { cn, nbspDash } from "@/lib/utils";

/** Цвета плиток фактов — те же, что у карточек главной */
const tiles = [
  { tile: "bg-brand text-white", label: "text-white/70", icon: "bg-white/20 text-white" },
  { tile: "bg-dark text-white", label: "text-white/55", icon: "bg-brand text-white" },
  { tile: "bg-lavender text-ink", label: "text-ink-500", icon: "bg-brand text-white" },
  { tile: "bg-surface text-ink shadow-soft", label: "text-ink-500", icon: "bg-brand text-white" },
];

/**
 * Hero курса в стиле главной: mesh-панель с лентой (чёрная панель у «ink»-курса), слева заголовок и кнопки,
 * справа цветные плитки с фактами (длительность, формат, уровень, старт) вместо пустой заглушки обложки.
 */
export interface CourseHeroData {
  slug: string;
  shortName: string;
  tagline: string;
  description: string;
  accent: AccentTheme;
  ctaLabel: string;
  duration: string;
  format: string;
  level: string;
  /** Дата для бейджа «Старт …» (нет — бейджа нет) */
  badgeDate: string | null;
  /** Значение плитки «Старт» (нет — плитки нет) */
  startFact: string | null;
  /** Подпись плитки: «Старт» (дата, срок старта) или «Записи эфиров» (пока формат не подтверждён) */
  startFactLabel: string;
  price: PriceParts | null;
  /** Цена в подписи кнопки: «… за 9 900 ₸» */
  ctaWithPrice?: boolean;
  /** Условия оплаты из products.ts (сумма рассрочки или «есть рассрочка») */
  paymentNote: string | null;
}

export function CourseHeroClient({ course }: { course: CourseHeroData }) {
  const dark = course.accent === "ink";
  const mesh = meshForAccent(course.accent);
  const facts = [
    { icon: Clock, label: "Длительность", value: course.duration },
    { icon: MonitorPlay, label: "Формат", value: course.format },
    { icon: Signal, label: "Уровень", value: course.level },
    ...(course.startFact ? [{ icon: Calendar, label: course.startFactLabel, value: course.startFact }] : []),
  ];


  return (
    <section className="px-2 sm:px-4" aria-labelledby="course-title">
      <div className={cn("relative overflow-hidden rounded-3xl", dark && "bg-dark text-white")}>
        {!dark && <MeshBackdrop variant={mesh} rounded="rounded-3xl" />}
        <Ribbon variant="right" tone={dark ? "dark" : "light"} opacity={dark ? 0.13 : 0.8} className="hidden sm:block" />

        <div className="container-site relative z-10 grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="flex flex-col items-start gap-5">
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <Pill tone={dark ? "brand" : "dark"} dot>
                {course.shortName}
              </Pill>
              {course.badgeDate && <Pill tone="white">Старт {course.badgeDate}</Pill>}
            </motion.div>

            <motion.h1
              id="course-title"
              variants={fadeUp}
              className={cn("font-display text-[clamp(2rem,1.3rem+3vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.015em] [text-wrap:balance]", dark ? "text-white" : "text-ink")}
            >
              {nbspDash(course.tagline)}
            </motion.h1>

            <motion.p variants={fadeUp} className={cn("max-w-[56ch] text-[15px] leading-relaxed", dark ? "text-white/70" : "text-ink-500")}>
              {nbspDash(course.description)}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LeadButton
                variant={dark ? "white" : "dark"}
                size="lg"
                source={`course-hero:${course.slug}`}
                interest={productForCourseSlug(course.slug)}
                icon={<ArrowRight className="size-5" />}
              >
                {course.ctaLabel}
                {/* Практикум: цена в самой кнопке («Записаться на практикум за 9 900 ₸»), цена из products.ts */}
                {course.ctaWithPrice && course.price && (
                  <>
                    {" "}за <ProductPrice parts={course.price} />
                  </>
                )}
              </LeadButton>
              {!course.ctaWithPrice && course.price && (
                <span className="ml-1 flex flex-col leading-tight">
                  <ProductPrice parts={course.price} className={cn("font-display text-lg", dark ? "text-white" : "text-ink")} />
                  {course.paymentNote && <span className={cn("text-[13px]", dark ? "text-white/65" : "text-ink-500")}>{course.paymentNote}</span>}
                </span>
              )}
              {course.ctaWithPrice && course.paymentNote && <span className={cn("ml-1 text-[13px]", dark ? "text-white/65" : "text-ink-500")}>{course.paymentNote}</span>}
            </motion.div>
          </motion.div>

          <motion.ul
            variants={stagger(0.08, 0.2)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4"
            aria-label="Коротко о программе"
          >
            {facts.map((f, i) => {
              const t = tiles[i % tiles.length]!;
              return (
                <motion.li key={f.label} variants={fadeUp} className={cn("flex min-h-[150px] flex-col justify-between gap-4 rounded-[24px] p-5", t.tile)}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-[11px] font-bold uppercase tracking-wider", t.label)}>{f.label}</p>
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", t.icon)}>
                      <f.icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <p className="font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.375rem)] font-bold leading-tight">{f.value}</p>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
