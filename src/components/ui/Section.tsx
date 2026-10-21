import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Pill } from "./Pill";

type SectionTone = "bg" | "white" | "lavender" | "soft" | "dark" | "brand";

const tones: Record<SectionTone, string> = {
  bg: "bg-bg",
  white: "bg-surface",
  lavender: "bg-lavender",
  soft: "bg-soft-100",
  dark: "bg-dark text-white",
  /** Мягкий brand-tint — не solid magenta */
  brand: "bg-brand-50 text-ink",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  /** Скруглённая «карточка-секция» с отступами по бокам */
  rounded?: boolean;
  containerClassName?: string;
  as?: "section" | "div" | "aside";
}

export function Section({
  tone = "bg",
  rounded,
  className,
  containerClassName,
  children,
  as: Tag = "section",
  ...rest
}: SectionProps) {
  if (rounded) {
    return (
      <Tag className={cn("px-2 sm:px-4", className)} {...rest}>
        <div className={cn("section-y rounded-2xl sm:rounded-3xl", tones[tone])}>
          <div className={cn("container-site", containerClassName)}>{children}</div>
        </div>
      </Tag>
    );
  }
  return (
    <Tag className={cn("section-y", tones[tone], className)} {...rest}>
      <div className={cn("container-site", containerClassName)}>{children}</div>
    </Tag>
  );
}

interface SectionHeadProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  size?: "md" | "lg";
  className?: string;
  /** Тон eyebrow-пилюли */
  eyebrowTone?: "brand" | "peach" | "white" | "dark" | "lavender" | "neutral";
  invert?: boolean;
  /** Правый слот (кнопка «Смотреть все») */
  aside?: ReactNode;
  /** Уровень заголовка. size="lg" по умолчанию даёт h1 (заголовок страницы) */
  as?: "h1" | "h2";
}

export function SectionHead({
  eyebrow,
  title,
  description,
  align = "left",
  size = "md",
  className,
  eyebrowTone = "brand",
  invert,
  aside,
  as,
}: SectionHeadProps) {
  const Heading = as ?? (size === "lg" ? "h1" : "h2");
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:mb-14",
        align === "center" ? "items-center text-center" : "items-start",
        aside && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", align === "center" ? "items-center" : "items-start")}>
        {eyebrow && <Pill tone={eyebrowTone}>{eyebrow}</Pill>}
        <Heading className={cn(size === "lg" ? "text-display-lg" : "text-display-md", "max-w-[22ch]")}>{title}</Heading>
        {description && (
          <p className={cn("max-w-[56ch] text-[14px] leading-relaxed sm:text-[15px]", invert ? "text-white/70" : "text-ink-500")}>
            {description}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
