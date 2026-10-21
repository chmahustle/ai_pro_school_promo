import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlaceholderBadge } from "./PlaceholderBadge";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Отметить как плейсхолдер (нет реального фото) */
  placeholder?: boolean;
}

const sizes = {
  xs: "size-8 text-[11px]",
  sm: "size-10 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-base",
  xl: "size-24 text-xl",
};
const px = { xs: 32, sm: 40, md: 48, lg: 64, xl: 96 };

/** Детерминированный цвет из имени, чтобы инициалы были разными */
const palette = ["bg-brand-100 text-brand-700", "bg-peach text-ink", "bg-soft-200 text-ink-700", "bg-lavender text-brand-700"];
function toneFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return palette[Math.abs(h) % palette.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, src, size = "md", className, placeholder }: AvatarProps) {
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold", sizes[size], !src && toneFor(name), className)}>
      {src ? (
        <Image src={src} alt={name} width={px[size]} height={px[size]} className="size-full object-cover" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
      {placeholder && <PlaceholderBadge className="left-0 top-0 scale-75 origin-top-left" />}
    </span>
  );
}
