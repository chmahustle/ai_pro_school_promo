import Image from "next/image";
import { RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import { astanaHub, getPublishedMetrics } from "@/data/metrics";
import { team } from "@/data/team";
import type { Audience } from "@/data/types";
import { formatNumber } from "@/lib/utils";

type HostsData = NonNullable<Audience["hosts"]>;

/** Четырёхконечная звезда для декора карточек (как у «Ведёт курс» и «Кто преподаёт») */
const STAR = "M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z";

/** «70 000 000» → «70 млн+», «4500» → «4 500+»: единица отделена неразрывным пробелом, знак «+» не отрывается */
function statValue(value: number, suffix = "", compact?: boolean): string {
  if (compact && value >= 1_000_000) return `${formatNumber(Math.round(value / 100_000) / 10).replace(/[.,]0$/, "")} млн${suffix}`;
  return `${formatNumber(value)}${suffix}`;
}

/**
 * «Ведущие эфира»: две сиреневые карточки в стиле «Кто преподаёт» (квадратное фото в белой рамке, имя, роль, факты, декор-звезда и круг)
 * и ряд цифр школы на белых плитках.
 * Имя, роль и фото - из team.ts, цифры - из metrics.ts (только подтверждённые). Резидентство Astana Hub показываем,
 * только если astanaHub.show (metrics.ts); иначе из строки о maydi Studio оно убирается.
 */
export function Hosts({ data }: { data: HostsData }) {
  const showHub = astanaHub.show;
  const published = getPublishedMetrics();
  const stats = data.stats.flatMap((s) => {
    const m = published.find((x) => x.id === s.id);
    return m ? [{ key: s.id, value: statValue(m.value, m.suffix, m.format === "compact"), label: s.label }] : [];
  });

  return (
    <Section id="hosts" className="scroll-mt-24">
      <SectionIntro id="hosts-title" align="left" eyebrow={data.eyebrow} title={data.title} />
      <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2">
        {data.people.map((p) => {
          const member = team.find((t) => t.id === p.id);
          if (!member) return null;
          return (
            <RevealItem as="li" key={p.id} className="flex">
              <div className="relative isolate flex w-full flex-col gap-5 overflow-hidden rounded-[28px] bg-lavender p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
                {/* Декор за содержимым: большая звезда справа внизу и контурный круг слева вверху */}
                <svg aria-hidden viewBox="0 0 100 100" fill="#ffffff" className="pointer-events-none absolute -bottom-8 -right-6 -z-10 size-[190px] opacity-80 sm:size-[220px]">
                  <path d={STAR} />
                </svg>
                <svg aria-hidden viewBox="0 0 200 200" fill="none" className="pointer-events-none absolute -left-12 -top-14 -z-10 size-[170px] opacity-70">
                  <circle cx="100" cy="100" r="78" stroke="#ffffff" strokeWidth="10" />
                </svg>
                {member.photo && (
                  <div className="relative size-[120px] shrink-0 overflow-hidden rounded-[22px] bg-surface shadow-float ring-4 ring-white sm:size-[140px]">
                    <Image src={member.photo} alt={member.name} fill sizes="140px" className="object-cover object-[50%_18%]" />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-[clamp(1.375rem,1.15rem+0.9vw,1.75rem)] font-extrabold leading-tight text-ink">{member.name}</h3>
                  <p className="mt-1.5 text-[15px] leading-snug text-ink-700">{member.role}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {p.facts.map((f) => (
                      <li key={f.text} className="flex items-start gap-3 text-[15px] leading-snug text-ink-700">
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-brand" aria-hidden />
                        <span>
                          {f.text}
                          {f.astanaHub && showHub ? f.astanaHub : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <RevealGroup as="ul" className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <RevealItem as="li" key={s.key} className="flex">
            <div className="flex w-full flex-col gap-1.5 rounded-[24px] bg-surface p-5 ring-1 ring-ink-100 sm:p-6">
              <p className="whitespace-nowrap font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-extrabold leading-none text-ink">{s.value}</p>
              <p className="text-[14px] leading-snug text-ink-500">{s.label}</p>
            </div>
          </RevealItem>
        ))}
        {data.hubStat && showHub && (
          <RevealItem as="li" className="flex">
            <div className="flex w-full flex-col gap-1.5 rounded-[24px] bg-surface p-5 ring-1 ring-ink-100 sm:p-6">
              <p className="whitespace-nowrap font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-extrabold leading-none text-ink">Astana Hub</p>
              <p className="text-[14px] leading-snug text-ink-500">{data.hubStat}</p>
            </div>
          </RevealItem>
        )}
      </RevealGroup>
    </Section>
  );
}
