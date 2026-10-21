import type { AudienceSlug } from "@/data/types";
import { cn } from "@/lib/utils";

const INK = "#171717";
const PINK = "#E8307E";
const PINK_L = "#F7B0CF";
const LAV = "#ECE9FF";
const PEACH = "#FFB088";

const SPARK = "M0 -10C0.8 -3 3 -0.8 10 0C3 0.8 0.8 3 0 10C-0.8 3 -3 0.8 -10 0C-3 -0.8 -0.8 -3 0 -10Z";

/**
 * SVG-иллюстрации ЦА (широкие сцены 420×180) для превью в меню «Для кого» вместо заглушки под фото:
 * бизнес — цепочка автоматизации, фриланс — ноутбук с карточками заказов, найм — рост по ступеням, новичок — ракета.
 * Цвета рассчитаны на фон карточки: бизнес — чёрный, остальные — светлые.
 */
export function AudienceIllustration({ slug, className }: { slug: AudienceSlug; className?: string }) {
  return (
    <svg viewBox="0 0 420 180" fill="none" aria-hidden preserveAspectRatio="xMidYMid meet" className={cn("h-full w-full", className)}>
      {slug === "business" && (
        <>
          {/* три шага автоматизации: чат → CRM → отчёт */}
          {[20, 160, 300].map((x) => (
            <rect key={x} x={x} y="38" width="100" height="104" rx="22" fill="#fff" fillOpacity="0.07" stroke="#fff" strokeOpacity="0.14" />
          ))}
          {/* чат-бот */}
          <rect x="36" y="58" width="70" height="34" rx="11" fill={PINK} />
          <path d="M48 92L44 104L60 92Z" fill={PINK} />
          <rect x="46" y="68" width="42" height="5" rx="2.5" fill="#fff" />
          <rect x="46" y="79" width="28" height="5" rx="2.5" fill="#fff" fillOpacity="0.6" />
          <rect x="62" y="108" width="44" height="22" rx="9" fill="#fff" fillOpacity="0.16" />
          {/* таблица CRM */}
          <rect x="176" y="58" width="68" height="72" rx="10" fill="#fff" fillOpacity="0.1" />
          <rect x="176" y="58" width="68" height="16" rx="8" fill={PINK} />
          {[88, 103, 118].map((y) => (
            <rect key={y} x="184" y={y} width="52" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
          ))}
          {/* отчёт */}
          <rect x="320" y="104" width="14" height="28" rx="4" fill="#fff" fillOpacity="0.4" />
          <rect x="340" y="88" width="14" height="44" rx="4" fill="#fff" fillOpacity="0.4" />
          <rect x="360" y="68" width="14" height="64" rx="4" fill={PINK} />
          <path d="M322 70L346 56L368 46" stroke={PEACH} strokeWidth="3.5" strokeLinecap="round" />
          {/* связи */}
          <path d="M122 90H158M262 90H298" stroke={PINK} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 8" />
          <circle cx="140" cy="90" r="6" fill={PINK} />
          <circle cx="280" cy="90" r="6" fill={PINK} />
        </>
      )}

      {slug === "freelancers" && (
        <>
          {/* ноутбук */}
          <rect x="130" y="30" width="160" height="100" rx="12" fill={INK} />
          <rect x="140" y="40" width="140" height="80" rx="6" fill={LAV} />
          <g transform="translate(184 80) scale(2.2)">
            <path d={SPARK} fill={PINK} />
          </g>
          <rect x="216" y="56" width="52" height="6" rx="3" fill={INK} fillOpacity="0.25" />
          <rect x="216" y="70" width="36" height="6" rx="3" fill={INK} fillOpacity="0.15" />
          <rect x="108" y="132" width="204" height="12" rx="6" fill="#A6A3BA" />
          <rect x="186" y="132" width="48" height="4" rx="2" fill={INK} fillOpacity="0.2" />
          {/* карточки заказов */}
          <g transform="rotate(-8 74 66)">
            <rect x="34" y="40" width="80" height="52" rx="14" fill="#fff" stroke={INK} strokeOpacity="0.06" />
            <circle cx="54" cy="58" r="9" fill={PINK_L} />
            <rect x="68" y="53" width="36" height="5" rx="2.5" fill={INK} fillOpacity="0.5" />
            <rect x="68" y="63" width="24" height="5" rx="2.5" fill={INK} fillOpacity="0.2" />
            <rect x="46" y="76" width="56" height="6" rx="3" fill={PINK} />
          </g>
          <g transform="rotate(9 352 58)">
            <rect x="318" y="34" width="68" height="48" rx="14" fill="#fff" stroke={INK} strokeOpacity="0.06" />
            <text x="352" y="66" textAnchor="middle" fontSize="26" fontWeight="800" fill={PINK} fontFamily="inherit">₸</text>
          </g>
          <g transform="rotate(-6 352 128)">
            <rect x="312" y="108" width="80" height="40" rx="12" fill={INK} />
            <rect x="324" y="122" width="56" height="6" rx="3" fill="#fff" fillOpacity="0.2" />
            <rect x="324" y="122" width="36" height="6" rx="3" fill={PINK} />
            <rect x="324" y="134" width="24" height="4" rx="2" fill="#fff" fillOpacity="0.2" />
          </g>
          <g transform="translate(60 138) scale(1.2)">
            <path d={SPARK} fill={INK} />
          </g>
        </>
      )}

      {slug === "career" && (
        <>
          {/* ступени роста */}
          <rect x="64" y="122" width="52" height="30" rx="10" fill={PINK_L} />
          <rect x="128" y="96" width="52" height="56" rx="10" fill={PINK} />
          <rect x="192" y="68" width="52" height="84" rx="10" fill={INK} />
          <rect x="256" y="38" width="52" height="114" rx="10" fill={PINK_L} />
          <path d="M60 104L124 76L188 52L246 28L300 14" stroke={PEACH} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M284 12L302 13L298 30" stroke={PEACH} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {[[60, 104], [124, 76], [188, 52], [246, 28]].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="7" fill="#fff" stroke={PINK} strokeWidth="3.5" />
          ))}
          <g transform="translate(350 60) scale(2.4)">
            <path d={SPARK} fill={PINK} />
          </g>
          <g transform="translate(378 120) scale(1.2)">
            <path d={SPARK} fill={INK} />
          </g>
        </>
      )}

      {slug === "beginners" && (
        <>
          {/* орбита и звёзды */}
          <ellipse cx="210" cy="96" rx="170" ry="42" transform="rotate(-18 210 96)" stroke={PINK} strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
          <circle cx="70" cy="138" r="14" fill={PEACH} />
          <circle cx="70" cy="138" r="14" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" />
          {[[44, 40, 1.6], [372, 32, 2], [356, 140, 1.2], [118, 28, 1]].map(([x, y, k]) => (
            <g key={`${x}`} transform={`translate(${x} ${y}) scale(${k})`}>
              <path d={SPARK} fill={x === 372 ? PINK : INK} />
            </g>
          ))}
          {/* ракета */}
          <g transform="translate(150 6) rotate(28 60 84) scale(2.5)">
            <path d="M24 3C32 9 34.5 21 30.5 33H17.5C13.5 21 16 9 24 3Z" fill={PINK} />
            <circle cx="24" cy="17" r="4.5" fill={LAV} />
            <path d="M18 25L9 35L18 32.5V25Z" fill={INK} />
            <path d="M30 25L39 35L30 32.5V25Z" fill={INK} />
            <path d="M20.5 34C21.5 41 24 45 24 45C24 45 26.5 41 27.5 34H20.5Z" fill={PEACH} />
          </g>
        </>
      )}
    </svg>
  );
}
