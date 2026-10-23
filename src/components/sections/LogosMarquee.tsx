import Image from "next/image";
import { Marquee, PlaceholderBadge } from "@/components/ui";
import { getPublicPartners } from "@/data/public";
import type { PublicPartner } from "@/data/public-types";
import { cn } from "@/lib/utils";

interface LogosMarqueeProps {
  title?: string;
  className?: string;
  invert?: boolean;
}

/** Полоса «Где нас видели». Без меток резидент/партнёр. */
export function LogosMarquee({ title = "Где нас видели", className, invert }: LogosMarqueeProps) {
  const items = getPublicPartners();
  if (items.length === 0) return null;
  // Половина ленты должна быть шире экрана (≈2600px при ~190px на элемент), иначе справа будет пустота
  const repeat = Math.max(1, Math.ceil(14 / items.length));

  return (
    <section className={cn("pb-0 pt-10 sm:pt-12", className)} aria-label={title}>
      <div className="container-site">
        <p className={cn("mb-6 text-center text-xs font-bold uppercase tracking-wider", invert ? "text-white/40" : "text-ink-500")}>
          {title}
        </p>
      </div>
      <Marquee durationSec={items.length * repeat * 7} pauseOnHover repeat={repeat} gap="gap-14">
        {items.map((p) => (
          <PartnerItem key={p.id} partner={p} invert={invert} />
        ))}
      </Marquee>
    </section>
  );
}

function PartnerItem({ partner: p, invert }: { partner: PublicPartner; invert?: boolean }) {
  const showBadge = Boolean(p.devNote);
  const useLogo = Boolean(p.logo && !p.devNote);

  return (
    <div className="relative flex h-12 items-center">
      {showBadge && (
        <PlaceholderBadge
          status="placeholder"
          note={p.devNote}
          className="-top-5 left-0"
        />
      )}
      {useLogo ? (
        <Image
          src={p.logo!}
          alt={p.name}
          width={140}
          height={48}
          className={cn("h-8 w-auto object-contain", invert ? "brightness-0 invert" : "opacity-70 grayscale")}
        />
      ) : (
        <span
          className={cn(
            "flex flex-col items-start gap-0.5 whitespace-nowrap",
            invert ? "text-white/80" : "text-ink",
          )}
        >
          <span className="text-[15px] font-semibold leading-none sm:text-base">{p.name}</span>
          <span className={cn("text-[11px] font-medium leading-none", invert ? "text-white/45" : "text-ink-500")}>
            {p.relationLabel}
          </span>
        </span>
      )}
    </div>
  );
}
