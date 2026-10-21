import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { ThanksContent } from "./ThanksContent";

export const metadata = buildMetadata({
  title: "Спасибо! Заявка принята",
  description: "Мы получили вашу заявку и скоро свяжемся.",
  path: "/thanks",
  noIndex: true,
});

/**
 * Страница «спасибо» — отдельный URL для пикселей/конверсий.
 * Контент зависит от ?src= и ?interest= (читаются на клиенте, страница остаётся статической).
 */
export default function ThanksPage() {
  return (
    <Suspense fallback={null}>
      <ThanksContent />
    </Suspense>
  );
}
