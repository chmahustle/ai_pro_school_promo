import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Signal } from "lucide-react";
import { ArrowLink, RevealGroup, RevealItem, Section, SectionIntro, TileDecor } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { courses } from "@/data/courses";
import type { Course } from "@/data/types";
import { formatPriceParts, getCurrentPrice, getProductForCourse } from "@/data/products";
import { getCourseStart } from "@/lib/course-start";
import { cn } from "@/lib/utils";

interface CoursesCatalogProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  bare?: boolean;
  items?: Course[];
  /** Ссылка «Все программы» справа от заголовка (на главной) */
  allHref?: string;
}

type Tone = "brand" | "lavender" | "dark";

/** Цвет карточки по курсу: розовая — ИИ-креатор, сиреневая — практикум, тёмная — вайбкодинг */
const toneBySlug: Record<Course["slug"], Tone> = { "ai-creator": "brand", practicum: "lavender", vibecoding: "dark" };

const tones: Record<Tone, { tile: string; pill: string; line: string; muted: string; arrow: string; index: string }> = {
  brand: { tile: "bg-brand text-white", pill: "bg-white/20 text-white", line: "border-white/25", muted: "text-white/75", arrow: "bg-white text-brand group-hover:bg-dark group-hover:text-white", index: "text-white/30" },
  lavender: { tile: "bg-lavender text-ink", pill: "bg-ink/[0.07] text-ink", line: "border-ink/10", muted: "text-ink-500", arrow: "bg-ink text-white", index: "text-ink/20" },
  dark: { tile: "bg-dark text-white", pill: "bg-white/12 text-white", line: "border-white/15", muted: "text-white/65", arrow: "bg-white text-ink", index: "text-white/25" },
};

/** Каталог программ: цветные плитки в языке главной (как «Выберите свой путь»), без пустых обложек-заглушек */
export function CoursesCatalog({
  title = "Программы школы",
  eyebrow = "Курсы",
  description = "От 7-дневного практикума до полноценной профессии. Выберите формат под свою цель и время.",
  bare,
  items = courses,
  allHref,
}: CoursesCatalogProps) {
  const grid = (
    <RevealGroup as="ul" className="audience-grid grid gap-5 md:grid-cols-3">
      {items.map((c, i) => (
        <RevealItem as="li" key={c.slug} className="flex">
          <CourseCard course={c} index={i + 1} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
  if (bare) return grid;
  return (
    <Section id="courses">
      <SectionIntro
        id="courses-title"
        align="left"
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          allHref ? (
            <ArrowLink href={allHref}>Все программы</ArrowLink>
          ) : undefined
        }
      />
      {grid}
    </Section>
  );
}

export function CourseCard({ course, index }: { course: Course; index?: number }) {
  const tone = toneBySlug[course.slug] ?? "dark";
  const product = getProductForCourse(course.slug);
  const start = getCourseStart(course);
  const t = tones[tone];
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "audience-tile group relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-[32px] p-6 outline-none sm:p-7",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand",
        t.tile,
      )}
    >
      {course.cover && <Image src={course.cover} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-20 mix-blend-luminosity" />}
      <TileDecor tone={tone} />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className={cn("font-display text-[52px] font-extrabold leading-none tabular-nums", t.index)}>
          {String(index ?? 0).padStart(2, "0")}
        </span>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          {start.badgeDate && <span className={cn("rounded-pill px-3 py-1 text-[12px] font-semibold", t.pill)}>Старт {start.badgeDate}</span>}
          {product && getCurrentPrice(product) === 0 && <span className={cn("rounded-pill px-3 py-1 text-[12px] font-semibold", t.pill)}>Бесплатно</span>}
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <h3 className="font-display text-[26px] font-bold leading-tight">{course.shortName}</h3>
        <p className={cn("mt-2 max-w-[34ch] text-[14px] leading-snug", t.muted)}>{course.tagline}</p>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
        <span className={cn("inline-flex h-8 items-center gap-1.5 rounded-pill px-3 text-[12px] font-semibold", t.pill)}>
          <Clock className="size-3.5" aria-hidden />
          {course.duration}
        </span>
        <span className={cn("inline-flex h-8 items-center gap-1.5 rounded-pill px-3 text-[12px] font-semibold", t.pill)}>
          <Signal className="size-3.5" aria-hidden />
          {course.level}
        </span>
      </div>

      <div className={cn("relative z-10 mt-auto flex items-center justify-between gap-3 border-t pt-5", t.line)}>
        {product ? <ProductPrice parts={formatPriceParts(product)} className="font-display text-xl" /> : <span />}
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110", t.arrow)}>
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
