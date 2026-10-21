import { Accordion, Section, SectionHead } from "@/components/ui";
import type { FaqItem } from "@/data/types";

interface FAQProps {
  items: FaqItem[];
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
  if (items.length === 0) return null;

  const schema = withSchema
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }
    : null;

  const body = (
    <>
      <Accordion
        items={items.map((i) => ({ id: i.id, title: i.q, content: <p>{i.a}</p> }))}
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
