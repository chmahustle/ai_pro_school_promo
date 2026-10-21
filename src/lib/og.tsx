import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fontsDir = join(process.cwd(), "src/styles/fonts/og");

async function loadFonts() {
  const [uCyr, uLat, mCyr, mLat, mCyr600, mLat600] = await Promise.all([
    readFile(join(fontsDir, "unbounded-cyrillic-700-normal.woff")),
    readFile(join(fontsDir, "unbounded-latin-700-normal.woff")),
    readFile(join(fontsDir, "manrope-cyrillic-400-normal.woff")),
    readFile(join(fontsDir, "manrope-latin-400-normal.woff")),
    readFile(join(fontsDir, "manrope-cyrillic-600-normal.woff")),
    readFile(join(fontsDir, "manrope-latin-600-normal.woff")),
  ]);
  return [
    { name: "Unbounded", data: uCyr, weight: 700 as const, style: "normal" as const },
    { name: "UnboundedLatin", data: uLat, weight: 700 as const, style: "normal" as const },
    { name: "Manrope", data: mCyr, weight: 400 as const, style: "normal" as const },
    { name: "ManropeLatin", data: mLat, weight: 400 as const, style: "normal" as const },
    { name: "Manrope", data: mCyr600, weight: 600 as const, style: "normal" as const },
    { name: "ManropeLatin", data: mLat600, weight: 600 as const, style: "normal" as const },
  ];
}

interface OgProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  theme?: "light" | "dark" | "peach";
}

const themes = {
  light: { bg: "#F6F5FA", fg: "#14121F", muted: "#5F5B78", accent: "#E8307E", chip: "#FDE8F1", chipFg: "#A01D56" },
  dark: { bg: "#14121F", fg: "#FFFFFF", muted: "rgba(255,255,255,.65)", accent: "#E8307E", chip: "rgba(255,255,255,.1)", chipFg: "#FFFFFF" },
  peach: { bg: "#FFE4D6", fg: "#14121F", muted: "rgba(20,18,31,.7)", accent: "#E8307E", chip: "rgba(20,18,31,.08)", chipFg: "#14121F" },
};

/**
 * Генератор OG-картинок (1200×630) для превью в WhatsApp/Telegram.
 * Статически собирается на билде для каждой страницы через opengraph-image.tsx.
 */
export async function renderOg({ title, subtitle, eyebrow, theme = "light" }: OgProps) {
  const fonts = await loadFonts();
  const c = themes[theme];
  const titleSize = title.length > 60 ? 54 : title.length > 40 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: c.bg,
          color: c.fg,
          fontFamily: "Manrope, ManropeLatin",
          position: "relative",
        }}
      >
        {/* Mesh-подобные пятна без blur (satori) — полупрозрачные круги */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -100,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: theme === "dark" ? "rgba(184,166,255,.35)" : "rgba(184,166,255,.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: -120,
            width: 380,
            height: 380,
            borderRadius: 999,
            background: theme === "peach" ? "rgba(232,48,126,.2)" : "rgba(255,176,136,.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 200,
            bottom: -80,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: "rgba(126,200,255,.35)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: theme === "dark" ? "#FFFFFF" : "#14121F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme === "dark" ? "#14121F" : "#fff",
                fontFamily: "Unbounded, UnboundedLatin",
                fontSize: 26,
              }}
            >
              A
            </div>
            <div style={{ fontFamily: "Unbounded, UnboundedLatin", fontSize: 28, letterSpacing: -0.5 }}>
              AI Pro School
            </div>
          </div>
          {eyebrow && (
            <div
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: c.chip,
                color: c.chipFg,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000, position: "relative" }}>
          <div style={{ fontFamily: "Unbounded, UnboundedLatin", fontSize: titleSize, lineHeight: 1.05, letterSpacing: -1.5 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 30, lineHeight: 1.3, color: c.muted, maxWidth: 900 }}>{subtitle}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, color: c.muted, position: "relative" }}>
          <div>ai-pro-school.kz</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: c.accent }} />
            Онлайн-школа ИИ · Казахстан
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
