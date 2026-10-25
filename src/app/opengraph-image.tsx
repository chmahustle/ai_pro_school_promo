import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${site.name} — ${site.tagline}`;

export default function Image() {
  return renderOg({
    title: "Учим зарабатывать на ИИ. Без техобразования.",
    subtitle: "ИИ-контент, вайб-кодинг, автоматизация — для новичков, фрилансеров, бизнеса и специалистов",
    eyebrow: site.tagline,
  });
}
