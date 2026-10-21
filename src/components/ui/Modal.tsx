"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Ширина контента */
  size?: "sm" | "md" | "lg" | "full";
  /** Без белой подложки — для лайтбокса */
  bare?: boolean;
  className?: string;
  /** Центр элемента-источника (viewport px): окно «вылетает» из него и сворачивается обратно, как окно из Dock в macOS */
  origin?: { x: number; y: number } | null;
}

const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-3xl", full: "max-w-6xl" };

/**
 * Модалка с фокус-ловушкой, закрытием по Esc/клику на фон и блокировкой скролла.
 */
export function Modal({ open, onClose, title, children, size = "md", bare, className, origin }: ModalProps) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Фокус внутрь
    requestAnimationFrame(() => {
      const el = panelRef.current?.querySelector<HTMLElement>("[data-autofocus], button, input");
      el?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      (lastActive.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  // Анимация из точки клика — только на десктопе (на мобильном окно — «шторка» снизу)
  const genie = Boolean(origin) && !reduce && window.innerWidth >= 640;
  const dx = genie && origin ? origin.x - window.innerWidth / 2 : 0;
  const dy = genie && origin ? origin.y - window.innerHeight / 2 : 0;
  const collapsed = genie
    ? { x: dx, y: dy, scale: 0.08, opacity: 0 }
    : { y: 24, opacity: 0, scale: 0.98 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm cursor-default"
            tabIndex={-1}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={collapsed}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={genie ? { ...collapsed, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } } : collapsed}
            transition={genie ? { type: "spring", stiffness: 230, damping: 26, mass: 0.9 } : { duration: 0.3, ease: easeOut }}
            className={cn(
              "relative z-10 w-full max-h-[92dvh] overflow-y-auto",
              sizes[size],
              bare
                ? ""
                : "rounded-t-2xl bg-surface p-6 shadow-float sm:rounded-2xl sm:p-8",
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className={cn(
                "absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full transition-colors",
                bare ? "bg-white/15 text-white hover:bg-white/25" : "bg-ink/5 text-ink hover:bg-ink/10",
              )}
            >
              <X className="size-5" />
            </button>
            {title && !bare && (
              <h2 className="mb-5 pr-12 font-display text-xl sm:text-2xl">{title}</h2>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
