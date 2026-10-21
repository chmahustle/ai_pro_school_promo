import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrowLinkProps {
  href: string;
  children: string;
  /** onDark — белая пилюля для тёмных панелей; onLight — тёмная для светлых */
  tone?: "onDark" | "onLight";
  className?: string;
  onClick?: () => void;
  /** Внешняя ссылка: открывается в новой вкладке */
  external?: boolean;
}

/**
 * Ссылка-кнопка «Все …» с розовым кружком-стрелкой: при наведении круг разрастается на всю кнопку,
 * текст белеет, стрелки сменяют друг друга; к концу сама кнопка розовая — без каймы по краям.
 */
export function ArrowLink({ href, children, tone = "onLight", className, onClick, external }: ArrowLinkProps) {
  const dark = tone === "onLight";
  return (
    <Link
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-pill pl-6 pr-1.5 text-[15px] font-semibold",
        "transition-[transform,background-color] duration-200 hover:bg-brand hover:delay-300 active:scale-[0.98] active:delay-0",
        dark ? "bg-dark text-white" : "bg-white text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[12] motion-reduce:transition-none"
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{children}</span>
      <span aria-hidden className="relative z-10 grid size-9 place-items-center overflow-hidden rounded-full text-white">
        <ArrowRight className="absolute size-4 transition-transform duration-300 group-hover:translate-x-6" />
        <ArrowRight className="absolute size-4 -translate-x-6 transition-transform duration-300 group-hover:translate-x-0" />
      </span>
    </Link>
  );
}
