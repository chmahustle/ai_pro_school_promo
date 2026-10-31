"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Раскрывающаяся плашка «Ещё идеи»: заголовок со «+» (при открытии поворачивается в «×»), ниже чипы-идеи.
 * Свёрнутая плашка - только строка заголовка; без идей не рисуется. При prefers-reduced-motion значок не анимируется.
 */
export function IdeasToggle({ title, ideas }: { title: string; ideas: string[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (ideas.length === 0) return null;
  return (
    <div className="mt-4 rounded-[28px] bg-surface ring-1 ring-ink-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 rounded-[28px] px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:px-7 sm:py-5"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white">
          <Plus className={cn("size-4 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-45")} aria-hidden />
        </span>
        <span className="font-display text-[17px] font-bold text-ink">{title}</span>
      </button>
      <ul id={panelId} hidden={!open} className="flex flex-wrap gap-2 px-5 pb-6 sm:px-7 sm:pl-[88px]">
        {ideas.map((it) => (
          <li key={it} className="rounded-pill bg-bg px-4 py-2 text-[14px] leading-snug text-ink-700 ring-1 ring-ink-100">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
