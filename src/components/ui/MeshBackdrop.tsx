import { cn } from "@/lib/utils";

export type MeshVariant = "home" | "business" | "freelance" | "career";

const meshClass: Record<MeshVariant, string> = {
  home: "mesh-home",
  business: "mesh-business",
  freelance: "mesh-freelance",
  career: "mesh-career",
};

interface MeshBackdropProps {
  variant?: MeshVariant;
  /** Показать лёгкую сетку поверх */
  grid?: boolean;
  /** Медленная анимация слоя (transform), off при reduced-motion */
  animate?: boolean;
  className?: string;
  /** Скругление контейнера — обычно совпадает с родителем */
  rounded?: string;
}

/**
 * Mesh-фон: несколько radial-gradient, без filter:blur.
 * Класть как absolute inset-0 под контентом. Текст — не на этом слое,
 * а на surface/bg/ink поверх (или в центре, где mesh осветлён белым пятном).
 */
export function MeshBackdrop({
  variant = "home",
  grid = true,
  animate = true,
  className,
  rounded = "rounded-3xl",
}: MeshBackdropProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", rounded, className)} aria-hidden>
      {/* Анимируемый слой чуть больше родителя — drift без клиппинга краёв */}
      <div
        className={cn(
          "absolute -inset-[6%] opacity-100",
          meshClass[variant],
          animate && "mesh-animate",
        )}
      />
      {grid && <div className="bg-grid absolute inset-0 opacity-70" />}
    </div>
  );
}

/** Мягкая полоса-разделитель между секциями */
export function MeshDivider({ variant = "home", className }: { variant?: MeshVariant; className?: string }) {
  return (
    <div className={cn("relative h-16 w-full overflow-hidden sm:h-20", className)} aria-hidden>
      <div className={cn("absolute inset-0 opacity-60", meshClass[variant])} />
      <div className="absolute inset-x-0 top-0 h-px bg-ink/5" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink/5" />
    </div>
  );
}
