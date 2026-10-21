import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getAudience, landingAudiences } from "@/data/audiences";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return landingAudiences.map((a) => ({ audience: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const a = getAudience(audience);
  return renderOg({
    title: a?.hero.title ?? "AI Pro School",
    subtitle: a?.hero.subtitle,
    eyebrow: "Бесплатный эфир · 1,5 часа",
    theme: a?.accent === "ink" ? "dark" : a?.accent === "peach" ? "peach" : "light",
  });
}
