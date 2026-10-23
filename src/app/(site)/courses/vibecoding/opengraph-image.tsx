import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPublicDirectionPage } from "@/data/public";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const page = getPublicDirectionPage("vibecoding");
  return renderOg({ title: page.name, subtitle: page.tagline, eyebrow: "Направление", theme: "dark" });
}
