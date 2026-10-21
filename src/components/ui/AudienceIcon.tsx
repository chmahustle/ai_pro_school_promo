import type { AudienceSlug } from "@/data/types";
import { cn } from "@/lib/utils";

const INK = "#171717";
const PINK = "#E8307E";
const LAV = "#ECE9FF";
const PEACH = "#FFB088";

/** Фирменные SVG-иллюстрации ЦА вместо эмодзи: бизнес — здание, фриланс — ноутбук, найм — рост, новичок — ракета */
export function AudienceIcon({ slug, className }: { slug: AudienceSlug; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={cn("size-8", className)}>
      {slug === "business" && (
        <>
          <rect x="7" y="5" width="23" height="38" rx="4" fill={INK} />
          {[11, 19, 27].flatMap((y) => [12, 21].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1.5" fill={LAV} />))}
          <rect x="15" y="35" width="7" height="8" rx="1.5" fill={PINK} />
          <rect x="29" y="19" width="13" height="24" rx="3.5" fill={PINK} />
          <rect x="33" y="24" width="5" height="4" rx="1.2" fill="#fff" />
          <rect x="33" y="31" width="5" height="4" rx="1.2" fill="#fff" />
        </>
      )}
      {slug === "freelancers" && (
        <>
          <rect x="7" y="8" width="34" height="23" rx="4.5" fill={INK} />
          <rect x="10.5" y="11.5" width="27" height="16" rx="2.5" fill={LAV} />
          <path d="M24 14.5C24.8 19 26.5 20.7 31 21.5C26.5 22.3 24.8 24 24 28.5C23.2 24 21.5 22.3 17 21.5C21.5 20.7 23.2 19 24 14.5Z" fill={PINK} />
          <rect x="3" y="33" width="42" height="6.5" rx="3.25" fill="#A6A3BA" />
          <rect x="19" y="33" width="10" height="2.5" rx="1.25" fill={INK} opacity="0.25" />
        </>
      )}
      {slug === "career" && (
        <>
          <rect x="6" y="27" width="9" height="14" rx="3" fill="#F7B0CF" />
          <rect x="19.5" y="18" width="9" height="23" rx="3" fill={PINK} />
          <rect x="33" y="8" width="9" height="33" rx="3" fill={INK} />
          <path d="M8 19L19 11L25 14L36 4" stroke={PEACH} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30 4H36V10" stroke={PEACH} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {slug === "beginners" && (
        <>
          <path d="M24 3C32 9 34.5 21 30.5 33H17.5C13.5 21 16 9 24 3Z" fill={PINK} />
          <circle cx="24" cy="17" r="4.5" fill={LAV} />
          <path d="M18 25L9 35L18 32.5V25Z" fill={INK} />
          <path d="M30 25L39 35L30 32.5V25Z" fill={INK} />
          <path d="M20.5 34C21.5 41 24 45 24 45C24 45 26.5 41 27.5 34H20.5Z" fill={PEACH} />
        </>
      )}
    </svg>
  );
}
