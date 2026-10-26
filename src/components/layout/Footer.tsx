import Link from "next/link";
import { ArrowRight, Instagram, MessageCircle, Youtube } from "lucide-react";
import { NoBreakTerms } from "@/components/ui/NoBreakTerms";
import { Logo } from "./Logo";
import { LOGIN_URL } from "./nav";
import { getFooterData } from "@/data/public";
import { cn } from "@/lib/utils";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

const socialIcons = { instagram: Instagram, tiktok: TikTokIcon, youtube: Youtube } as const;

export function Footer() {
  const f = getFooterData();
  // Иконки: WhatsApp (если есть ссылка) и соцсети с непустым URL; пустой URL — иконки нет
  const contactPills = [
    ...(f.contacts.whatsapp ? [{ id: "whatsapp", label: "WhatsApp", href: f.contacts.whatsapp, icon: MessageCircle, tone: "brand" as const }] : []),
    ...f.contacts.socials.map((x) => ({ id: x.id, label: x.label, href: x.href, icon: socialIcons[x.id], tone: "ghost" as const })),
  ];

  return (
    <footer id="site-footer" className="mt-auto px-2 pb-2 pt-10 sm:px-4 sm:pb-4 sm:pt-16">
      <div className="overflow-hidden rounded-[40px] bg-dark px-5 pt-12 text-white md:px-12 md:pt-[72px]">
        {/* Верхний ряд */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-12">
          <div className="flex flex-col gap-5">
            <Logo invert />
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-white/60">{f.description}</p>
            {contactPills.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {contactPills.map((p) => {
                  const Icon = p.icon;
                  return (
                    <a
                      key={p.id}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.label}
                      title={p.label}
                      className={cn(
                        "grid size-12 place-items-center rounded-full text-white",
                        "transition-[background-color,transform] duration-200 hover:-translate-y-0.5 active:scale-[0.98]",
                        p.tone === "brand" ? "bg-brand hover:bg-brand-600" : "bg-white/[0.08] hover:bg-white/[0.16]",
                      )}
                    >
                      <Icon className="size-5 shrink-0" aria-hidden />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {f.directions.map((d) => (
              <FooterCol key={d.id} title={d.title} href={d.href}>
                {d.links.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    <NoBreakTerms text={l.label} />
                  </FooterLink>
                ))}
              </FooterCol>
            ))}

            <FooterCol title="Для кого">
              {f.audiences.map((a) => (
                <FooterLink key={a.href} href={a.href}>
                  {a.label}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title="Школа">
              {f.school.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
              <a
                href={LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-white/70 transition-colors hover:text-white"
              >
                Кабинет Strimmeo
              </a>
              {f.contacts.phone && (
                <a
                  href={f.contacts.phone.href}
                  className="mt-2 whitespace-nowrap text-[19px] font-bold leading-tight tracking-tight text-white transition-colors hover:text-brand-200"
                >
                  {f.contacts.phone.label.replace(/\s/g, "\u00a0")}
                </a>
              )}
            </FooterCol>
          </div>
        </div>

        {/* Юридическая строка */}
        <div className="relative mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="relative min-w-0 text-[13px] leading-relaxed text-white/50">
            <p>
              {f.copyright}
              {f.requisites.map((r, i) => (
                <span key={r} className={i === 0 ? "ml-1" : "mt-1 block sm:mt-0 sm:ml-1 sm:inline"}>
                  · {r}
                </span>
              ))}
            </p>
          </div>

          {f.legalLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-white/50">
              {f.legalLinks.map((l) => (
                <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Гигантский wordmark */}
        <div className="mt-12 flex justify-center overflow-visible">
          <div
            aria-hidden
            className="footer-wordmark select-none whitespace-nowrap text-center font-display font-[800] leading-[0.8] tracking-[-0.03em] transition-[background-position] duration-[1600ms] ease-out [background-position:0%_0] hover:[background-position:100%_0] motion-reduce:transition-none"
            style={{
              fontSize: "clamp(72px, 16vw, 260px)",
              backgroundImage: "linear-gradient(90deg, #FFC6B8, #FF9CC4, #B987E6, #FF9CC4, #FFC6B8)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              transform: "translateY(18%)",
            }}
          >
            AI Pro School
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  href,
  children,
  className,
}: {
  title: string;
  /** Заголовок-ссылка (колонки направлений) */
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav aria-label={title} className={cn("flex flex-col gap-2.5", className)}>
      <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-white/40">
        {href ? (
          <Link href={href} className="transition-colors hover:text-white">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      {children}
    </nav>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="footer-nav-link group inline-flex items-center text-[15px] text-white/70">
      <ArrowRight className="footer-nav-arrow size-3.5 shrink-0" aria-hidden />
      <span className="footer-nav-text">{children}</span>
    </Link>
  );
}
