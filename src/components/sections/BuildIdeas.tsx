"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Группа идей: название и список */
export interface IdeaGroup {
  id: string;
  title: string;
  items: string[];
}

const PREVIEW = 7;

/**
 * «Ещё N идей, что можно собрать»: N считается из длины массива данных. В свёрнутом виде - ряд из семи чипов-названий
 * (по одному из каждой группы и ещё один) и кнопка «ещё N−7»; по клику раскрывается полный список по группам.
 * Нет данных - строка скрыта.
 */
export function BuildIdeas({ groups }: { groups: IdeaGroup[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  if (total === 0) return null;
  const preview = [...groups.map((g) => g.items[0]), groups[0]?.items[1]].filter((x): x is string => Boolean(x)).slice(0, PREVIEW);
  const rest = total - preview.length;

  return (
    <div className="mt-6 rounded-[24px] bg-white/[0.06] p-4 ring-1 ring-white/10 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[18px] font-bold text-white">Ещё {total} идей, что можно собрать</h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Свернуть список идей" : "Показать все идеи"}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Plus className={cn("size-4 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-45")} aria-hidden />
        </button>
      </div>

      {!open && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {preview.map((it) => (
            <li key={it} className="rounded-pill bg-white/10 px-3 py-1.5 text-[13px] leading-snug text-white/85">
              {it}
            </li>
          ))}
          {rest > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-pill bg-brand-600 px-3 py-1.5 text-[13px] font-semibold leading-snug text-white transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ещё {rest}
              </button>
            </li>
          )}
        </ul>
      )}

      <div id={panelId} hidden={!open} className="mt-4 grid gap-5 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.id}>
            <h4 className="font-display text-[15px] font-bold text-white">{g.title}</h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <li key={it} className="rounded-pill bg-white/10 px-3 py-1.5 text-[13px] leading-snug text-white/85">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
