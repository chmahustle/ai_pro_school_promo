#!/usr/bin/env node
/**
 * Проверка собранного сайта (postbuild): служебные данные не должны уходить в браузер.
 * Сканирует .next после `next build`:
 *   • HTML и RSC-payload (.next/server/app/**: .html, .rsc) — запрещены JSON-ключи
 *     "priceStatus", "consent", "verified", "piiBlurred", "logoPermission" и фразы «с действующего сайта», «требует утверждения»;
 *   • клиентские JS-чанки (.next/static/**) — запрещены те же фразы и идентификаторы priceStatus, piiBlurred, logoPermission
 *     (их нет в коде интерфейса — значит, в чанк попали данные);
 *   • секреты: имя META_CAPI_TOKEN (серверный токен Meta Conversions API) не должно встречаться ни в HTML, ни в чанках;
 *     если токен задан в окружении сборки, ищем и его значение.
 *   • dev-пометки и TODO в HTML/RSC страниц («TODO», «ответ не подтверждён», «не подтверждено», PLACEHOLDER, UNVERIFIED и т.п.).
 * Нашли — сборка падает с указанием файла и контекста.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const NEXT = join(ROOT, ".next");

const KEYS = ["priceStatus", "consent", "verified", "piiBlurred", "logoPermission"];
const PHRASES = ["с действующего сайта", "требует утверждения", "META_CAPI_TOKEN"];
// Шаг 21: dev-пометки и служебные тексты — только в HTML/RSC страниц (в клиентских чанках библиотек возможны посторонние совпадения)
const PAGE_PHRASES = [
  "TODO",
  "ответ не подтверждён",
  "не подтверждено",
  "старая цена не подтверждена",
  "название на утверждении",
  "Блоки скрыты",
  "PLACEHOLDER",
  "UNVERIFIED",
];
const CHUNK_IDENTIFIERS = ["priceStatus", "piiBlurred", "logoPermission"];

function* walk(dir, exts) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p, exts);
    else if (exts.some((e) => p.endsWith(e))) yield p;
  }
}

if (!existsSync(NEXT)) {
  console.error("check-payload: папка .next не найдена — сначала `next build`.");
  process.exit(1);
}

const hits = [];
const ctx = (text, i, len) => text.slice(Math.max(0, i - 40), i + len + 40).replace(/\s+/g, " ");

// 1. HTML + RSC payload
for (const file of walk(join(NEXT, "server", "app"), [".html", ".rsc"])) {
  const text = readFileSync(file, "utf8");
  for (const key of KEYS) {
    // JSON-ключ: "key": или \"key\": (внутри строки RSC-payload); значения вроде name="consent" не считаются
    const re = new RegExp(`\\\\*"${key}\\\\*"\\s*:`, "g");
    const m = re.exec(text);
    if (m) hits.push({ file, what: `ключ "${key}"`, ctx: ctx(text, m.index, key.length + 4) });
  }
  for (const phrase of [...PHRASES, ...PAGE_PHRASES]) {
    const i = text.indexOf(phrase);
    if (i !== -1) hits.push({ file, what: `фраза «${phrase}»`, ctx: ctx(text, i, phrase.length) });
  }
}

// 2. Клиентские чанки
for (const file of walk(join(NEXT, "static"), [".js"])) {
  const text = readFileSync(file, "utf8");
  for (const phrase of PHRASES) {
    const i = text.indexOf(phrase);
    if (i !== -1) hits.push({ file, what: `фраза «${phrase}»`, ctx: ctx(text, i, phrase.length) });
  }
  for (const id of CHUNK_IDENTIFIERS) {
    const i = text.indexOf(id);
    if (i !== -1) hits.push({ file, what: `идентификатор ${id}`, ctx: ctx(text, i, id.length) });
  }
}

// 3. Значение серверного токена не должно оказаться ни в HTML/RSC, ни в клиентских файлах
const secret = process.env.META_CAPI_TOKEN;
if (secret && secret.length >= 8) {
  for (const file of [...walk(join(NEXT, "server", "app"), [".html", ".rsc"]), ...walk(join(NEXT, "static"), [".js", ".css", ".html"])]) {
    if (readFileSync(file, "utf8").includes(secret)) hits.push({ file, what: "значение META_CAPI_TOKEN", ctx: "(значение скрыто)" });
  }
}

if (hits.length > 0) {
  console.error(`\ncheck-payload: служебные данные попали в браузер (${hits.length}):\n`);
  for (const h of hits.slice(0, 40)) console.error(`  ${relative(ROOT, h.file)} — ${h.what}\n    …${h.ctx}…`);
  if (hits.length > 40) console.error(`  … и ещё ${hits.length - 40}`);
  console.error("\nПередавайте в клиентские компоненты только публичные модели из src/data/public.ts.\n");
  process.exit(1);
}
console.log("check-payload: ок (HTML, RSC и клиентские чанки без служебных данных)");
