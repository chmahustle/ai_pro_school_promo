import { ArrowDown, FileText, Flame, Laptop, Lightbulb, LifeBuoy, MapPin, MessageCircle, PlayCircle, Send, Sparkles, Users, Video } from "lucide-react";
import { Accordion, Avatar, Button, HomeSection, Pill, Reveal, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import { BuildCarousel } from "./BuildCarousel";
import { BuildIdeas } from "./BuildIdeas";
import { TimelineClient } from "./TimelineClient";
import { GrowthGrid } from "./GrowthGrid";
import { PhotoCarousel } from "./PhotoCarousel";
import { VideoCarousel } from "./VideoCarousel";
import type { getOfflineBuild, getOfflineSkill, getOfflineTimeline, getPracticumFormats, getPracticumGets, getPracticumGrowth, getPracticumGuide, getPracticumResults, getPracticumTeacher, PublicCourseContent } from "@/data/courseContent";
import { YoutubeTeaser } from "./YoutubeTeaser";
import { cn, nbspDash } from "@/lib/utils";
import Image from "next/image";

/** Красная dev-пометка (приходит только в dev) */
function DevNote({ note, className }: { note?: string | null; className?: string }) {
  return note ? <p className={cn("text-[12px] font-semibold text-danger", className)}>{note}</p> : null;
}

/** «Программа»: часть 1 и часть 2 - аккордеоны модулей (название, цель одной строкой, список уроков). Нет модулей - блока нет */
export function CourseProgram({ program }: { program: PublicCourseContent["program"] }) {
  if (program.length === 0) return null;
  return (
    <Section id="program" className="scroll-mt-24" aria-labelledby="course-program-title">
      <SectionIntro id="course-program-title" align="left" eyebrow="Программа" title="Программа курса" />
      <div className="flex flex-col gap-10">
        {program.map((part) => (
          <Reveal key={part.part}>
            <h3 className="mb-4 font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] font-bold leading-tight">{nbspDash(part.partTitle)}</h3>
            <Accordion
              tone="white"
              items={part.modules.map((m) => ({
                id: m.id,
                eyebrow: `Модуль ${m.number}`,
                title: (
                  <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
                    {nbspDash(m.title)}
                    {m.optional && <Pill tone="white">по желанию</Pill>}
                  </span>
                ),
                content: (
                  <div className="flex flex-col gap-3">
                    <DevNote note={m.devNote} />
                    <p className="text-[15px] font-medium leading-snug text-ink">{nbspDash(m.goal)}</p>
                    <ul className="flex flex-col gap-1.5 text-[15px] text-ink-700">
                      {m.lessons.map((l) => (
                        <li key={l} className="flex gap-2.5">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              }))}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** «Что вы сделаете»: нумерованные плитки; плитка-акцент («+ более 20 проектов») - на тёмном фоне и без номера */
export function CourseMilestones({ id, items, title = "Что вы сделаете" }: { id: string; items: PublicCourseContent["milestones"]; title?: string }) {
  if (items.length === 0) return null;
  let n = 0;
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Результат" title={title} />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <RevealItem as="li" key={m.id} className="flex">
            {m.highlight ? (
              <div className="audience-tile flex w-full items-center rounded-[24px] bg-brand-600 p-5 text-white sm:p-6">
                <div>
                  <DevNote note={m.devNote} />
                  <p className="font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] font-extrabold leading-snug">{nbspDash(m.text)}</p>
                </div>
              </div>
            ) : (
              <div className="audience-tile flex w-full items-start gap-4 rounded-[24px] bg-surface p-5 shadow-soft">
                <span className="font-display text-[28px] font-extrabold leading-none text-brand/40 tabular-nums">{String(++n).padStart(2, "0")}</span>
                <div>
                  <DevNote note={m.devNote} />
                  <p className="text-[15px] font-medium leading-snug">{nbspDash(m.text)}</p>
                </div>
              </div>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** «Один навык для любых задач» (офлайн-урок): заголовок с розовым акцентом, вводный абзац и три белые карточки с номерами */
export function CourseSkill({ skill }: { skill: ReturnType<typeof getOfflineSkill> }) {
  if (skill.items.length === 0) return null;
  return (
    <Section aria-labelledby="offline-skill-title">
      <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
        <h2 id="offline-skill-title" className="font-display text-[clamp(1.875rem,1.3rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink">
          {nbspDash(skill.title)} <span className="text-brand">{skill.titleAccent}</span>
        </h2>
        <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.7] text-ink-700 [text-wrap:balance]">
          {skill.lead} <span className="font-semibold text-brand">{skill.leadAccent}</span>.
        </p>
      </div>
      <RevealGroup as="ol" className="mt-12 grid gap-4 md:grid-cols-3">
        {skill.items.map((it, i) => (
          <RevealItem as="li" key={it.id} className="flex">
            <div className="flex w-full items-start gap-4 rounded-[24px] bg-surface p-5 shadow-soft sm:p-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-brand-50 font-display text-[20px] font-extrabold text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <DevNote note={it.devNote} />
                <h3 className="font-display text-[19px] font-bold leading-snug">{it.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-700">{it.text}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";

type BuildData = ReturnType<typeof getOfflineBuild>;

function Bubble({ text, time, gap, tone }: { text: string; time?: string; gap?: string; tone: "now" | "built" }) {
  return (
    <>
      {gap && <p className={cn("py-0.5 text-center text-[12px] font-semibold uppercase tracking-wide", tone === "now" ? "text-white/60" : "text-ink-500")}>{gap}</p>}
      <div className={cn("flex items-end justify-between gap-3 rounded-2xl px-3 py-2.5 text-[14px] leading-snug sm:px-3.5", tone === "now" ? "bg-white/10 text-white/75" : "bg-white text-ink shadow-soft")}>
        <span>{text}</span>
        {time && <span className={cn("shrink-0 text-[12px] tabular-nums", tone === "now" ? "text-white/55" : "text-ink-500")}>{time}</span>}
      </div>
    </>
  );
}

/** Мини-график из столбиков (статичный SVG, вымышленные данные примера) */
function MiniChart({ values }: { values: number[] }) {
  const w = 140;
  const h = 56;
  const step = w / values.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 6}`} role="img" aria-label="Пример: продажи по дням недели" className="h-16 w-full">
      {values.map((v, i) => {
        const bh = (v / 100) * h;
        return <rect key={i} x={i * step + step * 0.18} y={h - bh + 3} width={step * 0.64} height={bh} rx={3} className={i === values.length - 1 ? "fill-brand-600" : "fill-brand-200"} />;
      })}
    </svg>
  );
}

/** Круглая стрелка между панелями: вниз (колонка) или вправо (широкая карточка) и подпись «на уроке» */
function Connector({ horizontal }: { horizontal?: boolean }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", horizontal ? "lg:flex-col lg:px-2" : "")} aria-hidden>
      <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-white shadow-soft">
        <ArrowDown className={cn("size-4", horizontal && "lg:-rotate-90")} />
      </span>
      <span className="text-[13px] font-semibold text-brand-200">на уроке</span>
    </div>
  );
}

/**
 * «Что соберёте именно вы» (страница офлайн-урока /courses/vibecoding-offline, ProductLanding): на тёмной панели четыре карточки-примера.
 * В карточке: метка аудитории и боль (заголовок с запасом под 3 строки) → тёмная панель «Сейчас» → коннектор «на уроке» →
 * светлая панель «Соберёте на уроке». ≥1024 px - сетка из трёх колонок (общие строки через subgrid: панели всех карточек начинаются
 * на одной линии, нижние одной высоты), ниже - лента со scroll-snap. Затем «Ещё N идей».
 */
export function CourseBuild({ build }: { build: BuildData }) {
  if (build.cards.length === 0) return null;
  const wideLast = build.cards.length % 3 === 1;
  return (
    <HomeSection tone="dark" labelledBy="offline-build-title" mobileCompact className="mt-4">
      <SectionIntro id="offline-build-title" tone="dark" align="left" eyebrow="Примеры" title="Что соберёте именно вы" />
      <BuildCarousel label="Примеры того, что вы соберёте на уроке">
        {build.cards.map((c, idx) => {
          const wide = wideLast && idx === build.cards.length - 1;
          return (
            <li
              key={c.id}
              className={cn(
                "flex w-[92%] shrink-0 snap-start flex-col gap-4 rounded-[28px] bg-white/[0.06] p-3.5 text-white ring-1 ring-white/10 sm:w-[420px] sm:p-6",
                wide
                  ? "lg:col-span-3 lg:grid lg:w-auto lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-4 lg:gap-y-4"
                  : "lg:row-span-4 lg:grid lg:w-auto lg:grid-rows-subgrid lg:gap-y-4",
              )}
            >
              <div className={cn("min-h-[8.75rem] sm:min-h-[9.5rem]", wide && "lg:col-span-3 lg:min-h-0")}>
                <DevNote note={c.devNote} />
                <Pill tone="white" size="sm">{c.audience}</Pill>
                <h3 className="mt-3 font-display text-[22px] font-bold leading-snug [text-wrap:balance] sm:text-[24px]">{nbspDash(c.pain)}</h3>
              </div>

              <div className={cn("flex min-h-[15rem] flex-col gap-2 rounded-[20px] bg-black/30 p-3 ring-1 ring-white/10 sm:p-3.5", wide && "lg:min-h-0")}>
                <p className="text-[12px] font-bold uppercase tracking-wider text-white/70">Сейчас · {c.now.source}</p>
                {c.now.lines.map((l, i) => (
                  <Bubble key={i} text={l.text} time={l.time} gap={l.gap} tone="now" />
                ))}
                <p className="mt-0.5 text-[13px] font-semibold text-brand-200">{c.now.outcome}</p>
              </div>

              <Connector horizontal={wide} />

              <div className="flex flex-1 flex-col gap-2 rounded-[20px] bg-lavender p-3 text-ink sm:p-3.5">
                <p className="text-[12px] font-bold uppercase tracking-wider text-ink-700">Соберёте на уроке</p>
                <p className="flex flex-wrap items-center gap-2 font-display text-[18px] font-bold leading-tight">
                  {c.built.title}
                  {c.built.badge && <span className="rounded-pill bg-brand-100 px-2.5 py-1 text-[13px] font-bold leading-none text-brand-700">{c.built.badge}</span>}
                </p>
                {c.built.lines.map((l, i) => (
                  <Bubble key={i} text={l.text} time={l.time} gap={l.gap} tone="built" />
                ))}
                {c.built.chart && (
                  <div className="rounded-2xl bg-white p-3 shadow-soft">
                    <MiniChart values={c.built.chart} />
                  </div>
                )}
                {c.built.stats && (
                  <ul className="flex flex-col gap-1.5">
                    {c.built.stats.map((st) => (
                      <li key={st.label} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3.5 py-2 text-[14px] shadow-soft">
                        <span className="text-ink-700">{st.label}</span>
                        <span className="whitespace-nowrap font-display text-[15px] font-bold text-ink">{st.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {c.built.tags && (
                  <ul className="flex flex-col gap-1.5">
                    {c.built.tags.map((t) => (
                      <li key={t.label} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3.5 py-2 text-[14px] shadow-soft">
                        <span>{t.label}</span>
                        <span className="rounded-pill bg-brand-100 px-2.5 py-0.5 text-[13px] font-semibold text-brand-700">{t.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </BuildCarousel>

      <BuildIdeas groups={build.ideas} />
      <p className="mt-4 max-w-[60ch] text-[14px] text-white/70">{build.ideasNote}</p>

    </HomeSection>
  );
}

type TimelineData = ReturnType<typeof getOfflineTimeline>;

/** «3 часа на уроке»: широкий блок слева направо, линия по блокам прорисовывается при прокрутке (клиентская часть - TimelineClient) */
export function CourseTimeline({ timeline, date, time }: { timeline: TimelineData; date: string | null; time: string | null }) {
  if (timeline.items.length === 0) return null;
  return (
    <Section aria-labelledby="offline-timeline-title">
      <TimelineClient
        title={timeline.title}
        date={date}
        time={time}
        items={timeline.items}
        outcomePrefix={timeline.outcomePrefix}
        outcomeAccent={timeline.outcomeAccent}
        outcomeRest={timeline.outcomeRest}
      />
    </Section>
  );
}

const GETS_ICONS = { live: Video, chat: MessageCircle, records: PlayCircle, ideas: Lightbulb, prompts: Sparkles, docs: FileText, clients: Users } as const;

/**
 * «Что вы получаете, присоединившись» (практикум): светлая секция в стиле остальных плиточных блоков - заголовок слева,
 * семь компактных плиток с иконкой (первая шире). Крупная метка («3 эфира») - розовая, пояснение - обычным текстом.
 */
export function PracticumGets({ items }: { items: ReturnType<typeof getPracticumGets> }) {
  if (items.length === 0) return null;
  return (
    <Section aria-labelledby="practicum-gets-title">
      <SectionIntro id="practicum-gets-title" align="left" eyebrow="Состав" title="Что вы получаете, присоединившись" />
      <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const Icon = GETS_ICONS[it.id as keyof typeof GETS_ICONS] ?? Sparkles;
          return (
            <RevealItem as="li" key={it.id} className={cn("flex", i === 0 && "lg:col-span-2")}>
              <div className={cn("flex w-full items-start gap-4 rounded-[24px] p-5", i === 0 ? "bg-lavender" : "bg-surface shadow-soft")}>
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-full text-brand", i === 0 ? "bg-surface" : "bg-brand-50")}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <DevNote note={it.devNote} />
                  <h3 className="font-display text-[20px] font-extrabold leading-tight text-brand">{it.label}</h3>
                  <p className="mt-1 text-[14px] leading-snug text-ink-700">
                    {it.bold && it.text.includes(it.bold) ? (
                      <>
                        {it.text.slice(0, it.text.indexOf(it.bold))}
                        <b className="font-semibold text-ink">{it.bold}</b>
                        {it.text.slice(it.text.indexOf(it.bold) + it.bold.length)}
                      </>
                    ) : (
                      it.text
                    )}
                  </p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

/** «Коротко о практикуме»: видео-превью, плеер по клику */
export function PracticumVideo({ youtubeId, posterSrc, title }: { youtubeId: string; posterSrc: string; title: string }) {
  return (
    <Section aria-labelledby="practicum-video-title">
      <h2 id="practicum-video-title" className="mb-8 text-center font-display text-[clamp(1.875rem,1.3rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink">
        Коротко о <span className="text-brand">практикуме</span>
      </h2>
      <YoutubeTeaser youtubeId={youtubeId} posterSrc={posterSrc} title={title} />
    </Section>
  );
}


/** «Мы сами выросли благодаря роликам через ИИ»: рост площадок школы (Instagram, TikTok, YouTube) */
export function PracticumGrowth({ growth }: { growth: ReturnType<typeof getPracticumGrowth> }) {
  if (growth.stats.length === 0) return null;
  return (
    <HomeSection tone="dark" labelledBy="practicum-growth-title" mobileCompact className="mt-4">
      {/* Шапка: заголовок слева, подзаголовок справа (на узких экранах друг под другом) */}
      <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <h2 id="practicum-growth-title" className="font-display text-[clamp(1.875rem,1.3rem+2.4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-white">
          {growth.title}
          <br />
          <span className="text-brand">{growth.titleAccent}</span>
          <br />
          {growth.titleTail}
        </h2>
        <div>
          <p className="max-w-[46ch] text-[17px] leading-[1.7] text-white/80">{growth.lead}</p>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.7] text-white/90">
            <Flame className="mr-1.5 inline size-5 -translate-y-0.5 text-brand" aria-hidden />
            <b className="font-bold text-brand">{growth.highlight}</b> {growth.highlightText}
          </p>
        </div>
      </div>
      <GrowthGrid stats={growth.stats} />
    </HomeSection>
  );
}

/** «Результаты наших учеников после практикума»: тёмная панель, заголовок в две строки, скриншоты переписок каруселью (как на странице школы) */
export function PracticumResults({ results }: { results: ReturnType<typeof getPracticumResults> }) {
  if (results.shots.length === 0) return null;
  return (
    <HomeSection tone="dark" labelledBy="practicum-results-title" mobileCompact className="mt-4">
      <h2 id="practicum-results-title" className="mb-10 font-display text-[clamp(1.875rem,1.3rem+2.4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-white">
        <span className="text-brand">{results.title}</span>
        <br />
        {results.titleTail}
      </h2>
      <PhotoCarousel shots={results.shots} label="Скриншоты переписок учеников после практикума" altPrefix="Результат ученика практикума" />
    </HomeSection>
  );
}

/** «Какие ролики вы можете создавать, обучившись нашим ИИ»: семь форматов - горизонтальная лента вертикальных роликов с подписями, плеер по клику */
export function PracticumFormats({ formats }: { formats: ReturnType<typeof getPracticumFormats> }) {
  if (formats.videos.length === 0) return null;
  return (
    <Section aria-labelledby="practicum-formats-title">
      <h2 id="practicum-formats-title" className="mb-8 font-display text-[clamp(1.875rem,1.3rem+2.4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink">
        {formats.title}
        <br />
        <span className="text-brand">{formats.titleAccent}</span>
        <br />
        <span className="text-[0.55em] font-bold text-ink-500">{formats.titleTail}</span>
      </h2>
      <VideoCarousel label="Какие ролики можно создавать" items={formats.videos.map((v) => ({ id: v.id, poster: v.poster, youtubeId: v.youtubeId, label: v.label }))} />
    </Section>
  );
}

/** «Меня зовут Надира Батырбаева» (практикум): спокойная лавандовая панель с мягкими фигурами - фото слева, справа имя, «Я основатель…» и семь пунктов */
export function PracticumTeacher({ teacher, photo }: { teacher: ReturnType<typeof getPracticumTeacher>; photo: string | null }) {
  if (teacher.facts.length === 0) return null;
  return (
    <Section aria-labelledby="practicum-teacher-title">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-lavender p-5 sm:p-8 lg:p-10">
        <svg aria-hidden viewBox="0 0 100 100" fill="#ffffff" className="pointer-events-none absolute -bottom-12 -right-8 -z-10 size-[260px] opacity-80 sm:size-[320px]">
          <path d={STAR} />
        </svg>
        <svg aria-hidden viewBox="0 0 200 200" fill="none" className="pointer-events-none absolute -left-16 -top-20 -z-10 size-[240px] opacity-70">
          <circle cx="100" cy="100" r="78" stroke="#ffffff" strokeWidth="10" />
        </svg>
        <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr] sm:gap-10 lg:grid-cols-[240px_1fr]">
          <div className="relative mx-auto aspect-[4/5] w-[180px] overflow-hidden rounded-[24px] bg-surface shadow-float ring-4 ring-white sm:w-full">
            {photo ? <Image src={photo} alt={teacher.name} fill sizes="240px" className="object-cover object-[50%_18%]" /> : <Avatar name={teacher.name} src={null} size="xl" className="size-full rounded-none" />}
          </div>
          <div>
            <Pill tone="white">Преподаватель</Pill>
            <h2 id="practicum-teacher-title" className="mt-3 font-display text-[clamp(1.375rem,1.1rem+1.2vw,1.875rem)] font-bold leading-tight text-ink">
              {teacher.greeting} <span className="font-extrabold">{teacher.name}</span>
            </h2>
            <p className="mt-2 text-[16px] leading-snug text-ink-700">
              {teacher.lead.map((p, i) => (
                <span key={i} className={p.accent ? "font-semibold text-brand-600" : undefined}>
                  {p.text}
                </span>
              ))}
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2 lg:grid-cols-2">
              {teacher.facts.map((f) => (
                <li key={f.id} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-700">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand" />
                  <span>
                    <DevNote note={f.devNote} />
                    {f.parts.map((p, i) => (
                      <span key={i} className={p.accent ? "font-semibold text-ink" : undefined}>
                        {p.text}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Мини-гайд (практикум): обложка и текст слева направо, кнопка в Telegram школы. Это не бонус за оплату - гайд доступен всем */
export function PracticumGuide({ guide }: { guide: NonNullable<ReturnType<typeof getPracticumGuide>> }) {
  return (
    <Section aria-labelledby="practicum-guide-title">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-dark p-6 text-white sm:p-10">
        <svg aria-hidden viewBox="0 0 100 100" fill="#ffffff" className="pointer-events-none absolute -bottom-10 -right-6 -z-10 size-[240px] opacity-[0.06]">
          <path d={STAR} />
        </svg>
        <div className="grid items-center gap-8 sm:grid-cols-[180px_1fr] sm:gap-12">
          <Image src={guide.cover} alt={guide.guideTitle} width={420} height={625} sizes="(max-width:640px) 160px, 180px" className="mx-auto h-auto w-[150px] -rotate-3 drop-shadow-2xl sm:w-full" />
          <div>
            <Pill tone="brand" size="sm">{guide.eyebrow}</Pill>
            <h2 id="practicum-guide-title" className="mt-3 font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] font-extrabold leading-tight">
              {guide.title}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-white/80">
              {guide.lead} <b className="font-bold text-white">{guide.guideTitle}</b>
            </p>
            <p className="mt-2 text-[16px] leading-relaxed text-white/80">{guide.text}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-white/80">{guide.action}</p>
            <Button variant="white" size="lg" href={guide.href} target="_blank" rel="noopener noreferrer" icon={<Send className="size-5" />} className="mt-6">
              {guide.cta}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

const DELIVERY_ICONS = { online: Laptop, recorded: PlayCircle, calls: Video, support: LifeBuoy, chat: MessageCircle, offline: MapPin } as const;

/** «Как проходит обучение»: формат, записи, онлайн-созвоны, поддержка разработчика, чат */
export function CourseDelivery({ items }: { items: PublicCourseContent["delivery"] }) {
  if (items.length === 0) return null;
  return (
    <Section aria-labelledby="course-delivery-title">
      <SectionIntro id="course-delivery-title" align="left" eyebrow="Формат" title="Как проходит обучение" />
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => {
          const Icon = DELIVERY_ICONS[d.id as keyof typeof DELIVERY_ICONS] ?? Laptop;
          return (
            <RevealItem as="li" key={d.id} className="flex">
              <div className="flex w-full flex-col gap-4 rounded-[24px] bg-lavender p-5 sm:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-brand-600">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <DevNote note={d.devNote} className="mb-1" />
                  <h3 className="font-display text-[19px] font-bold leading-snug">{nbspDash(d.title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{nbspDash(d.text)}</p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

/** «Что понадобится кроме курса»: слева заголовок, справа сервисы, которые оплачивает студент (суммы не переносятся) */
export function CourseCosts({ costs }: { costs: PublicCourseContent["costs"] }) {
  if (costs.items.length === 0) return null;
  return (
    <Section aria-labelledby="course-costs-title">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        <SectionIntro id="course-costs-title" align="left" eyebrow="Расходы" title="Что понадобится кроме курса" description={`Ноутбук и два сервиса. ${costs.payer}.`} />
        <div>
          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
            {costs.items.map((c, i) => (
              <RevealItem as="li" key={c.id} className="flex">
                <div className={cn("flex w-full flex-col gap-3 rounded-[28px] p-6 sm:p-7", i % 2 === 0 ? "bg-lavender" : "bg-peach")}>
                  <DevNote note={c.devNote} />
                  <h3 className="font-display text-[19px] font-bold leading-snug">{c.name}</h3>
                  <p className="whitespace-nowrap font-display text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-extrabold leading-none">{c.amount}</p>
                  {c.hint && <p className="text-[14px] leading-snug text-ink-700">{c.hint}</p>}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}

/** «Ведёт курс»: два преподавателя - фото, имя, роль (строки - speakers.ts) */
export function CourseTeachers({ teachers, title = "Ведёт курс", id = "course-teachers-title" }: { teachers: { id: string; name: string; role: string; photo: string | null }[]; title?: string; id?: string }) {
  if (teachers.length === 0) return null;
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Преподаватели" title={title} />
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
        {teachers.map((t) => (
          <RevealItem as="li" key={t.id} className="flex">
            <div className="relative isolate flex w-full items-center gap-5 overflow-hidden rounded-[28px] bg-lavender p-5 sm:gap-6 sm:p-6">
              {/* Декор как у «Ведёт …»: большая звезда справа внизу и контурный круг слева вверху (за содержимым) */}
              <svg aria-hidden viewBox="0 0 100 100" fill="#ffffff" className="pointer-events-none absolute -bottom-8 -right-6 -z-10 size-[170px] opacity-80 sm:size-[200px]">
                <path d={STAR} />
              </svg>
              <svg aria-hidden viewBox="0 0 200 200" fill="none" className="pointer-events-none absolute -left-12 -top-14 -z-10 size-[170px] opacity-70">
                <circle cx="100" cy="100" r="78" stroke="#ffffff" strokeWidth="10" />
              </svg>
              <div className="relative size-[96px] shrink-0 overflow-hidden rounded-[22px] bg-surface shadow-float ring-4 ring-white sm:size-[120px]">
                {t.photo ? <Image src={t.photo} alt={t.name} fill sizes="120px" className="object-cover object-[50%_18%]" /> : <Avatar name={t.name} src={null} size="xl" className="size-full rounded-none" />}
              </div>
              <div>
                <h3 className="font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] font-extrabold leading-tight">{t.name}</h3>
                <p className="mt-1.5 text-[15px] leading-snug text-ink-700">{t.role}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
