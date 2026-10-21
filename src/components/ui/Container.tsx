import type { HTMLAttributes, ReactNode } from "react";
import { DecorLines, type DecorLinesVariant } from "./DecorLines";
import { Ribbon, type RibbonVariant } from "./Ribbon";
import { cn } from "@/lib/utils";

/** Единый контентный контейнер главной (и сайта) */
export function Container({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container-site", className)} {...rest}>
      {children}
    </div>
  );
}

interface HomeSectionProps {
  children: ReactNode;
  className?: string;
  /** id секции / aria-labelledby */
  labelledBy?: string;
  id?: string;
  /** Доп. отступ сверху (например 96px после логотипов) */
  padTop?: "default" | "tight" | "after-logos";
  /** Декоративные линии на фоне панели (опционально) */
  decor?: DecorLinesVariant;
  /** Тёмная панель (ink) */
  tone?: "light" | "dark";
  /** Фоновые ленты за контентом */
  ribbon?: RibbonVariant;
  /** Уменьшенные вертикальные отступы панели */
  compact?: boolean;
}

/**
 * Оболочка секций главной: px-2/4 + скруглённый bg + Container.
 * Совпадает с «Школа в цифрах».
 */
export function HomeSection({
  children,
  className,
  labelledBy,
  id,
  padTop = "default",
  decor,
  tone = "light",
  ribbon,
  compact,
}: HomeSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-2 sm:px-4",
        padTop === "after-logos" && "pt-24",
        padTop === "tight" && "pt-0",
        className,
      )}
      aria-labelledby={labelledBy}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl sm:rounded-3xl",
          tone === "dark" ? "bg-dark text-white" : "bg-bg",
          padTop === "after-logos" ? "pb-24" : compact ? "py-14 sm:py-16" : "py-24",
        )}
      >
        {ribbon ? <Ribbon variant={ribbon} tone={tone} /> : null}
        {decor ? <DecorLines variant={decor} className="z-0" /> : null}
        <Container className="relative z-[1]">{children}</Container>
      </div>
    </section>
  );
}
