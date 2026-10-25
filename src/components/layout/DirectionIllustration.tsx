import { AudienceIllustration } from "@/components/ui/AudienceIllustration";

const INK = "#171717";
const PINK = "#E8307E";
const PINK_L = "#F7B0CF";
const LAV = "#ECE9FF";

/**
 * Иллюстрации тёмной карточки меню (сцены 420×180). Ролики — телефон, плеер и таймлайн из простых форм;
 * вайб-кодинг — готовая сцена «чат → форма/CRM → график» из прежнего меню (AudienceIllustration, бизнес).
 */
export function DirectionIllustration({ direction }: { direction: "creator" | "vibecoding" }) {
  if (direction === "vibecoding") return <AudienceIllustration slug="business" className="absolute inset-0" />;
  return (
    <svg viewBox="0 0 420 180" fill="none" aria-hidden preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
      {/* телефон с плеером */}
      <rect x="150" y="8" width="84" height="132" rx="16" fill={LAV} />
      <rect x="156" y="16" width="72" height="116" rx="11" fill={INK} />
      <circle cx="192" cy="68" r="22" fill={PINK} />
      <path d="M185 57L205 68L185 79Z" fill="#fff" />
      <rect x="164" y="104" width="56" height="5" rx="2.5" fill="#fff" fillOpacity="0.25" />
      <rect x="164" y="104" width="30" height="5" rx="2.5" fill={PINK_L} />
      <circle cx="194" cy="106.5" r="5" fill="#fff" />
      {/* таймлайн под телефоном: клипы разной длины */}
      <rect x="40" y="146" width="340" height="26" rx="10" fill="#fff" fillOpacity="0.08" />
      <rect x="48" y="152" width="90" height="14" rx="5" fill={PINK} />
      <rect x="144" y="152" width="58" height="14" rx="5" fill={PINK_L} />
      <rect x="208" y="152" width="74" height="14" rx="5" fill="#fff" fillOpacity="0.45" />
      <rect x="288" y="152" width="84" height="14" rx="5" fill={LAV} fillOpacity="0.8" />
      <path d="M190 142V176" stroke="#fff" strokeWidth="2" />
      {/* кадры-карточки по бокам */}
      <rect x="52" y="30" width="62" height="92" rx="12" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.16" />
      <circle cx="83" cy="62" r="11" fill={PINK_L} />
      <rect x="64" y="86" width="38" height="5" rx="2.5" fill="#fff" fillOpacity="0.4" />
      <rect x="64" y="97" width="26" height="5" rx="2.5" fill="#fff" fillOpacity="0.25" />
      <rect x="270" y="30" width="62" height="92" rx="12" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.16" />
      <path d="M287 100L301 74L315 100Z" fill={PINK} />
      <circle cx="318" cy="52" r="8" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}
