import { getFaq } from "@/data/faq";
import { DirectionPage } from "@/components/sections/DirectionPage";
import { FAQ } from "@/components/sections/FAQ";
import { getPublicDirectionPage } from "@/data/public";
import { buildMetadata } from "@/lib/seo";

/** Лестница показывает ближайший старт — зависит от даты; обновляем раз в час */
export const revalidate = 3600;

const page = getPublicDirectionPage("vibecoding");

export const metadata = buildMetadata({ title: page.seo.title, description: page.seo.description, path: page.path, image: null });

/**
 * Направление «Вайб-кодинг»: hero, линейка (карточка эфира ведёт на /courses/vibecoding-efir), результаты и FAQ направления.
 * Подробности эфира (для кого, программа, ведущий, FAQ, «что дальше») — на странице эфира.
 */
export default function VibecodingPage() {
  return (
    <DirectionPage direction="vibecoding">
      <FAQ items={getFaq("vibecoding")} />
    </DirectionPage>
  );
}
