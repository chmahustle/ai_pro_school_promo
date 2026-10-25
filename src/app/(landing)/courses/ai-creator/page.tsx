import type { Metadata } from "next";
import { CoursePageView } from "@/components/sections/CoursePageView";
import { getCourse } from "@/data/courses";
import { buildMetadata } from "@/lib/seo";

/** «Ближайший старт» зависит от текущей даты — пересобираем раз в час */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const c = getCourse("ai-creator")!;
  return buildMetadata({ title: c.seo.title, description: c.seo.description, path: "/courses/ai-creator", image: null });
}

export default function Page() {
  return <CoursePageView slug="ai-creator" />;
}
