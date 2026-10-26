import type { ReactNode } from "react";
import { nbspDash } from "@/lib/utils";
import { MeshBackdrop, Pill, Reveal, Ribbon } from "@/components/ui";

interface PageHeroProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  /** Подпись под заголовком (например, рабочее название); не переносится */
  titleCaption?: ReactNode;
  description?: string;
  /** Кнопки под описанием */
  actions?: ReactNode;
  /** Правая колонка (список, карточки…) */
  aside?: ReactNode;
}

/** Hero внутренних страниц: mesh-панель с лёгкой лентой, как hero главной; заголовок/описание слева, опционально блок справа */
export function PageHero({ id, eyebrow, title, titleCaption, description, actions, aside }: PageHeroProps) {
  return (
    <section className="px-2 sm:px-4" aria-labelledby={id}>
      <div className="relative mx-auto overflow-hidden rounded-3xl">
        <MeshBackdrop variant="home" rounded="rounded-3xl" />
        <Ribbon variant="right" tone="light" className="hidden sm:block" draw />
        <div className={aside ? "container-site relative z-10 grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20" : "container-site relative z-10 py-14 sm:py-16 lg:py-20"}>
          <div className="flex flex-col items-start">
            <Pill tone="brand" dot>
              {eyebrow}
            </Pill>
            <h1 id={id} className="mt-4 max-w-[18ch] font-display text-[clamp(2.25rem,1.4rem+3.4vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.015em] text-ink">
              {nbspDash(title)}
            </h1>
            {titleCaption && <p className="mt-2 whitespace-nowrap font-display text-[clamp(1.125rem,0.95rem+0.8vw,1.5rem)] font-bold leading-tight text-ink-500">{titleCaption}</p>}
            {description && <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-500">{nbspDash(description)}</p>}
            {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          {aside && <Reveal delay={0.1}>{aside}</Reveal>}
        </div>
      </div>
    </section>
  );
}
