import { Section, SectionIntro } from "@/components/ui";
import { getPublicCatalog, getPublicLineup } from "@/data/public";
import { ProductCatalog } from "./ProductCatalog";

/** Каталог «Выберите программу» (id="courses"): все продукты из products.ts с фильтром по направлению */
export function CatalogSection() {
  const { directions, steps } = getPublicCatalog();
  const { entryBadge } = getPublicLineup();
  return (
    <Section id="courses" className="scroll-mt-24" aria-labelledby="courses-title">
      <SectionIntro id="courses-title" align="left" eyebrow="Курсы" title="Выберите программу" />
      <ProductCatalog directions={directions} steps={steps} entryBadge={entryBadge} />
    </Section>
  );
}
