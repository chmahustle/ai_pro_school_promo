import { FloatingMessenger } from "@/components/layout/FloatingMessenger";
import { LandingFooter } from "@/components/layout/LandingFooter";

/** Рекламные лендинги: без общей навигации (хедер задаётся на странице), короткий футер */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <main id="main" className="calm-hover flex-1">
        {children}
      </main>
      <LandingFooter />
      <FloatingMessenger />
    </>
  );
}
