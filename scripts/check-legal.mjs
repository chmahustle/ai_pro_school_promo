#!/usr/bin/env node
/**
 * Проверка юридических данных (prebuild и, с --built, postbuild).
 *   • src/data/company.ts: БИН - 12 цифр и контрольная сумма (алгоритм БИН/ИИН РК), наименование ТОО, адрес, сайт заполнены;
 *   • src/data/legalDocs.ts: обе docHref вида https://docs.google.com/document/d/e/<id>/pub (не /edit); sitePath /privacy и /public;
 *   • --built: в каждом собранном HTML-маршруте (.next/server/app/**.html) есть обе ссылки на документы, название ТОО и БИН.
 * Нашли проблему - exit 1.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const built = process.argv.includes("--built");
const errors = [];

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const field = (text, name) => text.match(new RegExp(`^\\s*${name}\\s*:\\s*"([^"]*)"`, "m"))?.[1] ?? "";

/** Контрольная цифра БИН/ИИН: веса 1..11, при остатке 10 - веса 3..11,1,2; снова 10 - номер недопустим */
function binChecksumOk(bin) {
  if (!/^\d{12}$/.test(bin)) return false;
  const d = [...bin].map(Number);
  let sum = d.slice(0, 11).reduce((a, x, i) => a + x * (i + 1), 0) % 11;
  if (sum === 10) {
    // веса второго прохода: 3,4,...,11,1,2
    sum = d.slice(0, 11).reduce((a, x, i) => a + x * (i < 9 ? i + 3 : i - 8), 0) % 11;
  }
  return sum !== 10 && sum === d[11];
}

const company = read("src/data/company.ts");
const bin = field(company, "bin");
const legalName = field(company, "legalName");
if (!binChecksumOk(bin)) errors.push(`company.ts: БИН «${bin}» не проходит проверку (12 цифр + контрольная сумма)`);
if (!/^ТОО\s/.test(legalName)) errors.push(`company.ts: legalName должен начинаться с «ТОО», сейчас «${legalName}»`);
for (const f of ["address", "website"]) if (!field(company, f).trim()) errors.push(`company.ts: пустое поле ${f}`);

const docsSrc = read("src/data/legalDocs.ts");
const PUB = /^https:\/\/docs\.google\.com\/document\/d\/e\/[\w-]+\/pub$/;
const docHrefs = [...docsSrc.matchAll(/docHref:\s*"([^"]*)"/g)].map((m) => m[1]);
if (docHrefs.length !== 2) errors.push(`legalDocs.ts: ожидалось 2 docHref, найдено ${docHrefs.length}`);
for (const h of docHrefs) if (!PUB.test(h)) errors.push(`legalDocs.ts: docHref не похож на https://docs.google.com/document/d/e/<id>/pub: ${h}`);
const sitePaths = [...docsSrc.matchAll(/sitePath:\s*"([^"]*)"/g)].map((m) => m[1]);
if (sitePaths.join() !== "/privacy,/public") errors.push(`legalDocs.ts: sitePath должны быть /privacy и /public, найдено: ${sitePaths.join(", ")}`);

const routes = [];
if (built) {
  const root = join(ROOT, ".next", "server", "app");
  if (!existsSync(root)) {
    console.error("check-legal --built: .next/server/app не найден - сначала `next build`.");
    process.exit(1);
  }
  const walk = function* (dir) {
    for (const n of readdirSync(dir)) {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) yield* walk(p);
      else if (p.endsWith(".html")) yield p;
    }
  };
  for (const file of walk(root)) {
    const html = readFileSync(file, "utf8");
    const route = "/" + relative(root, file).replace(/\.html$/, "").replace(/(^|\/)index$/, "");
    routes.push(route);
    for (const h of docHrefs) if (!html.includes(h)) errors.push(`${route}: в футере нет ссылки ${h}`);
    if (!html.includes(bin)) errors.push(`${route}: в футере нет БИН`);
    if (!html.includes(legalName)) errors.push(`${route}: в футере нет «${legalName}»`);
  }
  if (routes.length === 0) errors.push("в .next/server/app нет ни одной HTML-страницы");
}

if (errors.length) {
  console.error(`\ncheck-legal: проблемы (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`check-legal: ок (БИН, ссылки /pub${built ? `; футер на ${routes.length} маршрутах: ${routes.sort().join(", ")}` : ""})`);
