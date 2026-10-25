import "server-only";
import type { TeamMember } from "./types";

/**
 * Команда. Источник: business/freelance/career.ai-pro-school.kz, ai2026, prakticum.
 * Фото — placeholder (null) до получения от клиента.
 */
export const team: TeamMember[] = [
  {
    id: "nadira",
    name: "Надира Батырбаева",
    role: "Основатель AI Pro School",
    bio: "AI-эксперт, тренер и предприниматель. Больше двух лет в ИИ, 10+ лет в бизнесе и обучении. Учит только тому, что использует в реальных проектах.",
    facts: [
      "10+ лет в бизнесе и обучении",
      "Выпускница Ai'Preneurs",
      "Спикер крупнейших IT-мероприятий Казахстана",
      "Спикер Astana Hub, тренер проекта IT Ayel",
      "Сооснователь платформы Strimmeo.com",
      "Многодетная мама, предприниматель, лектор",
    ],
    photo: "/photo/nadira-studio.png",
    socials: {
      instagram: "https://www.instagram.com/nadira_batyrbaeva/",
      tiktok: "https://www.tiktok.com/@nadira_batyrbaeva",
      youtube: "https://youtube.com/@nadira_batyrbayeva",
    },
    status: "verified",
    note: "Текст — из действующих лендингов. Фото — студийное, public/photo/nadira-studio.png.",
  },
  {
    id: "maidan",
    name: "Майдан Найманов",
    role: "ML-инженер, AI-архитектор",
    bio: "Показывает, как идеи превращаются в AI-сервисы, Telegram-ботов и автоматизации. 7+ лет в IT, 100+ коммерческих проектов.",
    facts: [
      "Основатель maydi Studio · резидент Astana Hub",
      "MixSheeps: MVP за 1 день · оценка $370 000",
      "Победитель Kcell Summit · 1 000 000 ₸",
      "Проекты 2026: Helixa, Mimora, Origanima, Vivida",
      "Акселерации: IRA MostVC и Terricon Valley",
    ],
    photo: "/photo/maidan.jpg",
    status: "verified",
    note: "Текст — из лендингов вайб-кодинга. Фото — public/photo/maidan.jpg.",
  },
  {
    id: "alena",
    name: "Алёна Заярных",
    role: "Куратор",
    bio: "Выпускница школы. Прошла путь от первых ИИ-роликов до куратора: 500+ AI-видео, миллионные просмотры.",
    facts: ["500+ AI-видео", "Договор на 15 роликов на 500 000 ₸", "Куратор AI Pro School"],
    photo: null,
    status: "verified",
    note: "Упоминается как куратор в кейсах на лендингах. Роль/био — TODO уточнить.",
  },
];

/** Спикеры эфиров по вайб-кодингу (для ЦА-лендингов) */
export const webinarSpeakers = team.filter((m) => m.id === "nadira" || m.id === "maidan");
