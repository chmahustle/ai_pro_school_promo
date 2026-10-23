#!/usr/bin/env node
/**
 * Проверка окружения перед production-сборкой (prebuild): сборка падает, если выставлен
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS=true — переменная, из-за которой в проде оказывались заглушки.
 * Смотрим process.env и файлы .env, .env.local, .env.production, .env.production.local (но не .env.example).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const NAME = "NEXT_PUBLIC_SHOW_PLACEHOLDERS";
const hits = [];

if (String(process.env[NAME]).toLowerCase() === "true") hits.push("переменная окружения процесса");

for (const f of [".env", ".env.local", ".env.production", ".env.production.local"]) {
  const p = join(ROOT, f);
  if (!existsSync(p)) continue;
  for (const [i, line] of readFileSync(p, "utf8").split("\n").entries()) {
    if (/^\s*#/.test(line)) continue;
    const m = line.match(new RegExp(`^\\s*${NAME}\\s*=\\s*["']?(\\w+)`));
    if (m && m[1].toLowerCase() === "true") hits.push(`${f}:${i + 1}`);
  }
}

if (hits.length > 0) {
  console.error(`\ncheck-env: ${NAME}=true запрещён в production-сборке (${hits.join(", ")}).\nУдалите переменную: заглушки показываются только в dev.\n`);
  process.exit(1);
}
console.log("check-env: ок");
