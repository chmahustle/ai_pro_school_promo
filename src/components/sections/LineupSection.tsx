import { MessageCircle } from "lucide-react";
import { Button, Section, SectionIntro } from "@/components/ui";
import { getPublicLineup } from "@/data/public";
import { LineupTabs } from "./LineupTabs";
import { ProductLadder } from "./ProductLadder";

/** «Продуктовая линейка» на главной (id="lineup"): две вкладки-направления с лестницами продуктов */
export function LineupSection() {
  const lineup = getPublicLineup();
  return (
    <Section id={lineup.id} className="scroll-mt-24" aria-labelledby={`${lineup.id}-title`}>
      <SectionIntro id={`${lineup.id}-title`} eyebrow="Продуктовая линейка" title={lineup.title} description={lineup.subtitle} />
      <LineupTabs
        sectionId={lineup.id}
        tabs={lineup.tabs}
        panels={{ creator: <ProductLadder direction="creator" />, vibecoding: <ProductLadder direction="vibecoding" /> }}
      />
      <div className="mt-10 flex justify-center">
        <Button variant="dark" size="lg" fillTone="dark" href={lineup.help.href} icon={<MessageCircle className="size-5" />} iconPosition="left">
          {lineup.help.label}
        </Button>
      </div>
    </Section>
  );
}
