import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeSection, SectionIntro } from "@/components/ui";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { getPublicAudienceGroups } from "@/data/public";
import type { PublicAudienceCard } from "@/data/public-types";
import type { AudienceSlug } from "@/data/types";
import { cn, nbspDash, noBreakHyphen } from "@/lib/utils";

type Skin = "brand" | "soft" | "ink" | "lavender";

/** Визуальный ритм как у nyx-меню: цвет / стикеры / орбиты / лента */
const skins: Record<AudienceSlug, Skin> = {
  beginners: "brand",
  business: "soft",
  freelancers: "ink",
  career: "lavender",
};

const skinShell: Record<Skin, string> = {
  brand: "bg-[#E8307E] text-white",
  soft: "bg-[#E9E7EE] text-ink",
  ink: "bg-dark text-white",
  lavender: "bg-[#ECE9FF] text-ink",
};

function Spark({
  className,
  fill,
  size = 32,
}: {
  className?: string;
  fill: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={fill}
      className={cn("audience-spark", className)}
      aria-hidden
    >
      <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
    </svg>
  );
}

function CardDecor({ skin }: { skin: Skin }) {
  if (skin === "brand") {
    return (
      // Звезда в верхнем правом углу, за пределами текстовых строк: не заходит на чипы, цену первого шага и CTA
      <span className="pointer-events-none absolute -right-6 -top-6" aria-hidden>
        <Spark fill="#ECE9FF" size={96} className="h-[84px] w-[84px] opacity-95 sm:h-[96px] sm:w-[96px]" />
      </span>
    );
  }
  if (skin === "ink") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Кольцо в нижнем правом углу, тональное: не заходит на текст; медленно «дышит», при наведении смещается */}
        <span className="audience-decor audience-decor-circle absolute -bottom-20 -right-20 size-[240px]">
          <svg className="audience-decor-breathe h-full w-full" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="78" stroke="#fff" strokeOpacity="0.14" strokeWidth="12" />
          </svg>
        </span>
        <span className="absolute bottom-9 right-[34%]">
          <Spark fill="#ECE9FF" size={26} />
        </span>
        <span className="absolute bottom-[4.5rem] right-6">
          <Spark fill="#E8307E" size={20} />
        </span>
      </div>
    );
  }
  if (skin === "lavender") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Волна в нижнем правом углу, светло-розовая: не перекрывает текст; покачивается, при наведении сдвигается */}
        <span className="audience-decor audience-decor-wave absolute -bottom-8 -right-10 h-[130px] w-[190px]">
          <svg className="audience-decor-sway h-full w-full" viewBox="0 0 190 130" fill="none">
            <path d="M0 88C34 20 70 24 96 66C120 104 156 118 192 40" stroke="#F7B0CF" strokeWidth="18" strokeLinecap="round" />
          </svg>
        </span>
        <span className="absolute bottom-9 right-[34%]">
          <Spark fill="#14121F" size={18} />
        </span>
      </div>
    );
  }
  return null;
}

/** Явное размещение на xl: шапки в первой строке, карточки под своей шапкой (литеральные классы — Tailwind не видит динамические) */
const XL_HEAD: Record<string, string> = { creator: "xl:col-start-1 xl:row-start-1", vibecoding: "xl:col-start-2 xl:col-span-3 xl:row-start-1" };
const XL_CARD = ["xl:col-start-1", "xl:col-start-2", "xl:col-start-3", "xl:col-start-4"];

