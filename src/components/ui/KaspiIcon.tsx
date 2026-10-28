/**
 * Значок Kaspi для плашки рассрочки: белый скруглённый квадрат с красным знаком (упрощённая отрисовка).
 * TODO(клиент): заменить на официальный логотип Kaspi (SVG от школы) в public/.
 */
export function KaspiIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#ffffff" />
      <path d="M8 6.5v11M8 12.2l5.2-5.7M9.9 11l4.3 6.5" fill="none" stroke="#f14635" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
