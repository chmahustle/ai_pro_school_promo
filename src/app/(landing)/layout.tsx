import { FloatingMessenger } from "@/components/layout/FloatingMessenger";
import { LandingFooter } from "@/components/layout/LandingFooter";

/** Рекламные лендинги: хедер (то же меню + своя кнопка к форме) задаётся на странице, короткий футер */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" className="calm-hover flex-1">
        {children}
      </main>
      <LandingFooter />
      <FloatingMessenger />
    </>
  );
}
