#!/usr/bin/env node
/**
 * Проверка текстов перед сборкой (prebuild): сборка падает, если в src/ вне dev-блоков встречаются запрещённые фразы.
 *
 * Что считается «вне dev-блоков» — нарушением:
 *   • код и разметка (строки, JSX-текст), а не комментарии: пометки TODO(клиент) в комментариях разрешены правилами проекта;
 *   • строка не содержит SHOW_PLACEHOLDERS (условие «только в dev» на той же строке);
 *   • строка не внутри блока  // dev-only:start … // dev-only:end  (или /* dev-only:start *​/ … /* dev-only:end *​/);
 *   • в строке нет маркера  copy-check:ignore.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SRC = join(ROOT, "src");

const FORBIDDEN = ["Цена уточняется", "TODO(клиент)", "Старт 20 апреля", "20 апреля"];

/**
 * Шаг 6: обещания и неутверждённые формулировки (нельзя нигде вне dev-блоков).
 * «пассивный доход» разрешён только в отрицании: «Это не пассивный доход», «ищете пассивный доход» (список «не подойдёт»),
 * «Это пассивный доход?» (вопрос FAQ с ответом «Нет»), «не обещаем пассивный доход».
 */
const FORBIDDEN_PHRASES = [
  "400 000 ₸ за 2 недели",
  "рост чека",
  "Рост чека",
  "×2–3",
  "в 2–3 раза",
  "Всему научилась",
  "в разы",
  "вместо 2 недель",
  "за 1 вечер",
  "Освоить профессию за месяц",
  "освоить профессию за месяц",
  "гарантированно",
  // старые написания (словарь: «вайб-кодинг», «Курс AI Content Creator», Эфир «Вайб-кодинг вживую»)
  "вайбкодинг",
  "Вайбкодинг",
  "Vibe Coding",
  "Vibe-coding",
  "Бесплатный вебинар",
  "AI Content Creator (курс)",
];
const FORBIDDEN_RE = [
  // Шаг 8.4: обещание «поднять/повысить чек» (во всех файлах src/, включая данные и страницы)
  { re: /[Пп](однять|овысить)\s+(средний\s+)?чек/, name: "поднять/повысить чек" },
  { re: /(?<![А-Яа-яЁё-])ИИ-креатор(?![а-яё])/, name: "ИИ-креатор (курс называется «Курс AI Content Creator»)" },
  {
    re: /пассивн(ый|ого|ым) доход/,
    name: "пассивный доход",
    allow: /не пассивн|ищете пассивн|Это пассивный доход\?|не обещаем пассивн/,
  },
];
// Файлы меню (шаг 8): шапка, мобильное меню, футер, словари, данные меню — без «Бесплатный эфир», «гайд в подарок», «чек в 2–3 раза»
const MENU_FILES = /^src\/(components\/layout\/(Header|MegaMenu|MobileMenu|Footer|nav)\.tsx?|data\/navMenu\.ts|i18n\/dictionaries\/.*)$/;
const MENU_FORBIDDEN = ["Бесплатный эфир", "бесплатный эфир", "гайд в подарок", "Гайд в подарок", "чек в 2–3 раза"];
// Файлы, где старые написания перечислены намеренно (справочник словаря)
const SKIP_FILES = new Set(["src/data/vocabulary.ts"]);
const EXT = new Set([".ts", ".tsx", ".mjs", ".js", ".jsx"]);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (EXT.has(extname(p))) yield p;
  }
}

/** Убирает комментарии из строки; inBlock — состояние многострочного /* … *​/ между строками */
function stripComments(line, state) {
  let out = "";
  let i = 0;
  while (i < line.length) {
    if (state.inBlock) {
      const end = line.indexOf("*/", i);
      if (end === -1) return out;
      state.inBlock = false;
      i = end + 2;
      continue;
    }
    if (line.startsWith("/*", i)) {
      state.inBlock = true;
      i += 2;
      continue;
    }
    // «//» — комментарий, если это не часть URL (https://) и не внутри пути в кавычках сразу после «:»
    if (line.startsWith("//", i) && line[i - 1] !== ":") break;
    out += line[i];
    i++;
  }
  return out;
}

const violations = [];

for (const file of walk(SRC)) {
  const lines = readFileSync(file, "utf8").split("\n");
  const state = { inBlock: false };
  let dev = false;
  lines.forEach((raw, idx) => {
    // маркеры dev-блока (ищем в сыром тексте, они живут в комментариях)
    if (raw.includes("dev-only:start")) dev = true;
    if (raw.includes("dev-only:end")) {
      dev = false;
      return;
    }
    const code = stripComments(raw, state);
    if (dev || raw.includes("copy-check:ignore") || raw.includes("SHOW_PLACEHOLDERS")) return;
    for (const phrase of [...FORBIDDEN, ...(SKIP_FILES.has(relative(ROOT, file)) ? [] : FORBIDDEN_PHRASES)]) {
      if (code.includes(phrase)) violations.push({ file: relative(ROOT, file), line: idx + 1, phrase, text: raw.trim().slice(0, 140) });
    }
    if (MENU_FILES.test(relative(ROOT, file))) {
      for (const phrase of MENU_FORBIDDEN) {
        if (code.includes(phrase)) violations.push({ file: relative(ROOT, file), line: idx + 1, phrase: `${phrase} (меню)`, text: raw.trim().slice(0, 140) });
      }
    }
    if (!SKIP_FILES.has(relative(ROOT, file))) {
      for (const r of FORBIDDEN_RE) {
        if (r.re.test(code) && !(r.allow && r.allow.test(code))) violations.push({ file: relative(ROOT, file), line: idx + 1, phrase: r.name, text: raw.trim().slice(0, 140) });
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`\ncheck-copy: найдено ${violations.length} запрещённых фраз вне dev-блоков:\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  «${v.phrase}»\n    ${v.text}`);
  console.error("\nУберите фразу, возьмите значение из src/data/products.ts или оберните в dev-блок (SHOW_PLACEHOLDERS / dev-only:start…end).\n");
  process.exit(1);
}
console.log("check-copy: ок");
