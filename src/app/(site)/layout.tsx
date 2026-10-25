import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingMessenger } from "@/components/layout/FloatingMessenger";
import { getNavMenu } from "@/data/navMenu";

/** Основной сайт: полный хедер с mega-menu, футер, плавающий мессенджер */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header menu={getNavMenu()} />
      <main id="main" className="flex-1 pt-[88px] sm:pt-[96px]">
        {children}
      </main>
      <Footer />
      <FloatingMessenger />
    </>
  );
}
