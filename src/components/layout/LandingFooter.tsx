import Link from "next/link";
import { Logo } from "./Logo";
import { getLegalLinks } from "@/data/public";
import { site } from "@/lib/site";

/** Минимальный футер лендинга: лого, оферта, политика, телефон */
export function LandingFooter() {
  const legalLinks = getLegalLinks();
  return (
    <footer id="site-footer" className="container-site flex flex-col items-center gap-4 py-10 text-center text-[13px] text-ink-500 sm:flex-row sm:justify-between sm:text-left">
      <Logo />
      <p>
        © {new Date().getFullYear()} {site.name}
      </p>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {/* Политика и оферта — только утверждённые и только на домене сайта (company.ts) */}
        {legalLinks.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-ink">
            {l.label}
          </Link>
        ))}
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          {site.phones.primary}
        </a>
      </div>
    </footer>
  );
}
