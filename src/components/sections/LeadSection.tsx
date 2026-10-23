import { MessageCircle, ShieldCheck, Timer } from "lucide-react";
import { Button, MeshBackdrop, Pill, Reveal, type MeshVariant } from "@/components/ui";
import { LeadForm, type LeadFormProps } from "./LeadForm";
import { getFormConfig } from "@/data/public";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LeadSectionProps extends Omit<LeadFormProps, "className" | "config"> {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** dark/ink панель или mesh+белая форма */
  tone?: "dark" | "mesh" | "white";
  mesh?: MeshVariant;
  bullets?: string[];
  className?: string;
}

/**
 * Финальный CTA: mesh-фон + текст на ink/surface, форма на белой карточке.
 * Основной CTA формы — ink (не magenta).
 */
export function LeadSection({
  id = "lead",
  eyebrow = "Заявка",
  title,
  description,
  tone = "mesh",
  mesh = "home",
  bullets,
  className,
  ...formProps
}: LeadSectionProps) {
  const isDark = tone === "dark";

  return (
    <section id={id} data-hide-floating className={cn("scroll-mt-24 px-2 sm:px-4", className)} aria-labelledby={`${id}-title`}>
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        {tone === "mesh" && <MeshBackdrop variant={mesh} rounded="rounded-2xl sm:rounded-3xl" />}
        {isDark && <div className="absolute inset-0 bg-dark" aria-hidden />}
        {tone === "white" && <div className="absolute inset-0 bg-surface" aria-hidden />}

        <div className="container-site relative grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <Reveal
            className={cn("flex flex-col gap-5 lg:py-4", isDark ? "text-white" : "text-ink")}
          >
            <Pill tone={isDark ? "brand" : "dark"} dot className="self-start">
              {eyebrow}
            </Pill>
            <h2 id={`${id}-title`} className="font-display text-[clamp(1.75rem,1.2rem+2vw,2.875rem)] font-extrabold leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">
              {title}
            </h2>
            {description && (
              <p className={cn("max-w-[48ch] text-[15px] leading-relaxed", isDark ? "text-white/70" : "text-ink-500")}>
                {description}
              </p>
            )}
            {bullets && (
              <ul className="flex flex-col gap-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px]">
                    <ShieldCheck
                      className={cn("mt-0.5 size-5 shrink-0", isDark ? "text-brand-200" : "text-brand")}
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <div
              className={cn(
                "mt-2 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between",
                isDark ? "bg-white/5" : "bg-white/70 ring-1 ring-white/70 backdrop-blur-md",
              )}
            >
              <div className="flex items-center gap-3">
                <Timer className={cn("size-5", isDark ? "text-white/60" : "text-ink-500")} aria-hidden />
                <p className={cn("text-sm", isDark ? "text-white/70" : "text-ink-500")}>
                  Удобнее написать? Ответим в WhatsApp.
                </p>
              </div>
              <Button
                variant={isDark ? "white" : "dark"}
                size="sm"
                href={site.whatsapp}
                icon={<MessageCircle className="size-4" />}
                iconPosition="left"
              >
                WhatsApp
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="rounded-[32px] bg-surface p-6 text-ink shadow-float sm:p-8">
            <LeadForm config={getFormConfig()} {...formProps} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
