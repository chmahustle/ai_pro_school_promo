"use client";

import { LeadButton } from "@/components/ui/LeadButton";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface LandingHeaderProps {
  ctaLabel: string;
  interest: string;
  /** Якорь формы на странице — на лендингах скроллим к форме вместо модалки */
  formAnchor?: string;
  invert?: boolean;
}

/**
 * Минимальный хедер для рекламных лендингов: лого + одна CTA. Без навигации,
 * чтобы не уводить трафик (меню доступно через лого → главная).
 */
export function LandingHeader({ ctaLabel, interest, formAnchor, invert }: LandingHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "container-site flex h-14 items-center justify-between rounded-pill px-3 pl-4 backdrop-blur-xl sm:h-16 sm:px-4 sm:pl-5",
          invert ? "bg-dark/65 text-white ring-1 ring-white/10 backdrop-blur-2xl" : "bg-white/75 shadow-pill",
        )}
      >
        <Logo invert={invert} />
        {formAnchor ? (
          <a
            href={`#${formAnchor}`}
            className={cn(
              "inline-flex h-10 items-center rounded-pill px-4 text-[14px] font-semibold transition-colors",
              invert ? "bg-white text-ink hover:bg-brand hover:text-white" : "bg-ink text-white hover:bg-ink-700",
            )}
          >
            {ctaLabel}
          </a>
        ) : (
          <LeadButton variant={invert ? "dark" : "dark"} size="sm" source="landing-header" interest={interest}>
            {ctaLabel}
          </LeadButton>
        )}
      </div>
    </header>
  );
}
