#!/usr/bin/env node
/**
 * Скриншоты страниц на 375 и 1440 px (Playwright). Только читает сайт по URL, ничего в проекте не меняет.
 *
 *   node scripts/shots.mjs [--base http://localhost:3111] [--out tmp/shots] [--widths 375,1440] [--no-extra] /path ...
 *   node scripts/shots.mjs --prod [/path ...]
 *
 * Режим --prod: сам собирает production-копию (scripts/shots-serve.sh) на свободном порту, снимает главную (отдельно блок
 * «Результаты»), /reviews и страницу эфира в 1440 и 375 px в tmp/shots/prod, проверяет, что на страницах нет dev-плашек
 * и скрытых карточек (UNVERIFIED, PLACEHOLDER, «не подтверждено»…), и останавливает сервер.
 * Dev-сервер на общем .next при сборке лучше закрыть.
 *
 * Для каждой страницы и ширины: <имя>-<ширина>-top.png и (если не --no-extra) -form.png (последняя форма по центру экрана)
 * и -bottom.png (низ страницы: футер, плавающие кнопки). Папка tmp/shots в .gitignore.
 * Первый запуск: scripts/shots-setup.sh; копия сайта на отдельном порту: scripts/shots-serve.sh.
 * Не снимайте с dev-сервера, который работает на общем .next: используйте scripts/shots-serve.sh (отдельная копия, свой порт).
 */
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : def;
};
const prod = args.includes("--prod") && !!args.splice(args.indexOf("--prod"), 1);
const noExtra = args.includes("--no-extra") && !!args.splice(args.indexOf("--no-extra"), 1);
let base = opt("base", "http://localhost:3111");
const out = resolve(opt("out", prod ? "tmp/shots/prod" : "tmp/shots"));
const widths = opt("widths", prod ? "1440,375" : "375,1440").split(",").map(Number);
const paths = args.length ? args : prod ? ["/", "/reviews", "/courses/vibecoding-efir"] : ["/"];

/** Что не должно попасть на prod-страницы: dev-плашки и скрытые карточки */
const PROD_FORBIDDEN = ["UNVERIFIED", "PLACEHOLDER", "не подтверждено", "не подтверждены", "уточнить у школы", "метрика не число", "Клиенты-компании"];

let serverStarted = false;
if (prod) {
  const { spawnSync } = await import("node:child_process");
  const { createServer } = await import("node:net");
  const port = await new Promise((res) => {
    const srv = createServer();
    srv.listen(0, () => {
      const p = srv.address().port;
      srv.close(() => res(p));
    });
  });
  const root = resolve(new URL(".", import.meta.url).pathname, "..");
  const r = spawnSync("bash", [join(root, "scripts/shots-serve.sh"), String(port)], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  serverStarted = true;
  base = `http://localhost:${port}`;
}
const stopServer = async () => {
  if (!serverStarted) return;
  const { readFileSync } = await import("node:fs");
  try {
    process.kill(Number(readFileSync("/tmp/aps-shots.pid", "utf8").trim()));
  } catch {}
};
let prodProblems = 0;

const PW_DIR = process.env.PW_DIR ?? join(homedir(), ".cache", "ai-pro-school-shots");
const require = createRequire(import.meta.url);
let playwright;
for (const id of ["playwright", join(PW_DIR, "node_modules", "playwright")]) {
  try {
    playwright = require(id);
    break;
  } catch {}
}
if (!playwright) {
  console.error(`Playwright не найден. Выполните: bash scripts/shots-setup.sh (ставит в ${PW_DIR})`);
  process.exit(1);
}

// Системные библиотеки без sudo (scripts/shots-setup.sh кладёт их в $PW_DIR/libs)
const libs = [join(PW_DIR, "libs/usr/lib/x86_64-linux-gnu"), join(PW_DIR, "libs/usr/lib")].filter(existsSync).join(":");
const env = { ...process.env, ...(libs ? { LD_LIBRARY_PATH: [libs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":") } : {}) };

// Браузер: версия из кэша Playwright (может отличаться от версии пакета)
const cache = join(homedir(), ".cache", "ms-playwright");
const chromium = existsSync(cache) ? readdirSync(cache).filter((d) => d.startsWith("chromium-")).sort().at(-1) : undefined;
const executablePath = chromium ? join(cache, chromium, "chrome-linux", "chrome") : undefined;

mkdirSync(out, { recursive: true });
const browser = await playwright.chromium.launch({ env, ...(executablePath && existsSync(executablePath) ? { executablePath } : {}) });
const slug = (p) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/[^\w-]+/g, "-"));

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
    // плавная прокрутка сбивает кадры - отключаем
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.waitForTimeout(1500);
    const name = `${slug(path)}-${w}`;
    if (prod) {
      const html = await page.content();
      const found = PROD_FORBIDDEN.filter((f) => html.includes(f));
      if (found.length) {
        prodProblems += found.length;
        console.error(`✗ ${path} @${w}: в prod-странице найдено: ${found.join(", ")}`);
      }
      // Блок результатов на главной - отдельным снимком
      const block = page.locator("#results");
      if (path === "/" && (await block.count())) {
        await block.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        await block.screenshot({ path: join(out, `home-results-${w}.png`) });
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await page.screenshot({ path: join(out, `${name}-top.png`) });
    if (!noExtra) {
      const form = page.locator("form").last();
      if (await form.count()) {
        await form.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
        await page.waitForTimeout(1200);
        await page.screenshot({ path: join(out, `${name}-form.png`) });
      }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(1500);
      await page.screenshot({ path: join(out, `${name}-bottom.png`) });
    }
    console.log(`${path} @${w}: горизонтальный скролл ${overflow}px → ${out}/${name}-*.png`);
  }
  await ctx.close();
}
await browser.close();
await stopServer();
if (prod) {
  console.log(prodProblems ? `✗ prod-проверка: ${prodProblems} нарушений` : "✓ prod-проверка: dev-плашек и скрытых карточек на страницах нет");
  if (prodProblems) process.exit(1);
}
