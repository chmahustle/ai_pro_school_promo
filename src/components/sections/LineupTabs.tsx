"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn, noBreakHyphen } from "@/lib/utils";

type TabId = "creator" | "vibecoding";

interface LineupTabsProps {
  sectionId: string;
  tabs: { id: TabId; label: string }[];
  /** Содержимое вкладок (серверные ProductLadder) */
  panels: Record<TabId, ReactNode>;
}

const isTab = (v: string | null | undefined): v is TabId => v === "creator" || v === "vibecoding";

/** Вкладка из URL: «#lineup?tab=creator» (кнопки hero) или «?tab=creator» */
function readTab(): TabId | null {
  const fromHash = /[?&]tab=(\w+)/.exec(window.location.hash)?.[1];
  if (isTab(fromHash)) return fromHash;
  const fromSearch = new URLSearchParams(window.location.search).get("tab");
  return isTab(fromSearch) ? fromSearch : null;
}

/**
 * Переключатель направлений блока «Продуктовая линейка». Активная вкладка живёт в URL (?tab=); переход по якорю
 * «#lineup?tab=…» (нативный hashchange) открывает нужную вкладку и прокручивает к блоку.
 * Обе панели есть в HTML (для SEO и без JS), неактивная скрыта.
 */
export function LineupTabs({ sectionId, tabs, panels }: LineupTabsProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<TabId>(tabs[0]?.id ?? "creator");

  const syncFromUrl = useCallback(
    (scroll: boolean) => {
      const t = readTab();
      if (t) setActive(t);
      if (scroll && window.location.hash.startsWith(`#${sectionId}`)) {
        // дождаться применения вкладки, иначе высота блока ещё прежняя
        requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
      }
    },
    [sectionId, reduce],
  );

  useEffect(() => {
    syncFromUrl(true);
    const onHash = () => {
      syncFromUrl(true);
      // после разбора якоря оставляем в адресе канонический вид ?tab=…#lineup
      const t = readTab();
      if (t) window.history.replaceState(null, "", `${window.location.pathname}?tab=${t}#${sectionId}`);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [syncFromUrl, sectionId]);

  const select = (id: TabId) => {
    setActive(id);
    window.history.replaceState(null, "", `${window.location.pathname}?tab=${id}${window.location.hash}`);
  };

  return (
    <div>
      <div role="tablist" aria-label="Направления школы" className="mb-8 grid gap-2 rounded-[28px] bg-surface p-2 shadow-soft sm:mb-10 md:grid-cols-2">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`${sectionId}-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`${sectionId}-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  const next = tabs.find((x) => x.id !== t.id);
                  if (next) {
                    select(next.id);
                    document.getElementById(`${sectionId}-tab-${next.id}`)?.focus();
                  }
                }
              }}
              className={cn(
                "rounded-[22px] px-5 py-4 text-left font-display text-[16px] font-bold leading-snug transition-colors duration-200 sm:text-[17px]",
                "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand",
                on ? "bg-ink text-white" : "text-ink-700 hover:bg-soft-100",
              )}
            >
              {noBreakHyphen(t.label)}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`${sectionId}-panel-${t.id}`} aria-labelledby={`${sectionId}-tab-${t.id}`} hidden={t.id !== active}>
          {panels[t.id]}
        </div>
      ))}
    </div>
  );
}
