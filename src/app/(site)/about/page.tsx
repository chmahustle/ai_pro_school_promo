import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { ArrowLink, MediaPlaceholder, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import { PageHero } from "@/components/sections/PageHero";
import { HomeMetrics } from "@/components/sections/HomeMetrics";
import { Team } from "@/components/sections/Team";
import { LogosMarquee } from "@/components/sections/LogosMarquee";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { generalFaq } from "@/data/faq";
import { team } from "@/data/team";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "О школе",
  description: "AI Pro School — онлайн-школа ИИ из Казахстана. Учим зарабатывать на ИИ людей без технического образования: контент, вайбкодинг, автоматизация.",
  path: "/about",
});

const principles = [
  { title: "Учим только тому, что используем сами", text: "Все инструменты и подходы — из реальных проектов школы и платформы Strimmeo. Никакой теории ради теории." },
  { title: "Для обычных людей, не для айтишников", text: "Мы сами не из IT-среды. Поэтому выбираем нейросети, с которыми справится человек любого возраста без техобразования." },
  { title: "Честно про деньги", text: "Это не пассивный доход и не «кнопка бабло». Это навык, который продаётся как услуга — и мы показываем, как именно." },
  { title: "Доводим до первых заказов", text: "Платформа с заказами, Telegram-сообщества, поддержка на старте. Ученики берут первые заказы ещё во время курса." },
];

/** Плитки принципов в цветах главной: розовая, тёмная, сиреневая, белая */
const tileTones = [
  { tile: "bg-brand text-white", text: "text-white/80", num: "text-white/30" },
  { tile: "bg-dark text-white", text: "text-white/65", num: "text-white/25" },
  { tile: "bg-lavender text-ink", text: "text-ink-500", num: "text-ink/20" },
  { tile: "bg-surface text-ink shadow-soft", text: "text-ink-500", num: "text-brand/30" },
];

export default function AboutPage() {
  const founder = team.find((m) => m.id === "nadira");
  return (
    <>
      <PageHero
        id="about-hero-title"
        eyebrow="О школе"
        title={
          <>
            Школа, которая выросла из <span className="text-gradient-brand">собственных ИИ-роликов</span>
          </>
        }
        description="Мы потратили десятки миллионов тенге на таргет и увидели, как реклама дорожает. Вирусные ролики через ИИ стали альтернативой — и мы начали учить этому других. Сегодня AI Pro School — это практикум, курс «ИИ-креатор» и направление вайбкодинга для бизнеса и специалистов."
        aside={
          founder?.photo ? (
            <figure className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[32px] bg-dark shadow-float">
              <Image src={founder.photo} alt={founder.name} fill sizes="(max-width: 1024px) 80vw, 420px" className="object-cover" priority />
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-dark/70 p-4 text-white backdrop-blur-md">
                <span>
                  <span className="block font-display text-lg leading-tight">{founder.name}</span>
                  <span className="mt-0.5 block text-[13px] text-white/70">{founder.role}</span>
                </span>
              </figcaption>
            </figure>
          ) : (
            <MediaPlaceholder src={null} alt="Фото команды / офиса AI Pro School" aspect="video" rounded="rounded-[32px]" caption="Фото команды / видео о школе" />
          )
        }
      />

      <HomeMetrics />

      <Section>
        <SectionIntro id="principles-title" align="left" eyebrow="Принципы" title="Как мы учим" description="Четыре правила, по которым устроены все программы школы." />
        <RevealGroup as="ul" className="audience-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => {
            const t = tileTones[i % tileTones.length]!;
            return (
              <RevealItem as="li" key={p.title} className="flex">
                <article className={cn("audience-tile flex min-h-[280px] w-full flex-col rounded-[28px] p-6", t.tile)}>
                  <span className={cn("font-display text-[52px] font-extrabold leading-none tabular-nums", t.num)}>0{i + 1}</span>
                  <h3 className="mt-auto pt-8 font-display text-[20px] font-bold leading-tight">{p.title}</h3>
                  <p className={cn("mt-2 text-[14px] leading-snug", t.text)}>{p.text}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      <Team />
      <LogosMarquee title="Площадки и партнёры" className="pb-12 sm:pb-16" />
      <HowItWorks />

      {/* Strimmeo — компактная тёмная полоса той же ширины, что и соседние панели */}
      <section id="strimmeo" aria-labelledby="platform-title" className="mt-4 px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl bg-dark text-white sm:rounded-3xl">
          <svg viewBox="0 0 100 100" aria-hidden className="audience-spark pointer-events-none absolute -right-6 -top-10 size-44 fill-white/[0.05]">
            <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
          </svg>
          <div className="container-site relative flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-10">
            <div className="min-w-0 max-w-3xl">
              <p className="text-[12px] font-bold uppercase tracking-wider text-brand-200">Платформа</p>
              <h2 id="platform-title" className="mt-1 font-display text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-bold leading-tight">
                Strimmeo — своя платформа ИИ-креаторов
              </h2>
              <p className="mt-1.5 max-w-[62ch] text-[14px] leading-snug text-white/65">
                Ученики размещают портфолио, а школа приводит заказчиков. Разработана при поддержке Astana Hub.
              </p>
            </div>
            <ArrowLink href={site.platformUrl} external tone="onDark" className="shrink-0 self-start sm:self-center">
              strimmeo.com
            </ArrowLink>
          </div>
        </div>
      </section>

      <FAQ items={generalFaq} />
      <LeadSection
        className="mt-10 sm:mt-16"
        formId="about-footer"
        title="Познакомимся?"
        description="Оставьте контакты — расскажем о школе и подберём программу."
        hint="Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности"
      />
    </>
  );
}
