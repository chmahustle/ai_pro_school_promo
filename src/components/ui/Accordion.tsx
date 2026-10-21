"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  /** Небольшая подпись слева от заголовка (номер недели и т.п.) */
  eyebrow?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Разрешить открывать несколько одновременно */
  multiple?: boolean;
  defaultOpen?: string[];
  tone?: "white" | "lavender" | "transparent";
  className?: string;
}

const tones = {
  white: "bg-surface shadow-soft",
  lavender: "bg-lavender",
  transparent: "bg-transparent border border-ink-200",
};

export function Accordion({ items, multiple = false, defaultOpen = [], tone = "white", className }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen));
  const baseId = useId();

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const btnId = `${baseId}-${item.id}-btn`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div
            key={item.id}
            className={cn(
              "group/item relative overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card motion-reduce:hover:translate-y-0",
              isOpen && "shadow-card",
              tones[tone],
            )}
          >
            <h3 className="font-sans font-semibold text-base sm:text-lg m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                {item.eyebrow && (
                  <span className="shrink-0 font-display text-sm text-brand-700">{item.eyebrow}</span>
                )}
                <span className="flex-1 transition-transform duration-300 group-hover/item:translate-x-1.5 motion-reduce:group-hover/item:translate-x-0">{item.title}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300",
                    isOpen
                      ? "rotate-45 bg-brand text-white"
                      : "bg-ink/5 text-ink group-hover/item:rotate-90 group-hover/item:bg-brand group-hover/item:text-white",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-500 sm:px-6 sm:pb-6 sm:text-base">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
