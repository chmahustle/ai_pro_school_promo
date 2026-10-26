import type { Metadata } from "next";
import { EfirLanding } from "@/components/sections/EfirLanding";
import { getPublicLadder } from "@/data/public";
import { efirPriceLabel } from "@/data/products";
import { buildMetadata } from "@/lib/seo";

/** Цена эфира считается по дате — пересобираем раз в час */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const efir = getPublicLadder("vibecoding").steps.find((s) => s.isEntry);
  const title = efir?.name ?? "Эфир";
  // Цена в описании — из products.ts (efirPriceLabel), слово «бесплатный» руками не пишем
  const description = `${efir?.resultLine ?? ""}. Формат: ${efir?.format ?? ""}, ${efirPriceLabel()}. AI Pro School.`.replace(/^\. /, "");
  return buildMetadata({ title, description, path: efir?.href ?? "/courses/vibecoding-efir", image: null });
}

export default function Page() {
  return <EfirLanding />;
}
