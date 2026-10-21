"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, Instagram, Youtube } from "lucide-react";
import { Avatar, Button, MediaPlaceholder, Modal, Pill, PlaceholderBadge } from "@/components/ui";
import { audiences } from "@/data/audiences";
import { heroEvent, type HeroResult } from "@/data/heroResults";
import { isStoryPublishable, stories } from "@/data/stories";
import { team } from "@/data/team";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

export type HeroModalTarget = { type: "teacher" } | { type: "event" } | { type: "result"; result: HeroResult };

interface HeroInfoModalProps {
  target: HeroModalTarget | null;
  onClose: () => void;
  /** Откуда «вылетает» окно */
  origin?: { x: number; y: number } | null;
}

/** Окно с подробностями карточки hero. Весь текст — из src/data/* (team, stories, audiences, heroResults) */
export function HeroInfoModal({ target, onClose, origin }: HeroInfoModalProps) {
  // Пока окно сворачивается, содержимое не должно пропадать — помним последнюю цель
  const lastTarget = useRef<HeroModalTarget | null>(target);
  if (target) lastTarget.current = target;
  const shown = target ?? lastTarget.current;

  return (
    <Modal open={target !== null} onClose={onClose} title={titleFor(shown)} size="lg" origin={origin}>
      {shown?.type === "teacher" && <TeacherBody onClose={onClose} />}
      {shown?.type === "event" && <EventBody onClose={onClose} />}
      {shown?.type === "result" && <ResultBody result={shown.result} onClose={onClose} />}
    </Modal>
  );
}

function titleFor(t: HeroModalTarget | null): string | undefined {
  if (!t) return undefined;
  if (t.type === "teacher") return team.find((m) => m.id === "nadira")?.name;
  if (t.type === "event") return heroEvent.title;
  return t.result.name;
}

function TeacherBody({ onClose }: { onClose: () => void }) {
  const m = team.find((x) => x.id === "nadira");
  if (!m) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-8">
      <div className="relative">
        <MediaPlaceholder src={m.photo} alt={m.name} aspect="auto" className="aspect-[4/5]" rounded="rounded-2xl" caption="Фото основателя" />
      </div>
      <div className="flex flex-col gap-4">
        <Pill tone="brand" className="self-start">
          {m.role}
        </Pill>
        <p className="text-base leading-relaxed text-ink-700">{m.bio}</p>
        <ul className="flex flex-col gap-2">
          {m.facts.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-700">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Button variant="dark" size="sm" href="/about" onClick={onClose} icon={<ArrowRight className="size-4" />}>
            О школе
          </Button>
          {m.socials?.instagram && (
            <Button variant="outline" size="sm" href={m.socials.instagram} icon={<Instagram className="size-4" />} iconPosition="left">
              Instagram
            </Button>
          )}
          {m.socials?.youtube && (
            <Button variant="outline" size="sm" href={m.socials.youtube} icon={<Youtube className="size-4" />} iconPosition="left">
              YouTube
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EventBody({ onClose }: { onClose: () => void }) {
  const business = audiences.find((a) => a.slug === "business");
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand">{heroEvent.duration}</Pill>
        {heroEvent.tags.map((t) => (
          <Pill key={t} tone="lavender">
            {t}
          </Pill>
        ))}
      </div>
      {business && <p className="text-base leading-relaxed text-ink-700">{business.hero.subtitle}</p>}
      {business && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {business.outcomes.map((o) => (
            <li key={o.title} className="rounded-2xl bg-soft-100 p-4">
              <p className="font-display text-base">{o.title}</p>
              <p className="mt-1 text-[14px] leading-snug text-ink-500">{o.text}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[14px] text-ink-500">
        Дата эфира: {heroEvent.date ?? (SHOW_PLACEHOLDERS ? "TODO — уточнить у клиента" : "сообщим после регистрации")}
      </p>
      <div>
        <Button variant="dark" size="md" href={heroEvent.href} onClick={onClose} icon={<ArrowRight className="size-4" />}>
          {heroEvent.ctaLabel}
        </Button>
      </div>
    </div>
  );
}

function ResultBody({ result, onClose }: { result: HeroResult; onClose: () => void }) {
  const story = stories.find((s) => s.name.startsWith(result.name));
  // Детали кейса показываем только подтверждённые (verified && consent); в dev — все, с бейджем
  const details = story && (isStoryPublishable(story) || SHOW_PLACEHOLDERS) ? story : null;
  return (
    <div className="relative flex flex-col gap-5">
      {details && !isStoryPublishable(details) && <PlaceholderBadge status={details.placeholder ? "placeholder" : "unverified"} note={details.note} />}
      <div className="flex items-center gap-4">
        <Avatar name={result.name} src={details?.photo ?? result.photo} size="lg" />
        <div>
          <p className="font-display text-xl">{result.name}</p>
          {details && <p className="text-[14px] text-ink-500">{details.descriptor}</p>}
        </div>
      </div>
      <p className="font-display text-2xl leading-tight text-brand">
        <ResultText text={result.result} />
      </p>
      <p className="text-[14px] font-semibold text-ink-500">{result.label}</p>
      {details?.before && details.after && (
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="rounded-2xl bg-soft-100 p-4 text-[15px] leading-snug text-ink-700">
            <span className="font-semibold text-ink-500">До: </span>
            {details.before}
          </p>
          <p className="rounded-2xl bg-brand-50 p-4 text-[15px] leading-snug text-ink">
            <span className="font-semibold text-brand-700">После: </span>
            {details.after}
          </p>
        </div>
      )}
      {details?.quote?.verbatim && <p className="text-[15px] italic leading-relaxed text-ink-500">«{details.quote.text}»</p>}
      <div>
        <Link
          href="/reviews"
          onClick={onClose}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-dark px-5 text-[14px] font-semibold text-white transition-colors hover:bg-ink-700"
        >
          Все результаты
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/** Суммы в ₸ не переносятся и не рвутся посреди разряда */
function ResultText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d[\d\s.,]*\s*₸)/g).map((part, i) =>
        /₸/.test(part) ? (
          <span key={i} className="whitespace-nowrap">
            {part.replace(/\s/g, " ")}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
