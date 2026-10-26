#!/usr/bin/env node
/**
 * Проверка «бесплатно» перед сменой цены эфира: `node scripts/check-copy.mjs --at 2026-12-01`
 * (или `npm run check:efir -- 2026-12-01`).
 *
 * Собирает копию проекта в /tmp с подменой даты (APS_TEST_NOW) — эфир платный (9 900 ₸, products.ts),
 * затем читает собранный HTML (страницы, metadata, og:description, JSON-LD) и падает, если рядом с «эфир» осталось «бесплатн…».
 * Страховка от «бесплатно» про эфир в любых текстах; боевая сборка с APS_TEST_* запрещена check-env.
 * «бесплатные нейросети / версии / тарифы» — не про эфир, такие места пропускаются.
 */
import { spawnSync } from "node:child_process";
import { cpSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("Использование: node scripts/check-copy.mjs --at YYYY-MM-DD (дата после смены цены эфира)");
  process.exit(2);
}
const COPY = "/tmp/aps-efir-at";
rmSync(COPY, { recursive: true, force: true });
mkdirSync(COPY, { recursive: true });
const skip = new Set(["node_modules", ".next", ".git", "tmp"]);
for (const name of readdirSync(ROOT)) {
  if (skip.has(name)) continue;
  cpSync(join(ROOT, name), join(COPY, name), { recursive: true });
}
symlinkSync(join(ROOT, "node_modules"), join(COPY, "node_modules"));

console.log(`check-efir-at: сборка с датой ${date} (эфир платный с этого дня)…`);
const build = spawnSync(process.execPath, [join(COPY, "node_modules/next/dist/bin/next"), "build"], {
  cwd: COPY,
  env: { ...process.env, APS_TEST_NOW: `${date}T12:00:00+05:00`, NODE_ENV: "production" },
  encoding: "utf8",
});
if (build.status !== 0) {
  console.error((build.stdout ?? "").slice(-3000), (build.stderr ?? "").slice(-3000));
  process.exit(1);
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith(".html")) yield p;
  }
}

const NOT_EFIR = /^бесплатн[а-яё]*\s+(нейросет|верси|тариф|сервис|инструмент)/i;
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/ /g, " ");

const appDir = join(COPY, ".next/server/app");
const findings = [];
let pages = 0;
let sawPaidLabel = false;
for (const file of htmlFiles(appDir)) {
  const raw = readFileSync(file, "utf8");
  pages++;
  // Видимый текст + значения meta (title, description, og:*) + JSON-LD; RSC-скрипты не берём (дублируют видимый текст)
  const metas = [...raw.matchAll(/<meta[^>]+content="([^"]*)"/g)].map((m) => m[1]).join(" ");
  const ld = [...raw.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => m[1]).join(" ");
  const body = raw.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  const text = decode(`${body} ${metas} ${ld}`).replace(/\s+/g, " ");
  if (/9 900 ₸/.test(text)) sawPaidLabel = true;
  for (const m of text.matchAll(/бесплатн[а-яё]*/gi)) {
    const tail = text.slice(m.index, m.index + 40);
    if (NOT_EFIR.test(tail)) continue;
    const win = text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60);
    if (/эфир/i.test(win)) findings.push({ page: file.replace(appDir, "").replace(/\.html$/, "") || "/", ctx: win });
  }
}
rmSync(COPY, { recursive: true, force: true });

console.log(`check-efir-at: проверено страниц: ${pages}`);
if (findings.length > 0) {
  console.error(`\ncheck-efir-at: после смены цены (${date}) «бесплатн…» рядом с эфиром — ${findings.length} мест:\n`);
  for (const f of findings) console.error(`  ${f.page}\n    …${f.ctx}…`);
  process.exit(1);
}
if (!sawPaidLabel) console.warn("check-efir-at: предупреждение — «9 900 ₸» нигде не найдено, проверьте, что дата подмены применилась");
console.log("check-efir-at: ок — после смены цены «бесплатно» рядом с эфиром нет");
