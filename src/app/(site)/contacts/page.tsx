import { Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Button, Placeholder, Reveal, Section, SectionHead } from "@/components/ui";
import { LeadForm } from "@/components/sections/LeadForm";
import { getFormConfig, getLegalInfo } from "@/data/public";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Контакты",
  description: "Свяжитесь с AI Pro School: WhatsApp, телефон, соцсети. Ответим на вопросы о курсах и поможем выбрать программу.",
  path: "/contacts",
});

export default function ContactsPage() {
  return (
    <Section>
      <SectionHead size="lg" eyebrow="Контакты" title="Напишите нам" description="Быстрее всего - в WhatsApp. Или оставьте заявку, и мы свяжемся сами." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="flex flex-col gap-4">
          <ContactRow icon={MessageCircle} label="WhatsApp" value={site.phones.primary} href={site.whatsapp} primary />
          <ContactRow icon={Phone} label="Телефон" value={site.phones.secondary} href={`tel:+${site.phones.secondaryRaw}`} />
          <Placeholder note="TODO: контактный e-mail">
            <ContactRow icon={Mail} label="E-mail" value={site.email || "hello@ai-pro-school.kz"} href={site.email ? `mailto:${site.email}` : undefined} />
          </Placeholder>
          <Placeholder note="TODO: адрес офиса для офлайн-формата (если есть)">
            <ContactRow icon={MapPin} label="Город" value={`${site.city}, ${site.country}`} />
          </Placeholder>

          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" href={site.socials.instagram} icon={<Instagram className="size-4" />} iconPosition="left">
              Instagram
            </Button>
            <Button variant="outline" size="sm" href={site.socials.youtube} icon={<Youtube className="size-4" />} iconPosition="left">
              YouTube
            </Button>
            <Button variant="outline" size="sm" href={site.socials.tiktok}>
              TikTok
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="rounded-2xl bg-surface p-6 shadow-soft sm:p-8">
          <h2 className="mb-5 font-display text-xl">Оставить заявку</h2>
          <LeadForm config={getFormConfig()} formId="contacts" withComment />
        </Reveal>
      </div>
      <Requisites />
    </Section>
  );
}

/** Реквизиты ТОО из company.ts (без банковских данных) и ссылки на документы */
function Requisites() {
  const l = getLegalInfo();
  const rows = [
    { label: "Наименование", value: l.legalName },
    { label: "БИН", value: l.bin },
    { label: "Адрес", value: l.address },
    { label: "Сайт", value: l.website.replace(/^https?:\/\//, ""), href: l.website },
  ];
  return (
    <Reveal className="mt-6 rounded-2xl bg-surface p-6 shadow-soft sm:p-8">
      <h2 className="font-display text-xl sm:text-2xl">Реквизиты</h2>
      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-300">{r.label}</dt>
            <dd className="mt-1 text-[17px] font-semibold leading-snug text-ink">
              {r.href ? (
                <a href={r.href} className="underline-offset-4 hover:underline">
                  {r.value}
                </a>
              ) : (
                r.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-5 flex flex-col sm:flex-row sm:gap-x-6">
        {l.docs.map((d) => (
          <li key={d.href}>
            <a href={d.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-brand-700 underline-offset-4 hover:underline">
              {d.title}
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function ContactRow({ icon: Icon, label, value, href, primary }: { icon: typeof Phone; label: string; value: string; href?: string; primary?: boolean }) {
  const inner = (
    <>
      <span className={`grid size-12 shrink-0 place-items-center rounded-full ${primary ? "bg-brand-50 text-ink" : "bg-brand-50 text-brand"}`}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-300">{label}</p>
        <p className="font-display text-lg leading-tight">{value}</p>
      </div>
    </>
  );
  const cls = "flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft transition-colors";
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={`${cls} hover:bg-soft-100`}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
