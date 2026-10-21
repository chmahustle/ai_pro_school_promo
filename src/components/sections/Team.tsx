import Image from "next/image";
import { Check, Instagram, Linkedin, Send, Youtube } from "lucide-react";
import { Pill, PlaceholderBadge, RevealGroup, RevealItem, Section, SectionIntro } from "@/components/ui";
import { team } from "@/data/team";
import type { TeamMember } from "@/data/types";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

interface TeamProps {
  items?: TeamMember[];
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "dark" | "lavender";
  bare?: boolean;
  /** grid — карточки в ряд; wide — фото слева (спикеры эфира); feature — первый участник крупно, остальные под ним */
  layout?: "grid" | "wide" | "feature";
}

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

const socialMeta = {
  instagram: { label: "Instagram", Icon: Instagram },
  tiktok: { label: "TikTok", Icon: TikTokIcon },
  youtube: { label: "YouTube", Icon: Youtube },
  linkedin: { label: "LinkedIn", Icon: Linkedin },
  telegram: { label: "Telegram", Icon: Send },
} as const;

/** Команда / спикеры. Фото — из данных; без фото — крупные инициалы на фирменном градиенте (в dev с бейджем). */
export function Team({
  items = team,
  eyebrow = "Команда",
  title = "Кто учит",
  description = "Практики, которые сами зарабатывают на ИИ и строят AI-решения — и учат этому других.",
  tone = "bg",
  bare,
  layout = "grid",
}: TeamProps) {
  const invert = tone === "dark";
  const [lead, ...rest] = items;

  const body =
    layout === "feature" && lead ? (
      <div className="flex flex-col gap-5">
        <RevealGroup as="div" className="grid">
          <RevealItem>
            <FeatureCard member={lead} />
          </RevealItem>
        </RevealGroup>
        {rest.length > 0 && (
          <RevealGroup as="ul" className={cn("audience-grid grid gap-5", rest.length > 1 ? "md:grid-cols-2" : "")}>
            {rest.map((m, i) => (
              <RevealItem as="li" key={m.id}>
                <TeamCard member={m} tint={i % 2 === 0 ? "lavender" : "white"} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    ) : (
      <RevealGroup as="ul" className={cn("audience-grid grid gap-5", layout === "grid" ? "md:grid-cols-3" : "lg:grid-cols-2")}>
        {items.map((m, i) => (
          <RevealItem as="li" key={m.id}>
            <TeamCard member={m} invert={invert} wide={layout === "wide"} tint={layout === "grid" && !invert ? gridTints[i % gridTints.length] : undefined} />
          </RevealItem>
        ))}
      </RevealGroup>
    );

  if (bare) return body;
  return (
    <Section tone={tone} rounded={tone === "dark" || tone === "lavender"}>
      <SectionIntro id="team-title" align="left" tone={invert ? "dark" : "light"} eyebrow={eyebrow} title={title} description={description} />
      {body}
    </Section>
  );
}

/** Цвета карточек в ряду: тёмная, сиреневая, белая (как плитки главной) */
const gridTints = ["dark", "lavender", "white"] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Фото участника; без фото — инициалы на градиенте (в dev бейдж «нужно фото») */
function MemberPhoto({ member, className, sizes }: { member: TeamMember; className?: string; sizes: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-dark", className)}>
      {member.photo ? (
        <Image src={member.photo} alt={member.name} fill sizes={sizes} className="object-cover object-top" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-200 via-brand-100 to-lavender">
          <span className="font-display text-6xl font-extrabold text-brand-700/60">{initials(member.name)}</span>
          {SHOW_PLACEHOLDERS && <PlaceholderBadge note="Фото преподавателя" />}
        </div>
      )}
    </div>
  );
}

function Socials({ member, onDark }: { member: TeamMember; onDark?: boolean }) {
  const entries = Object.entries(member.socials ?? {}) as [keyof typeof socialMeta, string][];
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, href]) => {
        const { label, Icon } = socialMeta[key];
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} — ${label}`}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-pill px-4 text-[13px] font-semibold transition-colors duration-200 hover:bg-brand hover:text-white",
              onDark ? "bg-white/10 text-white" : "bg-ink/[0.06] text-ink",
            )}
          >
            <Icon className="size-4" />
            {label}
          </a>
        );
      })}
    </div>
  );
}

/** Основатель: тёмная карточка во всю ширину — фото слева, текст и факты справа */
function FeatureCard({ member }: { member: TeamMember }) {
  return (
    <article className="relative grid overflow-hidden rounded-[32px] bg-dark text-white lg:grid-cols-[minmax(0,400px)_1fr]">
      <MemberPhoto member={member} sizes="(max-width: 1024px) 100vw, 400px" className="aspect-[4/5] lg:aspect-auto lg:min-h-[480px]" />
      <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
        <svg viewBox="0 0 100 100" aria-hidden className="audience-spark pointer-events-none absolute -right-8 -top-8 size-44 fill-white/[0.06]">
          <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
        </svg>
        <div className="relative">
          <Pill tone="brand" size="sm" className="mb-3">
            {member.role}
          </Pill>
          <h3 className="font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] font-extrabold leading-[1.05]">{member.name}</h3>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-white/70">{member.bio}</p>
        </div>
        <ul className="relative grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {member.facts.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[14px] leading-snug text-white/85">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <div className="relative mt-auto pt-2">
          <Socials member={member} onDark />
        </div>
      </div>
    </article>
  );
}

function TeamCard({ member, invert: invertProp, wide, tint }: { member: TeamMember; invert?: boolean; wide?: boolean; tint?: "dark" | "lavender" | "white" }) {
  const invert = invertProp || tint === "dark";
  return (
    <article
      className={cn(
        "audience-tile relative flex h-full flex-col overflow-hidden rounded-[28px]",
        tint === "dark" ? "bg-dark text-white" : invert ? "bg-white/5 text-white ring-1 ring-white/10" : tint === "lavender" ? "bg-lavender text-ink" : "bg-surface text-ink shadow-soft",
        wide && "sm:flex-row",
      )}
    >
      <MemberPhoto
        member={member}
        sizes="(max-width: 768px) 100vw, 33vw"
        className={cn(wide ? "aspect-[4/5] sm:aspect-auto sm:min-h-full sm:w-[42%]" : "aspect-[4/5]")}
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <Pill tone="brand" size="sm" className="mb-3">
            {member.role}
          </Pill>
          <h3 className="font-display text-xl leading-tight">{member.name}</h3>
          <p className={cn("mt-2 text-[14px] leading-relaxed", invert ? "text-white/65" : "text-ink-500")}>{member.bio}</p>
        </div>
        <ul className={cn("flex flex-col gap-1.5 text-[13px]", invert ? "text-white/80" : "text-ink-700")}>
          {member.facts.slice(0, wide ? 5 : 3).map((f) => (
            <li key={f} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <Socials member={member} onDark={invert} />
        </div>
      </div>
    </article>
  );
}
