import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillTone = "neutral" | "brand" | "dark" | "lavender" | "peach" | "white" | "outline";

const tones: Record<PillTone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  brand: "bg-brand-50 text-brand-700",
  dark: "bg-ink text-white",
  lavender: "bg-lavender text-ink",
  peach: "bg-peach text-ink",
  white: "bg-surface text-ink shadow-soft",
  outline: "border border-ink-200 text-ink-700 bg-transparent",
};

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  size?: "sm" | "md";
  icon?: ReactNode;
  dot?: boolean;
}

/** Маленький «пилюльный» лейбл: теги, eyebrow над заголовками, статусы */
export function Pill({ tone = "neutral", size = "md", icon, dot, className, children, ...rest }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill font-semibold leading-none whitespace-nowrap",
        size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-3.5 text-[13px]",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />}
      {icon && <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>}
      {children}
    </span>
  );
}
