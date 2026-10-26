import { getFaq } from "@/data/faq";
import { CourseForWhom, CourseOutcomes } from "@/components/sections/CourseDetails";
import { CTA } from "@/components/sections/CTA";
import { DirectionPage } from "@/components/sections/DirectionPage";
import { FAQ } from "@/components/sections/FAQ";
import { Programs } from "@/components/sections/Programs";
import { Team } from "@/components/sections/Team";
import { getCourse } from "@/data/courses";
import { efirGenitive } from "@/data/efir";
import { getPublicDirectionPage } from "@/data/public";
import { webinarSpeakers } from "@/data/team";
import { buildMetadata } from "@/lib/seo";

/** Лестница показывает ближайший старт — зависит от даты; обновляем раз в час */
export const revalidate = 3600;

const page = getPublicDirectionPage("vibecoding");

export const metadata = buildMetadata({ title: page.seo.title, description: page.seo.description, path: page.path, image: null });

/**
 * Направление «Вайб-кодинг»: общая страница направления + секция #efir — прежнее содержимое страницы эфира
 * (для кого, программа, результаты, «Кто проведёт эфир», FAQ эфира, выбор эфира по аудитории). Карточка эфира в лестнице ведёт к форме записи (#lead) ниже.
 */
export default function VibecodingPage() {
  const course = getCourse("vibecoding")!;
  return (
    <DirectionPage direction="vibecoding">
      <div id="efir" className="scroll-mt-28">
        <CourseForWhom course={course} />
        <Programs modules={course.program} title="Как устроено обучение" description={`Начинаем с ${efirGenitive()} — дальше полная программа.`} />
        <CourseOutcomes course={course} />
        <Team items={webinarSpeakers} eyebrow="Спикеры" title="Кто проведёт эфир" layout="wide" />
        <FAQ items={getFaq("vibecoding")} />
        <CTA
          title="Выберите свой эфир"
          description="У каждой аудитории — свой разбор задач и свой гайд в подарок."
          primaryLabel="Для бизнеса"
          primaryHref="/for/business"
          secondaryLabel="Для фрилансеров"
          secondaryHref="/for/freelancers"
          tone="mesh"
          mesh="home"
          source="course-vibecoding-cta"
        />
      </div>
    </DirectionPage>
  );
}
