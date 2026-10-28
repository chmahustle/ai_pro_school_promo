import { Laptop, LifeBuoy, MapPin, MessageCircle, PlayCircle, Video } from "lucide-react";
import { Accordion, Avatar, Pill, Reveal, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import type { PublicCourseContent } from "@/data/courseContent";
import { cn, nbspDash } from "@/lib/utils";
import Image from "next/image";

/** Красная dev-пометка (приходит только в dev) */
function DevNote({ note, className }: { note?: string | null; className?: string }) {
  return note ? <p className={cn("text-[12px] font-semibold text-danger", className)}>{note}</p> : null;
}

/** «Программа»: часть 1 и часть 2 — аккордеоны модулей (название, цель одной строкой, список уроков). Нет модулей — блока нет */
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

/** «Что вы сделаете»: нумерованные плитки; плитка-акцент («+ более 20 проектов») — на тёмном фоне и без номера */
export function CourseMilestones({ id, items }: { id: string; items: PublicCourseContent["milestones"] }) {
  if (items.length === 0) return null;
  let n = 0;
  return (
    <Section aria-labelledby={id}>
      <SectionIntro id={id} align="left" eyebrow="Результат" title="Что вы сделаете" />
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

/** «Ведёт курс»: два преподавателя — фото, имя, роль (строки — speakers.ts) */
export function CourseTeachers({ teachers }: { teachers: { id: string; name: string; role: string; photo: string | null }[] }) {
  if (teachers.length === 0) return null;
  return (
    <Section aria-labelledby="course-teachers-title">
      <SectionIntro id="course-teachers-title" align="left" eyebrow="Преподаватели" title="Ведёт курс" />
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
        {teachers.map((t) => (
          <RevealItem as="li" key={t.id} className="flex">
            <div className="flex w-full items-center gap-5 rounded-[28px] bg-lavender p-5 sm:gap-6 sm:p-6">
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
