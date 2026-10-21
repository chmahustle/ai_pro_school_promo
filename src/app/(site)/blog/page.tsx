import { ArrowUpRight, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Button, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import { PageHero } from "@/components/sections/PageHero";
import { CTA } from "@/components/sections/CTA";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Блог",
  description: "Статьи и разборы AI Pro School: как зарабатывать на ИИ, вайбкодинг, нейросети для бизнеса и контента.",
  path: "/blog",
});

/** PLACEHOLDER: темы первых материалов. Структура карточек готова под CMS/MDX; TODO(клиент): реальные статьи. */
const posts = [
  { slug: "todo-1", title: "Какие ИИ-услуги реально покупают в 2026 году", tag: "Заработок", date: "Скоро" },
  { slug: "todo-2", title: "Вайбкодинг для бизнеса: 5 задач, которые закрываются за вечер", tag: "Вайбкодинг", date: "Скоро" },
  { slug: "todo-3", title: "Как сделать первый вирусный ролик на бесплатных нейросетях", tag: "Контент", date: "Скоро" },
];

/** Цвета плиток как на главной: розовая, тёмная, сиреневая */
const tones = [
  { tile: "bg-brand text-white", pill: "bg-white/20 text-white", muted: "text-white/75", spark: "fill-white/25" },
  { tile: "bg-dark text-white", pill: "bg-white/12 text-white", muted: "text-white/60", spark: "fill-white/10" },
  { tile: "bg-lavender text-ink", pill: "bg-ink/[0.07] text-ink", muted: "text-ink-500", spark: "fill-brand/20" },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        id="blog-hero-title"
        eyebrow="Блог"
        title={
          <>
            Разборы, инструкции, <span className="text-gradient-brand">кейсы</span>
          </>
        }
        description="Раздел в разработке. Первые материалы появятся скоро — пока подпишитесь на соцсети школы, там мы уже делимся разборами."
        actions={
          <>
            <Button variant="dark" size="md" href={site.socials.instagram} icon={<ArrowUpRight className="size-4" />}>
              Instagram школы
            </Button>
            <Button variant="white" size="md" href={site.socials.youtube} icon={<ArrowUpRight className="size-4" />}>
              YouTube
            </Button>
          </>
        }
      />

      <Section>
        <SectionIntro id="blog-topics-title" align="left" eyebrow="Скоро" title="О чём напишем в первую очередь" description="Темы первых материалов." />
        <RevealGroup as="ul" className="audience-grid grid gap-5 md:grid-cols-3">
          {posts.map((p, i) => {
            const t = tones[i % tones.length]!;
            return (
              <RevealItem as="li" key={p.slug} className="flex">
                <article className={cn("audience-tile relative flex min-h-[320px] w-full flex-col overflow-hidden rounded-[32px] p-6 sm:p-7", t.tile)}>
                  <svg viewBox="0 0 100 100" aria-hidden className={cn("audience-spark pointer-events-none absolute -right-8 -top-8 size-40", t.spark)}>
                    <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
                  </svg>
                  <span className={cn("relative inline-flex self-start rounded-pill px-3 py-1 text-[12px] font-semibold", t.pill)}>{p.tag}</span>
                  <h2 className="relative mt-auto pt-10 font-display text-[22px] font-bold leading-tight [text-wrap:balance]">{p.title}</h2>
                  <p className={cn("relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold", t.muted)}>
                    <Clock className="size-3.5" aria-hidden />
                    {p.date}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      <CTA title="Пока статьи готовятся — выберите программу" primaryLabel="Смотреть курсы" primaryHref="/courses" tone="lines" source="blog-cta" />
    </>
  );
}
