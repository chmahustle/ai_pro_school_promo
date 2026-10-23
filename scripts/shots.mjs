#!/usr/bin/env node
/**
 * Скриншоты страниц на 375 и 1440 px (Playwright). Только читает сайт по URL, ничего в проекте не меняет.
 *
 *   node scripts/shots.mjs [--base http://localhost:3111] [--out tmp/shots] [--widths 375,1440] [--no-extra] /path ...
 *
 * Для каждой страницы и ширины: <имя>-<ширина>-top.png и (если не --no-extra) -form.png (последняя форма по центру экрана)
 * и -bottom.png (низ страницы: футер, плавающие кнопки). Папка tmp/shots в .gitignore.
 * Первый запуск и подробности — в CLAUDE.md («Скриншоты»): scripts/shots-setup.sh, scripts/shots-serve.sh.
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
const noExtra = args.includes("--no-extra") && !!args.splice(args.indexOf("--no-extra"), 1);
const base = opt("base", "http://localhost:3111");
const out = resolve(opt("out", "tmp/shots"));
const widths = opt("widths", "375,1440").split(",").map(Number);
const paths = args.length ? args : ["/"];

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
    // плавная прокрутка сбивает кадры — отключаем
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.waitForTimeout(1500);
    const name = `${slug(path)}-${w}`;
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
