"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import { Button, MeshBackdrop, Pill } from "@/components/ui";
import { track, trackLead } from "@/lib/analytics";
import { isLeadProduct } from "@/data/product-ids";
import type { ThanksPageData } from "@/data/public-types";
import { fadeUp, stagger } from "@/lib/motion";

/** Заявка, сохранённая формой в sessionStorage: event_id тот же, что ушёл на сервер в Conversions API */
interface StoredLead {
  eventId: string;
  product: string;
  formId?: string;
  page?: string;
  sent?: boolean;
}

/**
 * Lead в браузерные пиксели — один раз на заявку. Без записи формы (прямой заход, обновление после отправки) не шлём:
 * иначе конверсия засчитается без заявки.
 */
function fireLeadOnce(productId: string) {
  try {
    const raw = sessionStorage.getItem("aps_lead");
    if (!raw) return;
    const lead = JSON.parse(raw) as StoredLead;
    if (lead.sent || !lead.eventId) return;
    sessionStorage.setItem("aps_lead", JSON.stringify({ ...lead, sent: true }));
    const product = isLeadProduct(lead.product) && lead.product !== "general" ? lead.product : null;
    trackLead({ product, page: lead.page ?? window.location.pathname, form_id: lead.formId }, lead.eventId);
    track({ name: "lead_success", params: { source: productId } });
  } catch {
    // sessionStorage недоступен — событие не отправляем
  }
}

export function ThanksContent({ data }: { data: ThanksPageData }) {
  useEffect(() => {
    fireLeadOnce(data.productId);
  }, [data.productId]);

  const title = "Заявка принята";
  const text = data.productName
    ? `${data.responseNote} и расскажем про ${data.productName}. Если сообщения нет — напишите нам первыми.`
    : `${data.responseNote} и поможем выбрать программу. Если сообщения нет — напишите нам первыми.`;

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
                href={data.whatsappHref}
                data-product={data.productId === "general" ? undefined : data.productId}
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
