"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal, Section, SectionIntro } from "@/components/ui";
import { cn, nbspDash } from "@/lib/utils";

interface Step {
  n: string;
  title: string;
  text: string;
}

const defaultSteps: Step[] = [
  { n: "01", title: "Пробуете формат", text: "7-дневный практикум: первый ИИ-ролик на бесплатных нейросетях. Понимаете, подходит ли вам такой заработок." },
  { n: "02", title: "Осваиваете профессию", text: "Курс «ИИ-креатор»: 4 направления заработка, портфолио, упакованный аккаунт. Выбираете 1–2 своих." },
  { n: "03", title: "Берёте первые заказы", text: "Ещё во время обучения: платформа Strimmeo, Telegram-сообщества, сарафан, свои соцсети." },
  { n: "04", title: "Растёте в чеке", text: "Добавляете вайбкодинг: боты, сайты, автоматизации — услуги с высоким чеком для бизнеса." },
];

interface HowItWorksProps {
  steps?: Step[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender" | "dark";
}

interface HowItWorksProps {
  steps?: Step[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender" | "dark";
}

/**
 * Линия пути (viewBox 1200×400): проходит через центры четырёх колонок (x = 150/450/750/1050) на высоте 200px,
 * между узлами плавно изгибается вверх и вниз. Карточки чередуются: ниже линии / выше линии.
 */
const PATH = "M0,200 C70,200 90,200 150,200 C260,155 340,155 450,200 C560,245 640,245 750,200 C860,155 940,155 1050,200 C1110,224 1160,214 1200,206";

/**
 * Путь ученика — 4 шага на толстой линии слева направо. Линия прорисовывается по мере прокрутки,
 * узлы-номера загораются розовым, когда линия до них доходит; карточки чередуются сверху и снизу.
 * На мобильном — вертикальная линия слева. При reduced-motion линия нарисована целиком.
 */
export function HowItWorks({
  steps = defaultSteps,
  eyebrow = "Как это работает",
  title = "Путь от первого ролика до стабильного дохода",
  description = "Мы не учим «ради обучения». Каждый шаг — про конкретный навык, который покупают.",
  tone = "lavender",
}: HowItWorksProps) {
  const invert = tone === "dark";
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 70%", "end 55%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(draw, "change", setProgress);
  const reached = (i: number) => reduce || progress >= (i + 0.5) / steps.length - 0.04;

  const node = (i: number, className?: string) => (
    <span
      className={cn(
        "grid size-12 place-items-center rounded-full font-display text-[15px] ring-8 transition-colors duration-500",
        reached(i) ? "bg-brand text-white ring-brand/20" : invert ? "bg-white/15 text-white ring-white/10" : "bg-ink text-white ring-white/70",
        className,
      )}
    >
      {steps[i]?.n}
    </span>
  );

  const card = (i: number) => {
    const st = steps[i]!;
    const last = i === steps.length - 1;
    return (
      <div
        className={cn(
          "rounded-[24px] p-5",
          last ? "bg-brand text-white" : invert ? "bg-white/5 ring-1 ring-white/10" : "bg-surface shadow-soft",
        )}
      >
        <h3 className="font-display text-[17px] leading-tight">{nbspDash(st.title)}</h3>
        <p className={cn("mt-1.5 text-[13.5px] leading-snug", last ? "text-white/85" : invert ? "text-white/65" : "text-ink-500")}>{nbspDash(st.text)}</p>
      </div>
    );
  };

  return (
    <Section tone={tone} rounded className="relative">
      <SectionIntro id="how-title" align="left" tone={invert ? "dark" : "light"} eyebrow={eyebrow} title={title} description={description} />

      <div ref={trackRef} className="relative">
        {/* Desktop: линия через центры колонок, карточки чередуются выше и ниже */}
        <div className="relative hidden h-[400px] lg:block">
          <svg aria-hidden viewBox="0 0 1200 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <path d={PATH} fill="none" stroke={invert ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.85)"} strokeWidth="26" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <motion.path
              d={PATH}
              fill="none"
              stroke="#E8307E"
              strokeWidth="26"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduce ? 1 : draw }}
            />
          </svg>

          <ol className="absolute inset-0 grid grid-cols-4">
            {steps.map((st, i) => {
              const above = i % 2 === 1;
              return (
                <li key={st.n} className="relative px-2">
                  <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">{node(i)}</div>
                  <Reveal
                    className={cn("absolute inset-x-2", above ? "bottom-[calc(50%+40px)]" : "top-[calc(50%+40px)]")}
                  >
                    {card(i)}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile / tablet: вертикальная линия слева */}
        <div className="relative lg:hidden">
          <div aria-hidden className={cn("absolute bottom-6 left-6 top-6 w-3 -translate-x-1/2 rounded-full", invert ? "bg-white/10" : "bg-white/85")} />
          <motion.div
            aria-hidden
            className="absolute bottom-6 left-6 top-6 w-3 origin-top -translate-x-1/2 rounded-full bg-brand"
            style={{ scaleY: reduce ? 1 : draw }}
          />
          <ol className="relative flex flex-col gap-4">
            {steps.map((st, i) => (
              <li key={st.n} className="relative pl-16">
                <div className="absolute left-0 top-1.5 z-10">{node(i)}</div>
                {card(i)}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
