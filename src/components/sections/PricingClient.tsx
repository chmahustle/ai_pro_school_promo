"use client";

import { useState } from "react";
import { Check, Gift, Minus } from "lucide-react";
import { Badge, Pill, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import { LeadButton } from "@/components/ui/LeadButton";
import { productForCourseSlug } from "@/data/product-ids";
import type { PublicBonuses, PublicTariff } from "@/data/public-types";
import { cn, formatTenge } from "@/lib/utils";

export interface PricingData {
  slug: string;
  shortName: string;
  tariffs: PublicTariff[];
  bonuses: PublicBonuses | null;
  /** Рассрочка включена: в products.ts заполнена цифра платежа */
  installmentEnabled: boolean;
  /** Подпись кнопки курса (courses.ts → ctaLabel) */
  ctaLabel: string;
}

interface PricingProps {
  course: PricingData;
  title?: string;
  eyebrow?: string;
}

/**
 * Тарифы курса. Переключатель «полностью / в рассрочку» показывается, если хоть у одного
 * тарифа есть installment. Цены со status !== verified → бейдж; price === null → «Уточняется».
 */
export function PricingClient({ course, title = "Тарифы", eyebrow = "Стоимость" }: PricingProps) {
  const { bonuses, tariffs } = course;
  const hasInstallment = course.installmentEnabled && tariffs.some((t) => t.installment);
  const [mode, setMode] = useState<"full" | "installment">("full");

  if (tariffs.length === 0) return null;
  // Один тариф: заголовок «Что входит», карточка по центру
  const single = tariffs.length === 1;

  return (
    <Section id="pricing" tone="lavender" rounded className="mt-4 scroll-mt-24">
      <SectionIntro
        id="pricing-title"
        eyebrow={eyebrow}
        title={single ? "Что входит" : title}
        align={single ? "center" : "left"}
        action={
          hasInstallment ? (
            <div role="tablist" aria-label="Способ оплаты" className="inline-flex rounded-pill bg-surface p-1 shadow-soft">
              {(["full", "installment"] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={cn("h-10 rounded-pill px-5 text-sm font-semibold transition-colors duration-200", mode === m ? "bg-ink text-white" : "text-ink-500 hover:text-ink")}
                >
                  {m === "full" ? "Полностью" : "В рассрочку"}
                </button>
              ))}
            </div>
          ) : undefined
        }
      />

      <RevealGroup as="ul" className={cn("audience-grid grid gap-5", single ? "mx-auto max-w-xl" : tariffs.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
        {tariffs.map((t) => (
          <RevealItem as="li" key={t.id}>
            <TariffCard tariff={t} mode={mode} course={course} single={single} />
          </RevealItem>
        ))}
      </RevealGroup>

      {bonuses && (
        <RevealItem className="mt-5 flex flex-col gap-4 rounded-[28px] bg-dark p-6 text-white sm:flex-row sm:items-center sm:p-7">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-white">
            <Gift className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="font-display text-lg leading-tight">{bonuses.title}</p>
            {bonuses.devNote && <p className="mt-1 text-[12px] font-semibold text-danger">{bonuses.devNote}</p>}
            <ul className="mt-3 flex flex-wrap gap-2">
              {bonuses.items.map((b) => (
                <li key={b}>
                  <Pill tone="outline" size="sm" icon={<Gift className="text-brand" />} className="border-white/20 text-white/85">
                    {b}
                  </Pill>
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      )}
    </Section>
  );
}

function TariffCard({ tariff: t, mode, course, single }: { tariff: PublicTariff; mode: "full" | "installment"; course: PricingData; single: boolean }) {
  const showInstallment = mode === "installment" && t.installment;
  const priceNode = (() => {
    if (t.price === 0) return <span className="font-display text-3xl">Бесплатно</span>;
    if (showInstallment)
      return (
        <span className="inline-flex items-baseline gap-1.5">
          <span className="whitespace-nowrap font-display text-3xl">{formatTenge(t.installment!)}</span>
          <span className="text-sm text-ink-500">/ мес{t.installmentMonths ? ` · ${t.installmentMonths} мес.` : ""}</span>
        </span>
      );
    return (
      <span className="inline-flex items-baseline gap-2.5">
        <span className="whitespace-nowrap font-display text-3xl">{formatTenge(t.price)}</span>
        {t.oldPrice && <span className="text-base text-ink-300 line-through">{formatTenge(t.oldPrice)}</span>}
      </span>
    );
  })();

  return (
    <article
      className={cn(
        "audience-tile relative flex h-full flex-col gap-6 rounded-[28px] p-6 sm:p-7",
        t.popular ? "bg-dark text-white shadow-float ring-2 ring-brand" : "bg-surface shadow-soft",
      )}
    >
      {t.popular && (
        <Badge tone="brand" className="absolute right-5 top-5">
          Популярный
        </Badge>
      )}

      <div>
        <h3 className="font-display text-xl">{t.name}</h3>
        {t.devNote && <p className="mt-1 text-[12px] font-semibold text-danger">{t.devNote}</p>}
        <p className={cn("mt-1.5 text-[14px] leading-snug", t.popular ? "text-white/65" : "text-ink-500")}>{t.description}</p>
      </div>

      <div className={cn(t.popular && "[&_.text-ink-500]:text-white/60 [&_.text-ink-300]:text-white/40")}>{priceNode}</div>

      <ul className="flex flex-col gap-2.5">
        {t.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[14px]">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            {f}
          </li>
        ))}
        {t.excluded?.map((f) => (
          <li key={f} className={cn("flex items-start gap-2.5 text-[14px]", t.popular ? "text-white/50" : "text-ink-300")}>
            <Minus className="mt-0.5 size-4 shrink-0" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <LeadButton
          variant="dark"
          size="md"
          fullWidth
          source={`pricing:${course.slug}:${t.id}`}
          interest={productForCourseSlug(course.slug)}
          modalTitle={`${course.shortName} · ${t.name}`}
          modalDescription="Оставьте контакты — пришлём детали тарифа, ссылку на оплату и ответим на вопросы."
        >
          {t.cta ?? (t.price === 0 ? "Зарегистрироваться" : single ? <>{course.ctaLabel} за <span className="whitespace-nowrap">{formatTenge(t.price)}</span></> : course.ctaLabel)}
        </LeadButton>
      </div>
    </article>
  );
}
