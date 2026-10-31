import { Section, SectionIntro } from "@/components/ui";
import { getVideoReviewById } from "@/data/videoReviews";
import type { Audience } from "@/data/types";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { StudentWorksGrid, type StudentWorkCard } from "./StudentWorksGrid";

type StudentWorksData = NonNullable<Audience["studentWorks"]>;

/**
 * «Ученики без опыта в коде уже сделали»: карточки проектов с видео (ролики - videoReviews.ts, по клику) или скриншотом.
 * Прод: только записи verified && consent, меньше трёх - блока нет; слот без видео и скриншота не рисуется.
 * Dev: показываются все записи, пустой слот - полосатая заглушка. В клиентский компонент уходят только публичные поля.
 */
export function StudentWorks({ data }: { data: StudentWorksData }) {
  const visible = data.items.filter((i) => SHOW_PLACEHOLDERS || (i.verified && i.consent));
  if (!SHOW_PLACEHOLDERS && visible.length < 3) return null;
  if (visible.length === 0) return null;
  const cards: StudentWorkCard[] = visible.map((i) => {
    const video = i.videoId ? getVideoReviewById(i.videoId) : null;
    return {
      id: i.videoId ?? i.title,
      title: i.title,
      text: i.text,
      video: video ? { src: video.src, poster: video.poster, duration: video.duration } : null,
      image: i.image,
      placeholder: SHOW_PLACEHOLDERS && !video && !i.image,
    };
  });
  return (
    <Section id="student-works" className="scroll-mt-24">
      <SectionIntro id="student-works-title" align="left" eyebrow={data.eyebrow} title={data.title} />
      <StudentWorksGrid items={cards} />
    </Section>
  );
}
