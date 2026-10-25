import { ArrowRight } from "lucide-react";
import { ArrowLink, Avatar, HomeSection, PlaceholderBadge, SectionIntro } from "@/components/ui";
import { getHomeBusinessCases } from "@/data/results";
import type { ResultCase } from "@/data/types";

/** ₸ с неразрывным пробелом: сумма не рвётся посреди строки */
function nbsp(text: string) {
  return text.replace(/(\d)\s+(?=\d)/g, "$1 ").replace(/\s*₸/g, " ₸");
}

interface BusinessCasesSectionProps {
  /** Ссылка «Все кейсы» в шапке (если блок стоит не на странице отзывов) */
  allHref?: string;
}

/**
 * «Что собирают предприниматели» — кейсы бизнесов в стиле главной: тёмная панель с лентами, белые карточки
 * с «До → После». Прод: только verified && consent, меньше 3 — блок скрыт (getHomeBusinessCases).
 */
export function BusinessCasesSection({ allHref }: BusinessCasesSectionProps = {}) {
  const items = getHomeBusinessCases();
  if (items.length < 3) return null;

  return (
    <HomeSection id="business-cases" labelledBy="business-cases-title" tone="dark" ribbon="pair">
      <SectionIntro
        id="business-cases-title"
        tone="dark"
        align="left"
        eyebrow="Бизнес-кейсы"
        title="Что собирают предприниматели"
        description="Боты, сайты и ассистенты на вайб-кодинге — без найма разработчиков."
        action={allHref ? <ArrowLink href={allHref} tone="onDark">Все кейсы</ArrowLink> : undefined}
      />
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <BusinessCaseCard item={item} />
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}

function BusinessCaseCard({ item }: { item: ResultCase }) {
  const before = nbsp(item.beforeValue?.trim() || item.before);
  const after = nbsp(item.afterValue?.trim() || item.after);
  const summary = item.summary?.trim() || item.after;

  return (
    <article className="audience-tile relative flex h-full flex-col rounded-[28px] bg-surface p-5 text-ink sm:p-6">
      {item.status !== "verified" && (
        <PlaceholderBadge status={item.status === "placeholder" ? "placeholder" : "unverified"} note={item.note} className="left-auto right-3 top-3" />
      )}

      <header className="flex items-center gap-3 pr-16">
        <Avatar name={item.name} src={item.photo} size="md" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight">{item.name}</p>
          {item.context && <p className="truncate text-[13px] text-ink-500">{item.context}</p>}
        </div>
      </header>

      <h3 className="mt-4 font-display text-[22px] font-bold leading-[1.15] [text-wrap:balance]">{item.headline}</h3>

      {/* До → После */}
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-500">До</p>
          <p className="flex min-h-12 items-center justify-center rounded-2xl bg-ink/[0.06] px-3 py-2 text-center text-[15px] font-bold leading-tight">{before}</p>
        </div>
        <ArrowRight className="mb-4 size-4 shrink-0 text-ink-300" aria-hidden />
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">После</p>
          <p className="flex min-h-12 items-center justify-center rounded-2xl bg-brand px-3 py-2 text-center text-[15px] font-bold leading-tight text-white">{after}</p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-[14px] leading-snug text-ink-500">{summary}</p>

      {item.proofUrl && (
        <a
          href={item.proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink/75 transition-colors hover:text-brand"
        >
          Подтверждение
          <ArrowRight className="size-3.5" aria-hidden />
        </a>
      )}
    </article>
  );
}
