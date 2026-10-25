import type { Metadata } from "next";
import { CoursePageView } from "@/components/sections/CoursePageView";
import { getCourse } from "@/data/courses";
import { buildMetadata } from "@/lib/seo";

/** «Ближайший старт» зависит от текущей даты — пересобираем раз в час */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const c = getCourse("practicum")!;
  return buildMetadata({ title: c.seo.title, description: c.seo.description, path: "/courses/practicum", image: null });
}

export default function Page() {
  return <CoursePageView slug="practicum" />;
}
