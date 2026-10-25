import { getNavMenu } from "@/data/navMenu";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Header menu={getNavMenu()} />
      <main id="main" className="flex-1 pt-[88px] sm:pt-[96px]">
        <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-7xl text-brand sm:text-8xl">404</p>
          <h1 className="mt-4 text-display-md">Такой страницы нет</h1>
          <p className="mt-4 max-w-[44ch] text-ink-500">Возможно, ссылка устарела. Вернитесь на главную или посмотрите курсы.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="dark" size="lg" href="/">
              На главную
            </Button>
            <Button variant="outline" size="lg" href="/courses">
              Курсы
            </Button>
          </div>
          <Link href="/contacts" className="mt-6 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline">
            Написать нам
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
