import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getNavMenu } from "../src/data/navMenu.ts";
import { catalogUrl, directionPages, getEntryProducts, getProduct, products } from "../src/data/products.ts";

const pageExists = (url) => {
  const path = url.split("#")[0].replace(/^\//, "");
  return ["(site)", "(landing)"].some((g) => existsSync(join("src/app", g, path, "page.tsx")));
};

test("меню: кнопка тёмной карточки ведёт на URL входного продукта из products.ts", () => {
  const menu = getNavMenu();
  for (const card of menu.cards) {
    const entry = getEntryProducts().find((p) => p.direction === card.direction);
    assert.ok(entry, `у направления ${card.direction} нет входного продукта`);
    assert.equal(card.entry.href, entry.landingUrl, `${entry.id}: href кнопки меню расходится с landingUrl`);
    assert.equal(card.entry.ctaLabel, entry.ctaLabel, `${entry.id}: подпись кнопки расходится с ctaLabel`);
  }
});

test("меню: «Записаться на практикум» → /courses/practicum", () => {
  const card = getNavMenu().cards.find((c) => c.direction === "creator");
  assert.equal(card.entry.ctaLabel, "Записаться на практикум");
  assert.equal(card.entry.href, "/courses/practicum");
});

test("меню: строки направлений и «Все курсы» берут адреса из products.ts", () => {
  const menu = getNavMenu();
  for (const card of menu.cards) assert.equal(card.href, directionPages[card.direction]);
  assert.equal(menu.allCoursesHref, catalogUrl);
});

test("каждый URL продукта и меню указывает на существующую страницу", () => {
  const menu = getNavMenu();
  const urls = [...products.map((p) => p.landingUrl), ...menu.cards.flatMap((c) => [c.href, c.entry.href]), menu.allCoursesHref];
  for (const url of urls) assert.ok(pageExists(url), `нет страницы для ${url}`);
});

test("эфир: URL — нейтральная страница /courses/vibecoding-efir; меню и лестница ведут на неё", async () => {
  const { getPublicLadder } = await import("../src/data/public.ts");
  assert.equal(getProduct("efir").landingUrl, "/courses/vibecoding-efir");
  const card = getNavMenu().cards.find((c) => c.direction === "vibecoding");
  assert.equal(card.entry.href, "/courses/vibecoding-efir");
  const step = getPublicLadder("vibecoding").steps.find((s) => s.id === "efir");
  assert.equal(step.href, "/courses/vibecoding-efir");
  assert.ok(pageExists("/courses/vibecoding-efir"), "нет страницы эфира");
});
