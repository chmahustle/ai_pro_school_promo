import type { ReactNode } from "react";
import { Pill } from "./Pill";
import { headingSize } from "@/lib/heading";
import { cn, nbspDash } from "@/lib/utils";

interface SectionIntroProps {
  id?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** dark - для тёмных панелей */
  tone?: "light" | "dark";
  align?: "center" | "left";
  /** Правый слот (ссылка «Все …») - только при align="left" */
  action?: ReactNode;
  /** Длинные строки описания (до ~85 символов, без балансировки): для абзацев в 2–3 предложения */
  wide?: boolean;
}

/** Единая шапка секций главной: пилюля · h2 · описание (· действие справа) */
export function SectionIntro({ id, eyebrow, title, description, tone = "light", align = "center", action, wide }: SectionIntroProps) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div
      className={cn(
        "mb-10 sm:mb-12 lg:mb-14",
        center ? "mx-auto flex max-w-[680px] flex-col items-center text-center" : "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("flex flex-col", wide ? "max-w-[960px]" : "max-w-[680px]", center ? "items-center" : "items-start")}>
        <Pill tone={dark ? "white" : "brand"} dot>
          {eyebrow}
        </Pill>
        <h2 id={id} className={cn("mt-4", headingSize(title), dark ? "text-white" : "text-ink")}>
          {nbspDash(title)}
        </h2>
        {description && (
          <p className={cn("mt-3 text-[14px] leading-relaxed sm:text-[15px]", wide ? "max-w-[86ch] [text-wrap:pretty]" : "max-w-[52ch] [text-wrap:balance]", dark ? "text-white/70" : "text-ink-500")}>
            {nbspDash(description)}
          </p>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
