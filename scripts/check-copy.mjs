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

const FORBIDDEN = ["Цена уточняется", "TODO(клиент)", "Старт 20 апреля"];
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
    for (const phrase of FORBIDDEN) {
      if (code.includes(phrase)) violations.push({ file: relative(ROOT, file), line: idx + 1, phrase, text: raw.trim().slice(0, 140) });
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
