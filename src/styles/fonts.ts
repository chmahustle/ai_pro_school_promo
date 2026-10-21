import localFont from "next/font/local";

/**
 * Manrope — текстовый шрифт (variable 200–800), кириллица + латиница.
 * Inter Tight — заголовки (variable), локальные woff2 — сеть для запуска не нужна.
 *
 * unicodeRange обязателен у local Manrope: без него next/font/local
 * подключает оба файла как один face.
 */
export const manrope = localFont({
  src: [
    {
      path: "./fonts/manrope-cyrillic-wght-normal.woff2",
      style: "normal",
      // @ts-expect-error next/font LocalFontSource types omit unicodeRange
      unicodeRange: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
    },
    {
      path: "./fonts/manrope-latin-wght-normal.woff2",
      style: "normal",
      // @ts-expect-error next/font LocalFontSource types omit unicodeRange
      unicodeRange:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  preload: true,
});

/** Акцидентный шрифт заголовков (variable 100–900, self-hosted) → CSS var(--font-display) */
export const interTight = localFont({
  src: [
    {
      path: "./fonts/inter-tight-cyrillic-wght-normal.woff2",
      style: "normal",
      // @ts-expect-error next/font LocalFontSource types omit unicodeRange
      unicodeRange: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
    },
    {
      path: "./fonts/inter-tight-latin-wght-normal.woff2",
      style: "normal",
      // @ts-expect-error next/font LocalFontSource types omit unicodeRange
      unicodeRange:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
});
