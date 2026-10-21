import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardTone = "white" | "lavender" | "soft" | "dark" | "brand" | "peach" | "glass";

const tones: Record<CardTone, string> = {
  white: "bg-surface text-ink shadow-soft",
  lavender: "bg-lavender text-ink",
  soft: "bg-soft-100 text-ink",
  dark: "bg-dark text-white",
  /** Мягкий magenta — не solid brand (white-on-#E8307E < AA) */
  brand: "bg-brand-50 text-ink",
  peach: "bg-peach text-ink",
  glass: "bg-white/70 backdrop-blur-md text-ink shadow-soft border border-white/60",
};

interface CardProps extends HTMLAttributes<HTMLElement> {
  tone?: CardTone;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  as?: "div" | "article" | "li" | "section";
}

const paddings = { none: "", sm: "p-4 sm:p-5", md: "p-6 sm:p-7", lg: "p-7 sm:p-9" };

export function Card({ tone = "white", padding = "md", hover, className, as = "div", ...rest }: CardProps) {
  const Tag = as as "div";
  return (
    <Tag
      className={cn(
        "rounded-2xl overflow-hidden",
        tones[tone],
        paddings[padding],
        hover && "transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card",
        className,
      )}
      {...rest}
    />
  );
}
