import { cn } from "@/lib/utils";

export type TileDecorTone = "brand" | "dark" | "lavender";

/** Четырёхконечная искра (форма из логотипа) */
function Spark({ className, size }: { className?: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={cn("audience-spark", className)} aria-hidden>
      <path d="M50 8C53.2 32.5 67.5 46.8 92 50C67.5 53.2 53.2 67.5 50 92C46.8 67.5 32.5 53.2 8 50C32.5 46.8 46.8 32.5 50 8Z" />
    </svg>
  );
}

/**
 * Фирменный декор плитки — те же линии и фигуры, что на карточках «Выберите свой путь»:
 * большая искра (розовая плитка), кольцо (тёмная), волна (сиреневая). Стоит в верхнем правом углу, не заходит на текст,
 * мягко анимирован и реагирует на наведение (классы .audience-decor-* и родитель .audience-tile).
 */
export function TileDecor({ tone }: { tone: TileDecorTone }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {tone === "brand" && (
        <>
          <Spark size={190} className="absolute -right-12 -top-12 fill-[#ECE9FF]" />
          <Spark size={22} className="absolute right-[44%] top-8 fill-white/70" />
        </>
      )}
      {tone === "dark" && (
        <>
          <span className="audience-decor audience-decor-circle absolute -right-16 -top-16 size-[230px]">
            <svg className="audience-decor-breathe h-full w-full" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="78" stroke="#fff" strokeOpacity="0.16" strokeWidth="12" />
            </svg>
          </span>
          <Spark size={22} className="absolute right-[40%] top-9 fill-brand" />
        </>
      )}
      {tone === "lavender" && (
        <>
          <span className="audience-decor audience-decor-wave absolute -right-12 -top-6 h-[125px] w-[185px]">
            <svg className="audience-decor-sway h-full w-full" viewBox="0 0 190 130" fill="none">
              <path d="M0 88C34 20 70 24 96 66C120 104 156 118 192 40" stroke="#F7B0CF" strokeWidth="18" strokeLinecap="round" />
            </svg>
          </span>
          <Spark size={20} className="absolute right-[42%] top-9 fill-dark" />
        </>
      )}
    </div>
  );
}
