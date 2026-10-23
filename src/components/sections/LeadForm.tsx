"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button, Dropdown, Input, Textarea } from "@/components/ui";
import { leadSchema, type LeadInput } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { formatPhoneInput, PHONE_PLACEHOLDER } from "@/lib/phone";
import { getAttribution, getSegment } from "@/lib/utm";
import { newEventId, track } from "@/lib/analytics";
import { resolveLeadProduct } from "@/data/product-ids";
import type { FormConfig } from "@/data/public-types";
import { site } from "@/lib/site";
import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export interface LeadFormProps {
  /** Публичные настройки формы (список продуктов, согласие, обещание ответа) — собираются на сервере */
  config: FormConfig;
  /** Идентификатор формы для аналитики (hero, footer, modal, landing-business…) */
  formId: string;
  /** Предвыбранный продукт: id из products.ts, слаг курса или ЦА (приводится к id) */
  defaultProduct?: string;
  /** Скрыть выбор продукта (на лендингах продукт фиксирован) */
  lockProduct?: boolean;
  /** Показать поле комментария */
  withComment?: boolean;
  submitLabel?: string;
  /** Информационная подсказка без сроков: отдельной строкой над responseNote */
  hint?: string;
  /** Куда редиректить после успеха. По умолчанию /thanks/<продукт> */
  thanksPath?: string;
  /** Светлая форма на тёмном фоне */
  invert?: boolean;
  className?: string;
  /** Компактная раскладка: имя и телефон в одну строку на десктопе */
  compact?: boolean;
  onSuccess?: () => void;
}

export function LeadForm({
  config,
  formId,
  defaultProduct,
  lockProduct,
  withComment,
  submitLabel,
  hint,
  thanksPath,
  invert,
  className,
  compact,
  onSuccess,
}: LeadFormProps) {
  const t = useT();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      product: resolveLeadProduct(defaultProduct),
      comment: "",
      formId,
      website: "",
    },
    mode: "onBlur",
  });

  // lead_start — один раз при первом взаимодействии
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track({ name: "lead_start", params: { form_id: formId } });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setValue("formId", formId);
      setValue("page", window.location.pathname + window.location.search);
      // Без явного продукта берём тот, что «стоит за» страницей
      if (!getValues("product")) setValue("product", resolveLeadProduct(defaultProduct, window.location.pathname));
    }
  }, [setValue, getValues, formId, defaultProduct]);

  const onSubmit = async (data: LeadInput) => {
    setServerError(null);
    // Атрибуция собирается в момент отправки: cookies _fbp/_fbc и first-touch UTM
    const attr = getAttribution();
    const page = window.location.pathname + window.location.search;
    const eventId = newEventId();
    const payload: LeadInput = {
      ...data,
      formId: data.formId || formId,
      page,
      eventId,
      utm: attr.utm,
      referrer: attr.referrer,
      firstPage: attr.firstPage,
      fbp: attr.fbp,
      fbc: attr.fbc,
      ttclid: attr.ttclid,
      segment: getSegment(window.location.pathname, attr.utm),
    };
    track({ name: "lead_submit", params: { form_id: formId, course: payload.product } });
    const res = await submitLead(payload);
    if (!res.ok) {
      setServerError(res.error ?? t.form.error);
      return;
    }
    // Lead в браузерные пиксели уйдёт со страницы «Спасибо» с тем же event_id; здесь только запоминаем
    try {
      sessionStorage.setItem("aps_lead", JSON.stringify({ eventId, product: payload.product, formId, page, sent: false }));
    } catch {
      // приватный режим: Lead на сервере всё равно ушёл
    }
    setDone(true);
    onSuccess?.();
    router.push(thanksPath ?? `/thanks/${payload.product}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("relative flex flex-col gap-4", className)}
      aria-busy={isSubmitting}
      onFocusCapture={markStarted}
    >
      {/* Служебные поля — без register не попадают в submit (RHF) */}
      <input type="hidden" {...register("formId")} />
      <input type="hidden" {...register("page")} />
      {/* Honeypot */}
      <div className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className={cn("grid gap-4", compact && "sm:grid-cols-2")}>
        <Input
          label={t.form.name}
          placeholder={t.form.namePlaceholder}
          autoComplete="name"
          error={errors.name?.message}
          className={invert ? "bg-white/95" : undefined}
          {...register("name")}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              label={t.form.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={PHONE_PLACEHOLDER}
              error={errors.phone?.message}
              className={invert ? "bg-white/95" : undefined}
              name={field.name}
              ref={field.ref}
              value={field.value}
              // При фокусе в пустом поле сразу показываем «+7», на blur пустой префикс убираем
              onFocus={() => !field.value && field.onChange("+7")}
              onBlur={() => {
                if (field.value === "+7") field.onChange("");
                field.onBlur();
              }}
              onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
            />
          )}
        />
      </div>

      {!lockProduct ? (
        <Controller
          name="product"
          control={control}
          render={({ field }) => (
            <Dropdown
              label={t.form.interest}
              placeholder="Выберите программу"
              options={config.productOptions}
              error={errors.product?.message}
              className={invert ? "bg-white/95" : undefined}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ) : (
        <input type="hidden" {...register("product")} />
      )}

      {withComment && (
        <Textarea
          label={t.form.comment}
          placeholder={t.form.commentPlaceholder}
          error={errors.comment?.message}
          className={invert ? "bg-white/95" : undefined}
          {...register("comment")}
        />
      )}

      {serverError && (
        <div role="alert" className="flex flex-col gap-2 rounded-xl bg-danger/10 p-4 text-sm text-danger">
          <p>{serverError}</p>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2"
          >
            <MessageCircle className="size-4" /> {t.common.whatsapp}
          </a>
        </div>
      )}

      <Button
        type="submit"
        variant={invert ? "dark" : "primary"}
        size="lg"
        fullWidth
        disabled={isSubmitting || done}
        icon={
          isSubmitting ? <Loader2 className="size-5 animate-spin" /> : done ? <Check className="size-5" /> : <ArrowRight className="size-5" />
        }
      >
        {isSubmitting ? t.form.submitting : done ? t.form.success : (submitLabel ?? t.form.submit)}
      </Button>

      {hint && <p className={cn("text-center text-[13px] leading-snug", invert ? "text-white/60" : "text-ink-500")}>{hint}</p>}
      <p className={cn("text-center text-[13px] leading-snug", invert ? "text-white/60" : "text-ink-500")}>{config.responseNote}</p>
      <p className={cn("text-center text-[12px] leading-snug", invert ? "text-white/55" : "text-ink-500")}>
        {config.agreement.before}
        <Link href={config.agreement.href} className={cn("underline underline-offset-2", invert ? "text-white" : "text-ink")}>
          {config.agreement.linkText}
        </Link>
      </p>
    </form>
  );
}
