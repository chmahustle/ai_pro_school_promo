import Image from "next/image";
import { cn } from "@/lib/utils";

/** Плашка «Рассрочка Kaspi на N месяцев»: фирменный красный (токен kaspi) и значок public/kaspi-kz.webp. Текст - из products.ts (getKaspiInstallmentLabel) */
export function KaspiBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-pill bg-kaspi py-1 pl-1 pr-4 text-[14px] font-bold leading-none text-white", className)}>
      <Image src="/kaspi-kz.webp" alt="" width={28} height={28} className="size-7 shrink-0 rounded-full" />
      {label}
    </span>
  );
}
