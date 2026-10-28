/**
 * YouTube без запросов до клика: в данных и в публичных моделях хранится только id ролика (никаких ссылок youtube.com
 * в HTML/RSC), адрес плеера собирается в браузере в момент клика. Домен youtube-nocookie.com, без трекинг-параметров (si и т.п.).
 */
const ID_RE = /(?:youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/|youtube\.com\/watch\?(?:[^#]*&)?v=|youtu\.be\/)([\w-]{11})/;

/** id ролика из ссылки (embed / watch / shorts / youtu.be); параметры si, t и прочий трекинг отбрасываются */
export function youtubeIdFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return ID_RE.exec(url)?.[1] ?? null;
}

/** Адрес плеера: вызывать только в браузере по клику */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&hl=ru`;
}
