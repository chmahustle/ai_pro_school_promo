import { DirectionPage } from "@/components/sections/DirectionPage";
import { getPublicDirectionPage } from "@/data/public";
import { buildMetadata } from "@/lib/seo";

/** Лестница показывает ближайший старт — зависит от даты; обновляем раз в час */
export const revalidate = 3600;

const page = getPublicDirectionPage("creator");

export const metadata = buildMetadata({ title: page.seo.title, description: page.seo.description, path: page.path, image: null });

export default function CreatorPage() {
  return <DirectionPage direction="creator" />;
}
