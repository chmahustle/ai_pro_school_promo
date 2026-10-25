"use client";

import { LeadButton } from "@/components/ui/LeadButton";
import { Logo } from "./Logo";

interface LandingHeaderProps {
  ctaLabel: string;
  /** Короткая подпись кнопки для узких экранов (до sm) */
  ctaShortLabel?: string;
  interest: string;
  /** Якорь формы на странице — на лендингах скроллим к форме вместо модалки */
  formAnchor?: string;
}

/**
 * Минимальный хедер для лендингов (/for/*, страницы продуктов): логотип без ссылки + одна CTA. Без навигации,
 * чтобы не уводить трафик.
 * Сплошная белая пилюля с тенью (как у главной шапки), логотип цветной, одна строка на любой ширине.
 */
export function LandingHeader({ ctaLabel, ctaShortLabel = "Записаться", interest, formAnchor }: LandingHeaderProps) {
  const label = (
    <>
      <span className="sm:hidden">{ctaShortLabel}</span>
      <span className="hidden sm:inline">{ctaLabel}</span>
    </>
  );
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="container-site flex h-14 items-center justify-between gap-3 rounded-pill bg-white px-3 pl-4 text-ink shadow-pill ring-1 ring-ink/5 sm:h-16 sm:px-4 sm:pl-5">
        <Logo className="shrink-0" asLink={false} />
        {formAnchor ? (
          <a
            href={`#${formAnchor}`}
            className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-pill bg-ink px-4 text-[14px] font-semibold text-white transition-colors hover:bg-ink-700"
          >
            {label}
          </a>
        ) : (
          <LeadButton variant="dark" size="sm" source="landing-header" interest={interest}>
            {label}
          </LeadButton>
        )}
      </div>
    </header>
  );
}
