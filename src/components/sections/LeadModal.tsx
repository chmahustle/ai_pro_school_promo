"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui";
import { LeadForm } from "./LeadForm";
import type { FormConfig } from "@/data/public-types";
import { track } from "@/lib/analytics";

interface OpenOptions {
  /** Предвыбранный продукт (id из products.ts, слаг курса или ЦА) */
  interest?: string;
  /** Откуда открыли (для аналитики) */
  source?: string;
  title?: string;
  description?: string;
}

interface LeadModalContextValue {
  open: (opts?: OpenOptions) => void;
  close: () => void;
}

const Ctx = createContext<LeadModalContextValue | null>(null);

/** Глобальная модалка заявки: любая кнопка вызывает useLeadModal().open({...}) */
export function LeadModalProvider({ children, config }: { children: ReactNode; config: FormConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});

  const open = useCallback((o: OpenOptions = {}) => {
    setOpts(o);
    setIsOpen(true);
    track({ name: "cta_click", params: { label: "open_lead_modal", location: o.source ?? "unknown" } });
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Modal open={isOpen} onClose={close} title={opts.title ?? "Оставить заявку"} size="md">
        <p className="-mt-2 mb-5 text-[15px] text-ink-500">
          {opts.description ?? "Перезвоним или напишем в WhatsApp в течение рабочего дня, ответим на вопросы и поможем выбрать программу."}
        </p>
        <LeadForm
          formId={`modal:${opts.source ?? "global"}`}
          config={config}
          defaultProduct={opts.interest}
          onSuccess={close}
        />
      </Modal>
    </Ctx.Provider>
  );
}

export function useLeadModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeadModal must be used within <LeadModalProvider>");
  return ctx;
}
