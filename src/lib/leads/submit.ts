"use client";

import type { LeadInput } from "./schema";

export interface SubmitLeadResponse {
  ok: boolean;
  id?: string;
  error?: string;
}

/** Клиентская отправка заявки в /api/lead */
export async function submitLead(input: LeadInput): Promise<SubmitLeadResponse> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as SubmitLeadResponse;
    return res.ok ? data : { ok: false, error: data.error ?? "Ошибка отправки" };
  } catch {
    return { ok: false, error: "Нет соединения. Попробуйте ещё раз или напишите в WhatsApp." };
  }
}
