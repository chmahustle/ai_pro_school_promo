import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  /** @deprecated — оставлен для совместимости вызовов, не влияет на видимость */
  delay?: number;
  rotate?: number;
  float?: "normal" | "slow" | "none";
  tone?: "white" | "dark" | "brand";
}

const tones = {
  white: "bg-surface text-ink shadow-float",
  dark: "bg-dark text-white shadow-float",
  brand: "bg-brand-50 text-ink shadow-card",
};

/** Всегда видима (без framer opacity:0). Парение — CSS transform. */
export function FloatingCard({
  children,
  className,
  rotate = 0,
  float = "normal",
  tone = "white",
}: FloatingCardProps) {
  return (
    <div className={cn("absolute z-10", className)} aria-hidden>
      <div
        style={{ ["--float-rotate" as string]: `${rotate}deg`, transform: `rotate(${rotate}deg)` }}
        className={cn(
          "rounded-2xl p-3.5 sm:p-4",
          tones[tone],
          float === "normal" && "animate-float",
          float === "slow" && "animate-float-slow",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ProgressCardContent({
  name,
  sub,
  progress,
  label,
}: {
  name: string;
  sub: string;
  progress: number;
  label: string;
}) {
  return (
    <div className="flex w-[180px] flex-col gap-2.5 sm:w-[200px]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
          {name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight">{name}</p>
          <p className="truncate text-[11px] text-ink-500">{sub}</p>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold text-ink-700">{label}</p>
        <div className="h-1.5 overflow-hidden rounded-pill bg-ink-100">
          <div className="h-full rounded-pill bg-brand" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export function StatCardContent({
  value,
  label,
  sub,
  invert,
}: {
  value: string;
  label: string;
  sub?: string;
  invert?: boolean;
}) {
  return (
    <div className="flex min-w-[140px] flex-col gap-0.5">
      <p className={cn("text-[11px] font-semibold", invert ? "text-white/60" : "text-ink-500")}>{label}</p>
      <p className="font-display text-xl leading-none sm:text-2xl">{value}</p>
      {sub && <p className={cn("text-[11px]", invert ? "text-white/60" : "text-ink-500")}>{sub}</p>}
    </div>
  );
}

export function PersonChipContent({ name, role, emoji }: { name: string; role: string; emoji?: string }) {
  return (
    <div className="flex items-center gap-2.5 pr-1">
      <span className="grid size-9 place-items-center rounded-full bg-white/15 text-lg">{emoji ?? name.slice(0, 1)}</span>
      <div>
        <p className="text-[13px] font-semibold leading-tight">{name}</p>
        <p className="text-[11px] opacity-70">{role}</p>
      </div>
    </div>
  );
}
