import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getCourse } from "@/data/courses";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const c = getCourse("practicum");
  return renderOg({
    title: c?.tagline ?? "AI Pro School",
    subtitle: c?.description,
    eyebrow: c?.shortName,
    theme: c?.accent === "ink" || c?.accent === "indigo" ? "dark" : c?.accent === "peach" ? "peach" : "light",
  });
}
