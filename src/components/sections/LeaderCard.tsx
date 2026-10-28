import Image from "next/image";
import { Avatar, Pill, Section } from "@/components/ui";

const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";

/**
 * «Ведёт …»: крупное фото, пилюля «Ведущий», имя и роль одной строкой (team.ts, только подтверждённая) на лавандовой панели с фигурами.
 * Биографию, факты и достижения не выводим: в данных нет согласия (consent) на публикацию.
 */
export function LeaderCard({ id, leader }: { id: string; leader: { name: string; photo: string | null; role?: string | null } }) {
  return (
    <Section aria-labelledby={id}>
      <div className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-[32px] bg-lavender p-6 text-center sm:flex-row sm:gap-10 sm:p-10 sm:text-left">
        {/* Декор позади текста: большая звезда справа и контурный круг (как в карточках линейки) */}
        <svg aria-hidden viewBox="0 0 100 100" fill="#ffffff" className="pointer-events-none absolute -bottom-10 -right-8 -z-10 size-[220px] opacity-80 sm:-right-4 sm:size-[300px]">
          <path d={STAR} />
        </svg>
        <svg aria-hidden viewBox="0 0 200 200" fill="none" className="pointer-events-none absolute -left-16 -top-20 -z-10 size-[240px] opacity-70">
          <circle cx="100" cy="100" r="78" stroke="#ffffff" strokeWidth="10" />
        </svg>

        <div className="relative size-[132px] shrink-0 overflow-hidden rounded-[28px] bg-surface shadow-float ring-4 ring-white sm:size-[168px]">
          {leader.photo ? (
            <Image src={leader.photo} alt={leader.name} fill sizes="168px" className="object-cover object-[50%_18%]" />
          ) : (
            <Avatar name={leader.name} src={null} size="xl" className="size-full rounded-none" />
          )}
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-start">
          <Pill tone="white">Ведущий</Pill>
          <h2 id={id} className="font-display text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink">
            Ведёт {leader.name}
          </h2>
          {leader.role && <p className="max-w-[40ch] text-[16px] leading-snug text-ink-700">{leader.role}</p>}
        </div>
      </div>
    </Section>
  );
}
