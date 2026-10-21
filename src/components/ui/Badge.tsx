import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * brand = brand-50 + brand-700 (≥ AA на small text).
 * Не используем white-on-#E8307E — ~4.07:1, ниже AA для 11px.
 */
type BadgeTone = "brand" | "dark" | "neutral" | "success" | "danger" | "peach";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700",
  dark: "bg-ink text-white",
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  peach: "bg-peach text-ink",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "brand", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide leading-tight",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
