import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getThanksPage, getThanksProductIds } from "@/data/public";
import { ThanksContent } from "../ThanksContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return getThanksProductIds().map((productId) => ({ productId }));
}

export const metadata = buildMetadata({
  title: "Спасибо! Заявка принята",
  description: "Мы получили вашу заявку и скоро свяжемся.",
  path: "/thanks",
  noIndex: true,
});

/** Страница «Спасибо» по продукту: отдельный URL для конверсий (Lead уходит в пиксели отсюда). */
export default async function ThanksPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const data = getThanksPage(productId);
  if (!data) notFound();
  return <ThanksContent data={data} />;
}
