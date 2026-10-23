"use client";

import { useState } from "react";
import type { PublicLadderStep } from "@/data/public-types";
import { cn } from "@/lib/utils";
import { LadderStepCard } from "./LadderStepCard";

interface ProductCatalogProps {
  directions: { id: "creator" | "vibecoding"; name: string }[];
  steps: PublicLadderStep[];
  entryBadge: string;
}

/** Каталог продуктов с фильтром по направлению: «Все» + направления (из products.ts) */
export function ProductCatalog({ directions, steps, entryBadge }: ProductCatalogProps) {
  const [filter, setFilter] = useState<"all" | "creator" | "vibecoding">("all");
  const list = filter === "all" ? steps : steps.filter((s) => s.direction === filter);
  const options = [{ id: "all" as const, name: "Все" }, ...directions];

  return (
    <div>
      <div role="tablist" aria-label="Направление" className="mb-8 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={filter === o.id}
            onClick={() => setFilter(o.id)}
            className={cn(
              "inline-flex h-11 items-center rounded-pill px-5 text-[14px] font-semibold transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand",
              filter === o.id ? "bg-ink text-white" : "bg-surface text-ink-700 shadow-soft hover:bg-soft-100",
            )}
          >
            {o.name}
            <span className={cn("ml-2 text-[12px]", filter === o.id ? "text-white/60" : "text-ink-300")}>
              {o.id === "all" ? steps.length : steps.filter((s) => s.direction === o.id).length}
            </span>
          </button>
        ))}
      </div>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <li key={s.id} className="flex">
            <LadderStepCard step={s} entryBadge={entryBadge} />
          </li>
        ))}
      </ul>
    </div>
  );
}
