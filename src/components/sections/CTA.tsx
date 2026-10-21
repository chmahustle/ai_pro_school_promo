import { ArrowRight } from "lucide-react";
import { Button, MeshBackdrop, Reveal, type MeshVariant } from "@/components/ui";
import { LeadButton } from "@/components/ui/LeadButton";
import { cn } from "@/lib/utils";

interface CTAProps {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref?: string;
  interest?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** lines — тёмная панель с паттерном из розовых волнистых линий */
  tone?: "mesh" | "dark" | "lines";
  mesh?: MeshVariant;
  source: string;
  className?: string;
}

/** Компактный CTA-баннер: mesh или ink, кнопки — ink/white */
export function CTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  interest,
  secondaryLabel,
  secondaryHref,
  tone = "mesh",
  mesh = "home",
  source,
  className,
}: CTAProps) {
  const dark = tone === "dark";
  if (tone === "lines") {
    return (
      <section className={cn("px-2 sm:px-4", className)}>
        <Reveal className="relative overflow-hidden rounded-[32px] bg-dark text-white sm:rounded-[40px]">
          <LinesPattern />
          <div className="container-site relative z-10 flex flex-col items-start gap-7 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-[clamp(1.875rem,1.3rem+2.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.015em] [text-wrap:balance]">{title}</h2>
              {description && <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/85">{description}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryHref ? (
                <Button variant="white" size="lg" href={primaryHref} icon={<ArrowRight className="size-5" />}>
                  {primaryLabel}
                </Button>
              ) : (
                <LeadButton variant="white" size="lg" source={source} interest={interest} icon={<ArrowRight className="size-5" />}>
                  {primaryLabel}
                </LeadButton>
              )}
              {secondaryLabel && secondaryHref && (
                <Button variant="outline" size="lg" href={secondaryHref} className="border-white/30 text-white hover:border-white">
                  {secondaryLabel}
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    );
  }
  return (
    <section className={cn("px-2 sm:px-4", className)}>
      <Reveal className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        {dark ? <div className="absolute inset-0 bg-dark" aria-hidden /> : <MeshBackdrop variant={mesh} rounded="rounded-2xl sm:rounded-3xl" />}
        <div
          className={cn(
            "container-site relative flex flex-col items-start gap-6 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between",
            !dark && "rounded-2xl bg-surface/90 shadow-soft backdrop-blur-[2px] sm:rounded-3xl my-0",
          )}
        >
          {/* На mesh оборачиваем текст+кнопки в светлую полосу внутри */}
          {!dark ? (
            <div className="flex w-full flex-col gap-6 rounded-2xl bg-surface/92 p-6 shadow-soft backdrop-blur-[2px] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-display-md text-ink">{title}</h2>
                {description && <p className="mt-3 text-base text-ink-500 sm:text-lg">{description}</p>}
              </div>
              <CtaButtons
                primaryLabel={primaryLabel}
                primaryHref={primaryHref}
                interest={interest}
                secondaryLabel={secondaryLabel}
                secondaryHref={secondaryHref}
                source={source}
                dark={false}
              />
            </div>
          ) : (
            <>
              <div className="max-w-2xl">
                <h2 className="text-display-md text-white">{title}</h2>
                {description && <p className="mt-3 text-base text-white/70 sm:text-lg">{description}</p>}
              </div>
              <CtaButtons
                primaryLabel={primaryLabel}
                primaryHref={primaryHref}
                interest={interest}
                secondaryLabel={secondaryLabel}
                secondaryHref={secondaryHref}
                source={source}
                dark
              />
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function CtaButtons({
  primaryLabel,
  primaryHref,
  interest,
  secondaryLabel,
  secondaryHref,
  source,
  dark,
}: {
  primaryLabel: string;
  primaryHref?: string;
  interest?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  source: string;
  dark: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {primaryHref ? (
        <Button variant={dark ? "white" : "dark"} size="lg" href={primaryHref} icon={<ArrowRight className="size-5" />}>
          {primaryLabel}
        </Button>
      ) : (
        <LeadButton
          variant={dark ? "white" : "dark"}
          size="lg"
          source={source}
          interest={interest}
          icon={<ArrowRight className="size-5" />}
        >
          {primaryLabel}
        </LeadButton>
      )}
      {secondaryLabel && secondaryHref && (
        <Button variant={dark ? "outline" : "white"} size="lg" href={secondaryHref} className={dark ? "border-white/30 text-white hover:bg-white/10" : ""}>
          {secondaryLabel}
        </Button>
      )}
    </div>
  );
}

/** Фирменный паттерн из линий: ряды волнистых розовых линий разной плотности — как ленты из референсов, но тоньше */
function LinesPattern() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <pattern id="lines-cta-pattern" width="160" height="44" patternUnits="userSpaceOnUse">
          <path d="M0 22 Q40 0 80 22 T160 22" fill="none" stroke="#E8307E" strokeOpacity="0.5" strokeWidth="2" />
          <path d="M0 34 Q40 12 80 34 T160 34" fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="1.5" />
        </pattern>
        <linearGradient id="lines-cta-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#171717" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#171717" stopOpacity="0.2" />
          <stop offset="1" stopColor="#171717" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#lines-cta-pattern)" />
      {/* Слева линии затухают, чтобы заголовок читался чисто */}
      <rect width="100%" height="100%" fill="url(#lines-cta-fade)" />
    </svg>
  );
}
