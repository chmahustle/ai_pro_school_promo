import "server-only";

/**
 * Единый источник строк «Ведёт …» для страниц эфира, офлайн-урока и курса вайб-кодинга.
 * Биографии и достижения сюда не добавляем: нужны отдельные подтверждения (см. courseContent.ts → courseUnverified).
 */
export interface Speaker {
  /** Совпадает с id в team.ts (фото берём оттуда) */
  id: "maidan" | "nadira";
  name: string;
  role: string;
  verified: boolean;
  source: string;
  asOf: string;
}

const SOURCE = "программа курса и приветствие студентам";
const AS_OF = "2026-10";

export const speakers: Speaker[] = [
  { id: "maidan", name: "Майдан Найманов", role: "Инженер-разработчик и ML-инженер, 7+ лет практики", verified: true, source: SOURCE, asOf: AS_OF },
  { id: "nadira", name: "Надира Батырбаева", role: "Основатель AI Pro School", verified: true, source: SOURCE, asOf: AS_OF },
];

/** Строка роли: только подтверждённая, иначе null */
export function getSpeakerRole(id: Speaker["id"]): string | null {
  const s = speakers.find((x) => x.id === id);
  return s?.verified ? s.role : null;
}
