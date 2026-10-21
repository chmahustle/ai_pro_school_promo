import type { ReactNode } from "react";
import { SHOW_PLACEHOLDERS, type VerificationStatus } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

interface PlaceholderBadgeProps {
  status?: Exclude<VerificationStatus, "verified">;
  note?: string;
  className?: string;
}

/**
 * Заметный dev-бейдж поверх плейсхолдерных данных. В проде не рендерится
 * (если не включён NEXT_PUBLIC_SHOW_PLACEHOLDERS). Родитель должен быть `relative`.
 */
export function PlaceholderBadge({ status = "placeholder", note, className }: PlaceholderBadgeProps) {
  if (!SHOW_PLACEHOLDERS) return null;
  const label = status === "placeholder" ? "PLACEHOLDER" : "UNVERIFIED";
  return (
    <span
      role="note"
      title={note ?? (status === "placeholder" ? "Заменить реальными данными" : "Цифра не подтверждена клиентом")}
      className={cn(
        "pointer-events-auto absolute left-2 top-2 z-30 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider shadow",
        status === "placeholder" ? "bg-[#ff3d71] text-white" : "bg-[#ffb020] text-ink",
        className,
      )}
    >
      <span aria-hidden>⚑</span>
      {label}
    </span>
  );
}

interface PlaceholderProps {
  status?: Exclude<VerificationStatus, "verified">;
  note?: string;
  className?: string;
  children: ReactNode;
  /** Инлайновая обёртка (для чисел/строк внутри текста) */
  inline?: boolean;
}

/** Обёртка: добавляет relative и бейдж вокруг любого контента */
export function Placeholder({ status = "placeholder", note, className, children, inline }: PlaceholderProps) {
  if (!SHOW_PLACEHOLDERS) return <>{children}</>;
  if (inline) {
    return (
      <span
        title={note}
        className={cn(
          "rounded-sm outline-dashed outline-1 outline-offset-2",
          status === "placeholder" ? "outline-[#ff3d71]" : "outline-[#ffb020]",
          className,
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <div className={cn("relative", className)}>
      <PlaceholderBadge status={status} note={note} />
      {children}
    </div>
  );
}
