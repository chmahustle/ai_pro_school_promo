import { Section, SectionIntro } from "@/components/ui";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { nbspDash } from "@/lib/utils";

/** Блок «Условия возврата»: только текст школы. Нет текста — блока нет (в dev подписано, чего не хватает). */
export function RefundTerms({ text }: { text: string | null }) {
  if (!text) {
    return SHOW_PLACEHOLDERS ? (
      <div className="container-site my-4">
        <p className="rounded-2xl border border-dashed border-danger/50 bg-danger/5 p-4 text-[13px] font-semibold text-danger">Блок «Условия возврата» скрыт: нет текста школы в products.ts</p>
      </div>
    ) : null;
  }
  return (
    <Section id="refund" aria-labelledby="refund-title">
      <SectionIntro id="refund-title" align="left" eyebrow="Оплата" title="Условия возврата" />
      <p className="max-w-[60ch] rounded-[28px] bg-surface p-6 text-[15px] leading-relaxed text-ink-700 shadow-soft sm:p-8">{nbspDash(text)}</p>
    </Section>
  );
}
