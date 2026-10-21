import type { ReactNode } from "react";
import { Pill } from "./Pill";
import { cn } from "@/lib/utils";

interface SectionIntroProps {
  id?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** dark — для тёмных панелей */
  tone?: "light" | "dark";
  align?: "center" | "left";
  /** Правый слот (ссылка «Все …») — только при align="left" */
  action?: ReactNode;
}

/** Единая шапка секций главной: пилюля · h2 · описание (· действие справа) */
export function SectionIntro({ id, eyebrow, title, description, tone = "light", align = "center", action }: SectionIntroProps) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div
      className={cn(
        "mb-10 sm:mb-12 lg:mb-14",
        center ? "mx-auto flex max-w-[680px] flex-col items-center text-center" : "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("flex max-w-[680px] flex-col", center ? "items-center" : "items-start")}>
        <Pill tone={dark ? "white" : "brand"} dot>
          {eyebrow}
        </Pill>
        <h2 id={id} className={cn("mt-4 text-display-md", dark ? "text-white" : "text-ink")}>
          {title}
        </h2>
        {description && (
          <p className={cn("mt-3 max-w-[52ch] text-[14px] leading-relaxed [text-wrap:balance] sm:text-[15px]", dark ? "text-white/70" : "text-ink-500")}>
            {description}
          </p>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
