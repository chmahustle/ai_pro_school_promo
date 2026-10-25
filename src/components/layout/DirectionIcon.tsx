import { Clapperboard, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Круглая иконка направления (lucide, палитра сайта): ролики — розовая, вайб-кодинг — сиреневая */
export function DirectionIcon({ direction, className }: { direction: "creator" | "vibecoding"; className?: string }) {
  const Icon = direction === "creator" ? Clapperboard : Code2;
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-full",
        direction === "creator" ? "bg-brand-50 text-brand-700" : "bg-lavender text-ink",
        className,
      )}
    >
      <Icon className="size-6" />
    </span>
  );
}
