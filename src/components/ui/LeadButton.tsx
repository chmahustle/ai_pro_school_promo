"use client";

import { Button, type ButtonProps } from "./Button";
import { useLeadModal } from "@/components/sections/LeadModal";
import { track } from "@/lib/analytics";

type LeadButtonProps = Omit<ButtonProps, "href" | "onClick"> & {
  interest?: string;
  source: string;
  modalTitle?: string;
  modalDescription?: string;
};

/** Кнопка, открывающая глобальную модалку заявки и логирующая cta_click */
export function LeadButton({ interest, source, modalTitle, modalDescription, children, ...rest }: LeadButtonProps) {
  const { open } = useLeadModal();
  return (
    <Button
      {...(rest as ButtonProps)}
      onClick={() => {
        track({ name: "cta_click", params: { label: String(children), location: source } });
        open({ interest, source, title: modalTitle, description: modalDescription });
      }}
    >
      {children}
    </Button>
  );
}
