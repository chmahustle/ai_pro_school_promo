import "server-only";

/**
 * Видеоотзывы учеников вайб-кодинга (файлы - public/video/off_vibecoding: MP4 H.264 720×1280 + постер WebP).
 * Показываются на страницах вайб-кодинга (/courses/vibecoding) и офлайн-урока (/courses/vibecoding-offline).
 * Прод: только verified && consent. Загружены владельцем 2026-10 как отзывы учеников; письменное согласие учеников
 * школа должна подтвердить (TODO.md → «Видеоотзывы вайб-кодинга»).
 */
export type VideoReviewPage = "vibecoding" | "vibecoding-offline";

export interface VideoReview {
  id: string;
  /** MP4 (H.264) в public/ */
  src: string;
  /** Постер WebP в public/ */
  poster: string;
  /** Длительность, секунд (для подписи «1:10») */
  durationSec: number;
  pages: VideoReviewPage[];
  verified: boolean;
  consent: boolean;
  source: string;
  asOf: string;
}

const BASE = "/video/off_vibecoding";
const PAGES: VideoReviewPage[] = ["vibecoding", "vibecoding-offline"];
const meta = { pages: PAGES, verified: true, consent: true, source: "видео от школы (загружено владельцем)", asOf: "2026-10" } as const;

export const videoReviews: VideoReview[] = [
  { id: "r-4829", src: `${BASE}/IMG_4829.mp4`, poster: `${BASE}/IMG_4829.webp`, durationSec: 70, ...meta },
  { id: "r-5066", src: `${BASE}/IMG_5066.mp4`, poster: `${BASE}/IMG_5066.webp`, durationSec: 74, ...meta },
  { id: "r-5123", src: `${BASE}/IMG_5123.mp4`, poster: `${BASE}/IMG_5123.webp`, durationSec: 50, ...meta },
  { id: "r-5179", src: `${BASE}/IMG_5179.mp4`, poster: `${BASE}/IMG_5179.webp`, durationSec: 71, ...meta },
  { id: "r-5809", src: `${BASE}/IMG_5809.mp4`, poster: `${BASE}/IMG_5809.webp`, durationSec: 57, ...meta },
  { id: "r-5866", src: `${BASE}/IMG_5866.mp4`, poster: `${BASE}/IMG_5866.webp`, durationSec: 46, ...meta },
  { id: "r-7039", src: `${BASE}/IMG_7039.mp4`, poster: `${BASE}/IMG_7039.webp`, durationSec: 119, ...meta },
  { id: "r-0969", src: `${BASE}/IMG_0969.mp4`, poster: `${BASE}/IMG_0969.webp`, durationSec: 76, ...meta },
  { id: "r-0974", src: `${BASE}/IMG_0974.mp4`, poster: `${BASE}/IMG_0974.webp`, durationSec: 18, ...meta },
  { id: "r-1127", src: `${BASE}/IMG_1127.mp4`, poster: `${BASE}/IMG_1127.webp`, durationSec: 74, ...meta },
  { id: "r-1139", src: `${BASE}/IMG_1139.mp4`, poster: `${BASE}/IMG_1139.webp`, durationSec: 16, ...meta },
  { id: "r-6902", src: `${BASE}/IMG_6902.mp4`, poster: `${BASE}/IMG_6902.webp`, durationSec: 58, ...meta },
  // Только для блока «Ученики без опыта в коде уже сделали» на лендингах /for/*: на страницах курса не показывается (pages: [])
  { id: "r-0979", src: `${BASE}/IMG_0979.mp4`, poster: `${BASE}/IMG_0979.webp`, durationSec: 56, ...meta, pages: [] },
];

/** Публичная модель: только то, что нужно плееру (без verified/consent/source) */
export interface PublicVideoReview {
  id: string;
  src: string;
  poster: string;
  /** «1:10» */
  duration: string;
}

const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Видеоотзывы страницы: verified && consent */
export function getVideoReviews(page: VideoReviewPage): PublicVideoReview[] {
  return videoReviews
    .filter((v) => v.pages.includes(page) && v.verified && v.consent)
    .map((v) => ({ id: v.id, src: v.src, poster: v.poster, duration: formatDuration(v.durationSec) }));
}

/** Один ролик по id (лендинги /for/*: блок «Ученики без опыта в коде уже сделали»): verified && consent, иначе null */
export function getVideoReviewById(id: string): PublicVideoReview | null {
  const v = videoReviews.find((x) => x.id === id && x.verified && x.consent);
  return v ? { id: v.id, src: v.src, poster: v.poster, duration: formatDuration(v.durationSec) } : null;
}
