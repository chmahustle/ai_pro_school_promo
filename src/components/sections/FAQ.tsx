import { Accordion, Section, SectionHead } from "@/components/ui";
import type { PublicFaqItem } from "@/data/faq";

interface FAQProps {
  /** Вопросы страницы из getFaq(page): в проде только подтверждённые, в dev — ещё и неподтверждённые (с devNote) */
  items: PublicFaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender";
  bare?: boolean;
  /** JSON-LD FAQPage для SEO */
  withSchema?: boolean;
}

export function FAQ({
  items,
  eyebrow = "FAQ",
  title = "Частые вопросы",
  description,
  tone = "bg",
  bare,
  withSchema = true,
}: FAQProps) {
  const list = items;
  if (list.length === 0) return null;

  const schema = withSchema
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        // Только видимые подтверждённые вопросы: неподтверждённые (devNote, только dev) в разметку не попадают
        mainEntity: list.filter((i) => i.a && !i.devNote).map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }
    : null;

  const body = (
    <>
      <Accordion
        items={list.map((i) => ({ id: i.id, title: i.q, content: (
            <>
              {i.devNote && <p className="mb-1 text-[12px] font-semibold text-danger">{i.devNote}</p>}
              <p>{i.a}</p>
            </>
          ) }))}
        tone={tone === "white" ? "lavender" : "white"}
      />
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </>
  );

  if (bare) return body;

  return (
    <Section tone={tone} rounded={tone === "lavender"}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHead eyebrow={eyebrow} title={title} description={description} className="mb-0 lg:sticky lg:top-28 lg:self-start" />
        {body}
      </div>
    </Section>
  );
}
