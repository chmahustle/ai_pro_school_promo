import { Section, SectionIntro } from "@/components/ui";
import { nbspDash } from "@/lib/utils";

/** Блок «Условия возврата»: только текст школы. Нет текста — блока нет. */
export function RefundTerms({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <Section id="refund" aria-labelledby="refund-title">
      <SectionIntro id="refund-title" align="left" eyebrow="Оплата" title="Условия возврата" />
      <p className="max-w-[60ch] rounded-[28px] bg-surface p-6 text-[15px] leading-relaxed text-ink-700 shadow-soft sm:p-8">{nbspDash(text)}</p>
    </Section>
  );
}
