"use client";

import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes, type KeyboardEvent, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border bg-surface px-4 text-[15px] text-ink placeholder:text-ink-300 transition-colors duration-150 outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:opacity-60";
const fieldOk = "border-ink-200 hover:border-ink-300";
const fieldErr = "border-danger focus:border-danger focus:ring-danger/15";

interface FieldWrapProps {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

function FieldWrap({ id, label, error, hint, children, className }: FieldWrapProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, wrapClassName, id: idProp, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap id={id} label={label} error={error} hint={hint} className={wrapClassName}>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(fieldBase, "h-13", error ? fieldErr : fieldOk, className)}
        {...rest}
      />
    </FieldWrap>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapClassName?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, wrapClassName, id: idProp, options, placeholder, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap id={id} label={label} error={error} hint={hint} className={wrapClassName}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(fieldBase, "h-13 appearance-none pr-11", error ? fieldErr : fieldOk, className)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-500"
        />
      </div>
    </FieldWrap>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, wrapClassName, id: idProp, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap id={id} label={label} error={error} hint={hint} className={wrapClassName}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error || undefined}
        className={cn(fieldBase, "min-h-24 resize-y py-3", error ? fieldErr : fieldOk, className)}
        {...rest}
      />
    </FieldWrap>
  );
});

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, className, id: idProp, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={cn("flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-ink-500", className)}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-4.5 shrink-0 cursor-pointer appearance-none rounded-[6px] border border-ink-300 bg-surface transition-colors checked:border-brand checked:bg-brand checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M3.5 8.5l3 3 6-7%22/></svg>')] bg-center bg-no-repeat"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

interface DropdownProps {
  label?: string;
  error?: string;
  hint?: string;
  wrapClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

/**
 * Выпадающий список в стиле сайта вместо нативного <select>: стеклянная панель, скруглённые пункты,
 * галочка у выбранного, клавиатура (↑ ↓ Home End Enter Esc), закрытие по клику вне. Управляется снаружи (value/onChange),
 * для react-hook-form — через Controller.
 */
export function Dropdown({ label, error, hint, wrapClassName, className, id: idProp, name, options, placeholder, value = "", onChange, onBlur }: DropdownProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  /** Открывать вверх, если снизу не хватает места на весь список */
  const [up, setUp] = useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onBlur]);

  const openList = () => {
    const r = rootRef.current?.getBoundingClientRect();
    if (r) {
      const need = options.length * 36 + 24;
      setUp(window.innerHeight - r.bottom < need && r.top > need);
    }
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  };
  const choose = (v: string) => {
    onChange?.(v);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      setActive((i) => (e.key === "ArrowDown" ? Math.min(options.length - 1, i + 1) : Math.max(0, i - 1)));
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(options.length - 1);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      const o = options[active];
      if (o) choose(o.value);
    }
  };

  return (
    <FieldWrap id={id} label={label} error={error} hint={hint} className={wrapClassName}>
      <div ref={rootRef} className="relative">
        <button
          id={id}
          name={name}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          aria-invalid={!!error || undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          className={cn(fieldBase, "flex h-13 items-center pr-11 text-left", open && "border-brand ring-4 ring-brand/15", error ? fieldErr : fieldOk, className)}
        >
          <span className={cn("truncate", !selected && "text-ink-300")}>{selected?.label ?? placeholder ?? ""}</span>
        </button>
        <ChevronDown
          aria-hidden
          className={cn("pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-500 transition-transform duration-200", open && "rotate-180 text-brand")}
        />

        <AnimatePresence>
          {open && (
            <motion.ul
              id={listId}
              role="listbox"
              aria-label={label}
              initial={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute inset-x-0 z-50 flex flex-col rounded-2xl bg-white/90 p-1 shadow-float ring-1 ring-ink/5 backdrop-blur-2xl",
                up ? "bottom-[calc(100%+8px)] origin-bottom" : "top-[calc(100%+8px)] origin-top",
              )}
            >
              {options.map((o, i) => {
                const isSel = o.value === value;
                return (
                  <li
                    key={o.value}
                    id={`${id}-opt-${i}`}
                    role="option"
                    aria-selected={isSel}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(o.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2 text-[14px] leading-snug transition-colors duration-150",
                      i === active ? "bg-lavender/70 text-ink" : "text-ink-700",
                      isSel && "font-semibold text-ink",
                    )}
                  >
                    <span>{o.label}</span>
                    {isSel && <Check className="size-4 shrink-0 text-brand" aria-hidden />}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </FieldWrap>
  );
}
