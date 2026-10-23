"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button, Checkbox, Dropdown, Input, Textarea } from "@/components/ui";
import { leadSchema, LEAD_INTERESTS, type LeadInput } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit";
import { formatPhoneInput, PHONE_PLACEHOLDER } from "@/lib/phone-mask";
import { getUtm } from "@/lib/utm";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export interface LeadFormProps {
  /** Идентификатор формы для аналитики (hero, footer, modal, landing-business…) */
  formId: string;
  /** Предвыбранное направление */
  defaultInterest?: string;
  /** Скрыть селект (на ЦА-лендингах направление фиксировано) */
  lockInterest?: boolean;
  /** Показать поле комментария */
  withComment?: boolean;
  submitLabel?: string;
  /** Подпись под кнопкой */
  hint?: string;
  /** Куда редиректить после успеха. По умолчанию /thanks?src=<formId> */
  thanksPath?: string;
  /** Светлая форма на тёмном фоне */
  invert?: boolean;
  className?: string;
  /** Компактная раскладка: имя и телефон в одну строку на десктопе */
  compact?: boolean;
  onSuccess?: () => void;
}

export function LeadForm({
  formId,
  defaultInterest = "",
  lockInterest,
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
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      interest: defaultInterest,
      comment: "",
      consent: false,
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
      setValue("utm", getUtm() as Record<string, string | undefined>);
    }
  }, [setValue, formId]);

  const onSubmit = async (data: LeadInput) => {
    setServerError(null);
    // utm/page подстраховываем на submit (если useEffect ещё не успел)
    const payload: LeadInput = {
      ...data,
      formId: data.formId || formId,
      page: data.page || (typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined),
      utm: data.utm ?? (getUtm() as Record<string, string | undefined>),
    };
    track({ name: "lead_submit", params: { form_id: formId, course: payload.interest } });
    const res = await submitLead(payload);
    if (!res.ok) {
      setServerError(res.error ?? t.form.error);
      return;
    }
    setDone(true);
    onSuccess?.();
    const path =
      thanksPath ?? `/thanks?src=${encodeURIComponent(formId)}&interest=${encodeURIComponent(payload.interest)}`;
    router.push(path);
  };

  const labelColor = invert ? "text-white/80" : undefined;

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
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
            />
          )}
        />
      </div>

      {!lockInterest ? (
        <Controller
          name="interest"
          control={control}
          render={({ field }) => (
            <Dropdown
              label={t.form.interest}
              placeholder="Выберите направление"
              options={LEAD_INTERESTS}
              error={errors.interest?.message}
              className={invert ? "bg-white/95" : undefined}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      ) : (
        <input type="hidden" {...register("interest")} />
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

      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <Checkbox
            className={labelColor}
            label={
              <>
                {t.form.consent}.{" "}
                <Link href="/privacy" className={cn("underline underline-offset-2", invert ? "text-white" : "text-ink")}>
                  Политика конфиденциальности
                </Link>
              </>
            }
            error={errors.consent?.message}
            name={field.name}
            ref={field.ref}
            checked={field.value === true}
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />

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

      {hint && <p className={cn("text-center text-[13px]", invert ? "text-white/60" : "text-ink-500")}>{hint}</p>}
    </form>
  );
}
