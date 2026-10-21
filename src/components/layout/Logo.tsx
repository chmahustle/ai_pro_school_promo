import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  invert?: boolean;
  /** Только знак, без текста */
  markOnly?: boolean;
}

const LOGO_SRC = "/og/logo.svg";

/** Логотип: public/og/logo.svg + текстовый wordmark */
export function Logo({ className, invert, markOnly }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="AI Pro School — на главную"
      className={cn("inline-flex items-center gap-2.5 rounded-pill", className)}
    >
      <LogoMark className="size-9" />
      {!markOnly && (
        <span className={cn("font-display text-[15px] font-extrabold leading-none tracking-tight", invert ? "text-white" : "text-ink")}>
          AI&nbsp;Pro&nbsp;<span className={invert ? "text-brand-200" : "text-brand-700"}>School</span>
        </span>
      )}
    </Link>
  );
}

export function LogoMark({ className }: { className?: string; invert?: boolean }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={36}
      height={36}
      className={cn("rounded-[10px] object-cover", className)}
      priority
      aria-hidden
    />
  );
}
