import { ProductLanding } from "@/components/sections/ProductLanding";
import { getPublicProductPage } from "@/data/public";
import { buildMetadata } from "@/lib/seo";

const page = getPublicProductPage("offline");

export const metadata = buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/courses/vibecoding-offline", image: null });

export default function Page() {
  return <ProductLanding id="offline" />;
}
