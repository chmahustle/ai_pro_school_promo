#!/usr/bin/env node
/**
 * Предупреждение перед production-сборкой (prebuild): политика конфиденциальности не утверждена юристом школы.
 * Не валит сборку — только печатает предупреждение, пока в src/data/company.ts стоит privacyApproved: false.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const text = readFileSync(join(ROOT, "src", "data", "company.ts"), "utf8");
const m = text.match(/^\s*privacyApproved\s*:\s*(true|false)/m);

if (!m || m[1] === "false") {
  console.warn("\n⚠  Политика конфиденциальности не утверждена юристом школы (src/data/company.ts: privacyApproved: false).\n");
} else {
  console.log("check-legal: политика конфиденциальности утверждена");
}
