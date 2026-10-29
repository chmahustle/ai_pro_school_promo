import { Header } from "./Header";
import { getNavMenu } from "@/data/navMenu";

interface LandingHeaderProps {
  ctaLabel: string;
  /** Короткая подпись кнопки для узких экранов (до sm) */
  ctaShortLabel?: string;
  interest?: string;
  /** Якорь формы на странице: кнопка справа прокручивает к форме */
  formAnchor?: string;
}

/**
 * Хедер лендингов (/for/*, страницы продуктов и курсов): то же меню, что на основном сайте (Направления, Результаты, О нас,
 * бургер на мобильном), а кнопка справа ведёт к форме на странице.
 */
export function LandingHeader({ ctaLabel, ctaShortLabel, formAnchor = "lead" }: LandingHeaderProps) {
  return <Header menu={getNavMenu()} cta={{ label: ctaLabel, shortLabel: ctaShortLabel, formAnchor }} />;
}
