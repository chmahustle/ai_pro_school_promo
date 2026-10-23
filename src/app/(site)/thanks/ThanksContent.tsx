"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { Button, MeshBackdrop, Pill } from "@/components/ui";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import type { ThanksTarget } from "@/data/public-types";
import { fadeUp, stagger } from "@/lib/motion";

/** targets — публичные названия лендингов и курсов, собранные на сервере (getThanksTargets) */
export function ThanksContent({ targets }: { targets: ThanksTarget[] }) {
  const params = useSearchParams();
  const src = params.get("src") ?? undefined;
  const interest = params.get("interest") ?? undefined;

  useEffect(() => {
    track({ name: "lead_success", params: { source: src } });
  }, [src]);

  const audience = interest ? targets.find((t) => t.kind === "audience" && t.slug === interest) : undefined;
  const course = interest ? targets.find((t) => t.kind === "course" && t.slug === interest) : undefined;
  const isWebinar = !!audience?.isWebinar;

  const title = isWebinar ? "Вы зарегистрированы на эфир" : "Заявка принята";
  const text = isWebinar
    ? `Ссылка на эфир и гайд «${audience?.guideTitle?.replace(/^Гайд «|»$/g, "") ?? "в подарок"}» придут в WhatsApp в течение нескольких минут. Если не пришло — напишите нам.`
    : course
      ? `Мы свяжемся с вами в течение рабочего дня, расскажем про программу «${course.courseShortName}» и ответим на вопросы.`
      : "Мы свяжемся с вами в течение рабочего дня. А пока — посмотрите результаты учеников или напишите в WhatsApp.";

  return (
    <section className="px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-3xl">
        <MeshBackdrop variant="home" />
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="container-site relative z-10 flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"
        >
          <div className="flex w-full max-w-2xl flex-col items-center rounded-3xl bg-surface/92 px-6 py-10 shadow-soft backdrop-blur-[2px] sm:px-10">
            <motion.span variants={fadeUp} className="grid size-20 place-items-center rounded-full bg-brand-50 text-ink shadow-float">
              <Check className="size-9" strokeWidth={3} />
            </motion.span>
            <motion.div variants={fadeUp} className="mt-6">
              <Pill tone="lavender">Готово</Pill>
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-5 text-display-lg">
              {title}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-[52ch] text-base text-ink-500 sm:text-lg">
              {text}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="dark"
                size="lg"
                href={site.whatsapp}
                icon={<MessageCircle className="size-5" />}
                iconPosition="left"
              >
                Открыть WhatsApp
              </Button>
              <Button variant="white" size="lg" href="/reviews" icon={<ArrowRight className="size-5" />}>
                Результаты учеников
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
