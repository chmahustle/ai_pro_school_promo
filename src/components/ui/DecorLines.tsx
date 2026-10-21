import { cn } from "@/lib/utils";

export type DecorLinesVariant = "loops" | "wave" | "orbits";

interface DecorLinesProps {
  variant?: DecorLinesVariant;
  className?: string;
  opacity?: number;
}

/**
 * Декоративные линии заднего плана (inline SVG):
 * - loops  — тонкие петли/орбиты
 * - wave   — широкая мягкая лента
 * - orbits — крупные дуги + искры
 */
export function DecorLines({ variant = "loops", className, opacity }: DecorLinesProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
      style={opacity !== undefined ? { opacity } : undefined}
    >
      {variant === "loops" && <LoopsSvg />}
      {variant === "wave" && <WaveSvg />}
      {variant === "orbits" && <OrbitsSvg />}
    </div>
  );
}

function LoopsSvg() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.55]"
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M-40 420C80 180 280 80 480 160C680 240 720 420 560 520C400 620 220 580 160 440C100 300 280 220 460 280C640 340 780 520 700 640C620 760 400 780 240 700"
        stroke="#B8A6FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M1240 280C1080 80 860 40 680 140C500 240 520 420 700 480C880 540 1040 460 1100 340C1160 220 980 160 820 220C660 280 580 460 680 580C780 700 1020 720 1180 600"
        stroke="#C9B8FF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M510 248C514 268 526 280 546 284C526 288 514 300 510 320C506 300 494 288 474 284C494 280 506 268 510 248Z"
        fill="#E8307E"
        opacity="0.55"
      />
      <path
        d="M900 470C902 482 910 490 922 492C910 494 902 502 900 514C898 502 890 494 878 492C890 490 898 482 900 470Z"
        fill="#14121F"
        opacity="0.35"
      />
    </svg>
  );
}

function WaveSvg() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-90"
      viewBox="0 0 1440 720"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M-80 380C120 220 320 180 520 260C720 340 820 420 980 400C1140 380 1280 280 1520 300L1520 520C1280 500 1140 560 980 580C820 600 720 520 520 480C320 440 120 500 -80 560Z"
        fill="#ECE9FF"
        opacity="0.85"
      />
      <path
        d="M-80 420C140 280 340 250 540 320C740 390 860 450 1020 430C1180 410 1320 340 1520 360"
        stroke="#B8A6FF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function OrbitsSvg() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-70"
      viewBox="0 0 1000 700"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <ellipse cx="120" cy="80" rx="280" ry="260" stroke="#fff" strokeWidth="12" opacity="0.55" />
      <ellipse cx="920" cy="640" rx="300" ry="280" stroke="#fff" strokeWidth="12" opacity="0.5" />
      <path
        d="M200 160C204 178 216 190 234 194C216 198 204 210 200 228C196 210 184 198 166 194C184 190 196 178 200 160Z"
        fill="#E8307E"
        opacity="0.7"
      />
    </svg>
  );
}
