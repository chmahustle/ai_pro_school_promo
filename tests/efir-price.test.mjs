import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Дата, с которой эфир платный, в тесте задаётся переменной (в products.ts реальной даты нет — школа не назвала).
// Переменные читаются при импорте products.ts и при каждом вызове currentDate().
const PAID_FROM = "2030-01-01";
process.env.APS_TEST_EFIR_PAID_FROM = PAID_FROM;
const BEFORE = "2029-12-31T12:00:00+05:00";
const AFTER = "2030-01-02T12:00:00+05:00";

let products, efir, audiences, courses;
before(async () => {
  process.env.APS_TEST_NOW = BEFORE;
  products = await import("../src/data/products.ts");
  efir = await import("../src/data/efir.ts");
  audiences = await import("../src/data/audiences.ts");
  courses = await import("../src/data/courses.ts");
});
const at = (when) => {
  process.env.APS_TEST_NOW = when;
};
// Неразрывные пробелы (U+00A0, U+202F) сравниваем как обычные
const norm = (s) => s.replace(/[\u00a0\u202f]/g, " ");
const EFIR_FREE = /бесплатн[а-яё]*[^.]{0,60}эфир|эфир[^.]{0,60}бесплатн/i;

test("efirPriceLabel: «бесплатно» до даты смены цены, «9 900 ₸» после", () => {
  at(BEFORE);
  assert.equal(products.efirIsFree(), true);
  assert.equal(products.efirPriceLabel(), "бесплатно");
  at(AFTER);
  assert.equal(products.efirIsFree(), false);
  assert.equal(norm(products.efirPriceLabel()), "9 900 ₸");
});

test("подзаголовок hero: «бесплатного» только пока цена 0", () => {
  at(BEFORE);
  const free = products.getEntrySubtitle();
  assert.match(free.before + free.price + free.after, /с бесплатного эфира$/);
  at(AFTER);
  const paid = products.getEntrySubtitle();
  assert.equal(norm(paid.before + paid.price + paid.after), "Без техобразования. Начать можно с 9 900 ₸ или с эфира");
});

test("подпись под кнопкой hero: «Эфир бесплатно» → «Эфир 9 900 ₸»", () => {
  const efirProduct = products.getProduct("efir");
  at(BEFORE);
  assert.equal(products.formatEntryLine(efirProduct), "Эфир бесплатно");
  at(AFTER);
  assert.equal(norm(products.formatEntryLine(efirProduct)), "Эфир 9 900 ₸");
});

test("тексты efir.ts, лендинги /for/* и курс вайб-кодинга: после смены цены нет «бесплатн» рядом с эфиром", () => {
  at(AFTER);
  const texts = [
    efir.efirTitle(),
    efir.efirLow(),
    efir.efirGenitive(),
    efir.efirCostValue(),
    efir.efirSignupCta(false),
    efir.efirRegisterTitle(),
    efir.efirNoHiddenConditions(),
    efir.efirFormatBadge(),
    JSON.stringify(audiences.audiences),
    JSON.stringify(courses.courses.find((c) => c.slug === "vibecoding")),
  ];
  for (const t of texts) assert.doesNotMatch(t, EFIR_FREE, t.slice(0, 80));
  // и обратная проверка: до смены цены слово на месте
  at(BEFORE);
  assert.match(efir.efirSignupCta(false), /бесплатно$/);
  assert.match(JSON.stringify(audiences.audiences), /Бесплатный эфир/);
});

test("исходники: слова «бесплатн» про эфир не написаны руками вне products.ts и efir.ts", () => {
  const ALLOWED = new Set(["src/data/products.ts", "src/data/efir.ts"]);
  const offenders = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(p)) check(p);
    }
  };
  const check = (p) => {
    const rel = relative(process.cwd(), p);
    if (ALLOWED.has(rel)) return;
    let inBlock = false;
    for (const [i, raw] of readFileSync(p, "utf8").split("\n").entries()) {
      let line = raw;
      if (inBlock) {
        const end = line.indexOf("*/");
        if (end < 0) continue;
        line = line.slice(end + 2);
        inBlock = false;
      }
      line = line.replace(/\/\*.*?\*\//g, "");
      if (line.includes("/*")) {
        line = line.slice(0, line.indexOf("/*"));
        inBlock = true;
      }
      line = line.replace(/\/\/.*$/, "");
      for (const m of line.matchAll(/бесплатн[а-яё]*/gi)) {
        if (/^бесплатн[а-яё]*\s+(нейросет|верси|тариф|сервис|инструмент)/i.test(line.slice(m.index))) continue;
        if (/^бесплатн[а-яё]*\s+(использовать топовые|т)/i.test(line.slice(m.index))) continue;
        const win = line.slice(Math.max(0, m.index - 60), m.index + 60);
        // PricingClient: «Бесплатно» при price === 0 у тарифа — из данных; остальное про эфир запрещено
        if (/эфир/i.test(win) || rel.endsWith("PricingClient.tsx")) offenders.push(`${rel}:${i + 1}`);
      }
    }
  };
  walk(join(process.cwd(), "src"));
  assert.deepEqual(offenders.filter((o) => !o.includes("PricingClient.tsx")), []);
});
