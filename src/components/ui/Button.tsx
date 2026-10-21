import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** primary/dark = ink CTA (основной). brand = мягкий magenta-акцент, не для главных CTA. */
export type ButtonVariant = "primary" | "dark" | "brand" | "outline" | "ghost" | "white";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Hover-принцип: у кнопок «текст + стрелка справа» от стрелки разрастается круг цвета `fill`, текст меняется на `hoverText`,
 * к концу сама кнопка тоже получает этот цвет (без каймы). У кнопок без стрелки — обычный hover (`plain`).
 */
const variants: Record<ButtonVariant, { base: string; plain: string; fill?: string; hoverBg?: string; hoverText?: string }> = {
  primary: { base: "bg-ink text-white shadow-pill", plain: "hover:bg-ink-700", fill: "bg-brand", hoverBg: "hover:bg-brand" },
  dark: { base: "bg-ink text-white shadow-pill", plain: "hover:bg-ink-700", fill: "bg-brand", hoverBg: "hover:bg-brand" },
  brand: { base: "bg-brand-50 text-brand-700", plain: "hover:bg-brand-100", fill: "bg-brand", hoverBg: "hover:bg-brand", hoverText: "group-hover:text-white" },
  outline: { base: "bg-transparent text-ink border border-ink-200 hover:border-ink", plain: "hover:bg-surface", fill: "bg-ink", hoverBg: "hover:bg-ink", hoverText: "group-hover:text-white" },
  ghost: { base: "bg-transparent text-ink hover:bg-ink/5 active:bg-ink/10", plain: "" },
  white: { base: "bg-surface text-ink shadow-pill", plain: "hover:bg-soft-100", fill: "bg-brand", hoverBg: "hover:bg-brand", hoverText: "group-hover:text-white" },
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-[15px] gap-2",
  lg: "h-14 px-7 text-base gap-2.5",
};

const base =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-pill font-semibold whitespace-nowrap transition-[background-color,transform,box-shadow,border-color,color] duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] active:delay-0";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  /** Цвет заливки при наведении вместо розового — для кнопок на розовом фоне */
  fillTone?: "dark";
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, icon, iconPosition = "right", fullWidth, fillTone, ...rest },
  ref,
) {
  const v = variants[variant];
  // Анимация заливки — только у кнопок с иконкой-стрелкой справа
  const withFill = Boolean(icon && iconPosition === "right" && v.fill);
  const classes = cn(
    base,
    v.base,
    withFill ? `${fillTone === "dark" ? "hover:bg-dark" : v.hoverBg} hover:[transition-delay:300ms,0ms,0ms,0ms,0ms] motion-reduce:hover:[transition-delay:0ms]` : v.plain,
    sizes[size],
    fullWidth && "w-full",
    className,
  );
  const content = (
    <>
      {withFill && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-1.5 top-1/2 aspect-square h-[72%] -translate-y-1/2 scale-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[26] motion-reduce:hidden",
            fillTone === "dark" ? "bg-dark" : v.fill,
          )}
        />
      )}
      {icon && iconPosition === "left" && <span className="relative z-10 shrink-0 -ml-0.5">{icon}</span>}
      <span className={cn("relative z-10 transition-colors duration-300", withFill && v.hoverText)}>{children}</span>
      {icon && iconPosition === "right" && (
        <span className={cn("relative z-10 shrink-0 -mr-0.5 transition-transform duration-300 group-hover:translate-x-1", withFill && v.hoverText)}>{icon}</span>
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, target, rel, onClick, ...linkRest } = rest as ButtonAsLink;
    const external = /^https?:|^mailto:|^tel:/.test(href);
    if (external) {
      return (
        <a
          href={href}
          target={target ?? "_blank"}
          rel={rel ?? "noopener noreferrer"}
          className={classes}
          onClick={onClick}
          {...linkRest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonAsButton;
  return (
    <button ref={ref} type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
});
