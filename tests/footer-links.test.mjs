import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getFooterData } from "../src/data/public.ts";
import { catalogUrl, directionPages, getProduct, products } from "../src/data/products.ts";
import { company } from "../src/data/company.ts";

import { readdirSync } from "node:fs";

/** Страница есть: точный каталог или динамический сегмент ([audience], [slug]) на месте последнего сегмента */
const pageExists = (url) => {
  const segs = url.split("#")[0].split("/").filter(Boolean);
  if (segs.length === 0) return true;
  return ["(site)", "(landing)"].some((g) => {
    const dir = join("src/app", g, ...segs.slice(0, -1));
    if (existsSync(join(dir, segs.at(-1), "page.tsx"))) return true;
    return existsSync(dir) && readdirSync(dir).some((n) => /^\[.+\]$/.test(n) && existsSync(join(dir, n, "page.tsx")));
  });
};

test("футер: колонки направлений — заголовок и ссылки равны URL из products.ts", () => {
  const f = getFooterData();
  assert.deepEqual(f.directions.map((d) => d.id), ["creator", "vibecoding"]);
  for (const d of f.directions) {
    assert.equal(d.href, directionPages[d.id], `${d.id}: заголовок колонки`);
    const expected = products.filter((p) => p.direction === d.id).map((p) => p.landingUrl);
    assert.deepEqual(d.links.map((l) => l.href).sort(), expected.sort(), `${d.id}: ссылки колонки`);
  }
});

test("футер: «Новичкам в ИИ» → /courses/practicum, «Все курсы» → каталог", () => {
  const f = getFooterData();
  const beginners = f.audiences.find((a) => a.label === "Новичкам в ИИ");
  assert.equal(beginners?.href, "/courses/practicum");
  assert.equal(beginners?.href, getProduct("practicum").landingUrl);
  assert.equal(f.school.find((l) => l.label === "Все курсы")?.href, catalogUrl);
});

test("футер: все внутренние ссылки ведут на существующие страницы", () => {
  const f = getFooterData();
  const urls = [
    ...f.directions.flatMap((d) => [d.href, ...d.links.map((l) => l.href)]),
    ...f.audiences.map((a) => a.href),
    ...f.school.map((l) => l.href),
    ...f.legalLinks.map((l) => l.href),
  ].filter((u) => u.startsWith("/"));
  for (const u of urls) assert.ok(pageExists(u), `нет страницы для ${u}`);
});

test("футер: соцсети и телефон из company.ts, пустой URL — без иконки; нет «#» и пустых href", () => {
  const f = getFooterData();
  assert.equal(f.contacts.phone?.href, `tel:+${company.contacts.phoneRaw}`);
  assert.equal(f.contacts.whatsapp, company.contacts.whatsapp);
  for (const s of f.contacts.socials) assert.equal(s.href, company.contacts.social[s.id]);
  const all = [f.contacts.whatsapp, f.contacts.phone?.href, ...f.contacts.socials.map((s) => s.href), ...f.legalLinks.map((l) => l.href)].filter(Boolean);
  for (const h of all) assert.ok(h && h !== "#" && !h.startsWith("#"), `плохой href: ${h}`);
});

test("футер: политика и оферта — только утверждённые и на домене сайта; юр. строка — только подтверждённые реквизиты", () => {
  const f = getFooterData();
  if (!company.privacyApproved) assert.ok(!f.legalLinks.some((l) => l.href === "/privacy"));
  if (!company.offerApproved) assert.ok(!f.legalLinks.some((l) => l.label.includes("оферта")));
  for (const l of f.legalLinks) assert.ok(l.href.startsWith("/"), `ссылка не на домене сайта: ${l.href}`);
  const legalOk = company.legal.verified && company.legal.name.trim() && company.legal.bin.trim();
  if (!legalOk) {
    assert.match(f.copyright, /^© \d{4} AI Pro School$/);
    assert.deepEqual(f.requisites, []);
  }
});
