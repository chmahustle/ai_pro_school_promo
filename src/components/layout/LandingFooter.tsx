import { Logo } from "./Logo";
import { LegalLine } from "./LegalLine";
import { site } from "@/lib/site";

/**
 * Минимальный футер лендинга: лого и телефон, ниже копирайт с реквизитами ТОО и ссылки на политику и оферту.
 * Снизу запас под плавающую кнопку «наверх» (44 px, стоит 64-136 px от низа окна): на мобильных - по высоте, на sm+ - отступ справа.
 */
export function LandingFooter() {
  return (
    <footer id="site-footer" className="container-site flex flex-col items-center gap-2 pb-40 pt-10 text-center text-[13px] text-ink-500 sm:items-stretch sm:pb-10 sm:text-left">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:pr-20">
        <Logo />
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[15px] hover:text-ink">
          {site.phones.primary}
        </a>
      </div>
      <LegalLine tone="light" className="items-center sm:pr-20" />
    </footer>
  );
}
