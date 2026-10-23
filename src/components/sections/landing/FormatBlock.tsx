import { ArrowRight, Clock, MonitorPlay, Wallet, MessageCircle, type LucideIcon } from "lucide-react";
import { headingSize } from "@/lib/heading";
import { cn, nbspDash } from "@/lib/utils";
import { Pill, RevealGroup, RevealItem } from "@/components/ui";
import { Button } from "@/components/ui";
import type { Audience } from "@/data/types";

const icons: LucideIcon[] = [Clock, MonitorPlay, Wallet, MessageCircle];

interface FormatBlockProps {
  format: Audience["format"];
  /** Якорь формы заявки на странице — для кнопки в блоке */
  formAnchor?: string;
  ctaLabel?: string;
}

/**
 * Формат эфира: сиреневая панель — слева заголовок и кнопка записи, справа плитки 2×2
 * с крупными значениями (длительность / формат / стоимость / как получить ссылку).
 */
export function FormatBlock({ format, formAnchor, ctaLabel }: FormatBlockProps) {
  if (format.items.length === 0) return null;
  return (
    <section id="format" className="mt-4 px-2 sm:px-4" aria-labelledby="format-title">
      <div className="relative overflow-hidden rounded-2xl bg-lavender sm:rounded-3xl">
        {/* Фирменная волна в углу, тональная */}
        <svg viewBox="0 0 190 130" aria-hidden className="audience-decor-sway pointer-events-none absolute -bottom-6 -left-10 h-[130px] w-[190px]" fill="none">
          <path d="M0 88C34 20 70 24 96 66C120 104 156 118 192 40" stroke="#F7B0CF" strokeWidth="18" strokeLinecap="round" />
        </svg>

        <div className="container-site relative grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="flex flex-col items-start">
            <Pill tone="white" dot>
              Формат
            </Pill>
            <h2 id="format-title" className={cn("mt-4 text-ink", headingSize(format.title))}>
              {nbspDash(format.title)}
            </h2>
            {formAnchor && ctaLabel && (
              <Button variant="dark" size="md" href={`#${formAnchor}`} icon={<ArrowRight className="size-4" />} className="mt-7">
                {ctaLabel}
              </Button>
            )}
          </div>

          <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2">
            {format.items.map((it, i) => {
              const Icon = icons[i % icons.length]!;
              return (
                <RevealItem as="li" key={it.label} className="flex">
                  <div className="audience-tile flex min-h-[150px] w-full flex-col justify-between gap-4 rounded-[24px] bg-surface p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{it.label}</p>
                      <span className="grid size-10 place-items-center rounded-full bg-brand text-white">
                        <Icon className="size-[18px]" aria-hidden />
                      </span>
                    </div>
                    <p className="font-display text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] font-bold leading-tight">{it.value}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
