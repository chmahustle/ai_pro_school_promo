import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

/** Максимум карточек ленты на главной */
export const HOME_WORKS_LIMIT = 8;

export interface WorkViews {
  value: string;
  verified: boolean;
}

export interface Work {
  id: string;
  poster: string;
  videoSrc: string | null;
  views?: WorkViews;
  ageNote?: string;
  personName?: string;
  consent: boolean;
  platformUrl?: string;
  verified: boolean;
  thirdPartyWatermark: boolean;
  watermarkPermission?: boolean;
  note?: string;
}

export const works: Work[] = [
  {
    id: "w-2_7m",
    poster: "/stories/practicum/reel-2_7m.jpg",
    videoSrc: null,
    views: { value: "2,7 млн", verified: true },
    consent: false,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=H9gsaBtulxQ",
  },
  {
    id: "w-74y",
    poster: "/stories/practicum/reel-74y.jpg",
    videoSrc: null,
    ageNote: "74 года",
    consent: true,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=a6kI7H38uzU",
  },
  {
    id: "w-1_4m_a",
    poster: "/stories/practicum/reel-1_4m_a.jpg",
    videoSrc: null,
    views: { value: "1,4 млн", verified: true },
    consent: false,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=o4ezXzupeDo",
  },
  {
    id: "w-64y",
    poster: "/stories/practicum/reel-64y.jpg",
    videoSrc: null,
    ageNote: "64 года",
    consent: true,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=tj6WJDyANHM",
  },
  {
    id: "w-1m",
    poster: "/stories/practicum/reel-1m.jpg",
    videoSrc: null,
    views: { value: "1 млн", verified: true },
    consent: false,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=ZBLVe2acbvQ",
  },
  {
    id: "w-62y",
    poster: "/stories/practicum/reel-62y.jpg",
    videoSrc: null,
    ageNote: "62 года",
    consent: true,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=shtjx0pph9Q",
  },
  {
    id: "w-1_9m",
    poster: "/stories/practicum/reel-1_9m.jpg",
    videoSrc: null,
    views: { value: "1,9 млн", verified: true },
    consent: false,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=rpQWe1Z3CQ4",
  },
  {
    id: "w-1_4m_b",
    poster: "/stories/practicum/reel-1_4m_b.jpg",
    videoSrc: null,
    views: { value: "1,4 млн", verified: true },
    consent: false,
    verified: true,
    thirdPartyWatermark: false,
    platformUrl: "https://www.youtube.com/watch?v=QoGgW3U7EQc",
  },
  ...Array.from({ length: 9 }, (_, i) => {
    const n = i + 1;
    const yt = [
      "RDLCMfuHW4U",
      "wC3Iwmk_MTg",
      "YJGNvYglvuE",
      "Uac29_nlknA",
      "0lHtMeAnbrg",
      "IGaH0pRQAcs",
      "DraOftA9sdY",
      "bGeHiczDroc",
      "G58GV--LEYU",
    ][i]!;
    return {
      id: `w-extra-${n}`,
      poster: `/stories/practicum/reel-extra-${n}.jpg`,
      videoSrc: null as string | null,
      consent: false,
      verified: true,
      thirdPartyWatermark: false,
      platformUrl: `https://www.youtube.com/watch?v=${yt}`,
    } satisfies Work;
  }),
];

export function getVisibleWorks(): Work[] {
  return (SHOW_PLACEHOLDERS ? works : works.filter((w) => w.verified)).filter((w) => {
    if (!w.poster || !w.verified) return false;
    if (w.thirdPartyWatermark && !w.watermarkPermission) return false;
    return true;
  });
}

/** Лента на главной: только интерактивные карточки, лимит */
export function getHomeWorks(): Work[] {
  const list = getVisibleWorks().filter((w) => {
    const ok = Boolean(w.videoSrc || w.platformUrl);
    if (!ok && process.env.NODE_ENV !== "production") {
      console.warn(`[works] ${w.id}: нет videoSrc и platformUrl — скрыта из ленты`);
    }
    return ok;
  });
  return list.slice(0, HOME_WORKS_LIMIT);
}
