import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const EXTS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

function withExt(base) {
  if (/\.[cm]?[jt]sx?$/.test(base) && existsSync(base)) return base;
  for (const e of EXTS) if (existsSync(base + e)) return base + e;
  return null;
}

/** Хуки для тестов данных: «server-only» → пустой модуль, алиас «@/» → src/, импорты без расширения → .ts/.tsx */
export async function resolve(specifier, context, next) {
  if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
  let base = null;
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2));
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    base = join(dirname(fileURLToPath(context.parentURL)), specifier);
  }
  const file = base && withExt(base);
  if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  return next(specifier, context);
}