export function AudienceSwitcher() {
  const groups = getPublicAudienceGroups();
  let col = 0;

  return (
    <HomeSection id="audiences" labelledBy="audience-title">
      <SectionIntro
        id="audience-title"
        eyebrow="Для кого"
        title="Выберите свой путь в ИИ"
        description="У каждой аудитории — своя программа, свои примеры и свой результат. Выберите, что ближе."
      />

      <ul
        className={cn(
          "audience-grid grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-4",
          "xl:grid-rows-[auto_auto_auto_auto_auto_auto_minmax(1rem,1fr)_auto]",
        )}
      >
        {groups.map((g) => (
          <li key={g.direction} className="contents">
            <h3 className={cn("mt-4 border-b border-ink/10 pb-3 font-display text-[20px] font-bold leading-tight text-ink first:mt-0 sm:col-span-2 sm:text-[22px] xl:mt-0", XL_HEAD[g.direction])}>
              {noBreakHyphen(g.title)}
            </h3>
            {g.cards.map((a) => (
              <AudienceCardLink key={a.slug} audience={a} className={cn("xl:row-start-2", XL_CARD[col++])} />
            ))}
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}

function AudienceCardLink({ audience: card, className }: { audience: PublicAudienceCard; className?: string }) {
  const skin = skins[card.slug];
  const onDark = skin === "brand" || skin === "ink";

  return (
    <Link
      href={card.href}
      className={cn(
        "audience-tile group relative flex min-h-[340px] flex-col overflow-hidden rounded-[32px] p-6 sm:min-h-[380px] sm:p-7",
        "outline-none",
        "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#14121F]",
        "xl:row-span-7 xl:grid xl:min-h-0 xl:grid-rows-subgrid xl:gap-y-3",
        className,
        skinShell[skin],
        skin === "brand" && "audience-tile-brand",
      )}
    >
      <CardDecor skin={skin} />

      {/* 1 · заголовок */}
      <div className="relative z-10">
        <h3
          className={cn(
            "line-clamp-2 font-display text-[22px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[24px]",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {nbspDash(card.title)}
        </h3>
        {card.titleNote ? (
          <p
            className={cn(
              "mt-1 text-[14px] font-medium leading-snug",
              onDark ? "text-white/70" : "text-ink-500",
            )}
          >
            {card.titleNote}
          </p>
        ) : null}
      </div>

      {/* 2 · боль */}
      <p
        className={cn(
          "relative z-10 mt-3 line-clamp-2 text-[14px] font-medium leading-snug xl:mt-0",
          onDark ? "text-white/75" : "text-ink-500",
        )}
      >
        {card.pain}
      </p>

      {/* 3 · метка */}
      <p
        className={cn(
          "relative z-10 mt-5 text-[11px] font-bold uppercase tracking-wide xl:mt-0",
          onDark ? "text-white/45" : "text-ink-500",
        )}
      >
        Что получите
      </p>

      {/* 4 · чипы / стикеры */}
      <div className="relative z-10 mt-2 xl:mt-0">
        {skin === "soft" ? (
          <div className="relative min-h-[5.25rem]">
            <span className="audience-sticker audience-sticker-a absolute left-0 top-0 z-10 inline-flex max-w-[95%] rounded-pill bg-ink px-3 py-1.5 font-display text-[11px] font-bold leading-tight tracking-wide text-white">
              {card.chips[0]}
            </span>
            <span className="audience-sticker audience-sticker-b absolute left-4 top-9 z-10 inline-flex max-w-[95%] rounded-pill bg-[#E8307E] px-3 py-1.5 font-display text-[11px] font-bold leading-tight tracking-wide text-white sm:left-6">
              {card.chips[1]}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {card.chips.map((chip) => (
              <span
                key={chip}
                className={cn(
                  "inline-flex h-7 items-center whitespace-nowrap rounded-pill px-3 text-[12px] font-semibold",
                  onDark ? "bg-white/15 text-white" : "bg-ink/8 text-ink",
                )}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 5 · первый шаг и цена (products.ts) / proof */}
      <div className="relative z-10 mt-auto min-h-4 flex-1 pt-3 xl:mt-0 xl:pt-0">
        {card.firstStep && (
          <p className={cn("text-[13px] leading-snug", onDark ? "text-white/80" : "text-ink-700")}>
            <span className={cn("font-semibold", onDark ? "text-white/55" : "text-ink-500")}>Первый шаг: </span>
            {card.firstStep.name} · <ProductPrice parts={card.firstStep.price} className="font-bold" />
          </p>
        )}
        {card.proofText ? (
          <p className={cn("mt-1 text-[12px] leading-snug", onDark ? "text-white/55" : "text-ink-500")}>{card.proofText}</p>
        ) : null}
      </div>

      {/* 6 · CTA */}
      <span
        className={cn(
          "relative z-10 mt-5 inline-flex w-full items-center justify-between gap-2 border-t pt-5 text-[15px] font-semibold xl:mt-0",
          onDark ? "border-white/15" : "border-ink/10",
        )}
      >
        {card.ctaLabel}
        <span
          className={cn(
            "audience-cta-arrow grid size-9 place-items-center rounded-full transition-[transform,background-color] duration-300 motion-reduce:transition-none",
            onDark ? "bg-white/20 text-white" : "bg-ink text-white",
          )}
        >
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
