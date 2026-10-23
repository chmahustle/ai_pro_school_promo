import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { courses, getCourse } from "@/data/courses";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return courses.filter((c) => c.slug !== "vibecoding").map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCourse(slug);
  return renderOg({
    title: c?.tagline ?? "AI Pro School",
    subtitle: c?.description,
    eyebrow: c?.shortName,
    theme: c?.accent === "ink" || c?.accent === "indigo" ? "dark" : c?.accent === "peach" ? "peach" : "light",
  });
}
