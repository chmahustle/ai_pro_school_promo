/**
 * Юридические документы школы. Тексты живут в Google Docs (опубликованы в вебе), школа редактирует их сама;
 * на сайт ничего не копируем, только ссылаемся. Файл без server-only: ссылки публичные, нужны и клиентским формам.
 * sitePath - короткий адрес на нашем домене (на него ссылается п. 13.2 оферты), он редиректит на docHref (next.config.ts).
 */
export const legalDocs = {
  privacy: {
    title: "Политика конфиденциальности",
    sitePath: "/privacy",
    docHref: "https://docs.google.com/document/d/e/2PACX-1vRZ2tCJW28hK-WBpIg4iIXApjs9ktmfO0ed_CjS1sdcpN9fXZK3r91I7K_xcXVbwg/pub",
  },
  offer: {
    title: "Договор публичной оферты",
    sitePath: "/public",
    docHref: "https://docs.google.com/document/d/e/2PACX-1vQdFNTumbVQzYEGBHW9Qy98PEw7IdqxT2bqdGsqotEREfZxVHBeT97Nv-6GQ0NP-A/pub",
  },
} as const;

export type LegalDocKey = keyof typeof legalDocs;
