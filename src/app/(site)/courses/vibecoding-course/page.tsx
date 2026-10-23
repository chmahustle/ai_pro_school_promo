import { ProductLanding } from "@/components/sections/ProductLanding";
import { getPublicProductPage } from "@/data/public";
import { buildMetadata } from "@/lib/seo";

const page = getPublicProductPage("course");

export const metadata = buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/courses/vibecoding-course", image: null });

export default function Page() {
  return <ProductLanding id="course" />;
}
