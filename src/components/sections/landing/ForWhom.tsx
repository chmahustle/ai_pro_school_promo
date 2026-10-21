import { Check } from "lucide-react";
import { HomeSection, RevealGroup, RevealItem, SectionIntro } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ForWhomProps {
  items: { title: string; text: string }[];
  footnote?: string;
  title?: string;
  eyebrow?: string;
  /** Оставлен для совместимости вызовов: блок всегда тёмный */
  tone?: "bg" | "white" | "lavender";
  /** Нумерация 01–06 вместо галочек */
  numbered?: boolean;
}

/**
 * «Этот эфир для вас, если вы» — тёмная панель в стиле главной: стеклянные плитки с крупными номерами,
 * внизу розовая плашка-вывод (footnote).
 */
export function ForWhom({ items, footnote, title = "Этот эфир для вас, если вы", eyebrow = "Для кого", numbered = true }: ForWhomProps) {
  if (items.length === 0) return null;
  return (
    <HomeSection id="for-whom" labelledBy="for-whom-title" tone="dark" compact className="mt-4">
      <SectionIntro id="for-whom-title" tone="dark" align="left" eyebrow={eyebrow} title={title} />
      <RevealGroup as="ul" className="audience-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <RevealItem as="li" key={it.title} className="flex">
            <div className="audience-tile flex w-full flex-col gap-3 rounded-[24px] bg-white/[0.07] p-5 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.11] sm:p-6">
              <span className={cn("font-display text-[40px] font-extrabold leading-none text-white/20", !numbered && "hidden")}>0{i + 1}</span>
              {!numbered && (
                <span className="grid size-10 place-items-center rounded-full bg-brand text-white">
                  <Check className="size-4" aria-hidden />
                </span>
              )}
              <div>
                <h3 className="font-sans text-[16px] font-bold leading-snug text-white">{it.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{it.text}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      {footnote && (
        <RevealItem className="mt-5 flex items-center justify-center gap-3 rounded-[24px] bg-brand p-5 text-center text-[15px] font-semibold text-white">
          {footnote}
        </RevealItem>
      )}
    </HomeSection>
  );
}
