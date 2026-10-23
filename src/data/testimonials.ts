import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

export type TestimonialType = "testimonial" | "receipt" | "chat";

/** Максимум слайдов карусели на главной */
export const HOME_TESTIMONIALS_LIMIT = 6;

export interface Testimonial {
  id: string;
  type: TestimonialType;
  personName?: string;
  caption?: string;
  consent: boolean;
  /** Локальный mp4 (если есть) */
  videoSrc?: string | null;
  /** YouTube/embed — открывается в лайтбоксе по клику */
  embedUrl?: string | null;
  imageSrc?: string | null;
  poster: string;
  verified: boolean;
  /** «2,7 млн» — бейдж вверху слева, если verified */
  views?: { value: string; verified: boolean };
  note?: string;
}

/**
 * Карусель «Что говорят ученики».
 * Только testimonial / receipt / chat. Работы учеников — в works.ts.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t-guldaria",
    type: "testimonial",
    personName: "Гульдария",
    caption: "мама двоих детей",
    consent: true,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/eyqVEf-2294?autoplay=1",
    poster: "/stories/ai2026/video-guldaria.jpg",
    verified: true,
  },
  {
    id: "t-shynar",
    type: "testimonial",
    personName: "Шынар",
    caption: "43 года",
    consent: true,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/IsYI0XQy9A8?autoplay=1",
    poster: "/stories/ai2026/video-shynar.jpg",
    verified: true,
  },
  {
    id: "t-moldir",
    type: "testimonial",
    personName: "Молдир",
    caption: "техспец",
    consent: true,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/_vHOfJPFbUY?autoplay=1",
    poster: "/stories/ai2026/video-moldir.jpg",
    verified: true,
  },
  {
    id: "t-review-1",
    type: "testimonial",
    consent: false,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/cKWY9WswkBg?autoplay=1",
    poster: "/stories/ai2026/video-review-1.jpg",
    verified: true,
  },
  {
    id: "t-review-2",
    type: "testimonial",
    consent: false,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/IjdBjuBEsYg?autoplay=1",
    poster: "/stories/ai2026/video-review-2.jpg",
    verified: true,
  },
  {
    id: "t-review-3",
    type: "testimonial",
    consent: false,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/6MNlwnkbZwY?autoplay=1",
    poster: "/stories/ai2026/video-review-3.jpg",
    verified: true,
  },
  {
    id: "t-review-4",
    type: "testimonial",
    consent: false,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/3BGOZYQYhXU?autoplay=1",
    poster: "/stories/ai2026/video-review-4.jpg",
    verified: true,
  },
  {
    id: "t-review-5",
    type: "testimonial",
    consent: false,
    videoSrc: null,
    embedUrl: "https://www.youtube.com/embed/D6k9I_fcdL8?autoplay=1",
    poster: "/stories/ai2026/video-review-5.jpg",
    verified: true,
  },
  ...Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    return {
      id: `t-receipt-${n}`,
      type: "receipt" as const,
      consent: true,
      imageSrc: `/stories/practicum/receipt-${n}.png`,
      poster: `/stories/practicum/receipt-${n}.png`,
      verified: true,
    };
  }),
  ...Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    const ext = n === 19 ? "png" : "jpeg";
    return {
      id: `t-chat-p-${n}`,
      type: "chat" as const,
      consent: true,
      imageSrc: `/stories/practicum/chat-${n}.${ext}`,
      poster: `/stories/practicum/chat-${n}.${ext}`,
      verified: true,
    };
  }),
  ...[1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((n) => {
    const ext = n === 1 ? "jpg" : "jpeg";
    return {
      id: `t-chat-a-${n}`,
      type: "chat" as const,
      consent: true,
      imageSrc: `/stories/ai2026/chat-${n}.${ext}`,
      poster: `/stories/ai2026/chat-${n}.${ext}`,
      verified: true,
    };
  }),
];

const ALLOWED: TestimonialType[] = ["testimonial", "receipt", "chat"];

function assertCarouselTypes(list: Testimonial[]) {
  if (process.env.NODE_ENV === "production") return;
  for (const item of list) {
    if (!ALLOWED.includes(item.type)) {
      console.error(
        `[testimonials] запись ${item.id} имеет type="${String((item as { type: string }).type)}" — в карусель допускаются только testimonial | receipt | chat`,
      );
    }
  }
}

export function getVisibleTestimonials(): Testimonial[] {
  const list = (SHOW_PLACEHOLDERS ? testimonials : testimonials.filter((t) => t.verified)).filter(
    (t) => Boolean(t.poster) && t.verified,
  );
  assertCarouselTypes(list);
  return list;
}

/** Слайды для главной: лимит + приоритет video → receipt → chat */
export function getHomeTestimonials(): Testimonial[] {
  const all = getVisibleTestimonials();
  const order: TestimonialType[] = ["testimonial", "receipt", "chat"];
  const picked: Testimonial[] = [];
  for (const type of order) {
    for (const t of all) {
      if (t.type !== type) continue;
      picked.push(t);
      if (picked.length >= HOME_TESTIMONIALS_LIMIT) {
        assertCarouselTypes(picked);
        return picked;
      }
    }
  }
  assertCarouselTypes(picked);
  return picked;
}

/** Сколько отзывов остаётся за пределами карусели на главной */
export function getTestimonialsMoreCount(): number {
  return Math.max(0, getVisibleTestimonials().length - HOME_TESTIMONIALS_LIMIT);
}
