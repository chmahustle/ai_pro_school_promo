import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPublicProductPage } from "@/data/public";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const page = getPublicProductPage("offline");
  return renderOg({ title: page.name, subtitle: page.resultLine, eyebrow: page.directionName, theme: "dark" });
}
